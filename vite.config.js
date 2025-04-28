import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://10.120.33.60',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/app')
      }
    }
  }
})
