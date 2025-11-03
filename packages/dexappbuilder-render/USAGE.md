# How to use @dexkit/dexappbuilder-render

## What is this build for?

The `dexappbuilder-render` build generates a **complete and unified package** that includes all modules from the `@dexkit` packages in a single location. This enables:

1. **Single Bundle**: All `@dexkit` packages are compiled in one place (`dist/`)
2. **Tree-shaking**: You can import only what you need, reducing the final bundle size
3. **Modularity**: Each module is available as an independent export
4. **Consistency**: A single build ensures all packages are synchronized

## Build structure

```
dist/
├── index.js                    # Main entry point
├── widget.js                   # Widget entry point
├── chunk-*.js                  # Shared code chunks (432 files)
├── dexkit-core/
│   ├── index.js               # Core package main entry
│   ├── types.js
│   ├── utils.js
│   └── ...                     # Other core modules
├── dexkit-ui/
│   ├── index.js               # UI package main entry
│   ├── components.js
│   ├── hooks.js
│   └── ...                     # Other UI modules
├── dexkit-exchange/
│   ├── index.js               # Exchange package main entry
│   └── ...                     # Exchange modules
├── dexkit-wallet-connectors/
│   ├── index.js               # Wallet connectors main entry
│   └── ...                     # Connector modules
├── dexkit-widgets/
│   └── index.js               # Widgets main entry
├── dexkit-unlock-widget/
│   └── index.js               # Unlock widget main entry
├── dexkit-web3forms/
│   ├── index.js               # Web3forms main entry
│   └── ...                     # Web3forms modules
└── dexappbuilder-viewer/
    └── index.js               # Viewer main entry
```

## Usage examples

### 1. Basic usage - Import the main package

```typescript
import { RenderDexAppBuilderWidget } from '@dexkit/dexappbuilder-render';

// Use the widget
<RenderDexAppBuilderWidget 
  widgetId={123} 
  apiKey="your-api-key"
  onConnectWallet={() => {}}
/>
```

### 2. Import specific modules from dexkit-core

```typescript
// Import from main package entry (now in dexkit-core/index.js)
import { useAppToken, useNetworkProvider } from '@dexkit/dexappbuilder-render/dexkit-core';

// Import specific utilities
import { formatEther, parseUnits } from '@dexkit/dexappbuilder-render/dexkit-core/utils/ethers/formatEther';
import { isAddress } from '@dexkit/dexappbuilder-render/dexkit-core/utils/ethers/isAddress';

// Import hooks
import { useAppToken } from '@dexkit/dexappbuilder-render/dexkit-core/hooks/coin';
import { useNetworkProvider } from '@dexkit/dexappbuilder-render/dexkit-core/hooks/blockchain';

// Import constants
import { ChainId, TransactionStatus } from '@dexkit/dexappbuilder-render/dexkit-core/constants/enums';
import { NETWORKS } from '@dexkit/dexappbuilder-render/dexkit-core/constants/network';

// Import types
import type { Token } from '@dexkit/dexappbuilder-render/dexkit-core/types';
import type { TransactionMetadata } from '@dexkit/dexappbuilder-render/dexkit-core/types/blockchain';
```

### 3. Import modules from dexkit-ui

```typescript
// Import from main package entry (now in dexkit-ui/index.js)
import { DexkitProvider, useNft } from '@dexkit/dexappbuilder-render/dexkit-ui';

// Import dialog components
import { ChooseNetworkDialog } from '@dexkit/dexappbuilder-render/dexkit-ui/components/dialogs/ChooseNetworkDialog';
import { SignMessageDialog } from '@dexkit/dexappbuilder-render/dexkit-ui/components/dialogs/SignMessageDialog';

// Import specific modules
import { useNft } from '@dexkit/dexappbuilder-render/dexkit-ui/modules/nft/hooks';
import { useSwap } from '@dexkit/dexappbuilder-render/dexkit-ui/modules/swap/hooks';

// Import providers
import { DexkitProvider } from '@dexkit/dexappbuilder-render/dexkit-ui/providers/DexkitProvider';
import { AuthProvider } from '@dexkit/dexappbuilder-render/dexkit-ui/providers/authProvider';

// Import services
import { getUserEvents } from '@dexkit/dexappbuilder-render/dexkit-ui/services/userEvents';
import { getTokenInfo } from '@dexkit/dexappbuilder-render/dexkit-ui/services/token';

// Import utils
import { TOKEN_ICON_URL_V2 } from '@dexkit/dexappbuilder-render/dexkit-ui/utils/coin';
```

### 4. Import modules from dexkit-exchange

```typescript
// Import components
import { TradeWidget } from '@dexkit/dexappbuilder-render/dexkit-exchange/components/TradeWidget';
import { ExchangeSettingsForm } from '@dexkit/dexappbuilder-render/dexkit-exchange/components/ExchangeSettingsForm';

// Import hooks
import { useExchangeContextState } from '@dexkit/dexappbuilder-render/dexkit-exchange/hooks';
import { useMarketTradeGaslessExec } from '@dexkit/dexappbuilder-render/dexkit-exchange/hooks/zrx/useMarketTradeGaslessExec';

// Import constants
import { ZEROEX_AFFILIATE_ADDRESS } from '@dexkit/dexappbuilder-render/dexkit-exchange/constants/zrx';
```

### 5. Import modules from dexkit-wallet-connectors

```typescript
// Import hooks
import { useWeb3React } from '@dexkit/dexappbuilder-render/dexkit-wallet-connectors/hooks/useWeb3React';
import { useWallet } from '@dexkit/dexappbuilder-render/dexkit-wallet-connectors/hooks/wallet';

// Import connectors
import { getConnectors } from '@dexkit/dexappbuilder-render/dexkit-wallet-connectors/connectors';

// Import constants
import { WALLET_CONNECTORS } from '@dexkit/dexappbuilder-render/dexkit-wallet-connectors/constants/icons';
```

### 6. Import modules from dexkit-web3forms

```typescript
// Import components
import { ContractFormView } from '@dexkit/dexappbuilder-render/dexkit-web3forms/components/ContractFormView';

// Import hooks
import { useContractForm } from '@dexkit/dexappbuilder-render/dexkit-web3forms/hooks';
```

## Typical use cases

### Case 1: Complete Next.js application

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app';
import { DexAppBuilderProvider } from '@dexkit/dexappbuilder-render';
import { DexkitProvider } from '@dexkit/dexappbuilder-render/dexkit-ui/providers/DexkitProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DexkitProvider>
      <DexAppBuilderProvider>
        <Component {...pageProps} />
      </DexAppBuilderProvider>
    </DexkitProvider>
  );
}
```

### Case 2: Standalone widget

```typescript
// components/Widget.tsx
import { RenderDexAppBuilderWidget } from '@dexkit/dexappbuilder-render';

export function MyWidget() {
  return (
    <RenderDexAppBuilderWidget 
      widgetId={123}
      apiKey="your-api-key"
    />
  );
}
```

### Case 3: Use specific utilities

```typescript
// utils/ethers.ts
import { formatEther, parseEther, isAddress } from '@dexkit/dexappbuilder-render/dexkit-core/utils/ethers/formatEther';

export function formatTokenAmount(amount: string, decimals: number = 18) {
  if (!isAddress(amount)) {
    return formatEther(parseEther(amount));
  }
  return amount;
}
```

### Case 4: Custom hook using dexkit modules

```typescript
// hooks/useTokenBalance.ts
import { useAppToken } from '@dexkit/dexappbuilder-render/dexkit-core/hooks/coin';
import { useWeb3React } from '@dexkit/dexappbuilder-render/dexkit-wallet-connectors/hooks/useWeb3React';

export function useTokenBalance(tokenAddress: string) {
  const { account } = useWeb3React();
  const { data: token } = useAppToken({ address: tokenAddress });
  
  // Your logic here
  return { token, account };
}
```

## Advantages of this approach

1. **Single package**: You don't need to install multiple `@dexkit/*` packages separately
2. **Tree-shaking**: Only what you actually use is included in your bundle
3. **Guaranteed compatibility**: All packages are synchronized in a single build
4. **Modularity**: You can import only the specific modules you need
5. **Simplified development**: Change the source code and the build updates automatically

## Installation

If this package is published on npm:

```bash
npm install @dexkit/dexappbuilder-render
# or
yarn add @dexkit/dexappbuilder-render
```

If you're using it locally in the monorepo:

```json
{
  "dependencies": {
    "@dexkit/dexappbuilder-render": "*"
  }
}
```

## Why are there so many files in the dist root?

When you look at the `dist/` directory, you'll notice hundreds of JavaScript files (700+) in the root. This is normal and expected. Here's why:

### File Organization Structure

**Files in root (`dist/`):**
- **~432 chunks** (`chunk-*.js`) - Shared code chunks (MUST be in root for proper imports)
- **2 main files** (`index.js`, `widget.js`) - Package main entries
- **~295 individual components** - Components/utilities from third-party dependencies (auto-generated during code splitting)

**Files in subdirectories (`dist/dexkit-core/`, `dist/dexkit-ui/`, etc.):**
- **Main entry points** - Package main entries are now organized in subdirectories:
  - `dexkit-core/index.js` - Core package main entry
  - `dexkit-ui/index.js` - UI package main entry
  - `dexkit-exchange/index.js` - Exchange package main entry
  - `dexkit-wallet-connectors/index.js` - Wallet connectors main entry
  - And other package main entries...
- **Nested entry points** - Entry points with nested paths (e.g., `dexkit-core/types.js`, `dexkit-ui/components/dialogs/ChooseNetworkDialog.js`) are automatically organized in subdirectories by tsup based on the entry point name structure.

### 1. **Entry Point Files**
Each entry point defined in `tsup.config.ts` generates its own file:
- `index.js` - Main entry point (in root)
- `widget.js` - Widget entry point (in root)
- `dexkit-core/index.js` - Core package main entry (in `dexkit-core/` subdirectory)
- `dexkit-core/types.js` - Core types entry (in `dexkit-core/` subdirectory)
- `dexkit-ui/index.js` - UI package main entry (in `dexkit-ui/` subdirectory)
- `dexkit-ui/components/dialogs/ChooseNetworkDialog.js` - Nested component (in `dexkit-ui/components/dialogs/` subdirectory)
- And many more...

### 2. **Automatic Code Splitting (Chunks)**
`esbuild` (used by `tsup`) automatically performs **code splitting** to optimize bundle size. When multiple entry points share common dependencies, `esbuild` creates shared chunks:

- **`chunk-*.js` files**: These are shared code chunks that contain common dependencies used by multiple entry points. Examples:
  - `chunk-2BNY23MS.js` - Large shared dependency (e.g., MUI, React)
  - `chunk-SSDU5AW5.js` - Crypto utilities from `@noble/curves`
  - `chunk-EWZE5RCY.js` - Shared dexkit-core code
  
- **Benefits of code splitting**:
  - Avoids duplicating code across entry points
  - Reduces overall bundle size
  - Allows browsers to cache shared chunks separately
  - Better tree-shaking opportunities

### 3. **Third-party Dependencies**
Large third-party libraries are automatically split into separate chunks:
- React, MUI components
- ethers.js utilities
- thirdweb SDK modules
- Other npm packages

### 4. **Individual Component Exports**
Some components or modules exported individually also generate their own files:
- Component icons (e.g., `arrow-left-P55ZGIRU.js`)
- Individual utility modules
- Standalone widgets

### How It Works

When you import from an entry point, for example:

```typescript
// Import main package entry
import { useAppToken } from '@dexkit/dexappbuilder-render/dexkit-core';

// Or import specific nested module
import { formatEther } from '@dexkit/dexappbuilder-render/dexkit-core/utils/ethers/formatEther';
```

The entry point files import the necessary chunks:

```javascript
// dexkit-core/index.js
import { formatEther } from "../chunk-EWZE5RCY.js";
import "../chunk-HRRIDYNN.js"; // Shared dependencies

// dexkit-core/utils/ethers/formatEther.js
import { formatEther } from "../../chunk-EWZE5RCY.js";
import "../../chunk-HRRIDYNN.js"; // Shared dependencies
```

### File Count Breakdown

- **~300 files**: Entry points (one per module/component export, organized in subdirectories)
- **~432 files**: Automatic code splitting chunks (`chunk-*.js`, in root)
- **~295 files**: Individual components from third-party dependencies (auto-generated, in root)
- **Total**: ~727 JavaScript files in root + organized entry points in subdirectories

This is **expected behavior** and actually **optimizes** your application:
- Smaller individual file sizes
- Better browser caching
- Reduced duplication
- More efficient tree-shaking

### Why are chunks and some files in the root?

**Chunks (`chunk-*.js`) MUST be in the root** because:
- They are shared across multiple entry points
- Entry points import chunks using relative paths like `"../chunk-XXX.js"` or `"./chunk-XXX.js"`
- Moving them to subdirectories would break import paths
- All entry points need access to these shared chunks

**Main package files in root** (`index.js`, `widget.js`):
- These are the main package entry points
- They import from shared chunks using relative paths
- These are the primary exports that users import from

**Individual component files in root** (~295 files):
- These are auto-generated during code splitting from third-party dependencies
- Examples: MUI icons, thirdweb connectors, etc.
- These are automatically split into separate files by esbuild for optimization
- They must remain in root for proper module resolution by bundlers

**Main package entries are now organized in subdirectories:**
- `dexkit-core/index.js`, `dexkit-ui/index.js`, etc. are now in their respective subdirectories
- This provides better organization and makes it clear which files belong to which package
- All imports work correctly as `package.json` exports are configured to point to the correct paths

### Important Notes

1. **Main package entries ARE organized**: Package main entries (e.g., `dexkit-core/index.js`, `dexkit-ui/index.js`) are now organized in their respective subdirectories for better organization
2. **Nested entry points ARE organized**: Entry points with slashes in their names (e.g., `'dexkit-core/types'`) are automatically placed in subdirectories by tsup
3. **Chunks MUST stay in root**: Shared chunks (`chunk-*.js`) must remain in the root for proper module resolution - they are shared across all entry points
4. **Import paths work correctly**: All imports work correctly because `package.json` exports are configured to point to the correct file paths (e.g., `"./dexkit-core": "./dist/dexkit-core/index.js"`)
5. **Tree-shaking still works**: Bundlers (webpack, vite, etc.) will only include what you actually use
6. **Dynamic imports**: Some chunks are loaded on-demand when using dynamic imports
7. **Browser caching**: Separate chunks allow browsers to cache dependencies independently

## Important notes

1. **TypeScript**: The build does not include `.d.ts` files for now (`dts: false`), but types are available in the source packages
2. **Bundle size**: Although you can import specific modules, the complete bundle is large (~5MB+). Use tree-shaking
3. **Browser only**: This build is configured for `platform: 'browser'`, it does not work in Node.js
4. **External dependencies**: Some dependencies like `@base-org/account` are marked as external and must be available at runtime
