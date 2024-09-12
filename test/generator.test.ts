import { createGenerator } from '@mini-unocss/core'
import { presetUno } from '@mini-unocss/preset-uno'
import { expect, test } from 'vitest'

const fixture1 = `<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <p text-red class="text-red">11</p>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
`

test('generator', async () => {
  const uno = createGenerator({
    presets: [
      presetUno(),
    ],
  })

  const tokens = await uno.applyExtractors(fixture1)

  expect(tokens).toMatchInlineSnapshot(`
    Set {
      "<script",
      "setup",
      "lang=",
      "ts",
      ">",
      "import",
      "HelloWorld",
      "from",
      "./components/HelloWorld.vue",
      "</script>",
      "<template>",
      "<div>",
      "<a",
      "href=",
      "https://vitejs.dev",
      "target=",
      "_blank",
      "<img",
      "src=",
      "/vite.svg",
      "class=",
      "logo",
      "alt=",
      "Vite",
      "/>",
      "</a>",
      "<p",
      "text-red",
      ">11</p>",
      "https://vuejs.org/",
      "./assets/vue.svg",
      "vue",
      "Vue",
      "</div>",
      "<HelloWorld",
      "msg=",
      "+",
      "</template>",
      "<style",
      "scoped>",
      ".logo",
      "height:",
      "6em",
      "padding:",
      "1.5em",
      "will-change:",
      "filter",
      ".logo:hover",
      "filter:",
      "drop-shadow(0",
      "0",
      "2em",
      "#646cffaa)",
      ".logo.vue:hover",
      "#42b883aa)",
      "</style>",
    }
  `)
})
