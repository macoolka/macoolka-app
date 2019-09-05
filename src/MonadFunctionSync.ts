/**
 * App Function Monid(sync)
 * @file
 * @since 0.2.0
 */
import { pipe } from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Either'
import * as RE from 'fp-ts/lib/ReaderEither'
import { MonidI18N } from 'macoolka-i18n'
import { showUnknow } from 'macoolka-object'
export * from 'fp-ts/lib/ReaderEither'

/**
 * Build from Reader
 * @desczh
 * 从Reader中建立
 * @since 0.2.0
 */
export function fromReader<A, B,>(f: (a: A) => B): MonadFunctionSync<A, B> {
    return a => pipe(
        E.tryCatch(() => {
            return f(a)

        }, (error): MonidI18N => () => {
            return showUnknow.show(error)
        })

    )
}
/**
 * Build from IOReader
 * @desczh
 * 从IOReader中建立
 * @since 0.2.0
 */
export function fromIOReader<A, B>(f: (a: A) => () => B): MonadFunctionSync<A, B> {
    return a => pipe(
        E.tryCatch(f(a), (error): MonidI18N => () => {
            return showUnknow.show(error)
        })

    )
}
/**
 * Build from empty Reader
 * @desczh
 * 从空参数的Reader中建立
 * @since 0.2.0
 */
export function fromEmptyReader<B>(f: () => B): MonadFunctionSync<never, B> {
    return () => pipe(
        E.tryCatch(() => {
            return f()

        }, (error): MonidI18N => () => {
            return showUnknow.show(error)
        })

    )
}

/**
 * The is a App Function data struct.
 * @desczh
 * App函数(sync)
 *
 * @since 0.2.0
 */
export interface MonadFunctionSync<A, B, L = MonidI18N> extends RE.ReaderEither<A, L, B> { }
