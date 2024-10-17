import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: '',
    root: './',
    build: {
        outDir: '../../.dist/app/browser'
    },
    server: {
        port: 4200,
        proxy: {
            '/api': {
                target: 'http://localhost:8090',
                changeOrigin: true,
                secure: false,
            },
            '/swagger': {
                target: 'http://localhost:8090',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})
