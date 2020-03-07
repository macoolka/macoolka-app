import {
    fromOptionToE, fromNullableToRE, fromPredicateToRE, fromReaderToRE,
    fromReaderOptionToRE, fromIOToE, traverseE, E,Node,ReaderNode,RE
} from './Node'
import {
    fromIOToTE, fromReaderTaskToTRE, fromReaderToTRE, fromTaskToTE,
    traverseTE, TE, T, RTE,TaskNode,ReaderTaskNode
} from './TaskNode'
export {
    E,RE,
    TE, T, RTE,
    traverseTE,
    traverseE,
    Node,
    ReaderNode,
    ReaderTaskNode,
    TaskNode,
}
import { Log } from 'macoolka-log-core'
import monadI18NBuild, { I18NOption } from 'macoolka-i18n'
import { diffWithObject } from 'macoolka-fp/lib/Reader'
import { unknownToString,merge } from 'macoolka-object'
import { pipe } from 'fp-ts/lib/pipeable'
import { templateProp, templatePropObject } from './templateProp'
import { MonadModule } from 'macoolka-module-core'
import errorInit from 'macoolka-error'

import * as A from 'fp-ts/lib/Array'
export const parallelTE = A.array.sequence(TE.taskEither)
export const sequenceTE = A.array.sequence(TE.taskEitherSeq)
import consoleM from 'macoolka-console'

export const throwException = <E, A>(a: E.Either<E, A>): A => {
    return pipe(
        a,
        E.fold(left => {
            throw new Error(unknownToString(left))
        }, right => {
            return right
        })
    )
}
export const warnException = ({ warn }: Log) => <E, A>({ node, defaultValue }: { node: E.Either<E, A>, defaultValue: A }): A => {
    return pipe(
        node,
        E.fold(left => {
            warn(unknownToString(left))
            return defaultValue
        }, right => {
            return right
        })
    )
}
export function init<MK extends string>(option: { i18nOption: I18NOption } & MonadModule & Partial<Log>) {
    const mOption = { ...consoleM, ...option }
    const { moduleName, ...others } = mOption
    const fa = diffWithObject({ title: moduleName })
    const errors = errorInit(mOption)
    const i18n = monadI18NBuild<MK>(option.i18nOption);
    const extend=<MKA extends string>(optionA: { i18nOption: I18NOption } & MonadModule & Partial<Log>)=>{
       return init<MKA|MK>(merge({},option,optionA))
    }
    const getI18NOption=()=> option.i18nOption
    return {
        ...mOption,
        ...errors,
        ...i18n,
        fromOptionToE: fa(fromOptionToE<MK>(i18n)),
        fromNullableToRE: fa(fromNullableToRE<MK>(i18n)),
        fromPredicateToRE: fa(fromPredicateToRE<MK>(i18n)),
        fromReaderToRE: fa(fromReaderToRE<MK>(i18n)),
        fromReaderOptionToRE: fa(fromReaderOptionToRE<MK>(i18n)),
        fromIOToE: fa(fromIOToE<MK>(i18n)),
        fromIOToTE: fa(fromIOToTE<MK>(i18n)),
        fromReaderTaskToTRE: fa(fromReaderTaskToTRE<MK>(i18n)),
        fromReaderToTRE: fa(fromReaderToTRE<MK>(i18n)),
        fromTaskToTE: fa(fromTaskToTE<MK>(i18n)),
        throwException,
        warnException: warnException(others),
        templateProp: fa(templateProp(i18n)),
        templatePropObject: fa(templatePropObject(i18n)),
        extend,
        getI18NOption,

    }
}
export default init