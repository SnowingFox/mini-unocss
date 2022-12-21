import { extractorSplit } from '../extractors'
import type { UserConfig } from '../types'

export function resolveConfig(userConfig: UserConfig): UserConfig {
  const config = userConfig

  if (!config.extractors?.length) {
    config.extractors = [extractorSplit]
  }

  return config
}
