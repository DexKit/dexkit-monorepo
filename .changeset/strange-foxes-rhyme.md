---
"nft-marketplace": minor
"@dexkit/widgets": minor
"@dexkit/core": minor
"@dexkit/ui": minor
---

Added nft, token and receive functionalities to wallet and where is needed to do a transfer.
Added a send page where users can send directly from a link. Created widgets for these featues.
Fix footer issue where the footer was misplaced.
Fix asset image not well sizing when image is not otimized.
Enabled back magic wallets.
Refactor of transaction dialogs and move them to ui package.
Fix connect wallet button icon not displaying properly.
Wallet container no longer uses suspense, as it was causing errors breaking the whole page
add copy to clipboard on wallet page.
Now on wallet page if there is no wallet all buttons are disabled.
