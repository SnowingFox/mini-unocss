import type { ExtractorContext, GenerateOptions, UserConfig } from '../types'
import type { IParseUtilsResult } from '../types/generator'
import type { DynamicMatcher, Rule, RuleContext } from '../types/rule'
import type { CSSObject } from '../types/utils'
import type { Variant, VariantContext, VariantMatchedResult } from '../types/variants'
import { isFunction, isRegExp, isString } from '../utils'
import { resolveConfig } from '../utils/config'

export class UnoGenerator<Theme extends {} = {}> {
  private _cache = new Map<string, any>()
  public config: UserConfig<Theme>

  public blocked = new Set<string>()
  constructor(
    public userConfig: UserConfig<Theme>,
  ) {
    this.config = resolveConfig(userConfig)
  }

  async generate(
    input: string,
    options?: GenerateOptions,
  ) {
    const tokens = await this.applyExtractors(input, options?.id)

    const layerSet = new Set<string>(['default'])
    const matched = new Set<string>()
    const sheet = new Map<string, string[]>()

    const tokenPromises = Array.from(tokens).map(async (raw) => {
      if (matched.has(raw)) {
        return
      }

      matched.add(raw)

      const payload = await this.parseToken(raw)

      if (!payload) {
        return
      }

      if (!sheet.get(payload.currentSelector)) {
        sheet.set(payload.currentSelector, [])
      }

      sheet.get(payload.currentSelector)!.push(payload.body)
    })

    await Promise.all(tokenPromises)

    const layers = Array.from(layerSet)

    const getLayer = (layer: string) => {
      return Array.from(sheet).map(([selector, body]) => {
        const css = `${selector}{${body.join('')}}`
        return css
      }).join('\n')
    }

    const getLayers = (includes = layers, excludes?: string[]) => {
      return includes
        .filter(i => !excludes?.includes(i))
        .map(i => getLayer(i))
        .join('\n')
    }

    return {
      get css() { return getLayers() },
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

    // const shortcuts = this.expandShortcuts(raw, context)

    return this.parseUtil(raw, context) as IParseUtilsResult
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

      processed = isString(result) ? result : result.matcher
      rule = await this.getCSSRuleByRaw(raw)! as Rule
      selector = isString(result) ? raw : result.selector?.(raw, rule) as string
      variants.add(v as Variant<Theme>)
    })

    return { raw, processed, variants, selector }
  }

  getCSSRuleByRaw(raw: string) {
    for (const r of this.config.rules!) {
      const rule = r[0]
      if (isRegExp(rule)) {
        const exec = rule.exec(raw)
        // TODO solve type problem
        if (exec) {
          return (r[1] as DynamicMatcher<Theme>)(exec as RegExpExecArray, {} as any)
        }
      }
      else if (raw === rule) {
        return r[1] as CSSObject
      }
    }
  }

  parseUtil(
    raw: string,
    context: Readonly<RuleContext<Theme>>,
  ): IParseUtilsResult | null {
    const { currentSelector } = context

    const body = this.getCSSRuleByRaw(raw) as CSSObject

    if (!body) {
      return null
    }

    return {
      selector: currentSelector,
      currentSelector: (currentSelector.startsWith('[') || currentSelector.startsWith('.')) ? currentSelector : `.${currentSelector}`,
      body: Object.entries(body).map(([key, val]) => `${key}:${val};`).join(''),
    }
  }

  async stringifyShortcuts() {}

  async applyExtractors(
    input: string,
    id?: string,
  ) {
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

  async expandShortcuts(raw: string, context: RuleContext<Theme>, depth = 5): Promise<string[] | undefined> {
    if (depth === 0) {
      return []
    }

    for (const shortcut of this.config.shortcuts!) {
      const rule = shortcut[0]
      const matched = isRegExp(rule) ? rule.exec(raw) : raw === rule
      const shortcuts = await (isFunction(shortcut[1]) ? shortcut[1](matched as RegExpExecArray, context) : shortcut[1])

      if (isString(shortcuts)) {
        return shortcuts.split(' ').filter(s => s.length !== 0).map((s) => {
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
    return !raw || this.config.blocked!.some(item => isRegExp(item)
      ? item.test(raw)
      : raw === item,
    )
  }
}
