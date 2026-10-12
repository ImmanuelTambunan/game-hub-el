import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './',
  appType: 'mpa', // Mengizinkan pembukaan file HTML di folder public secara langsung
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});