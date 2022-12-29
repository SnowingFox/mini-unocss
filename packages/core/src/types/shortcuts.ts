import type { RuleContext, RuleMeta } from './rule'
import type { CSSValue } from './utils'

export type DynamicShortcutMatcher<Theme extends {} = {}> = ((match: RegExpMatchArray, context: Readonly<RuleContext<Theme>>) => (string | ShortcutValue[] | undefined))

export type StaticShortcut = [string, string | ShortcutValue[]] | [string, string | ShortcutValue[], RuleMeta]
export type DynamicShortcut<Theme extends {} = {}> = [RegExp, DynamicShortcutMatcher<Theme>] | [RegExp, DynamicShortcutMatcher<Theme>, RuleMeta]
export type UserShortcuts<Theme extends {} = {}> = StaticShortcut | DynamicShortcut<Theme>
export type Shortcut<Theme extends {} = {}> = StaticShortcut | DynamicShortcut<Theme>
export type ShortcutValue = string | CSSValue
