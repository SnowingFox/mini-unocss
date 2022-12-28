import type { Rule } from './rule'
import type { UserShortcuts } from './shortcuts'
import type { Awaitable } from './utils'
import type { Variant } from './variants'

export type Preprocessor = (matcher: string) => string | undefined

export interface GenerateOptions {
  id?: string

  safelist?: string[]

  preflights?: boolean
}

export interface BaseConfig<Theme extends {} = {}> {
  rules?: Rule<Theme>[]

  extractors?: Extractor[]
}

export interface UserConfig<Theme extends {} = {}> extends BaseConfig<Theme>, GenerateOptions {
  /*
  * blocked
  *
  * @default []
  */
  blocked?: string[]

  /*
  * preprocess
  *
  * @default []
  */
  preprocess?: Preprocessor[]

  /*
  * variants
  *
  * @default []
  */
  variants?: Variant<Theme>[]

  theme?: any

  shortcuts?: UserShortcuts<Theme>[]
}

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
