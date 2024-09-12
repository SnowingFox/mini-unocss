import cac from 'cac'
import { build } from './index'

export interface Commands {
  w: boolean
  o: string
}

export async function startCli(cwd = process.cwd()) {
  const cli = cac('munocss')

  cli
    .command('[...patterns]', 'Glob patterns', {
      ignoreOptionDefaultValue: true,
    })
    .option('-o <file>', 'Output file', {
      default: process.cwd(),
    })
    .option('-w', 'Watch for file changes')
    .action(async (patterns: string[], commands: Commands) => {
      await build(cwd, patterns, commands)
    })

  cli.help()
  cli.parse()
}
