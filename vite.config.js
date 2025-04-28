import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    base: '/',  // Use root path for both production and development
    server: {
      proxy: isProduction ? {} : {
        '/api': {
          target: 'http://10.120.33.60',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/app')
        }
      }
    }
  };
});
