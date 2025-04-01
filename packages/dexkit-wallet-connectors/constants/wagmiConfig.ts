import { chainsViem } from "@dexkit/core/constants/chainsViem";
import { getDefaultConfig } from "../rainbowkit/config/getDefaultConfig";

export const wagmiConfig = getDefaultConfig({
  chains: chainsViem,
  appName: "Dapp",
  projectId: "bcd1271357ab9202f271bc908324aff6",
});

/*createConfig({
  chains: [mainnet, sepolia, polygon, polygonAmoy, bsc, fantom, avalanche, base, optimism, arbitrum],
  connectors: [coinbaseWallet(), walletConnect({  })/* metaMask({ dappMetadata: { name: 'Wallet' } })
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [fantom.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [polygonAmoy.id]: http()
  },
})*/
