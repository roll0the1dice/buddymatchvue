import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), AutoImport({
    resolvers: [VantResolver()],
  }),
  Components({
    resolvers: [VantResolver()],
  }),],  
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
