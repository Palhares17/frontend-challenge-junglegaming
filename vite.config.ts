import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      routesDirectory: './src/core/router/routes',
      generatedRouteTree: './src/core/router/routeTree.gen.ts',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  server: { watch: { ignored: ['**/docs/**', '**/playwright-report/**', '**/test-results/**'] } },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    cssCodeSplit: false,
    rolldownOptions: {
      input: {
        app: fileURLToPath(new URL('./index.html', import.meta.url)),
        preview: fileURLToPath(new URL('./ui-preview.html', import.meta.url)),
      },
    },
  },
});
