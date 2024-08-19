import { defineConfig } from '@solidjs/start/config';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  vite: {
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
    ],
  },

  ssr: false,

  server: {
    https: {
      cert: './.certs/cert.pem',
      key: './.certs/dev.pem',
    },
  },
});
