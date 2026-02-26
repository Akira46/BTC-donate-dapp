// Fix for @btc-vision/walletconnect resolution issue
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@btc-vision/walletconnect': path.resolve(__dirname, 'node_modules/@btc-vision/walletconnect/build/index.js'),
    }
  },
  optimizeDeps: {
    include: ['@btc-vision/walletconnect', '@btc-vision/bitcoin', '@btc-vision/transaction']
  }
})
