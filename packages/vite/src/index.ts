import type { UserConfig } from '@mini-unocss/core'
import { createGenerator } from '@mini-unocss/core/src/utils'
import type { Plugin, ViteDevServer } from 'vite'

export default function VitePlugin<T extends {} = {}>(config: UserConfig<T>): Plugin {
  const uno = createGenerator(config)
  let server: ViteDevServer

  return {
    name: 'mini-uno:vite',
    configureServer(s) {
      server = s
    },
    load(id) {
      if (id.includes('uno.css')) {

      }
    },
  }
}
