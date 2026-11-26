import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      "/flickr": {
        target: "https://api.flickr.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flickr/, "/services/feeds"),
      },
    },
  },
});
