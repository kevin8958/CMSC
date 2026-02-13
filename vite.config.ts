import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // 1. 청크 크기 경고 제한을 늘림
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // 2. 대형 라이브러리를 별도 파일로 분리 (Vendor Splitting)
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // lodash, lucide-react, supabase 등 무거운 애들을 따로 뺍니다.
            return "vendor";
          }
        },
      },
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
