import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'vendor-react'
          }

          if (id.includes('/@codemirror/') || id.includes('/@uiw/react-codemirror/') || id.includes('/codemirror/')) {
            return 'vendor-codemirror'
          }

          return undefined
        },
      },
    },
  },
  resolve: {
    alias: {
      // Vite 需要 ESM；shared 的 dist 是 CJS（供 Nest 使用），web 直接编源码
      '@icon-forge/shared': fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
      '/health': 'http://localhost:3000',
    },
  },
  optimizeDeps: {
    include: ['@uiw/react-codemirror', '@codemirror/lang-xml', '@codemirror/theme-one-dark', '@codemirror/view'],
  },
})
