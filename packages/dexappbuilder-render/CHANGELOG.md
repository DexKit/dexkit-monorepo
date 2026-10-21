# @dexkit/dexappbuilder-render

## 2.0.1

### Patch Changes

- ee0884a: Bump `@dexkit/evm-chains` to `1.16.0` and expand 0x swap/exchange chain support.

  **Swap:** add Abstract (2741), Berachain (80094), HyperEVM (999), Ink (57073), Monad (143), Plasma (9745), Sonic (146), Tempo (4217), and World Chain (480). Unichain (130) was already supported.

  **Exchange:** add the same mainnets to `ZEROX_SUPPORTED_NETWORKS`, except Linea (59144) which stays swap-only. Add matching `ChainId` enum values and GeckoTerminal slugs where applicable.

- Updated dependencies [ee0884a]
- Updated dependencies [3324504]
- Updated dependencies [9549dfb]
- Updated dependencies [2fef362]
  - @dexkit/ui@2.1.0
  - @dexkit/dexappbuilder-viewer@2.1.0

## 2.0.0

### Major Changes

- b128486: Major version updates: Next 15.5.5, MUI v7 and several other packages

### Minor Changes

- b128486: fixed component theming for MUI v7 compatibility

### Patch Changes

- Updated dependencies [3b93251]
- Updated dependencies [b128486]
- Updated dependencies [b128486]
  - @dexkit/dexappbuilder-viewer@2.0.0
  - @dexkit/ui@2.0.0

## 1.0.0

### Major Changes

- c3f2753: Major version updates: Next 15.5.5, MUI v7 and several other packages

### Minor Changes

- 846b6b2: New layout variants for Navbar were added (glass, minimal, custom) for total customization.
- eefb4b8: Add footer visual variants (glassmorphic, minimal, invisible and custom) for increased customization.
- 1ced984: Add new MUI components to use on DexAppBuilder (card, cards list, accordion, tree view, stepper, image list)

### Patch Changes

- Updated dependencies [c877144]
- Updated dependencies [c3f2753]
- Updated dependencies [208288b]
- Updated dependencies [846b6b2]
- Updated dependencies [eefb4b8]
- Updated dependencies [ced668c]
- Updated dependencies [1ced984]
  - @dexkit/ui@1.0.0
  - @dexkit/dexappbuilder-viewer@1.0.0

## 0.1.0

### Minor Changes

- 716f7ca: added support for pulsechain on thirdweb smart contracts
- d5d944a: Added widgets. Now you can create and edit widgets and use them across all your apps. Additionally, you can easily embed widgets or iframes in external apps.

### Patch Changes

- Updated dependencies [a275b3f]
- Updated dependencies [d823504]
- Updated dependencies [52dbc2f]
- Updated dependencies [716f7ca]
- Updated dependencies [18c97ca]
- Updated dependencies [7af06ae]
- Updated dependencies [31f971c]
- Updated dependencies [d5d944a]
- Updated dependencies [53d4efb]
- Updated dependencies [ee44982]
  - @dexkit/dexappbuilder-viewer@0.10.0
  - @dexkit/ui@0.24.0
  - @dexkit/unlock-widget@0.5.0
