/**
 * App Function Monid
 * @file
 * @since 0.2.0
 */
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import * as T from 'fp-ts/lib/Task'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'
import * as E from 'fp-ts/lib/Either'
import { MonidI18N } from 'macoolka-i18n'
import { showUnknow } from 'macoolka-object'
export * from 'fp-ts/lib/ReaderTaskEither'

/**
 * Build from Reader
 * @desczh
 * 从Reader中建立
 * @since 0.2.0
 */
export function fromReader<A, B,>(f: (a: A) => B): MonadFunction<A, B> {
    return a => pipe(
        () => E.tryCatch(() => {
            return f(a)

        }, (error): MonidI18N => () => {
            return showUnknow.show(error)
        }),
        TE.fromIOEither
    )
}
/**
 * Build from ReaderTask
 * @desczh
 * 从ReaderTask中建立
 * @since 0.2.0
 */
export function fromReaderTask<A, B>(f: (a: A) => T.Task<B>): MonadFunction<A, B> {
    return a => pipe(
        TE.tryCatch(f(a), (error): MonidI18N => () => {
            return showUnknow.show(error)
        })

    )
}
/**
 * Build from empty ReaderTask
 * @desczh
 * 从空参数的ReaderTask中建立
 * @since 0.2.0
 */
export function fromEmptyReader<B>(f: () => B): MonadFunction<never, B> {
    return () => pipe(
        () => E.tryCatch(() => {
            return f()

        }, (error): MonidI18N => () => {
            return showUnknow.show(error)
        }),
        TE.fromIOEither
    )
}

/**
 * The is a App Function data struct.
 * @desczh
 * App函数
 *
 * @since 0.2.0
 */
export interface MonadFunction<A, B, L = MonidI18N> extends RTE.ReaderTaskEither<A, L, B> { }
