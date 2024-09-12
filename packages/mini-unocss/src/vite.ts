import type { UserConfig } from '@mini-unocss/core'
import type { Plugin } from 'vite'

export default function MiniUnocssViteConfig<T extends {} = {}>(config: UserConfig<T>): Plugin {
  return {
    name: '',
  }
}
