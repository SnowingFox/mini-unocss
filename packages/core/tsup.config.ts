import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  target: 'es2020',
  sourcemap: true,
  splitting: false,
})
