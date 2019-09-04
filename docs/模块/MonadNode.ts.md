---
title: MonadNode.ts
nav_order: 2
parent: 模块
---

# 概述

App Function's Result Monid

---

<h2 class="text-delta">目录</h2>

- [MonadNode (接口)](#monadnode-%E6%8E%A5%E5%8F%A3)
- [TEO (常量)](#teo-%E5%B8%B8%E9%87%8F)
- [parallel (常量)](#parallel-%E5%B8%B8%E9%87%8F)
- [sequence (常量)](#sequence-%E5%B8%B8%E9%87%8F)
- [traverse (常量)](#traverse-%E5%B8%B8%E9%87%8F)
- [fromString (函数)](#fromstring-%E5%87%BD%E6%95%B0)
- [fromTask (函数)](#fromtask-%E5%87%BD%E6%95%B0)

---

# MonadNode (接口)

这表示 App 函数的结果值

**签名**

```ts
interface MonadNode extends TaskEither {}
```

v0.2.0 中添加

# TEO (常量)

**签名**

```ts

export const TEO: ApplicativeComposition21<"TaskEither", "Option"> = ...

```

# parallel (常量)

**签名**

```ts

export const parallel: <E, A>(ta: TE.TaskEither<E, A>[]) => TE.TaskEither<E, A[]> = ...

```

# sequence (常量)

**签名**

```ts

export const sequence: <E, A>(ta: TE.TaskEither<E, A>[]) => TE.TaskEither<E, A[]> = ...

```

# traverse (常量)

**签名**

```ts

export const traverse: <A, E, B>(ta: A[], f: (a: A) => TE.TaskEither<E, B>) => TE.TaskEither<E, B[]> = ...

```

# fromString (函数)

从 MonidNode<A,string>建立

v0.2.0 中添加

# fromTask (函数)

从一个能抛出异常的 Task 中建立 MonidNode

v0.2.0 中添加
