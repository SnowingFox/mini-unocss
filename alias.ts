import { resolve } from 'path'

const r = (p: string) => resolve(__dirname, p)

export const alias: Record<string, string> = {
  '@mini-unocss/core': r('./packages/core/src/'),
  '@mini-unocss/preset-uno': r('./packages/preset-uno/src/'),
}
