import type { ExtractorContext, GenerateOptions, UserConfig } from '../types'

import { isRegExp } from '../utils'
import { resolveConfig } from '../utils/config'
export class UnoGenerator {
  config: UserConfig
  constructor(
    public userConfig: UserConfig,
  ) {
    this.config = resolveConfig(userConfig)
  }

  async generate(
    input: string,
    options?: GenerateOptions,
  ) {
    const tokens = await this.applyExtractors(input, options?.id)

    const sheet = new Map<string, string[]>()

    const tokenPromises = Array.from(tokens).map(async (token) => {
      const payload = await this.parseToken(token)

      if (!payload) {
        return
      }

      if (!sheet.has(token)) {
        sheet.set(token, [])
      }
      sheet.get(token)!.push(payload[1])
    })

    await Promise.all(tokenPromises)

    return {
      get css() {
        return Array.from(sheet.keys()).map((selector) => {
          const cssEntries = sheet.get(selector)!
          return `.${selector}{ ${cssEntries} }`
        }).join('\n')
      },
    }
  }

  async parseToken(token: string) {
    for (const rule of this.config.rules) {
      const name = rule[0]
      const isValidToken = isRegExp(name)
        ? name.test(token)
        : name === token

      if (!isValidToken) {
        continue
      }

      return [name, Object.entries(this.userConfig.rules.find(item => name === item[0])![1]).map((
        [key, val]) => `${key}:${val};`,
      ).join('')] as const
    }
  }

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
}
