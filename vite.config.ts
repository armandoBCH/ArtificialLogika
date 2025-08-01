import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Environment variables are handled automatically by Vite
  // Variables prefixed with VITE_ are exposed to the client
  // In development: loaded from .env files (if they exist)
  // In production (Vercel): loaded from Vercel environment variables
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/contexts": path.resolve(__dirname, "./contexts"),
      "@/hooks": path.resolve(__dirname, "./hooks"),
      "@/pages": path.resolve(__dirname, "./pages"),
      "@/styles": path.resolve(__dirname, "./styles"),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  // Environment variables are handled automatically by Vite
  // Variables from Vercel are available during build time
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', 'framer-motion'],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `styles/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react'],
  },
})