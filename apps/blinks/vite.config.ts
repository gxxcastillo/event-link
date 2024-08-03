/// <reference types='vitest' />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: './node_modules/.vite/apps/blinks',

  plugins: [
    nxViteTsPaths(),
    {
      name: 'minify-node-modules',
      async renderChunk(code, chunk) {
        if (chunk.fileName.includes('node_modules')) {
          const result = await esbuild.transform(code, {
            minify: true,
            loader: 'js',
          });
          return {
            code: result.code,
            map: result.map,
          };
        }
        return null;
      },
    },
  ],

  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: './src/handlers/index.ts',
      name: 'blinks',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: [],
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

  optimizeDeps: {
    esbuildOptions: {
      minify: true,
    },
  },

  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/web',
      provider: 'v8',
    },
  },
});
