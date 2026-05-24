import { defineConfig } from 'vite'
import { readFileSync } from 'node:fs'
import { minify } from 'html-minifier-terser'

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

export default defineConfig({
  base: './',
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    minify: 'esbuild',
    cssMinify: true,
  },
  plugins: [
    {
      name: 'minify-html',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        async handler(html) {
          return minify(html, {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            keepClosingSlash: true,
            removeAttributeQuotes: false,
            removeComments: true,
            removeEmptyAttributes: true,
            removeOptionalTags: false,
            sortAttributes: true,
            sortClassName: true,
          })
        },
      },
    },
  ],
})
