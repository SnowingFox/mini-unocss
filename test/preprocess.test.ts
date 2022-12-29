import { expect, test } from 'vitest'
import { createGenerator } from '../packages/core/src/utils'

test('preprocess', async () => {
  const uno = createGenerator({
    rules: [
      ['text-red', { color: 'red' }],
      ['preflights', { name: 'a' }, { layer: 'preflights' }],
    ],
    preprocess: [
      (matcher) => {
        return matcher.startsWith('prefix-')
          ? matcher.slice(7)
          : matcher
      },
    ],
  })

  const { css } = await uno.generate('prefix-text-red')

  expect(css).toMatchInlineSnapshot(`
    "/** layer default **/
    .prefix-text-red{color:red;}"
  `)
})
