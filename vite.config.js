// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // --- AGREGA ESTA PARTE ---
  server: {
    proxy: {
      '/webhook': {
        target: 'https://agente-de-citas-dental-space-n8n.ofcrls.easypanel.host',
        changeOrigin: true,
        secure: false,
      }
    }
  }
  // -------------------------
})