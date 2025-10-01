import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [
    mkcert({
      hosts: ['eventlink.x'],
      savePath: './.certs',
    }),
    nodePolyfills({
      include: ['buffer'],
      globals: {
        global: true,
        Buffer: true,
      },
    }),
    devtools(),
    solidPlugin(),
  ],
  server: {
    host: 'eventlink.x',
    port: 3000,
    https: {
      cert: './.certs/cert.pem',
      key: './.certs/dev.pem',
    },
  },
  build: {
    target: 'esnext',
  },
});
