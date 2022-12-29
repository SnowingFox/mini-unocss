import { expect, test } from 'vitest'
import { createGenerator } from '../packages/core/src/utils'

test('variants', async () => {
  const uno = createGenerator({
    rules: [
      ['text-red', { color: 'red' }],
      ['preflights', { name: 'a' }, { layer: 'preflights' }],
      ['m-2', { m: 2 }],
    ],
    preprocess: [
      (matcher) => {
        return matcher.startsWith('prefix-')
          ? matcher.slice(7)
          : matcher
      },
    ],
    variants: [
      (matcher) => {
        if (!matcher.startsWith('hover:'))
          return matcher
        return {
          matcher: matcher.slice(6),
          selector: s => `${s}:hover`,
        }
      },
    ],
  })

  const { css } = await uno.generate('prefix-hover:m-2 hover:m-2 m-2')

  expect(css).toMatchInlineSnapshot(`
    "/** layer default **/
    .m-2{m:2;}
    .prefix-hover\\\\:m-2\\\\:hover{m:2;}
    .hover\\\\:m-2\\\\:hover{m:2;}"
  `)
})
