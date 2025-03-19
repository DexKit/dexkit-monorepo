import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "index.ts",
  },
  dts: true,
});
