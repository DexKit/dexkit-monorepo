# nft-marketplace

## 0.2.0

### Minor Changes

- 0453a0d: Added QrCode receiver to page editor.
- 0453a0d: Added wallet section and wallet quick builder to create wallet apps fast
- 4ff5f54: Fix create order show when no account on store. Now when no wallet and user click buy it shows connect wallet dialog. Fix hydrate query error when param maker is null
- 0453a0d: Now users can create a profile page with bio, short bio, background and profile image. They can also associate their Discord and Twitter profiles to make their profile verified. Additionally was added a claim page where users can claim an airdrop of KIT when they have their profile complete.
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
- 2f5cf42: Added option to choose between dark and light mode. Added these additional configs to the builder
- 0453a0d: Remove required store account on asset store container
- 0453a0d: Added markdown editor to pre made sections
- 0453a0d: Added magic network select to UI

### Patch Changes

- Updated dependencies [0453a0d]
- Updated dependencies [0453a0d]
- Updated dependencies [0453a0d]
  - @dexkit/ui@0.2.0
  - @dexkit/widgets@0.1.0
  - @dexkit/core@0.2.0

## 0.1.0

### Minor Changes

- fe4bb58: 404 now shows the whitelabel theme config
- 6c0309f: Added filters on edit builder app page to users be able to filter tools related to swap and nfts
- 6d44455: Otimize pages loading adding a filter per page. Now in each page we just fetch the config related to that page
- 6a9ac9f: Added tour to onboard users on the app builder edit page
- 02e9618: Fix error on fetching nfts on collection page. Now it is catched all errors
- 76f5bc6: Allow locale to be from app config, if user has a locale already defined it uses it
- e0e6ac1: Added option to hide powered by DexKit signature.

  Apps with associated NFTs are not clonable now.

  Rebranded product to DexAppBuilder.

### Patch Changes

- Updated dependencies [e873b81]
- Updated dependencies [76f5bc6]
  - @dexkit/core@0.1.0
  - @dexkit/ui@0.1.0
