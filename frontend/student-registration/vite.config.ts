import { defineConfig } from "vite";
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
});
