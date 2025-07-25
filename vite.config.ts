import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path"; // Importe o módulo path

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: path.resolve(__dirname, "src"),
      },
    ],
  },
});