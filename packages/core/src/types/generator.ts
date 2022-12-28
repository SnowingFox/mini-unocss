export interface IParseUtilsResult {
  currentSelector: string

  body: string

  selector: string

  layer: string
}

export interface SheetUtils {
  body: string | string[]

  layer: string
}
