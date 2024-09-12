import { isRegExp } from './index'

export const generateSelector = (s: string) => s.startsWith('[') || s.startsWith('.') ? s : `.${s}`

export const isRuleEqual = (val: string | RegExp, target: string) => isRegExp(val) ? val.test(target) : target === val
