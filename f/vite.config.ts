import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg'],
  // Thêm server config để hỗ trợ autoplay
  server: {
    headers: {
      // Quan trọng: Cho phép autoplay
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  },
  build: {
    // Tối ưu cho audio
    rollupOptions: {
      output: {
        manualChunks: {
          audio: ['src/assets/*.mp3']
        }
      }
    }
  }
})