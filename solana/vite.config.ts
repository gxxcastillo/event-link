import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: './node_modules/.vitest',
  test: {
    watch: false,
    globals: false,
    environment: 'node',
    sequence: {
      // Ensure tests run sequentially
      shuffle: false,
      concurrent: false,
    },
    include: ['tests/**/*test.ts'],
  },
});
