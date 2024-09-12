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
      ['ab', 'a b'],
    ],
  })

  const { css } = await uno.generate('a b c d c1 d2 abcd ab')

  expect(css).toMatchInlineSnapshot(`
    "/** layer default **/
    .a{name:bar1;age:18;}
    .ab{name:bar1;age:18;name:bar2;}
    /** layer b **/
    .b{name:bar2;}
    /** layer c **/
    .c1{name:1;}
    /** layer d **/
    .d2{/* RAW 2 */}
    /** layer abcd **/
    .abcd{name:bar1;age:18;name:bar2;}"
  `)
})
