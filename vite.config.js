import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@emotion/styled', 'pdfjs-dist/legacy/build/pdf', 'pdfjs-dist/legacy/build/pdf.worker.entry'],
    exclude: ['firebase', 'firebase/app', 'firebase/firestore']
  }
})
