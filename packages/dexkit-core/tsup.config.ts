import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "index.ts",
    types: "types/index.ts",
    utils: "utils/index.ts",
    hooks: "hooks/index.ts",
    services: "services/index.ts",
    constants: "constants/index.ts",
    connectors: "connectors.ts",
    "constants/network": "constants/networks.ts",
    "constants/enums": "constants/enums.ts",
    "constants/abis": "constants/abis/index.ts",
  },
  platform: "browser",
  dts: true,
});
