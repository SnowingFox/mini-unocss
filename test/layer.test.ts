import { expect, test } from 'vitest'
import { createGenerator } from '../packages/core/src/utils'

test('layer', async () => {
  const uno = createGenerator({
    rules: [
      ['a', { name: 'bar1', age: '18' }, { layer: 'default' }],
      ['b', { name: 'bar2' }, { layer: 'b' }],
      [/^c(\d+)$/, ([, d]) => ({ name: d }), { layer: 'c' }],
      [/^d(\d+)$/, ([, d]) => `/* RAW ${d} */`, { layer: 'd' }],
    ],
    shortcuts: [
      ['abcd', 'a b c d', { layer: 'abcd' }],
    ],
  })

  const { css } = await uno.generate('a b c d abcd')

  // TODO solve bug
  expect(css).toMatchInlineSnapshot(`
    "/** layer default **/
    .a{name:bar1;age:18;}
    .abcd{name:bar1;age:18;name:bar2;}
    /** layer b **/
    .b{name:bar2;}


    /** layer default **/
    .a{name:bar1;age:18;}
    .abcd{name:bar1;age:18;name:bar2;}"
  `)
})
