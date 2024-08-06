/// <reference types='vitest' />
import { resolve } from 'node:path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    root: __dirname,
    cacheDir: './node_modules/.vite',

    plugins: [nxViteTsPaths()],

    build: {
      outDir: './dist/rsvp',
      emptyOutDir: true,
      reportCompressedSize: true,
      external: ['package.json'],

      lib: {
        entry: resolve(__dirname, 'src/api/rsvp/index.ts'),
        formats: ['cjs'],
        fileName: 'index',
      },

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },

      minify: false,
    },
  };
});
