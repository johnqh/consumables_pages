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
        // The host configures the design system's theme. A bundled copy is a
        // second module instance nobody configured, which answers with the
        // un-themed palette: that is how a blue button reached a red app.
        "@sudobility/design",
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
