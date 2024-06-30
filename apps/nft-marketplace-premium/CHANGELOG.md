# dexappbuilder

## 0.22.0

### Minor Changes

- 3d477c0: add swap layout variants and option to import tokens

### Patch Changes

- Updated dependencies [a73f89e]
- Updated dependencies [3d477c0]
  - @dexkit/widgets@0.10.0
  - @dexkit/ui@0.19.0
  - @dexkit/dexappbuilder-viewer@0.6.0

## 0.21.0

### Minor Changes

- e648d26: Add various types of aggregators and improve the display screen of the application's events.
- 46656c4: Improve wallet connection. Add support for injected wallets
- 0b2ac90: Add new website to dexappbuilder
- 4262e38: Add user activity tab on wallet page

### Patch Changes

- Updated dependencies [46656c4]
- Updated dependencies [3596cad]
  - @dexkit/wallet-connectors@0.4.0
  - @dexkit/ui@0.18.0

## 0.20.0

### Minor Changes

- 95faa89: Add Czech language and translations for other languages
- b909e38: Add border radius on image plugin on custom section, add option to add font size on text editor on custom section
- 75691c0: Add carousel section to pages
- 4446f4b: Add AI completation to markdown editor on page sections
- 165d0bd: Add Token Drop allowance
- 04db6a2: Upgrade app to use Next 14
- 75691c0: Add showcase gallery section
- a0a65d0: Internal: remove duplicated code to prepare for update next version
- 3deed54: Add site metadata to be displayed on templates page
- 09ffcbe: add bsc testnet
- ffb59ed: Add tables specific for each onchain user events
- 8d6efa9: Add support for dexkit publisher and added first iteration of DropAllowanceERC20 contract.
- 2d6a0ac: Add extend key functionality and countdown for Unlock with renew functionality
- cc656de: Add new sidebar menu variant

### Patch Changes

- Updated dependencies [95faa89]
- Updated dependencies [165d0bd]
- Updated dependencies [04db6a2]
- Updated dependencies [9cdde53]
- Updated dependencies [a0a65d0]
- Updated dependencies [3deed54]
- Updated dependencies [09ffcbe]
- Updated dependencies [ffb59ed]
- Updated dependencies [8d6efa9]
- Updated dependencies [2d6a0ac]
  - @dexkit/ui@0.17.0
  - @dexkit/wallet-connectors@0.3.0
  - @dexkit/dexappbuilder-viewer@0.5.0
  - eslint-config-custom@0.1.0
  - @dexkit/darkblock-evm-widget@0.2.0
  - @dexkit/widgets@0.9.0
  - @dexkit/unlock-widget@0.3.0
  - @dexkit/core@0.16.0
  - @dexkit/web3forms@0.12.0

## 0.19.0

### Minor Changes

- f15a3bd: Added languages FR, IT, German and Norwegian. Optimizing loading of languages. Adding scripts to handle all internalization automatically
- f174b6d: Add option to disable secondary sales showing on collection page
- e4bdcd8: Added token trade section, add easy access for token buy links, improve display of dexgenerator components on custom section
- 664c6ab: Improve translations scripts
- f242a33: Add Blast and Pulse networks
- ab238f4: Improve wallet handling and connection on mobile
- 1e637b4: Add countdowns and more detailed info when there is more than one phase on all drop types
- 388431f: Add AI features to create and edit images, create and improve text, add billing system to add credits

### Patch Changes

- Updated dependencies [664c6ab]
- Updated dependencies [f242a33]
- Updated dependencies [ab238f4]
- Updated dependencies [388431f]
  - @dexkit/widgets@0.8.0
  - @dexkit/unlock-widget@0.2.0
  - @dexkit/ui@0.16.0
  - @dexkit/web3forms@0.11.0
  - @dexkit/core@0.15.0
  - @dexkit/wallet-connectors@0.2.0

## 0.18.0

### Minor Changes

- 7ee615d: Add unlock widget
- 7ee615d: Add aidrop claimable erc20 feature. This allows users to reward communities without spending gas, and it was added as well option to add merkle tree.
- 7ee615d: Add transak widget in wallet and token market buy

### Patch Changes

- Updated dependencies [7ee615d]
- Updated dependencies [7ee615d]
- Updated dependencies [7ee615d]
  - @dexkit/unlock-widget@0.1.0
  - @dexkit/core@0.14.0
  - @dexkit/ui@0.15.0
  - @dexkit/web3forms@0.10.0

## 0.17.0

### Minor Changes

- 6f22c6a: Starting adding support for templates made by DexKit to be easily cloned
- 86181b2: Add option to add global search and easy way to check changelog for builders.

### Patch Changes

- Updated dependencies [86181b2]
  - @dexkit/ui@0.14.0

## 0.16.0

### Minor Changes

- b7d4d61: add revalidate time to all pages from whitelabel
- cd21537: Added improvements on fetching nfts
- d4113b2: Add dynamic sitemaps
- 8982d0a: add blast testnet
- 8ff3c78: Add Darkblock on collection page. Remove the requirement to have KIT and NFT to hide the footer, now just holding KIT is enough
- 637aecf: Add support for media dialog sorting images and add gif support
- 3734d95: Add new darblock integration and make adjustments to 0x integration
- 85d086c: Added missing darkblock dependency
- 6f2e89c: Allows builder to active or deactivate networks
- 18e39ed: Improve Darkblock integration and fix bugs
- c88850d: Add option to buy now from listings on collection pages
- 8a856e6: Improve token buy flow

### Patch Changes

- Updated dependencies [571516a]
- Updated dependencies [cd21537]
- Updated dependencies [8982d0a]
- Updated dependencies [85d086c]
- Updated dependencies [6f2e89c]
- Updated dependencies [18e39ed]
- Updated dependencies [c88850d]
- Updated dependencies [8a856e6]
  - @dexkit/darkblock-evm-widget@0.1.0
  - @dexkit/core@0.13.0
  - @dexkit/web3forms@0.9.0
  - @dexkit/widgets@0.7.0
  - @dexkit/ui@0.13.0

## 0.15.0

### Minor Changes

- 970d5c4: Add DexGenerator section
- fff22a8: Add versions to app admin
- dcec1a9: Add mint to functionality to Token page
- b0ad3ba: add page to enable iframes
- 98fe3bc: Added team management, and trigger when changes are not saved
- 0e10533: improve loading changing from server paths to static paths on custom pages, adding more custom options on gated content, now only can see apps the owner of the app.
- 3be52a5: Added user events container with support for referral field

### Patch Changes

- Updated dependencies [fff22a8]
- Updated dependencies [dcec1a9]
- Updated dependencies [98fe3bc]
- Updated dependencies [3be52a5]
  - @dexkit/web3forms@0.8.0
  - @dexkit/ui@0.12.0
  - @dexkit/core@0.12.0

## 0.14.0

### Minor Changes

- e0bf0fd: Added open in new page option on call to action and put subtitle not required
- 5adc45b: Added support for token and collection drops. Added support for staking on token, collection and edition. Added manage admin for token, edition, and collection and respective drops. Added admin for stake
- 5adc45b: Added airdrop contracts and respective admin and public pages. Improve wallet button popover
- 1b2fb6f: Add code section

### Patch Changes

- Updated dependencies [e0bf0fd]
- Updated dependencies [1d1863b]
- Updated dependencies [5adc45b]
- Updated dependencies [5adc45b]
  - @dexkit/ui@0.11.0
  - @dexkit/core@0.11.0
  - @dexkit/web3forms@0.7.0

## 0.13.0

### Minor Changes

- e793f4f: UX improvement on DexAppBuilder admin section
- 71f1e01: Added page reload when conditions are meet

### Patch Changes

- Updated dependencies [e793f4f]
  - @dexkit/wallet-connectors@0.1.0
  - @dexkit/widgets@0.6.0
  - @dexkit/core@0.10.0
  - @dexkit/ui@0.10.0

## 0.12.0

### Minor Changes

- 372b27b: Added support for token and collection drops. Added support for staking on token, collection and edition. Added manage admin for token, edition, and collection and respective drops. Added admin for stake
- 372b27b: Added airdrop contracts and respective admin and public pages. Improve wallet button popover

### Patch Changes

- Updated dependencies [372b27b]
- Updated dependencies [372b27b]
  - @dexkit/core@0.9.0
  - @dexkit/ui@0.9.0
  - @dexkit/web3forms@0.6.0

## 0.11.0

### Minor Changes

- 7044ea4: Improve contract list data grid
- 051a75e: Improving way to interact with contracts metadata. Add server file option to web3 forms

### Patch Changes

- Updated dependencies [051a75e]
  - @dexkit/web3forms@0.5.0

## 0.10.0

### Minor Changes

- 25e0bd1: Add feature to track user events done onchain
- 12eb3a8: Add email confirmation to site admin, added generic action mutation dialog
- def3b5d: refactor token interface, add slippage for market buy and sell, add in form, add notifications where needed

### Patch Changes

- Updated dependencies [25e0bd1]
- Updated dependencies [12eb3a8]
- Updated dependencies [def3b5d]
  - @dexkit/widgets@0.5.0
  - @dexkit/core@0.8.0
  - @dexkit/ui@0.8.0

## 0.9.0

### Minor Changes

- 9f8ac92: Update MUI dependency

### Patch Changes

- a762215: Add complete exchange feature
- Updated dependencies [9f8ac92]
- Updated dependencies [a762215]
  - @dexkit/core@0.7.0
  - @dexkit/ui@0.7.0
  - @dexkit/web3forms@0.4.0

## 0.8.0

### Minor Changes

- 2e9a359: Added edition drop feature to enable users to create drops and manage them, added image url from server to web3 forms, added pages for edition and collection drops. Added contract page for generic contracts

### Patch Changes

- Updated dependencies [2e9a359]
  - @dexkit/core@0.6.0
  - @dexkit/ui@0.6.0
  - @dexkit/web3forms@0.3.0

## 0.7.0

### Minor Changes

- 6373154: Remove wallet connect v1 and use v2. Fix on loading wallet dialog

### Patch Changes

- Updated dependencies [6373154]
  - @dexkit/core@0.5.0
  - @dexkit/ui@0.5.0

## 0.6.0

### Minor Changes

- b7c959a: Add quantity option to ERC1155
- cd0f21a: Fix slate giving error on react page editor

### Patch Changes

- Updated dependencies [f18d0a1]
  - @dexkit/widgets@0.4.0

## 0.5.0

### Minor Changes

- 7b52be8: Added Base Network
  Enable testnets on wizard collection
- d6fb0d6: Add warning for when swap interface not support network

### Patch Changes

- Updated dependencies [b93071c]
- Updated dependencies [7b52be8]
- Updated dependencies [d6fb0d6]
  - @dexkit/ui@0.4.1
  - @dexkit/widgets@0.3.0
  - @dexkit/core@0.4.0
  - @dexkit/web3forms@0.2.0

## 0.4.0

### Minor Changes

- 00933b3: Moving UI components from dexappbuilder for packages to be published on npm, fixed bugs related to vars, added dexappbuilder viewer package to render DexAppBuilder externally
- 89397d4: Add support to inline script in page editor
- cc8bdb6: Added gated conditions for pages, that allows users to define custom logic to lock or unlock certain pages
- cc8bdb6: Users will be able to create personalized forms for interacting with contracts. They can also create predefined templates to reuse the same parameters when creating new forms from them.
- 7a6cea2: Allow whitelabels of whitelabels by registering from which site the new app was created

### Patch Changes

- Updated dependencies [00933b3]
- Updated dependencies [cc8bdb6]
  - @dexkit/widgets@0.2.0
  - @dexkit/core@0.3.0
  - @dexkit/ui@0.3.0
  - @dexkit/web3forms@0.1.0

## 0.3.0

### Minor Changes

- f59e7d6: Added logo size option
- f59e7d6: Added more socials to footer menu, and also the option to add custom link icons
- f59e7d6: Added option to choose between dark and light mode. Added these additional configs to the builder

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
