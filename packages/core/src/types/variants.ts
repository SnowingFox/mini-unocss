import type { UnoGenerator } from '../generator/index'
import type { Rule } from './rule'
import type { CSSEntries } from './utils'

export interface VariantMatchedResult<Theme extends {} = {}> {
  raw: string
  processed: string
  variants: Set<Variant<Theme>>
  selector: string
}

export interface VariantHandlerContext {
  /**
   * Rewrite the output selector. Often be used to append parents.
   */
  prefix: string
  /**
   * Rewrite the output selector. Often be used to append pseudo classes.
   */
  selector: string
  /**
   * Rewrite the output selector. Often be used to append pseudo elements.
   */
  pseudo: string
  /**
   * Rewrite the output css body. The input come in [key,value][] pairs.
   */
  entries: CSSEntries
  /**
   * Provide a parent selector(e.g. media query) to the output css.
   */
  parent?: string
  /**
   * Provide order to the `parent` parent selector within layer.
   */
  parentOrder?: number
  /**
   * Override layer to the output css.
   */
  layer?: string
  /**
   * Order in which the variant is sorted within single rule.
   */
  sort?: number
  /**
   * Option to not merge the resulting entries even if the body are the same.
   * @default false
   */
  noMerge?: boolean
}

export interface VariantContext<Theme extends {} = {}> {
  /**
   * Unprocessed selector from user input.
   */
  rawSelector: string
  /**
   * UnoCSS generator instance
   */
  generator: UnoGenerator<Theme>
  /**
   * The theme object
   */
  theme: Theme
}

export interface VariantHandler {
  /**
   * Callback to process the handler.
   */
  handle?: (input: VariantHandlerContext, next: (input: VariantHandlerContext) => VariantHandlerContext) => VariantHandlerContext
  /**
   * The result rewritten selector for the next round of matching
   */
  matcher: string
  /**
   * Order in which the variant is applied to selector.
   */
  order?: number
  /**
   * Rewrite the output selector. Often be used to append pseudo classes or parents.
   */
  selector?: (input: string, body: Rule) => string | undefined
  /**
   * Rewrite the output css body. The input come in [key,value][] pairs.
   */
  body?: (body: CSSEntries) => CSSEntries | undefined
  /**
   * Provide a parent selector(e.g. media query) to the output css.
   */
  parent?: string | [string, number] | undefined
  /**
   * Order in which the variant is sorted within single rule.
   */
  sort?: number
  /**
   * Override layer to the output css.
   */
  layer?: string | undefined
}

export type VariantFunction<Theme extends {} = {}> = (matcher: string, context: Readonly<VariantContext<Theme>>) => string | VariantHandler | undefined

export interface VariantObject<Theme extends {} = {}> {
  /**
   * The name of the variant.
   */
  name?: string
  /**
   * The entry function to match and rewrite the selector for further processing.
   */
  match: VariantFunction<Theme>

  /**
   * Allows this variant to be used more than once in matching a single rule
   *
   * @default false
   */
  multiPass?: boolean
}

export type Variant<Theme extends {} = {}> = VariantFunction<Theme> | VariantObject<Theme>
