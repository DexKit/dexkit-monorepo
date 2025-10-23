# @dexkit/core

## 2.0.0

### Major Changes

- b128486: Major version updates: Next 15.5.5, MUI v7 and several other packages

### Minor Changes

- b128486: fixed component theming for MUI v7 compatibility

## 1.0.0

### Major Changes

- c3f2753: Major version updates: Next 15.5.5, MUI v7 and several other packages

### Minor Changes

- 208288b: Add support for Cronos on swap interface using DexKit router
- 846b6b2: New layout variants for Navbar were added (glass, minimal, custom) for total customization.
- 1de7f58: Fix all errors related to Coinleague
- eefb4b8: Add footer visual variants (glassmorphic, minimal, invisible and custom) for increased customization.
- 1ced984: Add new MUI components to use on DexAppBuilder (card, cards list, accordion, tree view, stepper, image list)

## 0.19.0

### Minor Changes

- 716f7ca: added support for pulsechain on thirdweb smart contracts
- 3e9d1ff: fix ens not resolving name on transfer
- 7af06ae: new swap variants, optimized both for desktop and mobile
- d5d944a: Added widgets. Now you can create and edit widgets and use them across all your apps. Additionally, you can easily embed widgets or iframes in external apps.

## 0.18.0

### Minor Changes

- 54b163d: Added monetization for custom domains and powered by dexkit. Added AI capabilities to coder

## 0.17.0

### Minor Changes

- e9afb9c: Improved wallet connection
- e9afb9c: Implementation of thirdweb and 0x Swap API v2

### Patch Changes

- e9afb9c: 0x Migration to V2

## 0.16.0

### Minor Changes

- 04db6a2: Upgrade app to use Next 14
- a0a65d0: Internal: remove duplicated code to prepare for update next version
- 09ffcbe: add bsc testnet
- ffb59ed: Add tables specific for each onchain user events
- 2d6a0ac: Add extend key functionality and countdown for Unlock with renew functionality

## 0.15.0

### Minor Changes

- f242a33: Add Blast and Pulse networks
- 388431f: Add AI features to create and edit images, create and improve text, add billing system to add credits

## 0.14.0

### Minor Changes

- 7ee615d: Add unlock widget
- 7ee615d: Add aidrop claimable erc20 feature. This allows users to reward communities without spending gas, and it was added as well option to add merkle tree.

## 0.13.0

### Minor Changes

- cd21537: Added improvements on fetching nfts
- 8982d0a: add blast testnet
- 6f2e89c: Allows builder to active or deactivate networks
- c88850d: Add option to buy now from listings on collection pages
- 8a856e6: Improve token buy flow

## 0.12.0

### Minor Changes

- 3be52a5: Added user events container with support for referral field

## 0.11.0

### Minor Changes

- 5adc45b: Added support for token and collection drops. Added support for staking on token, collection and edition. Added manage admin for token, edition, and collection and respective drops. Added admin for stake
- 5adc45b: Added airdrop contracts and respective admin and public pages. Improve wallet button popover

## 0.10.0

### Minor Changes

- e793f4f: UX improvement on DexAppBuilder admin section

## 0.9.0

### Minor Changes

- 372b27b: Added support for token and collection drops. Added support for staking on token, collection and edition. Added manage admin for token, edition, and collection and respective drops. Added admin for stake
- 372b27b: Added airdrop contracts and respective admin and public pages. Improve wallet button popover

## 0.8.0

### Minor Changes

- 25e0bd1: Add feature to track user events done onchain
- def3b5d: refactor token interface, add slippage for market buy and sell, add in form, add notifications where needed

## 0.7.0

### Minor Changes

- 9f8ac92: Update MUI dependency

## 0.6.0

### Minor Changes

- 2e9a359: Added edition drop feature to enable users to create drops and manage them, added image url from server to web3 forms, added pages for edition and collection drops. Added contract page for generic contracts

## 0.5.0

### Minor Changes

- 6373154: Remove wallet connect v1 and use v2. Fix on loading wallet dialog

## 0.4.0

### Minor Changes

- 7b52be8: Added Base Network
  Enable testnets on wizard collection

## 0.3.0

### Minor Changes

- 00933b3: Moving UI components from dexappbuilder for packages to be published on npm, fixed bugs related to vars, added dexappbuilder viewer package to render DexAppBuilder externally

## 0.2.0

### Minor Changes

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

## 0.1.0

### Minor Changes

- e873b81: Moved connectors to core. Add additional logic to check if connectors are on mobile and display accordingly
