import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  /* Alias */
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    /* Size minify */
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: {
        /* Remove when there is access from external source */
        properties: true,
      },
      format: {
        comments: false,
      },
    },

    /* One-file build */
    lib: {
      entry: "src/main.ts",
      name: "EngineJS",
      fileName: () => "script.js",
      formats: ["iife"],
    },
  },
});
