import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/IELC-Homepage/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ec: resolve(__dirname, 'ec.html'),
        events: resolve(__dirname, 'events.html'),
      },
    },
  },
})
