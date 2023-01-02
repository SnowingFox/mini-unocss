import fs from 'fs-extra'

export const slash = (path: string) => path.replaceAll('\\', '/')

export const readFile = (file: string) => fs.readFileSync(file, { encoding: 'utf-8' })
