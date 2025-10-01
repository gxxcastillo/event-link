import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: './node_modules/.vitest',
  test: {
    watch: false,
    globals: false,
    environment: 'node',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
    testTimeout: 60_000,
  },
});
