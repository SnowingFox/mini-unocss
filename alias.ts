import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export const alias: Record<string, string> = {
  '@mini-unocss/core': r('./packages/core/src/'),
  '@mini-unocss/preset-uno': r('./packages/preset-uno/src/'),
  '@mini-unocss/config': r('./packages/config/src/'),
  '@mini-unocss/vite': r('./packages/vite/src/'),
  '@mini-unocss/cli': r('./packages/cli/src/'),
  'mini-unocss': r('./packages/mini-unocss/src/'),
}
