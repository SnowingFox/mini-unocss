import { loadConfig } from 'unconfig'

export async function createConfigLoader() {
  return loadConfig({
    sources: [
      {
        files: 'unocss.config',
        extensions: ['js', 'ts'],
      },
    ],
  })
}
