import { resolve } from 'node:path';

export default {
  // The `@/` alias tsconfig declares, for the client bundle Vite builds.
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
    },
  },
};
