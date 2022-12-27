import type { ExtractorContext, GenerateOptions, UserConfig } from '../types/index'
import type { RuleContext } from '../types/rule'
import type { Variant, VariantContext, VariantMatchedResult } from '../types/variants'
import { isFunction, isRegExp, isString } from '../utils'
import { resolveConfig } from '../utils/config'

export class UnoGenerator<Theme extends {} = {}> {
  private _cache = new WeakMap<string, any>()
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

    const layerSet = new Set<string>()
    const matched = new Set<string>()
    const sheet = new Map<string, string[]>()

    const tokenPromises = Array.from(tokens).map(async (raw) => {
      if (matched.has(raw)) {
        return
      }

      const payload = await this.parseToken(raw)

      if (!payload) {
        return
      }
    })

    await Promise.all(tokenPromises)

    const layers = Array.from(layerSet)

    const getLayer = (layer: string) => {
      Array.from(sheet).map((item) => {

      })
    }

    const getLayers = (includes = layers, excludes?: string[]) => {

    }

    return {
      get css() { return getLayers() },
    }
  }

  async parseToken(raw: string) {
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
    }

    const shortcuts = this.expandShortcuts(raw, context)

    const parsed = shortcuts
  }

  matchVariants(raw: string): VariantMatchedResult<Theme> {
    const variants = new Set<Variant<Theme>>()

    const context: VariantContext<Theme> = {
      rawSelector: raw,
      theme: this.config.theme,
      generator: this,
    }

    let processed = raw

    this.config.variants!.forEach((v) => {
      if (variants.has(v)) {
        return
      }
      const handler = isFunction(v) ? v : v.match
      const result = handler(raw, context)

      if (!result) {
        return
      }

      processed = isString(result) ? result : result.matcher
      variants.add(v as Variant<Theme>)
    })

    return { raw, processed, variants }
  }

  async stringifyTokens(token: string, context: Readonly<RuleContext<Theme>>) {

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
