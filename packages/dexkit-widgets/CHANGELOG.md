# @dexkit/widgets

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
- eefb4b8: Add footer visual variants (glassmorphic, minimal, invisible and custom) for increased customization.
- 1ced984: Add new MUI components to use on DexAppBuilder (card, cards list, accordion, tree view, stepper, image list)

## 0.14.0

### Minor Changes

- 716f7ca: added support for pulsechain on thirdweb smart contracts
- 3e9d1ff: fix ens not resolving name on transfer
- 7af06ae: new swap variants, optimized both for desktop and mobile
- d5d944a: Added widgets. Now you can create and edit widgets and use them across all your apps. Additionally, you can easily embed widgets or iframes in external apps.
- e35e0e7: fix swap prices not being displayed in matcha and uniswap variant

## 0.13.0

### Minor Changes

- 54b163d: Added monetization for custom domains and powered by dexkit. Added AI capabilities to coder

## 0.12.0

### Minor Changes

- 528512d: Hide transak button
- 742d40d: Fixed provider

## 0.11.0

### Minor Changes

- e9afb9c: Improved wallet connection
- 72ebec1: Fixed swap interface when there is insufficient balance
- e9afb9c: Implementation of thirdweb and 0x Swap API v2
- 465fbcd: Fixed search token
- 9139f66: Fixed sign messages with user wallet
- 1775883: Updated Swap widget

### Patch Changes

- e9afb9c: 0x Migration to V2

## 0.10.0

### Minor Changes

- 3d477c0: add swap layout variants and option to import tokens

### Patch Changes

- a73f89e: Several improvements on swap and token trade components. Add gasless setting on global dialog

## 0.9.0

### Minor Changes

- 04db6a2: Upgrade app to use Next 14

## 0.8.0

### Minor Changes

- 664c6ab: Improve translations scripts

## 0.7.0

### Minor Changes

- 6f2e89c: Allows builder to active or deactivate networks

## 0.6.0

### Minor Changes

- e793f4f: UX improvement on DexAppBuilder admin section

## 0.5.0

### Minor Changes

- 25e0bd1: Add feature to track user events done onchain
- def3b5d: refactor token interface, add slippage for market buy and sell, add in form, add notifications where needed

## 0.4.0

### Minor Changes

- f18d0a1: Fix click on max button not resolve to input value

## 0.3.0

### Minor Changes

- 7b52be8: Added Base Network
  Enable testnets on wizard collection
- d6fb0d6: Add warning for when swap interface not support network

## 0.2.0

### Minor Changes

- 00933b3: Moving UI components from dexappbuilder for packages to be published on npm, fixed bugs related to vars, added dexappbuilder viewer package to render DexAppBuilder externally

## 0.1.0

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
