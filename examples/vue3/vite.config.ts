import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from '../../packages/vite/src/index'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unocss({
      rules: [
        ['text-red', {color: 'red'}]
      ]
    }),
    vue()],
})
