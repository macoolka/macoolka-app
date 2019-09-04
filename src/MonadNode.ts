/**
 * App Function's Result Monid
 * @file
 * @since 0.2.0
 */
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import * as A from 'fp-ts/lib/Array'
import { MonidI18N } from 'macoolka-i18n'
import { showUnknow } from 'macoolka-object'
import * as O from 'fp-ts/lib/Option'
import { getApplicativeComposition } from 'fp-ts/lib/Applicative'
export * from 'fp-ts/lib/TaskEither'
export const parallel = A.array.sequence(TE.taskEither)
export const sequence = A.array.sequence(TE.taskEitherSeq)
export const traverse = A.array.traverse(TE.taskEither)
export const TEO = getApplicativeComposition(TE.taskEither, O.option)
/**
 * The is a app function's result value
 * @desczh
 * 这表示App函数的结果值
 * @since 0.2.0
 */
export interface MonadNode<A, L = MonidI18N> extends TE.TaskEither<L, A> { }
/**
 * Build from a task that can throw a excpection.
 * @desczh
 * 从一个能抛出异常的Task中建立MonidNode
 * @since 0.2.0
 */
export function fromTask<A>(a: T.Task<A>): MonadNode<A> {
    return pipe(
        TE.tryCatch(a, (error): MonidI18N => () => {
            return showUnknow.show(error)
        })

    )
}
/**
 * Build from a MonidNode<A,string>
 * @desczh
 * 从MonidNode<A,string>建立
 * @since 0.2.0
 */
export function fromString<A>(a: MonadNode<A, string>): MonadNode<A> {
    return pipe(
        a,
        TE.mapLeft(content => {
            const result: MonidI18N = () => {
                return content
            }
            return result
        })
    )
}
/*
export function ABfToEff<A, B, C>(f: (a: A, fab: ((a: A) => B)) => C): ((a: A, fab: ((a: A) => B)) => MonidNode<C>) {
    return (a1, f1) => pipe(
        () => E.tryCatch(() => {
            return f(a1, f1)

        }, (error): MonidI18N => () => {
            return showUnknow(error)
        }),
        TE.fromIOEither
    )
}
export function ABToEff<A, B, C>(f: (a: A, b: B) => C): ((a: A, b: B) => MonidNode<C>) {
    return (a, b) => pipe(
        () => E.tryCatch(() => {
            return f(a, b)

        }, (error): MonidI18N => () => {
            return showUnknow(error)
        }),
        TE.fromIOEither
    )
} */
