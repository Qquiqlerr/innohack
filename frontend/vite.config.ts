import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      cache: false,
      include: [
        "./src/**/*.ts",
        "./src/**/*.tsx",
        "./fetchers/**/*.ts",
        "./config/**/*.ts",
        "./i18n/**/*.ts",
        "./*.ts",
      ],
      exclude: ["./src/Sandbox/**.**"],
    }),
  ],
});
