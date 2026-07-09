---
"@dexkit/ui": minor
"@dexkit/core": minor
"@dexkit/exchange": minor
"dexappbuilder": patch
"coinleague": patch
"@dexkit/dexappbuilder-render": patch
---

Bump `@dexkit/evm-chains` to `1.16.0` and expand 0x swap/exchange chain support.

**Swap:** add Abstract (2741), Berachain (80094), HyperEVM (999), Ink (57073), Monad (143), Plasma (9745), Sonic (146), Tempo (4217), and World Chain (480). Unichain (130) was already supported.

**Exchange:** add the same mainnets to `ZEROX_SUPPORTED_NETWORKS`, except Linea (59144) which stays swap-only. Add matching `ChainId` enum values and GeckoTerminal slugs where applicable.
