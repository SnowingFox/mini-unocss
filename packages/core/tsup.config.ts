import { defineConfig } from 'tsup'
import build from '../../scripts/build'

export default defineConfig({
  ...build,
  dts: true,
})
