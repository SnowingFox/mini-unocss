export type Awaitable<T> = T | Promise<T>
export type Arrayable<T> = T | T[]

export type CSSObject = Record<string, string | number | undefined>
export type CSSEntries = [string, string | number | undefined][]

export type CSSValue = CSSObject | CSSEntries
