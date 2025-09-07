import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
    // Note: Compression disabled for Vercel deployment - Vercel handles compression automatically
    // viteCompression({
    //   algorithm: 'gzip',
    //   ext: '.gz',
    // }),
    // viteCompression({
    //   algorithm: 'brotliCompress',
    //   ext: '.br',
    // }),
  ],
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          // UI libraries
          'ui-vendor': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group',
            '@radix-ui/react-tooltip'
          ],
          // State management
          'state-vendor': ['zustand', 'immer'],
          // Data fetching
          'data-vendor': ['@tanstack/react-query', 'axios'],
          // AI and external services
          'ai-vendor': ['@anthropic-ai/sdk', '@google/generative-ai', 'ai'],
          // Database
          'db-vendor': ['@supabase/supabase-js'],
          // Payment
          'payment-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          // 3D and graphics
          'graphics-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          // Utilities
          'utils-vendor': ['lodash', 'date-fns', 'clsx', 'tailwind-merge'],
          // Animation
          'animation-vendor': ['framer-motion'],
          // Icons
          'icons-vendor': ['lucide-react'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  server: {
    port: 3000,
    // Enable HMR for better development experience
    hmr: {
      overlay: true
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'zustand',
      'immer',
      '@tanstack/react-query',
      'axios',
      'lucide-react',
      'framer-motion',
      'clsx',
      'tailwind-merge'
    ],
    exclude: ['@vite/client', '@vite/env']
  },
  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl(filename: string) {
      return `/${filename}`
    }
  }
})