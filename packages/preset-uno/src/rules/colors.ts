import type { Rule } from '@mini-unocss/core'
import type { Colors, Theme } from '../theme/types'

export const rules: Rule<Theme>[] = [
  [/^text-(.+)$/, ([, d], { theme }) => {
    const dSplit = d.split('-')
    const name = dSplit[0]
    const level = dSplit[1] || '500'

    const color = (theme.colors![name] as Colors)[level] as string
    if (color) {
      return { color }
    }
  }],
]
