import { UnoGenerator } from '@unocss/core'
import type { UserConfig } from '../types'

export const validateFilterRE = /[\w\u00A0-\uFFFF-_:%-?]/

export function isValidSelector(selector = ''): selector is string {
  return validateFilterRE.test(selector)
}

export const isRegExp = (val: unknown): val is RegExp => val instanceof RegExp

export const createGenerator = (options: UserConfig) => {
  return new UnoGenerator(options)
}
