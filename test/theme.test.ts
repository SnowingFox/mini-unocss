import { expect, test } from 'vitest'
import { createGenerator } from '../packages/core/src/utils'

interface Colors {
  primary: string

  secondary: string
}

interface Theme {
  palette: {
    dark: Colors
    light: Colors
  }
}

const dark: Colors = {
  primary: 'd-p',
  secondary: 'd-s',
}

const light: Colors = {
  primary: 'l-p',
  secondary: 'l-s',
}
test('theme', async () => {
  const uno = createGenerator<Theme>({
    rules: [
      [/bg-(.*)$/, ([, c], { theme, rawSelector }) => {
        if (['primary', 'secondary'].includes(c)) {
          const mode: keyof Theme['palette'] = rawSelector.startsWith('dark:') ? 'dark' : 'light'
          return { s: theme.palette[mode][c as keyof Colors] }
        }
      }],
    ],
    theme: {
      palette: {
        dark,
        light,
      },
    },
  })

  const { css } = await uno.generate('bg-secondary dark:bg-primary')

  expect(css).toMatchInlineSnapshot(`
    "/** layer default **/
    .bg-secondary{s:l-s;}
    .dark\\\\:bg-primary{s:d-p;}"
  `)
})
