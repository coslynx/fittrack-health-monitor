import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,jsx}'],
    // Optional setup file for Vitest (e.g., extending expect with matchers)
    // Create this file if needed: ./src/setupTests.js
    setupFiles: './src/setupTests.js',
  },
});