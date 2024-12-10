// vite.config.ts
import react from "file:///D:/Documenten/00-Fontys/Semester%203/Groepsproject/Front-end/Repo/front/node_modules/.pnpm/@vitejs+plugin-react@4.3.1_vite@5.4.4_@types+node@20.16.5_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///D:/Documenten/00-Fontys/Semester%203/Groepsproject/Front-end/Repo/front/node_modules/.pnpm/vite@5.4.4_@types+node@20.16.5/node_modules/vite/dist/node/index.js";
import viteTsconfigPaths from "file:///D:/Documenten/00-Fontys/Semester%203/Groepsproject/Front-end/Repo/front/node_modules/.pnpm/vite-tsconfig-paths@4.3.2_typescript@5.4.5_vite@5.4.4_@types+node@20.16.5_/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  base: "./",
  plugins: [react(), viteTsconfigPaths()],
  server: {
    port: 3e3
  },
  preview: {
    port: 3e3
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/testing/setup-tests.ts",
    exclude: ["**/node_modules/**", "**/e2e/**"],
    coverage: {
      include: ["src/**"]
    }
  },
  optimizeDeps: { exclude: ["fsevents"] },
  build: {
    rollupOptions: {
      external: ["fs/promises"],
      output: {
        experimentalMinChunkSize: 3500
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEb2N1bWVudGVuXFxcXDAwLUZvbnR5c1xcXFxTZW1lc3RlciAzXFxcXEdyb2Vwc3Byb2plY3RcXFxcRnJvbnQtZW5kXFxcXFJlcG9cXFxcZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERvY3VtZW50ZW5cXFxcMDAtRm9udHlzXFxcXFNlbWVzdGVyIDNcXFxcR3JvZXBzcHJvamVjdFxcXFxGcm9udC1lbmRcXFxcUmVwb1xcXFxmcm9udFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRG9jdW1lbnRlbi8wMC1Gb250eXMvU2VtZXN0ZXIlMjAzL0dyb2Vwc3Byb2plY3QvRnJvbnQtZW5kL1JlcG8vZnJvbnQvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGUvY2xpZW50XCIgLz5cblxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZpdGVUc2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnLi8nLFxuICBwbHVnaW5zOiBbcmVhY3QoKSwgdml0ZVRzY29uZmlnUGF0aHMoKV0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gIH0sXG4gIHByZXZpZXc6IHtcbiAgICBwb3J0OiAzMDAwLFxuICB9LFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBzZXR1cEZpbGVzOiAnLi9zcmMvdGVzdGluZy9zZXR1cC10ZXN0cy50cycsXG4gICAgZXhjbHVkZTogWycqKi9ub2RlX21vZHVsZXMvKionLCAnKiovZTJlLyoqJ10sXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIGluY2x1ZGU6IFsnc3JjLyoqJ10sXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7IGV4Y2x1ZGU6IFsnZnNldmVudHMnXSB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ2ZzL3Byb21pc2VzJ10sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgZXhwZXJpbWVudGFsTWluQ2h1bmtTaXplOiAzNTAwLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBR0EsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sdUJBQXVCO0FBRTlCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQSxFQUNOLFNBQVMsQ0FBQyxNQUFNLEdBQUcsa0JBQWtCLENBQUM7QUFBQSxFQUN0QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVk7QUFBQSxJQUNaLFNBQVMsQ0FBQyxzQkFBc0IsV0FBVztBQUFBLElBQzNDLFVBQVU7QUFBQSxNQUNSLFNBQVMsQ0FBQyxRQUFRO0FBQUEsSUFDcEI7QUFBQSxFQUNGO0FBQUEsRUFDQSxjQUFjLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRTtBQUFBLEVBQ3RDLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxhQUFhO0FBQUEsTUFDeEIsUUFBUTtBQUFBLFFBQ04sMEJBQTBCO0FBQUEsTUFDNUI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
