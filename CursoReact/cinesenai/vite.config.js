import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // mock-server; na integração, troque pela URL do back-end
        changeOrigin: true,
        secure: false
      }
    }
  }
})