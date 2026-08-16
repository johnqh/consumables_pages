import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "ConsumablesPages",
      // ES only, emitted as dist/index.js: that is what `main`, `types` and
      // the exports map already point at, and what entity_pages produces. A
      // UMD build has no consumer here and its globals map is dead weight.
      formats: ["es"],
      fileName: () => `index.js`,
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@sudobility/consumables_client",
        "@sudobility/types",
      ],
      output: {
        exports: "named",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
