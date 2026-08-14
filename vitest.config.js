import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.spec.{js,jsx,ts,tsx}"],
    // Don't process CSS imports through PostCSS — Next.js's postcss config
    // isn't compatible with vitest's plugin loader. Components importing
    // CSS just get no-op imports; that's fine for behavior tests.
    css: false,
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
  // Override the auto-resolved Next.js postcss config with an empty inline
  // config so vitest's CSS module loader doesn't try (and fail) to load it.
  // Paired with `test.css: false` above.
  css: {
    postcss: { plugins: [] },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // JSX in specs — use React 17+ automatic runtime so we don't need to
  // `import React` at the top of every .spec.jsx file.
  esbuild: {
    jsx: "automatic",
  },
});
