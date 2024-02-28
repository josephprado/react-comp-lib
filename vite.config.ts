/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['lib/**/!(*.spec|*.test).{ts,tsx}'],
      exclude: ['lib/test/**'],
    }),
  ],
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'],
      fileName: 'main',
    },
    copyPublicDir: false,
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./lib/test/setup.ts'],
    mockReset: true,
    restoreMocks: true,
  },
});
