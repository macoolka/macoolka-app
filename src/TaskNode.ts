/**
 * App Function's Result Monid(sync)
 * @file
 * @since 0.2.0
 */
import * as TE from 'fp-ts/lib/TaskEither'
import * as A from 'fp-ts/lib/Array'
import * as R from 'fp-ts/lib/Reader'
import * as T from 'fp-ts/lib/Task'
import {  notMaybe as _notMaybe } from 'macoolka-predicate'
import { Message, MonadI18N } from 'macoolka-i18n'
import { IO } from 'fp-ts/lib/IO'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import { pipe } from 'fp-ts/lib/pipeable'
import * as MN from './Node'
export {
    TE,T,RTE
}
/**
 * The is a app function's result value
 * @desczh
 * 这表示App函数的结果值
 * @since 0.2.0
 */
export interface TaskNode<A> extends TE.TaskEither<string, A> { }
export const traverseTE = A.array.traverse(TE.taskEither)

export type ReaderTaskNode<A, B>
    = RTE.ReaderTaskEither<A, string, B>

/**
 * Build TE from a io that can throw a excpection.
 * @desczh
 * 从一个能抛出异常的IO中建立TE
 * @since 0.2.3
 */
export function fromIOToTE<MK extends string>(m: MonadI18N<MK>): (option: Message<MK> & { title?: string })
    => <A>(io: IO<A>)
        => TaskNode<A> {
    return option => io => pipe(
        MN.fromIOToE(m)(option)(io),
        TE.fromIOEither
    );
}
/**
 * Build TRE from Reader
 * @desczh
 * 从Reader中建立TRE
 * @since 0.2.3
 */
export function fromReaderToTRE<MK extends string>(m: MonadI18N<MK>): (
    option: Message<MK> & { title?: string }) => <A, B>(reader: R.Reader<A, B>)
        => R.Reader<A, TaskNode<B>> {
    return option => reader => a => pipe(
        MN.fromReaderToRE(m)(option)(reader)(a),
        TE.fromEither
    );
}
/**
 * Build TE from a task that can throw a excpection.
 * @desczh
 * 从一个能抛出异常的Task中建立TE
 * @since 0.2.0
 */
export function fromTaskToTE<MK extends string>(m: MonadI18N<MK>):
    (option: Message<MK> & { title?: string }) => <A>(task: T.Task<A>) => TaskNode<A> {
    return option => task =>TE.tryCatch(task,error=>{
       return m.formatErrorMessage({...option,error:error as any})
    }) 
}

/**
 * Build TRE from ReaderTask
 * @desczh
 * 从ReaderTask中建立TRE
 * @since 0.2.3
 */
export function fromReaderTaskToTRE<MK extends string>(m: MonadI18N<MK>):
    (option: { title?: string } & Message<MK>) => <A, B> (reader: R.Reader<A, T.Task<B>>)
        => R.Reader<A, TaskNode<B>> {
    return ({ ...others }) => reader => {
        return pipe(
            reader,
            R.map(a => fromTaskToTE(m)({ ...others })(a))
        )
    }
}