import type { RuleContext } from './rule'
import type { CSSValue } from './utils'

export type ShortcutValue = string | CSSValue

export type DynamicShortcutMatcher<Theme extends {} = {}> = ((match: RegExpMatchArray, context: Readonly<RuleContext<Theme>>) => (string | ShortcutValue[] | undefined))

export type StaticShortcut = [string, string | ShortcutValue[]] | [string, string | ShortcutValue[]]
export type StaticShortcutMap = Record<string, string | ShortcutValue[]>
export type DynamicShortcut<Theme extends {} = {}> = [RegExp, DynamicShortcutMatcher<Theme>] | [RegExp, DynamicShortcutMatcher<Theme>]
export type UserShortcuts<Theme extends {} = {}> = StaticShortcutMap | (StaticShortcut | DynamicShortcut<Theme> | StaticShortcutMap)[]
export type Shortcut<Theme extends {} = {}> = StaticShortcut | DynamicShortcut<Theme>
