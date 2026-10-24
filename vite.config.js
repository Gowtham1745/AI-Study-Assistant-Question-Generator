import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages hosts this repository at /AI-Study-Assistant-Question-Generator/
  base: '/AI-Study-Assistant-Question-Generator/',
  plugins: [react()],
})
