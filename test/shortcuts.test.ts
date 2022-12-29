import { expect, test } from 'vitest'
import { createGenerator } from '../packages/core/src/utils'

test('nested shortcuts', async () => {
  const uno = createGenerator({
    rules: [
      ['a', { color: 'red' }],
      ['b', { color: 'blue' }],
      ['c', { color: 'c' }],
      ['d', { color: 'd' }],
    ],
    shortcuts: [
      ['ab', 'a b', { layer: 'a' }],
      ['cd', 'c d'],
      ['abcd', 'ab cd'],
    ],
  })

  const payload1 = await uno.expandShortcuts('ab', {} as any)
  const payload2 = await uno.expandShortcuts('cd', {} as any)
  const payload3 = await uno.expandShortcuts('abcd', {} as any)

  expect(payload1).toMatchInlineSnapshot(`
    [
      "a",
      "b",
    ]
  `)
  expect(payload2).toMatchInlineSnapshot(`
    [
      "c",
      "d",
    ]
  `)
  expect(payload3).toMatchInlineSnapshot(`
    [
      "a",
      "b",
      "c",
      "d",
    ]
  `)
})
