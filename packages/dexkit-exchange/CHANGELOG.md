# @dexkit/ui

## 0.15.0

### Minor Changes

- 716f7ca: added support for pulsechain on thirdweb smart contracts
- 18c97ca: add custom variants (custom and glass) for exchange section, improve pair selection & mobile UX for complete responsivity on small screens.

### Patch Changes

- Updated dependencies [a275b3f]
- Updated dependencies [d823504]
- Updated dependencies [52dbc2f]
- Updated dependencies [716f7ca]
- Updated dependencies [3e9d1ff]
- Updated dependencies [7af06ae]
- Updated dependencies [31f971c]
- Updated dependencies [d5d944a]
- Updated dependencies [53d4efb]
- Updated dependencies [ee44982]
  - @dexkit/ui@0.24.0
  - @dexkit/core@0.19.0

## 0.14.0

### Minor Changes

- 54b163d: Added monetization for custom domains and powered by dexkit. Added AI capabilities to coder

### Patch Changes

- Updated dependencies [c6eb0f1]
- Updated dependencies [653b345]
- Updated dependencies [77a00c8]
- Updated dependencies [fbe0eff]
- Updated dependencies [54b163d]
  - @dexkit/ui@0.23.0
  - @dexkit/core@0.18.0

## 0.13.0

### Minor Changes

- 8d99dd6: add user connect event
- 742d40d: Fixed provider
- 9e686ed: Remove limit orders from exchange component

### Patch Changes

- Updated dependencies [45d6bed]
- Updated dependencies [f738705]
- Updated dependencies [dd35937]
- Updated dependencies [8d99dd6]
- Updated dependencies [528512d]
- Updated dependencies [742d40d]
  - @dexkit/ui@0.22.0

## 0.12.0

### Minor Changes

- e9afb9c: Implementation of thirdweb and 0x Swap API v2

### Patch Changes

- e9afb9c: 0x Migration to V2
- Updated dependencies [e9afb9c]
- Updated dependencies [72ebec1]
- Updated dependencies [e9afb9c]
- Updated dependencies [bacf6ad]
- Updated dependencies [ecbf91f]
- Updated dependencies [e9afb9c]
- Updated dependencies [9139f66]
  - @dexkit/core@0.17.0
  - @dexkit/ui@0.21.0

## 0.11.1

### Patch Changes

- a73f89e: Several improvements on swap and token trade components. Add gasless setting on global dialog
- Updated dependencies [a73f89e]
- Updated dependencies [3d477c0]
  - @dexkit/ui@0.19.0

## 0.11.0

### Minor Changes

- 04db6a2: Upgrade app to use Next 14

### Patch Changes

- Updated dependencies [95faa89]
- Updated dependencies [165d0bd]
- Updated dependencies [04db6a2]
- Updated dependencies [a0a65d0]
- Updated dependencies [09ffcbe]
- Updated dependencies [ffb59ed]
- Updated dependencies [8d6efa9]
- Updated dependencies [2d6a0ac]
  - @dexkit/ui@0.17.0
  - @dexkit/core@0.16.0

## 0.10.0

### Minor Changes

- 664c6ab: Improve translations scripts

### Patch Changes

- Updated dependencies [664c6ab]
- Updated dependencies [f242a33]
- Updated dependencies [ab238f4]
- Updated dependencies [388431f]
  - @dexkit/ui@0.16.0
  - @dexkit/core@0.15.0

## 0.9.0

### Minor Changes

- 3a3e1e2: fix few parts on exchange
- 6f2e89c: Allows builder to active or deactivate networks
- 8a856e6: Improve token buy flow

### Patch Changes

- Updated dependencies [cd21537]
- Updated dependencies [8982d0a]
- Updated dependencies [6f2e89c]
- Updated dependencies [c88850d]
- Updated dependencies [8a856e6]
  - @dexkit/core@0.13.0
  - @dexkit/ui@0.13.0

## 0.8.0

### Minor Changes

- 042308c: fix gecko terminal networks

### Patch Changes

- Updated dependencies [dcec1a9]
- Updated dependencies [98fe3bc]
- Updated dependencies [3be52a5]
  - @dexkit/ui@0.12.0
  - @dexkit/core@0.12.0

## 0.7.0

### Minor Changes

- 5adc45b: Added support for token and collection drops. Added support for staking on token, collection and edition. Added manage admin for token, edition, and collection and respective drops. Added admin for stake
- 5adc45b: Added airdrop contracts and respective admin and public pages. Improve wallet button popover

### Patch Changes

- Updated dependencies [e0bf0fd]
- Updated dependencies [1d1863b]
- Updated dependencies [5adc45b]
- Updated dependencies [5adc45b]
  - @dexkit/ui@0.11.0
  - @dexkit/core@0.11.0

## 0.6.0

### Minor Changes

- e793f4f: UX improvement on DexAppBuilder admin section

### Patch Changes

- Updated dependencies [e793f4f]
  - @dexkit/core@0.10.0
  - @dexkit/ui@0.10.0

## 0.5.0

### Minor Changes

- 372b27b: Added support for token and collection drops. Added support for staking on token, collection and edition. Added manage admin for token, edition, and collection and respective drops. Added admin for stake
- 372b27b: Added airdrop contracts and respective admin and public pages. Improve wallet button popover

### Patch Changes

- Updated dependencies [372b27b]
- Updated dependencies [372b27b]
  - @dexkit/core@0.9.0
  - @dexkit/ui@0.9.0

## 0.4.0

### Minor Changes

- 25e0bd1: Add feature to track user events done onchain
- 12eb3a8: Add email confirmation to site admin, added generic action mutation dialog
- def3b5d: refactor token interface, add slippage for market buy and sell, add in form, add notifications where needed

### Patch Changes

- Updated dependencies [25e0bd1]
- Updated dependencies [12eb3a8]
- Updated dependencies [def3b5d]
  - @dexkit/core@0.8.0
  - @dexkit/ui@0.8.0

## 0.3.0

### Minor Changes

- 9f8ac92: Update MUI dependency

### Patch Changes

- Updated dependencies [9f8ac92]
- Updated dependencies [a762215]
  - @dexkit/core@0.7.0
  - @dexkit/ui@0.7.0

## 0.2.0

### Minor Changes

- 0453a0d: Added QrCode receiver to page editor.
- 0453a0d: Added nft, token and receive functionalities to wallet and where is needed to do a transfer.
  Added a send page where users can send directly from a link. Created widgets for these featues.
  Fix footer issue where the footer was misplaced.
  Fix asset image not well sizing when image is not otimized.
  Enabled back magic wallets.
  Refactor of transaction dialogs and move them to ui package.
  Fix connect wallet button icon not displaying properly.
  Wallet container no longer uses suspense, as it was causing errors breaking the whole page
  add copy to clipboard on wallet page.
  Now on wallet page if there is no wallet all buttons are disabled.
- 0453a0d: Added magic network select to UI

## 0.1.0

### Minor Changes

- e873b81: Moved connectors to core. Add additional logic to check if connectors are on mobile and display accordingly
- 76f5bc6: Allow locale to be from app config, if user has a locale already defined it uses it
