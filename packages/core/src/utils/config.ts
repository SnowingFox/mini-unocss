import { extractorSplit } from '../extractors'
import type { UserConfig } from '../types'

export function resolveConfig<T extends {} = {}>(userConfig: UserConfig<T>): Required<UserConfig<T>> {
  const {
    id = '',
    presets = [],
    blocked = [],
    extractors = [extractorSplit],
    preprocess = [],
    shortcuts = [],
    variants = [],
    safelist = [],
    rules = [],
    preflights = [],
  } = userConfig

  const presetTheme: T[] = []

  for (const preset of presets) {
    const {
      blocked: b = [],
      preprocess: p = [],
      theme: t = {} as T,
      shortcuts: s = [],
      variants: v = [],
      rules: r = [],
    } = preset

    variants.push(...v)
    presetTheme.push(t)
    shortcuts.push(...s)
    blocked.push(...b)
    preprocess.push(...p)
    rules.push(...r)
  }

  presetTheme.forEach(p => userConfig.theme = Object.assign(p, userConfig.theme))

  return {
    id,
    blocked,
    extractors,
    preprocess,
    shortcuts,
    variants,
    safelist,
    preflights,
    rules,
    theme: userConfig.theme as T,
    presets,
  }
}
