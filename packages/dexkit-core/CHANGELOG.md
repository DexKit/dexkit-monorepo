# @dexkit/core

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
