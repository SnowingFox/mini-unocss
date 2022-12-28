import { describe, expect, test } from 'vitest'
import type { RuleContext } from '../packages/core/src/types/rule'
import { createGenerator } from '../packages/core/src/utils'

describe('core', async () => {
  const uno = createGenerator({
    rules: [
      ['text-red', { color: 'red' }],
      [/^m-(\d)$/, ([, d]) => ({ margin: `${+d / 4}rem` })],
    ],
  })

  test('getCSSRuleByRaw', async () => {
    expect(uno.getCSSRuleByRaw('m-2')).toMatchInlineSnapshot(`
      {
        "margin": "0.5rem",
      }
    `)
  })

  test('stringifyToken', async () => {
    const context: RuleContext = {
      rawSelector: 'hover:text-red',
      currentSelector: 'text-red',
    } as RuleContext

    expect(await uno.parseUtil('m-2', context)).toMatchInlineSnapshot(`
      {
        "body": "margin:0.5rem;",
        "currentSelector": ".text-red",
        "selector": "text-red",
      }
    `)
  })

  test('generate', async () => {
    const { css } = await uno.generate('text-red m-2 m-3')

    expect(css).toMatchInlineSnapshot(`
      ".text-red{color:red;}
      .m-2{margin:0.5rem;}
      .m-3{margin:0.75rem;}"
    `)
  })
})
