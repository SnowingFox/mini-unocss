import { defineConfig } from 'tsup'
import build from '../../scripts/build'

export default defineConfig({
  ...build,
  dts: true,
  entry: [
    'src/cli.ts',
    'src/cli-start.ts',
    'src/index.ts',
  ],
})
