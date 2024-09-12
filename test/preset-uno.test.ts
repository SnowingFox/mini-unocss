import { expect, test } from 'vitest'
import { presetUno } from '@mini-unocss/preset-uno'
import { createGenerator } from '../packages/core/src/utils'

test('preset-uno', async () => {
  const uno = createGenerator({
    presets: [
      presetUno(),
    ],
  })

  const { css: css1 } = await uno.generate('text-red')
  const { css: css2 } = await uno.generate('text-red-500')

  expect(css1.includes('#ef4444') && css2.includes('#ef4444')).toBeTruthy()
})
