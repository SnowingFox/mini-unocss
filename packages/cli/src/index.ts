import path from 'node:path'
import consola from 'consola'
import chokidar from 'chokidar'
import { loadConfig } from '@mini-unocss/config'
import type { UnoGenerator } from '@mini-unocss/core'
import { createGenerator } from '@mini-unocss/core'
import fg from 'fast-glob'
import fs from 'fs-extra'
import { debounce } from 'perfect-debounce'
import { green } from 'colorette'
import type { Commands } from './cli-start'
import { readFile, slash } from './utils'

const fileCache = new Map<string, string>()

export async function build(cwd = process.cwd(), patterns: string | string[], commands: Commands) {
  const { config } = await loadConfig(cwd)

  if (!config) {
    consola.fatal('Can\' find config, please define config file first.')
    return
  }

  const uno = createGenerator(config)

  if (!patterns) {
    patterns = [patterns]
  }

  const files = await fg(patterns, {
    ignore: ['node_modules', 'dist'],
  })

  for (const f of files) {
    const code = readFile(f)

    if (!fileCache.get(f)) {
      fileCache.set(f, code)
    }
  }

  const debounceBuilder = debounce(async () => await generate(uno, cwd, commands.o || 'uno.css'), 500)

  await debounceBuilder()

  if (commands.w) {
    const watcher = chokidar.watch(patterns, {
      ignored: [/(^|[\/\\])\../, 'node_modules', 'dist'],
      persistent: true,
    })

    watcher.on('all', async (eventName, filePath) => {
      const file = slash(path.resolve(cwd, slash(filePath)))
      if (eventName.includes('unlink')) {
        fileCache.delete(file)
      }
      else if (eventName === 'change' || eventName.includes('add')) {
        fileCache.set(file, readFile(file))
      }
      await debounceBuilder()
    })
  }
}

async function generate(uno: UnoGenerator, cwd: string, output: string) {
  const code = Array.from(fileCache).map(f => f[1]).join('\n')
  const outputPath = path.resolve(cwd, output)

  const { css } = await uno.generate(code, { id: outputPath })

  fs.outputFileSync(outputPath, css, { encoding: 'utf-8' })

  consola.success(green(`[${new Date()}] build success!`))
}
