import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  build: { chunkSizeWarningLimit: 1500 }, // the license list is a lazy-loaded chunk
  server: {
    port: 1420,
    strictPort: true,
    // Cargo writes build files under src-tauri; Windows locks them, so Vite must not watch them.
    watch: { ignored: ["**/src-tauri/**"] },
  },
});
