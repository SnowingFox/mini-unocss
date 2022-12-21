import { expect, test } from 'vitest'
import { createGenerator } from '../packages/core/src/utils'

test('test', async () => {
  const uno = createGenerator({
    rules: [
      ['a', { color: 'red' }],
      ['b', { color: 'blue' }],
    ],
  })

  const { css } = await uno.generate('a b')

  expect(css).toMatchInlineSnapshot(`
    ".a{ color:red; }
    .b{ color:blue; }"
  `)
})
