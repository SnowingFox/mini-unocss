import { DEFAULT_LAYER } from '../constant'
import { isFunction, isRegExp, isString } from '../utils'
import { resolveConfig } from '../utils/config'
import type { ExtractorContext, GenerateOptions, UserConfig } from '../types'
import type { IParseUtilsResult, SheetUtils } from '../types/generator'
import type { DynamicMatcher, Rule, RuleContext } from '../types/rule'
import type {
  Variant,
  VariantContext,
  VariantMatchedResult,
} from '../types/variants'
import { generateSelector } from '../utils/utils'

// TODO resolve shortcuts
export class UnoGenerator<Theme extends {} = {}> {
  private _cache = new Map<string, any>()
  public config: UserConfig<Theme>

  public blocked = new Set<string>()
  constructor(public userConfig: UserConfig<Theme>) {
    this.config = resolveConfig(userConfig)
  }

  async generate(input: string, options?: GenerateOptions) {
    const tokens = await this.applyExtractors(input, options?.id)

    const layerSet = new Set<string>([DEFAULT_LAYER])
    const matched = new Set<string>()
    const sheet = new Map<string, SheetUtils>()

    this.config.safelist!.forEach(s => tokens.add(s))

    const tokenPromises = Array.from(tokens).map(async (raw) => {
      if (matched.has(raw) || this.isBlocked(raw)) {
        return
      }
      const payload = await this.parseToken(raw)

      if (!payload) {
        return
      }

      matched.add(raw)

      if (!sheet.get(payload.currentSelector)) {
        sheet.set(payload.currentSelector, { layer: payload.layer, body: [] })
      }

      (sheet.get(payload.currentSelector)!.body as string[]).push(payload.body)
    })

    await Promise.all(tokenPromises)

    const layers = this.config
      .rules!.map(r => r[2]?.layer)
      .filter(Boolean)
      .concat(Array.from(layerSet)) as string[]

    const layerCache: Record<string, string> = {}

    const getLayer = (layer: string) => {
      if (layerCache[layer]) {
        return layerCache[layer]
      }

      const css = Array.from(sheet)
        .filter(
          ([, { layer: cssLayer }]) => cssLayer === (layer || DEFAULT_LAYER),
        )
        .map(([selector, { body }]) => {
          return `${selector}{${isString(body) ? body : body.join('')}}`
        })
        .join('\n')

      const layerMark = css ? `/** layer ${layer} **/\n${css}` : ''
      return (layerCache[layer] = layerMark)
    }

    const getLayers = (includes = layers, excludes?: string[]) => {
      return includes
        .filter(i => !excludes?.includes(i))
        .map(i => getLayer(i) || '')
        .join('\n')
    }

    return {
      get css() {
        return getLayers()
      },
      getLayer,
      getLayers,
    }
  }

  async parseToken(raw: string): Promise<IParseUtilsResult | undefined> {
    if (this.blocked.has(raw)) {
      return
    }

    if (this._cache.has(raw)) {
      return this._cache.get(raw)
    }

    let token = raw

    for (const fn of this.config.preprocess!) {
      token = fn(raw)!
    }

    if (this.isBlocked(token)) {
      this.blocked.add(raw)
      this._cache.set(token, null)
      return
    }

    const variantsApplied = this.matchVariants(raw)

    if (this.isBlocked(variantsApplied.processed!)) {
      this.blocked.add(raw)
      this._cache.set(raw, null)
      return
    }

    const context: RuleContext<Theme> = {
      rawSelector: raw,
      currentSelector: variantsApplied.selector,
    } as RuleContext<Theme>

    const shortcuts = await this.expandShortcuts(raw, context)

    const util = shortcuts
      ? this.parseShortcutsUtil(raw, shortcuts, context)
      : this.parseUtil(raw, context)

    return util as IParseUtilsResult
  }

  matchVariants(raw: string): VariantMatchedResult<Theme> {
    const variants = new Set<Variant<Theme>>()

    const context: VariantContext<Theme> = {
      rawSelector: raw,
      theme: this.config.theme,
      generator: this,
    }

    let processed = raw
    let selector = raw
    let rule

    this.config.variants!.forEach(async (v) => {
      if (variants.has(v)) {
        return
      }
      const handler = isFunction(v) ? v : v.match
      const result = handler(raw, context)

      if (!result) {
        return
      }

      // TODO solve type problem

      processed = isString(result) ? result : result.matcher
      rule = await this.getRule(raw)
      selector = isString(result)
        ? raw
        : (result.selector?.(raw, rule as Rule) as string)
      variants.add(v as Variant<Theme>)
    })

    return { raw, processed, variants, selector }
  }

  getRule(raw: string) {
    return this.config.rules!.find(r =>
      isRegExp(r[0]) ? r[0].test(raw) : r[0] === raw,
    )
  }

  getShortcut(shortcut: string) {
    return this.config.shortcuts
  }

  parseShortcutsUtil(
    raw: string,
    shortcuts: string[],
    context: Readonly<RuleContext<Theme>>,
  ): IParseUtilsResult | null {
    // TODO solve shortcuts layer
    const body = shortcuts
      .map(s => this.parseUtil(s, context)?.body)
      .filter(Boolean)
      .join('')

    return {
      selector: context.currentSelector,
      layer: DEFAULT_LAYER,
      currentSelector: generateSelector(context.currentSelector),
      body,
    }
  }

  parseUtil(
    raw: string,
    context: Readonly<RuleContext<Theme>>,
  ): IParseUtilsResult | null {
    const { currentSelector } = context

    const rule = this.getRule(raw)

    if (!rule) {
      return null
    }

    const body = isRegExp(rule[0])
      ? (rule[1] as DynamicMatcher<Theme>)(
          rule[0].exec(raw) as RegExpExecArray,
          context,
        )
      : rule[1]

    if (!body) {
      return null
    }

    return {
      selector: currentSelector,
      layer: rule[2]?.layer || DEFAULT_LAYER,
      currentSelector: generateSelector(currentSelector),
      body: isString(body)
        ? body
        : Object.entries(body)
          .map(([key, val]) => `${key}:${val};`)
          .join(''),
    }
  }

  async applyExtractors(input: string, id?: string) {
    const tokenSet = new Set<string>()

    const extractContext: ExtractorContext = {
      original: input,
      id,
      code: input,
    }

    if (this.config.extractors) {
      for (const extractor of this.config.extractors) {
        const extractedTokens = await extractor.extract(extractContext)

        if (extractedTokens) {
          for (const token of extractedTokens) {
            tokenSet.add(token)
          }
        }
      }
    }

    return tokenSet
  }

  async expandShortcuts(
    raw: string,
    context: RuleContext<Theme>,
    depth = 5,
  ): Promise<string[] | undefined> {
    if (depth === 5 && !this.isShortcuts(raw)) {
      return
    }

    if (depth === 0) {
      return []
    }

    for (const shortcut of this.config.shortcuts!) {
      const rule = shortcut[0]
      const matched = isRegExp(rule) ? rule.exec(raw) : raw === rule
      const shortcuts = await (isFunction(shortcut[1])
        ? shortcut[1](matched as RegExpExecArray, context)
        : shortcut[1])

      if (isString(shortcuts)) {
        return shortcuts
          .split(' ')
          .filter(s => s.length > 0)
          .map((s) => {
            if (this.isShortcuts(s)) {
              return this.expandShortcuts(s, context, depth - 1) || []
            }

            return s
          }) as string[]
      }
    }
  }

  isShortcuts(raw: string) {
    for (const s of this.config.shortcuts!) {
      const rule = s[0]
      const matched = isRegExp(rule) ? rule.exec(raw) : raw === rule

      if (matched) {
        return true
      }
    }

    return false
  }

  processShortcuts(shortcut: string) {}

  isBlocked(raw: string) {
    return (
      !raw
      || this.config.blocked!.some(item =>
        isRegExp(item) ? item.test(raw) : raw === item,
      )
    )
  }
}
