import type { Presets } from '@mini-unocss/core'
import { rules } from './rules/colors'
import { UnoTheme } from './theme'
import type { Theme } from './theme/types'

export const presetUno = (): Presets<Theme> => {
  return {
    theme: UnoTheme,
    rules,
  }
}
