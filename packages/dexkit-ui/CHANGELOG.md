# @dexkit/ui

## 0.17.0

### Minor Changes

- 95faa89: Add Czech language and translations for other languages
- 165d0bd: Add Token Drop allowance
- 04db6a2: Upgrade app to use Next 14
- a0a65d0: Internal: remove duplicated code to prepare for update next version
- 09ffcbe: add bsc testnet
- ffb59ed: Add tables specific for each onchain user events
- 8d6efa9: Add support for dexkit publisher and added first iteration of DropAllowanceERC20 contract.
- 2d6a0ac: Add extend key functionality and countdown for Unlock with renew functionality

### Patch Changes

- Updated dependencies [04db6a2]
- Updated dependencies [a0a65d0]
- Updated dependencies [3deed54]
- Updated dependencies [09ffcbe]
- Updated dependencies [ffb59ed]
- Updated dependencies [2d6a0ac]
  - @dexkit/wallet-connectors@0.3.0
  - @dexkit/core@0.16.0

## 0.16.0

### Minor Changes

- 664c6ab: Improve translations scripts
- f242a33: Add Blast and Pulse networks
- ab238f4: Improve wallet handling and connection on mobile
- 388431f: Add AI features to create and edit images, create and improve text, add billing system to add credits

### Patch Changes

- Updated dependencies [f242a33]
- Updated dependencies [ab238f4]
- Updated dependencies [388431f]
  - @dexkit/core@0.15.0
  - @dexkit/wallet-connectors@0.2.0

## 0.15.0

### Minor Changes

- 7ee615d: Add unlock widget
- 7ee615d: Add aidrop claimable erc20 feature. This allows users to reward communities without spending gas, and it was added as well option to add merkle tree.
- 7ee615d: Add transak widget in wallet and token market buy

### Patch Changes

- Updated dependencies [7ee615d]
- Updated dependencies [7ee615d]
  - @dexkit/core@0.14.0

## 0.14.0

### Minor Changes

- 86181b2: Add option to add global search and easy way to check changelog for builders.

## 0.13.0

### Minor Changes

- 6f2e89c: Allows builder to active or deactivate networks
- 8a856e6: Improve token buy flow

### Patch Changes

- Updated dependencies [cd21537]
- Updated dependencies [8982d0a]
- Updated dependencies [6f2e89c]
- Updated dependencies [c88850d]
- Updated dependencies [8a856e6]
  - @dexkit/core@0.13.0

## 0.12.0

### Minor Changes

- dcec1a9: Add mint to functionality to Token page
- 98fe3bc: Added team management, and trigger when changes are not saved
- 3be52a5: Added user events container with support for referral field

### Patch Changes

- Updated dependencies [3be52a5]
  - @dexkit/core@0.12.0

## 0.11.0

### Minor Changes

- e0bf0fd: Added open in new page option on call to action and put subtitle not required
- 1d1863b: Improve API handling
- 5adc45b: Added support for token and collection drops. Added support for staking on token, collection and edition. Added manage admin for token, edition, and collection and respective drops. Added admin for stake
- 5adc45b: Added airdrop contracts and respective admin and public pages. Improve wallet button popover

### Patch Changes

- Updated dependencies [5adc45b]
- Updated dependencies [5adc45b]
  - @dexkit/core@0.11.0

## 0.10.0

### Minor Changes

- e793f4f: UX improvement on DexAppBuilder admin section

### Patch Changes

- Updated dependencies [e793f4f]
  - @dexkit/wallet-connectors@0.1.0
  - @dexkit/core@0.10.0

## 0.9.0

### Minor Changes

- 372b27b: Added support for token and collection drops. Added support for staking on token, collection and edition. Added manage admin for token, edition, and collection and respective drops. Added admin for stake
- 372b27b: Added airdrop contracts and respective admin and public pages. Improve wallet button popover

### Patch Changes

- Updated dependencies [372b27b]
- Updated dependencies [372b27b]
  - @dexkit/core@0.9.0

## 0.8.0

### Minor Changes

- 25e0bd1: Add feature to track user events done onchain
- 12eb3a8: Add email confirmation to site admin, added generic action mutation dialog
- def3b5d: refactor token interface, add slippage for market buy and sell, add in form, add notifications where needed

### Patch Changes

- Updated dependencies [25e0bd1]
- Updated dependencies [def3b5d]
  - @dexkit/core@0.8.0

## 0.7.0

### Minor Changes

- 9f8ac92: Update MUI dependency

### Patch Changes

- a762215: Add transaction watcher dialog
- Updated dependencies [9f8ac92]
  - @dexkit/core@0.7.0

## 0.6.0

### Minor Changes

- 2e9a359: Added edition drop feature to enable users to create drops and manage them, added image url from server to web3 forms, added pages for edition and collection drops. Added contract page for generic contracts

### Patch Changes

- Updated dependencies [2e9a359]
  - @dexkit/core@0.6.0

## 0.5.0

### Minor Changes

- 6373154: Remove wallet connect v1 and use v2. Fix on loading wallet dialog

### Patch Changes

- Updated dependencies [6373154]
  - @dexkit/core@0.5.0

## 0.4.1

### Patch Changes

- b93071c: Add transaction watcher dialog
- Updated dependencies [7b52be8]
  - @dexkit/core@0.4.0

## 0.4.0

### Minor Changes

- 4d173f0: Fix image fill error

## 0.3.0

### Minor Changes

- 00933b3: Moving UI components from dexappbuilder for packages to be published on npm, fixed bugs related to vars, added dexappbuilder viewer package to render DexAppBuilder externally

### Patch Changes

- Updated dependencies [00933b3]
  - @dexkit/core@0.3.0

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
