import type { UnoGenerator } from '../generator/index'
import type { Shortcut } from './shortcuts'
import type { Awaitable, CSSEntries, CSSObject, CSSValue } from './utils'
import type { Variant } from './variants'

export interface RuleMeta {
  /**
   * The layer name of this rule.
   * @default 'default'
   */
  layer?: string

  /**
   * Option to not merge this selector even if the body are the same.
   * @default false
   */
  noMerge?: boolean

  /**
   * Fine tune sort
   */
  sort?: number

  /**
   * Matching prefix before this util
   */
  prefix?: string

  /**
   * Internal rules will only be matched for shortcuts but not the user code.
   * @default false
   */
  internal?: boolean
}

export type DynamicMatcher<Theme extends {} = {}> = ((match: RegExpMatchArray, context: Readonly<RuleContext<Theme>>) => Awaitable<CSSValue | string | (CSSValue | string)[] | undefined>)
export type DynamicRule<Theme extends {} = {}> = [RegExp, DynamicMatcher<Theme>] | [RegExp, DynamicMatcher<Theme>, RuleMeta]
export type StaticRule = [string, CSSObject | CSSEntries] | [string, CSSObject | CSSEntries, RuleMeta]
export type Rule<Theme extends {} = {}> = DynamicRule<Theme> | StaticRule

export interface RuleContext<Theme extends {} = {}> {
  /**
   * Unprocessed selector from user input.
   * Useful for generating CSS rule.
   */
  rawSelector: string
  /**
   * Current selector for rule matching
   */
  currentSelector: string
  /**
   * UnoCSS generator instance
   */
  generator: UnoGenerator<Theme>
  /**
   * The theme object
   */
  theme: Theme

  /**
   * Available only when `details` option is enabled.
   */
  rules?: Rule[]
  /**
   * Available only when `details` option is enabled.
   */
  shortcuts?: Shortcut<Theme>[]
  /**
   * Available only when `details` option is enabled.
   */
  variants?: Variant<Theme>[]
}
