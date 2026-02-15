import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/IELC-Homepage/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ec: resolve(__dirname, 'ec.html'),
        '8th-ec': resolve(__dirname, '8th-ec.html'),
        '7th-ec': resolve(__dirname, '7th-ec.html'),
        '6th-ec': resolve(__dirname, '6th-ec.html'),
        '5th-ec': resolve(__dirname, '5th-ec.html'),
        events: resolve(__dirname, 'events.html'),
      },
    },
  },
})
