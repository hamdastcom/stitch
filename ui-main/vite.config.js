import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so Capacitor Android WebView can load the SPA
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.lottie"],
  server: {
    allowedHosts: ["app.lontra.ir", 'app.hamdast.com','api.hamdast.com',"api.lontra.ir", "hamdast.chatsift.com"],
  },
});
