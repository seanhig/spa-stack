import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '',
  root: './',
  build: {
    outDir: '../../.dist/app/browser'
  },
  server: {
    port: 4200
  }
})
