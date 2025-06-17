import { createConfig, http } from 'wagmi'
import { arbitrum, avalanche, base, bsc, mainnet, optimism, polygon, polygonAmoy, sepolia } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, sepolia, polygon, polygonAmoy, bsc, avalanche, base, optimism, arbitrum],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID! }),
    metaMask(),
    safe(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
    [bsc.id]: http(),
    [avalanche.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
})


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