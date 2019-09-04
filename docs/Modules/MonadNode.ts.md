---
title: MonadNode.ts
nav_order: 2
parent: Modules
---

# Overview

App Function's Result Monid

---

<h2 class="text-delta">Table of contents</h2>

- [MonadNode (interface)](#monadnode-interface)
- [TEO (constant)](#teo-constant)
- [parallel (constant)](#parallel-constant)
- [sequence (constant)](#sequence-constant)
- [traverse (constant)](#traverse-constant)
- [fromString (function)](#fromstring-function)
- [fromTask (function)](#fromtask-function)

---

# MonadNode (interface)

The is a app function's result value

**Signature**

```ts
interface MonadNode extends TaskEither {}
```

Added in v0.2.0

# TEO (constant)

**Signature**

```ts

export const TEO: ApplicativeComposition21<"TaskEither", "Option"> = ...

```

# parallel (constant)

**Signature**

```ts

export const parallel: <E, A>(ta: TE.TaskEither<E, A>[]) => TE.TaskEither<E, A[]> = ...

```

# sequence (constant)

**Signature**

```ts

export const sequence: <E, A>(ta: TE.TaskEither<E, A>[]) => TE.TaskEither<E, A[]> = ...

```

# traverse (constant)

**Signature**

```ts

export const traverse: <A, E, B>(ta: A[], f: (a: A) => TE.TaskEither<E, B>) => TE.TaskEither<E, B[]> = ...

```

# fromString (function)

Build from a MonidNode<A,string>

Added in v0.2.0

# fromTask (function)

Build from a task that can throw a excpection.

Added in v0.2.0
