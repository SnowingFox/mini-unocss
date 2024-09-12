import type { UserConfig } from '@mini-unocss/core'

export default <UserConfig> {
  rules: [
    [/^text-(.*)/, ([,color]) => ({ color })],
  ],
}
