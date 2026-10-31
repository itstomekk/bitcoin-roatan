import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    // `npm run dev` has no Pages Functions; read-only data (places, events) comes from the live site.
    proxy: { "/api": { target: "https://bitcoin-roatan.pages.dev", changeOrigin: true } },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
