# @dexkit/widgets

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
