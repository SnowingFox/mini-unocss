import { expect, test } from 'vitest'
import { createGenerator } from '../packages/core/src/utils'

test('test', async () => {
  const uno = createGenerator({
    rules: [
      ['a', { color: 'red' }],
      ['b', { color: 'blue' }],
    ],
    shortcuts: [
      ['ab', 'a b', { layer: 'a' }],
    ],
  })

  const payload = await uno.expandShortcuts('d', {} as any)

  expect(payload).toMatchInlineSnapshot(`
    [
      "a",
      "b",
    ]
  `)
})
