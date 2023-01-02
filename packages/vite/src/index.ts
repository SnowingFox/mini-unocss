import type { UserConfig } from '@mini-unocss/core'
import { createGenerator } from '@mini-unocss/core'
import type { Plugin, ViteDevServer } from 'vite'

export default function VitePlugin<T extends {} = {}>(config: UserConfig<T>): Plugin {
  const uno = createGenerator(config)
  let server: ViteDevServer

  const tokens: string[] = []

  return {
    name: 'mini-uno:vite',
    configureServer(s) {
      server = s
    },
    async transform(code, id) {
      if (/\.[vue]/.test(id)) {
        const extractors = await uno.applyExtractors(code, id)
        tokens.push(...Array.from(extractors))
      }
      return code
    },
    resolveId(id) {
      return id
    },
    async load(id) {
      if (id.includes('uno.css')) {
        const { css } = await uno.generate(tokens.join('\n'))
        console.log(css)
        return css
      }
    }
  }
}
