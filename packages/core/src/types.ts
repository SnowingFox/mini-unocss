export type Awaitable<T> = T | Promise<T>

export type CSSObject = Record<string, string | number | undefined>
export type CSSEntries = [string, string | number | undefined][]

export type BaseRule = [string | RegExp, CSSObject | CSSEntries]

export type Rule = BaseRule[]

export interface GenerateOptions {
  id?: string

  safelist?: string[]

}

export interface BaseConfig {
  rules: Rule

  extractors?: Extractor[]
}
export interface UserConfig extends BaseConfig, GenerateOptions {}

export interface ExtractorContext {
  readonly original: string
  code: string
  id?: string
}

export interface Extractor {
  name: string
  extract(ctx: ExtractorContext): Awaitable<Set<string> | string[] | undefined>
  order?: number
}
