import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Alias for AWS Amplify if used
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  optimizeDeps: {
    include: ['react-router-dom'],
  },
});
