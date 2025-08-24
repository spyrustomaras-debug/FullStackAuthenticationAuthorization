import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // ✅ enable source maps
    rollupOptions: {
      output: {
        manualChunks: undefined, // optional: for simpler chunking
      },
    },
  },
  test: {
    setupFiles: 'src/setupTests.ts',
    environment: 'jsdom',
    globals: true,
    coverage: {
      reporter: ['text', 'lcov'],
      all: true,            // include all files
      exclude: ['node_modules/', 'tests/']
    }
  },
});
