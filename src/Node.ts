/**
 * App Function's Result Monid(sync)
 * @file
 * @since 0.2.0
 */
import * as E from 'fp-ts/lib/Either'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import * as R from 'fp-ts/lib/Reader'
import { getApplicativeComposition } from 'fp-ts/lib/Applicative'
import { showUnknow } from 'macoolka-object'
import { Predicate, notMaybe as _notMaybe } from 'macoolka-predicate'
import { Message, MonadI18N } from 'macoolka-i18n'
import { IO } from 'fp-ts/lib/IO'
import * as RE from 'fp-ts/lib/ReaderEither'
import { pipe } from 'fp-ts/lib/pipeable'
export {
    E
}

export const traverseE = A.array.traverse(E.either)
export const EO = getApplicativeComposition(E.either, O.option)

/**
 * The is a app function's result value(sync)
 * @desczh
 * 这表示App函数的结果值(sync)
 * @since 0.2.0
 */
export type Node<A>
    = E.Either<string, A>
export type ReaderNode<A, B>
    = RE.ReaderEither<A, string, B>

/**
 * Build E from a io that can throw a excpection.
 * @desczh
 * 从一个能抛出异常的IO中建立E
 * @since 0.2.3
 */
export function fromIOToE<MK extends string>({ formatErrorMessage }: MonadI18N<MK>): (option: Message<MK> & { title?: string })
    => <A>(io: IO<A>)
        => IO<Node<A>> {
    return ({ ...others }) => io => () =>
        E.tryCatch(io, (error) => {
            return formatErrorMessage({ ...others, error: error as any })
        })
}

/**
 * Build RE from Reader
 * @desczh
 * 从Reader中建立RE
 * @since 0.2.3
 */
export function fromReaderToRE<MK extends string>({ formatErrorMessage }: MonadI18N<MK>): (
    option: Message<MK> & { title?: string }) => <A, B>(reader: R.Reader<A, B>)
        => R.Reader<A, Node<B>> {
    return ({ title, id, value = {} }) => reader => a =>
        E.tryCatch(() => reader(a), (error) => {
            return formatErrorMessage({ id, title, error: error as any, value: { ...value, value: showUnknow.show(a) } })
        })
}

/**
 * Build RE from Predicate
 * @desczh
 * 从Predicate中建立RE
 * @since 0.2.3
 */
export function fromPredicateToRE<MK extends string>({ formatErrorMessage }: MonadI18N<MK>):
    (option: Message<MK> & { title?: string }) => <A>(predicate: Predicate<A>) => R.Reader<A, Node<A>> {
    return ({ id, value = {}, title }) => predicate => {

        return E.fromPredicate(predicate, v => {
            return formatErrorMessage({ id: id, title, value: { ...value, value: showUnknow.show(v) } })
        })

    }
}
/**
 * Build RE from Nullable
 * @desczh
 * 从Nullable中建立RE
 * @since 0.2.3
 */
export function fromNullableToRE<MK extends string>({ formatErrorMessage }: MonadI18N<MK>):
    (option: Message<MK> & { title?: string }) => <A>(a: A) => Node<A> {
    return (option) => E.fromNullable(formatErrorMessage(option))


}
/**
 * Build E from Option
 * @desczh
 * 从Option中建立E
 * @since 0.2.3
 */
export function fromOptionToE<MK extends string>({ formatErrorMessage }: MonadI18N<MK>):
    (option: Message<MK> & { title?: string }) => <A>(option: O.Option<A>)
        => Node<A> {
    return ({ ...others }) => option => {
        return E.fromOption(() => {
            return formatErrorMessage(others)
        })(option)
    }
}

/**
 * Build RE from ReaderOption
 * @desczh
 * 从ReaderOption中建立RE
 * @since 0.2.3
 */
export function fromReaderOptionToRE<MK extends string>(m: MonadI18N<MK>):
    (option: { title?: string } & Message<MK>) => <A, B> (reader: R.Reader<A, O.Option<B>>)
        => R.Reader<A, Node<B>> {
    return ({ ...others }) => reader => {
        return pipe(
            reader,
            R.map(a => fromOptionToE(m)({ ...others })(a))
        )
    }
}