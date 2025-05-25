import { ChainId, ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants";
import {
  NETWORKS,
  NETWORK_COIN_IMAGE,
  NETWORK_COIN_NAME,
  NETWORK_COIN_SYMBOL,
} from "@dexkit/core/constants/networks";
import { EvmCoin, TokenWhitelabelApp } from "@dexkit/core/types";

import { convertTokenToEvmCoin, ipfsUriToUrl } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  UseMutationOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import type { providers } from "ethers";
import { Contract } from "ethers";
import { useContext, useMemo } from "react";
import { useAppConfig, useAppWizardConfig, useDexKitContext } from ".";
import { AdminContext } from "../context/AdminContext";
import { DexKitContext } from "../context/DexKitContext";
import { getTokenData } from "../services/token";

import axios from "axios";

/**
 * If chainId is not passed it returns all tokens from all chains
 * @param param0
 * @returns
 */
export function useAllTokenList({
  chainId,
  includeNative = false,
  onlyTradable,
  hideTestnetTokens,
  onlyNative,
  isWizardConfig,
}: {
  chainId?: number;
  includeNative?: boolean;
  hideTestnetTokens?: boolean;
  onlyNative?: boolean;
  onlyTradable?: boolean;
  isWizardConfig?: boolean;
}) {
  const appConfig = useAppConfig();
  const { wizardConfig } = useAppWizardConfig();

  const tokenListJson = useMemo(() => {
    if (isWizardConfig && wizardConfig && wizardConfig.tokens?.length === 1) {
      return wizardConfig.tokens[0].tokens || [];
    }

    if (appConfig.tokens?.length === 1) {
      return appConfig.tokens[0].tokens || [];
    }

    return [];
  }, [appConfig, isWizardConfig, wizardConfig]);

  let tokens = tokenListJson;

  if (onlyTradable) {
    tokens = tokens.filter((t) => Boolean(t.tradable));
  }

  return useMemo(() => {
    if (onlyNative && chainId) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: NETWORK_COIN_IMAGE(chainId),
          name: NETWORK_COIN_NAME(chainId),
          symbol: NETWORK_COIN_SYMBOL(chainId),
        },
      ] as TokenWhitelabelApp[];
    }
    let tokenList: TokenWhitelabelApp[] = [...tokens];
    if (chainId) {
      tokenList = [
        ...tokens.filter(
          (token: TokenWhitelabelApp) => token.chainId === chainId
        ),
      ];
    }

    if (chainId) {
      const wrappedAddress = NETWORKS[chainId]?.wrappedAddress;
      const isNoWrappedTokenInList =
        tokenList &&
        tokenList.findIndex(
          (t) => t.address.toLowerCase() === wrappedAddress
        ) === -1;
      // Wrapped Token is not on the list, we will add it here
      if (wrappedAddress && isNoWrappedTokenInList) {
        tokenList = [
          {
            address: wrappedAddress,
            chainId,
            decimals: 18,
            logoURI: NETWORK_COIN_IMAGE(chainId),
            name: `Wrapped ${NETWORK_COIN_NAME(chainId)}`,
            symbol: `W${NETWORK_COIN_SYMBOL(chainId)}`,
          } as TokenWhitelabelApp,
          ...tokenList,
        ];
      }
    } else {
      // if no chainId, we just add all networks
      for (const ch of Object.keys(NETWORKS)) {
        const chain = Number(ch);
        const wrappedAddress = NETWORKS[chain]?.wrappedAddress;
        const isNoWrappedTokenInList =
          tokenList &&
          tokenList.findIndex(
            (t) =>
              t.address.toLowerCase() === wrappedAddress?.toLowerCase() &&
              t.chainId === chain
          ) === -1;
        // Wrapped Token is not on the list, we will add it here
        if (wrappedAddress && isNoWrappedTokenInList) {
          tokenList = [
            {
              address: wrappedAddress,
              chainId: chain,
              decimals: 18,
              logoURI: NETWORK_COIN_IMAGE(chain),
              name: `Wrapped ${NETWORK_COIN_NAME(chain)}`,
              symbol: `W${NETWORK_COIN_SYMBOL(chain)}`,
            } as TokenWhitelabelApp,
            ...tokenList,
          ];
        }
      }
    }
    if (includeNative && chainId) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: NETWORK_COIN_IMAGE(chainId),
          name: NETWORK_COIN_NAME(chainId),
          symbol: NETWORK_COIN_SYMBOL(chainId),
        },
        ...tokenList,
      ] as TokenWhitelabelApp[];
    } else {
      for (const ch of Object.keys(NETWORKS)) {
        const chain = Number(ch);
        tokenList = [
          {
            address: ZEROEX_NATIVE_TOKEN_ADDRESS,
            chainId: chain,
            decimals: 18,
            logoURI: NETWORK_COIN_IMAGE(chain),
            name: NETWORK_COIN_NAME(chain),
            symbol: NETWORK_COIN_SYMBOL(chain),
          },
          ...tokenList,
        ] as TokenWhitelabelApp[];
      }
    }
    if (hideTestnetTokens) {
      tokenList = tokenList.filter((tk) => !NETWORKS[tk.chainId]?.testnet);
    }

    return [...tokenList] as TokenWhitelabelApp[];
  }, [chainId, onlyNative, includeNative]);
}

export function useTokenList({
  chainId,
  includeNative = false,
  onlyTradable,
  onlyNative,
}: {
  chainId?: number;
  includeNative?: boolean;
  onlyNative?: boolean;
  onlyTradable?: boolean;
}) {
  const appConfig = useAppConfig();

  const tokensValues = useDexKitContext().tokens || [];

  const tokenListJson = useMemo(() => {
    if (appConfig.tokens?.length === 1) {
      return appConfig.tokens[0].tokens ? appConfig.tokens[0].tokens : [];
    }

    return [];
  }, [appConfig]);

  // TODO: do the right logic
  let tokens = [...tokensValues, ...tokenListJson];

  if (onlyTradable) {
    tokens = tokens.filter((t) => Boolean(t.tradable));
  }

  return useMemo(() => {
    if (chainId === undefined) {
      return [] as TokenWhitelabelApp[];
    }
    if (onlyNative) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: NETWORK_COIN_IMAGE(chainId),
          name: NETWORK_COIN_NAME(chainId),
          symbol: NETWORK_COIN_SYMBOL(chainId),
        },
      ] as TokenWhitelabelApp[];
    }

    let tokenList: TokenWhitelabelApp[] = [
      ...tokens.filter(
        (token: TokenWhitelabelApp) => token.chainId === chainId
      ),
    ];

    const wrappedAddress = NETWORKS[chainId]?.wrappedAddress;
    const isNoWrappedTokenInList =
      tokenList &&
      tokenList.findIndex(
        (t) => t.address.toLowerCase() === wrappedAddress?.toLowerCase()
      ) === -1;
    // Wrapped Token is not on the list, we will add it here
    if (wrappedAddress && isNoWrappedTokenInList) {
      tokenList = [
        {
          address: wrappedAddress,
          chainId,
          decimals: 18,
          logoURI: NETWORK_COIN_IMAGE(chainId),
          name: `Wrapped ${NETWORK_COIN_NAME(chainId)}`,
          symbol: `W${NETWORK_COIN_SYMBOL(chainId)}`,
        } as TokenWhitelabelApp,
        ...tokenList,
      ];
    }

    if (includeNative) {
      return [
        {
          address: ZEROEX_NATIVE_TOKEN_ADDRESS,
          chainId,
          decimals: 18,
          logoURI: NETWORK_COIN_IMAGE(chainId),
          name: NETWORK_COIN_NAME(chainId),
          symbol: NETWORK_COIN_SYMBOL(chainId),
        },
        ...tokenList,
      ] as TokenWhitelabelApp[];
    }

    return [...tokenList] as TokenWhitelabelApp[];
  }, [chainId, onlyNative, includeNative]);
}

export function useEvmCoins({
  defaultChainId,
}: {
  defaultChainId?: ChainId;
}): EvmCoin[] {
  const { chainId: walletChainId } = useWeb3React();
  const chainId = defaultChainId || walletChainId;
  const tokens = useTokenList({ chainId, includeNative: true });

  return useMemo(() => tokens.map(convertTokenToEvmCoin), [tokens]);
}

export function useActiveChainIds() {
  // If this editAppConfig exists, it means we are inside Edit Wizard, we on this case use the chainIds that the user had activated
  const { editAppConfig } = useContext(AdminContext);
  if (editAppConfig && editAppConfig.activeChainIds) {
    return { activeChainIds: editAppConfig.activeChainIds };
  }

  const activeChainIds = useContext(DexKitContext).activeChainIds;
  return { activeChainIds };
}

export const CONTRACT_METADATA = "CONTRACT_METADATA";

export type ContractMetadata = {
  name: string;
  description: string;
  image: string;
  external_link: string;
  collaborators: string[];
};

export default function useContractMetadata(params?: {
  chainId?: number;
  contractAddress?: string;
  provider?: providers.Provider;
}) {
  return useQuery<ContractMetadata | null>(
    [CONTRACT_METADATA, params?.contractAddress, params?.chainId],
    async () => {
      if (!params?.contractAddress || !params?.chainId || !params?.provider) {
        return null;
      }

      const abi = [
        "function contractURI() public view returns (string memory)",
      ];
      const contract = new Contract(
        params.contractAddress,
        abi,
        params.provider
      );

      const result: string = await contract.contractURI();
      if (result) {
        const url = ipfsUriToUrl(result);

        return (await axios.get<ContractMetadata>(url)).data;
      }

      return null;
    }
  );
}

export function useTokenData(options?: Omit<UseMutationOptions, any>) {
  return useMutation(
    async ({ chainId, address }: { chainId: number; address: string }) => {
      return await getTokenData(chainId, address);
    },
    options
  );
}

export const TOKEN_DATA_QUERY = "TOKEN_DATA_QUERY";

export function useTokenDataQuery({
  chainId,
  address,
}: {
  chainId: number;
  address: string;
}) {
  return useQuery(
    [TOKEN_DATA_QUERY, chainId, address],
    async () => {
      return await getTokenData(chainId, address);
    },
    { refetchOnMount: true, refetchOnWindowFocus: true }
  );
}
