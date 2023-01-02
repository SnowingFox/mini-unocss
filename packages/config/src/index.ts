import type { UserConfig } from '@mini-unocss/core'
import { loadConfig as createConfigLoader } from 'unconfig'

export async function loadConfig(cwd = process.cwd()) {
  return createConfigLoader<UserConfig>({
    sources: [
      {
        files: 'unocss.config',
        extensions: ['js', 'ts'],
      },
    ],
    cwd,
  })
}
