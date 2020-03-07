import { E, init } from '../'
import { getValueOption, getValue } from 'macoolka-object'
import * as R from 'fp-ts/lib/Reader'
import { pipe } from 'fp-ts/lib/pipeable'
const data = {
    en: {
        'macoolka.test.invariant': 'invarint error: {value}',
        'macoolka.test.nullable': 'null error',
        'macoolka.test.gt2': 'gt2 {value}',
        'macoolka.test.propNotFound': 'propNotFound {name}',
        'macoolka.test.add': 'add error {value}',
        'macoolka.test.reader': 'add error {a} {b} {c}',
        'macoolka.test.readerValue': 'add error {value}',
    },
    zh: {
        'macoolka.test.invariant': '无效的值: {value}'
    }
}
const nodeM = init<any>({ i18nOption: { data, defaultLocale: 'en' }, moduleName: 'Test', moduleType: 'Function' })

describe('ReaderMessageNode', () => {
    /*   it('invariant', () => {
          const id = 'test.invariant'
          const testNotMaybe = notMaybe({ id })
          expect(testNotMaybe(undefined)).toEqual(E.left({ id, value: { value: "undefined" } }))
          expect(testNotMaybe(null)).toEqual(E.left({ id, value: { value: "null" } }))
          expect(testNotMaybe(1)).toEqual(E.right(1))
      }) */
    it('formatMessage with defaultValue',()=>{
        const r=nodeM.formatMessage({id:'none',defaultMessage:'a is {a}.b is {b}',value:{a:'a1',b:'b1'}})
        expect(r).toEqual('a is a1.b is b1')
    })
    it('error',()=>{
        nodeM.error('error')
        //expect(r).toEqual('a is a1.b is b1')
    })
    it('fromNullableToRE', () => {
        const testFromNullable = nodeM.fromNullableToRE({ id: 'macoolka.test.nullable' })
        expect(testFromNullable(undefined)).toEqual(E.left('[Test] null error'))
        expect(testFromNullable(null)).toEqual(E.left('[Test] null error'))
        expect(testFromNullable(1)).toEqual(E.right(1))
    })
    it('fromPredicateToRE', () => {

        const gt2 = (a: number) => a > 2
        const gt2E = nodeM.fromPredicateToRE({ id: 'macoolka.test.gt2' })(gt2)

        expect(gt2E(3)).toEqual(E.right(3))
        expect(gt2E(1)).toEqual(E.left('[Test] gt2 1'))
    })
    it('fromReaderOptionToRE', () => {

        const getName = nodeM.fromReaderOptionToRE({ id: 'macoolka.test.propNotFound', value: { name: 'a' } })(getValueOption<A, 'a'>('a'))
        type A = {
            a?: string,
            b: number
        }
        expect(getName({ a: '1', b: 1 })).toEqual(E.right('1'))
        expect(getName({ b: 1 })).toEqual(E.left(`[Test] propNotFound a`))
    })

    it('fromReaderToRE', () => {

        const error = new Error('error')
        const add1 = (a: number) => {
            if (a === 1) {
                throw error
            }
            return a + 1
        }
        const add1E = nodeM.fromReaderToRE({ id: 'macoolka.test.add' })(add1)

        expect(add1E(3)).toEqual(E.right(4))
        pipe(
            add1E(1),
            E.mapLeft(a => expect(a.startsWith(`[Test] add error 1`)).toEqual(true)),
            E.map(() => {
                throw new Error()
            })
        )
    })
    it('fromReaderToRE extract param', () => {

        const error = new Error('error')
        const add1 = ({ a, b, c }: { a: number, b: string, c: number }) => {
            if (a === 1) {
                throw error
            }
            return a + b + c
        }
        const add1E = nodeM.fromReaderToRE({ id: 'macoolka.test.reader' })(add1)

        expect(add1E({a:4,b:'b',c:3})).toEqual(E.right('4b3'))
        pipe(
            add1E({a:1,b:'b',c:3}),
            
            E.mapLeft(a =>{
                expect(a.startsWith(`[Test] add error 1 "b" 3`)).toEqual(true)
            } ),
            E.map(() => {
                throw new Error()
            })
        )

    })
    it('fromReaderToRE extract value param', () => {

        const error = new Error('error')
        const add1 = ({ a, b, c }: { a: number, b: string, c: number }) => {
            if (a === 1) {
                throw error
            }
            return a + b + c
        }
        const add1E = nodeM.fromReaderToRE({ id: 'macoolka.test.readerValue' })(add1)

        expect(add1E({a:4,b:'b',c:3})).toEqual(E.right('4b3'))
        pipe(
            add1E({a:1,b:'b',c:3}),
            
            E.mapLeft(a =>{
                expect(a.startsWith(`[Test] add error { a: 1, b: "b", c: 3 }`)).toEqual(true)
            } ),
            E.map(() => {
                throw new Error()
            })
        )

    })
    it('fromIOToE', () => {
        const error = new Error('error')
        const add1 = (a: number) => {
            if (a === 1) {
                throw error
            }
            return a + 1
        }
        const errorIO = nodeM.fromIOToE({ id: 'macoolka.test.propNotFound', value: { name: 'a' } })(() => add1(1))
        const correctIO = nodeM.fromIOToE({ id: 'macoolka.test.propNotFound', value: { name: 'a' } })(() => add1(2))

        expect(correctIO()).toEqual(E.right(3))

        pipe(
            errorIO(),
            E.mapLeft(a => expect(a.startsWith(`[Test] propNotFound a`)).toEqual(true)),
            E.map(() => {
                throw new Error()
            })
        )

    })

    it('compose', () => {

        const testFromNullable = nodeM.fromNullableToRE({ id: 'macoolka.test.propNotFound', value: { name: 'a' } })

        type A = {
            a?: string,
            b: number
        }
        const getName = pipe(
            getValue<A, 'a'>('a'),
            R.map(testFromNullable)
        )
        expect(getName({ a: '1', b: 1 })).toEqual(E.right('1'))
        expect(getName({ b: 1 })).toEqual(E.left(`[Test] propNotFound a`))

    })
    it('throwException', () => {
        const testFromNullable = nodeM.fromNullableToRE({ id: 'macoolka.test.propNotFound', value: { name: 'a' } })

        type A = {
            a?: string,
            b: number
        }
        const getName = pipe(
            getValue<A, 'a'>('a'),
            R.map(testFromNullable)
        )
        expect(getName({ a: '1', b: 1 })).toEqual(E.right('1'))
        expect(getName({ b: 1 })).toEqual(E.left(`[Test] propNotFound a`))
        expect(nodeM.throwException(getName({ a: '1', b: 1 }))).toEqual('1')
        expect(() => nodeM.throwException(getName({ b: 1 }))).toThrowError(`[Test] propNotFound a`)
    })
    it('warnException', () => {
        const testFromNullable = nodeM.fromNullableToRE({ id: 'macoolka.test.propNotFound', value: { name: 'a' } })

        type A = {
            a?: string,
            b: number
        }
        const getName = pipe(
            getValue<A, 'a'>('a'),
            R.map(testFromNullable)
        )
        expect(getName({ a: '1', b: 1 })).toEqual(E.right('1'))
        expect(getName({ b: 1 })).toEqual(E.left(`[Test] propNotFound a`))
        console.log = jest.fn()
        expect(nodeM.warnException({
            node: getName({ a: '1', b: 1 }),
            defaultValue: '2'
        })).toEqual('1')
        expect(nodeM.warnException({
            node: getName({ b: 1 }),
            defaultValue: '2'
        })).toEqual('2')

        expect(console.log).toBeCalledTimes(1)
    })

    describe('configParamObject', () => {
        type A = { a: string, b?: number, c: { c1?: string, c2?: () => number } }
        const a = ({ a = '', b = 0, c: { c1 = '', c2 = () => 2 } = {} }: A): string => {
            if (a === '7')
                throw new Error('7')
            return `${a}${b.toString()}${c1}${c2()}`
        }
        const config: Record<'da' | 'db', Pick<A, 'a' | 'b'>> = { da: { a: '3' }, db: { a: 'a', b: 2 } }
        const cb = nodeM.templatePropObject({
            paramMessage: { value: { name: 'a.b' }, id: 'macoolka.test.propNotFound' },
            readerMessage: { value: { value: '1' }, id: 'macoolka.test.add' },
        })({
            name: 'option',
            propName: ['a', 'b'],
            reader: a,

            config,
        })
        it('ok', () => {

            expect(cb({ option: 'da', c: { c2: () => 99 } })).toEqual(E.right('3099'))
            expect(cb({ option: 'db', c: { c1: 'c1', c2: () => 99 } })).toEqual(E.right('a2c199'))
            expect(cb({ option: 'db', a: 'A1', c: {} })).toEqual(E.right('A122'))
            expect(cb({ option: 'db', a: 'A1', b: 5, c: {} })).toEqual(E.right('A152'))
        })
        it('param error', () => {

            expect(cb({ option: 'error' as any, c: { c2: () => 99 } })).toEqual(E.left('[Test] propNotFound a.b'))

        })
        it('reader error', () => {
            const result = cb({ option: 'da', a: '7', c: { c2: () => 99 } })
            if (E.isRight(result)) {
                throw new Error('')
            }
            expect(result.left.startsWith('[Test] add error 1')).toBeTruthy()

        })
    })
    describe('configParam', () => {
        type A = { a: string, b?: number, c: { c1?: string, c2?: () => number } }
        const a = ({ a = '', b = 0, c: { c1 = '', c2 = () => 2 } = {} }: A): string => {
            if (a === '7')
                throw new Error('7')
            return `${a}${b.toString()}${c1}${c2()}`
        }
        const config: Record<'da' | 'db', A['a']> = { da: '3', db: 'a' }
        const cb = nodeM.templateProp({
            paramMessage: { value: { name: 'a.b' }, id: 'macoolka.test.propNotFound' },
            readerMessage: { value: { value: '1' }, id: 'macoolka.test.add' },
        })({
            name: 'option',
            propName: 'a',
            reader: a,

            config,
        })
        it('ok', () => {

            expect(cb({ option: 'da', c: { c2: () => 99 } })).toEqual(E.right('3099'))
            expect(cb({ option: 'db', c: { c1: 'c1', c2: () => 99 } })).toEqual(E.right('a0c199'))
            expect(cb({ option: 'db', a: 'A1', c: {} })).toEqual(E.right('A102'))
            expect(cb({ option: 'db', a: 'A1', b: 5, c: {} })).toEqual(E.right('A152'))
        })
        it('param error', () => {

            expect(cb({ option: 'error' as any, c: { c2: () => 99 } })).toEqual(E.left('[Test] propNotFound a.b'))

        })
        it('reader error', () => {
            const result = cb({ option: 'da', a: '7', c: { c2: () => 99 } })
            if (E.isRight(result)) {
                throw new Error('')
            }
            expect(result.left.startsWith('[Test] add error 1')).toBeTruthy()

        })
    })

})