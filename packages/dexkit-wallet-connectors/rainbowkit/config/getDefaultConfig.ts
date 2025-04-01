import type { Chain, Transport } from "viem";
import { CreateConfigParameters, createConfig, http } from "wagmi";

import type { WalletList } from "../wallets/Wallet";
import { computeWalletConnectMetaData } from "../wallets/computeWalletConnectMetaData";
import { connectorsForWallets } from "../wallets/connectorsForWallets";
import {
  // coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "../wallets/walletConnectors";

import { dedicatedWalletConnector } from "../../connectors/magic-wagmi/dedicatedWalletConnector";

import { NETWORKS } from "@dexkit/core/constants/networks";
import { MagicApiKey } from "../../constants/magic";

import {
  getDeprecatedInjectionOnMobileBrowser,
  getHashInjectionOnMobileBrowser,
} from "../../utils/injected";

export type _chains = readonly [Chain, ...Chain[]];

// Define the '_transports' type as a Record
// It maps each 'Chain' id to a 'Transport'
export type _transports = Record<_chains[number]["id"], Transport>;

interface GetDefaultConfigParameters<
  chains extends _chains,
  transports extends _transports,
> extends Omit<
    CreateConfigParameters<chains, transports>,
    // If you use 'client' you can't use 'transports' (we force to use 'transports')
    // More info here https://wagmi.sh/core/api/createConfig#client
    // We will also use our own 'connectors' instead of letting user specifying it
    "client" | "connectors"
  > {
  appName: string;
  appDescription?: string;
  appUrl?: string;
  appIcon?: string;
  wallets?: WalletList;
  projectId: string;
}

const createDefaultTransports = <
  chains extends _chains,
  transports extends _transports,
>(
  chains: chains,
): transports => {
  const transportsObject = chains.reduce((acc: transports, chain) => {
    const providerRpcUrl = NETWORKS[chain.id]?.providerRpcUrl;

    const key = chain.id as keyof transports;
    if (providerRpcUrl) {
      acc[key] = http(providerRpcUrl) as transports[keyof transports]; // Type assertion here
    } else {
      acc[key] = http() as transports[keyof transports]; // Type assertion here
    }

    return acc;
  }, {} as transports);

  return transportsObject;
};

export const getDefaultConfig = <
  chains extends _chains,
  transports extends _transports,
>({
  appName,
  appDescription,
  appUrl,
  appIcon,
  wallets,
  projectId,
  ...wagmiParameters
}: GetDefaultConfigParameters<chains, transports>) => {
  const { transports, chains, ...restWagmiParameters } = wagmiParameters;

  const metadata = computeWalletConnectMetaData({
    appName,
    appDescription,
    appUrl,
    appIcon,
  });

  let walletConnectors = [
    metaMaskWallet,
    //  coinbaseWallet,
    walletConnectWallet,
  ];

  const hasInjectedOnMobileBrowser = getHashInjectionOnMobileBrowser();
  if (hasInjectedOnMobileBrowser) {
    const walletConnector = getDeprecatedInjectionOnMobileBrowser();
    walletConnectors = [];
    if (walletConnector) {
      //@ts-ignore
      walletConnectors = [walletConnector];
    }
  }

  const connectors = connectorsForWallets(
    wallets || [
      {
        groupName: "Popular",
        wallets: walletConnectors,
      },
    ],
    {
      projectId,
      appName,
      appDescription,
      appUrl,
      appIcon,
      walletConnectParameters: { metadata },
    },
  );

  const allConnectors = [
    ...connectors,
    dedicatedWalletConnector({ options: { apiKey: MagicApiKey } }),
  ];

  return createConfig({
    connectors: allConnectors,
    ssr: true,
    chains,
    transports:
      transports || createDefaultTransports<chains, transports>(chains),
    ...restWagmiParameters,
  });
};
