import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: './node_modules/.vitest',
  test: {
    watch: false,
    globals: false,
    environment: 'node',
    include: ['tests/**/*test.ts'],
  },
});
