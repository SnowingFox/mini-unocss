import { extractorSplit } from '../extractors'
import type { UserConfig } from '../types/index'

export function resolveConfig<T extends {} = {}>(userConfig: UserConfig<T>): UserConfig<T> {
  return {
    blocked: [],
    extractors: [extractorSplit],
    preprocess: [],
    shortcuts: [],
    variants: [],
    safelist: [],
    ...userConfig,
  }
}
