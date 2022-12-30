import { UnoGenerator } from '../generator'
import type { UserConfig } from '../types/index'

export const validateFilterRE = /[\w\u00A0-\uFFFF-_:%-?]/

export function isValidSelector(selector = ''): selector is string {
  return validateFilterRE.test(selector)
}

export const isRegExp = (val: unknown): val is RegExp => val instanceof RegExp

export const isFunction = (val: unknown): val is Function => val instanceof Function

export const isString = (val: unknown): val is string => typeof val === 'string'

export const createGenerator = <Theme extends {} = {}>(options: UserConfig<Theme>) => {
  return new UnoGenerator(options)
}
