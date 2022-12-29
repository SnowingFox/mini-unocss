import type { UnoGenerator } from '@unocss/core'
import type { Awaitable } from './utils'

export interface Preflights<Theme extends {} = {}> {
  getCSS: (params: { generator: UnoGenerator<Theme>; theme: Theme }) => Awaitable<string>

  /*
  * layer
  *
  * @default DEFAULT_LAYER
  */
  layer?: string
}
