import { get, merge, omit, pick } from 'macoolka-object'
import * as  R from 'fp-ts/lib/Reader'
import { DiffString, getValue } from 'macoolka-object'
import { pipe } from 'fp-ts/lib/pipeable'
import { Message, MonadI18N } from 'macoolka-i18n'
import { E, Node, fromNullableToRE, fromIOToE } from './Node'
import { isString } from 'macoolka-predicate'

export function templatePropObject<MK extends string>(m: MonadI18N<MK>): (message: {
    title?: string
    paramMessage: Message<MK>,
    readerMessage: Message<MK>,
}) =>
    <A, B, N extends string, PN extends keyof A, CK extends string>(a: {
        name: N extends keyof A ? never : N,
        propName: Array<PN>
        reader: R.Reader<A, B>
        config: Record<CK, Pick<A, PN>>
    }) => R.Reader<A | (DiffString<A, PN> & { [Key in N]: CK }), Node<B>> {
    return _templateProp(m)
}

export function templateProp<MK extends string>(m: MonadI18N<MK>): (message: {
    title?: string
    paramMessage: Message<MK>,
    readerMessage: Message<MK>,
}) =>
    <A, B, N extends string, PN extends keyof A, CK extends string>(a: {

        name: N extends keyof A ? never : N,
        propName: PN
        reader: R.Reader<A, B>

        config: Record<CK, A[PN]>
    }) => R.Reader<A | (DiffString<A, PN> & { [Key in N]: CK }), Node<B>> {
    return _templateProp(m)
}

function _templateProp(m: MonadI18N<any>): (message: {
    title?: string
    paramMessage: Message<any>,
    readerMessage: Message<any>,
}) =>
    (option: {
        name: any,
        propName: any

        reader: R.Reader<any, any>
        config: Record<any, any>
    }) => R.Reader<any, any> {
    return ({ title, paramMessage,
        readerMessage, }) => ({

            name,
            propName,
            reader,

            config,
        }) => a => {
            const idName = get(a, name)
            const param = idName ? pipe(
                fromNullableToRE(m)({ ...paramMessage, title })(getValue(idName)(config)),
                E.map(propConfig => isString(propName) ? ({ [propName]: propConfig }) : pick(propConfig, propName)),
                E.map(v => merge({}, v, omit(a as any, name)) as any)
            ) : E.right(a)
            return pipe(
                param,
                E.chain(p => fromIOToE(m)({ ...readerMessage, title })(() => reader(p))())
            )

        }
}
