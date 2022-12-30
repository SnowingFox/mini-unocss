import type { Preflights } from './preflights'
import type { Presets } from './presets'
import type { Rule } from './rule'
import type { UserShortcuts } from './shortcuts'
import type { Awaitable } from './utils'
import type { Variant } from './variants'

export type Preprocessor = (matcher: string) => string | undefined

export interface GenerateOptions {
  id?: string

  safelist?: string[]

}

export interface BaseConfig<Theme extends {} = {}> {
  rules?: Rule<Theme>[]

  extractors?: Extractor[]

  preflights?: Preflights<Theme>[]
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

  theme?: Theme

  shortcuts?: UserShortcuts<Theme>[]
}

interface PresetsConfig<Theme extends {} = {}> {
  presets?: Presets<Theme>[]
}

export interface UserConfig<Theme extends {} = {}> extends BaseConfig<Theme>, PresetsConfig<Theme>, GenerateOptions {

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

export * from './generator'
export * from './presets'
export * from './preflights'
export * from './rule'
export * from './utils'
export * from './shortcuts'
export * from './variants'
