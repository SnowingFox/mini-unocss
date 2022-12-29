import { expect, test } from 'vitest'
import { createGenerator } from '../packages/core/src/utils'

test('preflights', async () => {
  const uno = createGenerator({
    rules: [
      ['text-red', { color: 'red' }],
      ['preflights', { name: 'a' }, { layer: 'preflights' }],
    ],
    preflights: [
      {
        getCSS: () => '.hello { text: red }',
      },
      {
        getCSS: () => '.layer { /**  preflights **/ }',
        layer: 'preflights',
      },
    ],
  })

  const { css } = await uno.generate('text-red preflights')

  expect(css).toMatchInlineSnapshot(`
    "/** layer preflights **/
    .preflights{name:a;}
    .layer { /**  preflights **/ }
    /** layer default **/
    .text-red{color:red;}
    .hello { text: red }"
  `)
})
