# nft-marketplace

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
