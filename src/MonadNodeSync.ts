/**
 * App Function's Result Monid(sync)
 * @file
 * @since 0.2.0
 */
import { pipe } from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'
import { MonidI18N } from 'macoolka-i18n'
import { showUnknow } from 'macoolka-object'
import * as O from 'fp-ts/lib/Option'
import { getApplicativeComposition } from 'fp-ts/lib/Applicative'
export * from 'fp-ts/lib/TaskEither'
export const traverse = A.array.traverse(E.either)
export const EO = getApplicativeComposition(E.either, O.option)
/**
 * The is a app function's result value(sync)
 * @desczh
 * 这表示App函数的结果值(sync)
 * @since 0.2.0
 */
export type MonadNodeSync<A, L = MonidI18N> = E.Either<L, A>
/**
 * Build from a io that can throw a excpection.
 * @desczh
 * 从一个能抛出异常的IO中建立MonidNode
 * @since 0.2.0
 */
export function fromIOr<A>(a: () => A): MonadNodeSync<A> {
    return pipe(
        E.tryCatch(a, (error): MonidI18N => () => {
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
export function fromString<A>(a: MonadNodeSync<A, string>): MonadNodeSync<A> {
    return pipe(
        a,
        E.mapLeft(content => {
            const result: MonidI18N = () => {
                return content
            }
            return result
        })
    )
}
