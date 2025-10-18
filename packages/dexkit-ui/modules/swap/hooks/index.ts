import { ChainId } from "@dexkit/core/constants/enums";
import {
  NETWORK_FROM_SLUG,
  NETWORK_SLUG,
} from "@dexkit/core/constants/networks";
import { Token, TokenWhitelabelApp } from "@dexkit/core/types";
import { isAddressEqual } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  appMetadata,
  client,
  wallets,
} from "@dexkit/wallet-connectors/thirdweb/client";
import { DkApiPlatformCoin } from "@dexkit/widgets/src/types/api";
import {
  NotificationCallbackParams,
  RenderOptions,
} from "@dexkit/widgets/src/widgets/swap/types";
import { useTheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import { darkTheme, lightTheme, useConnectModal } from "thirdweb/react";
import { ThemeMode } from "../../../constants/enum";
import { useAppConfig, useDexKitContext, useThemeMode } from "../../../hooks";
import { useTokenList } from "../../../hooks/blockchain";
import { SUPPORTED_GASLESS_CHAIN } from "../constants";
import { getApiCoinPlatforms } from "../services";
import { isAutoSlippageAtom, maxSlippageAtom } from "../state";
import { isNativeInSell } from "../utils";

export function useSwapState() {
  const { chainId } = useWeb3React();
  const [isAutoSlippage, setIsAutoSlippage] = useAtom(isAutoSlippageAtom);
  const [maxSlippage, setMaxSlippage] = useAtom(maxSlippageAtom);

  const appConfig = useAppConfig();
  const { mode } = useThemeMode();
  const theme = useTheme();
  const onChangeSlippage = useCallback((value: number) => {
    setMaxSlippage(value);
  }, []);

  const onAutoSlippage = useCallback((value: boolean) => {
    setIsAutoSlippage((value) => !value);
  }, []);

  const featuredTokens = useMemo(() => {
    return appConfig.tokens
      ?.map((t) => t.tokens)
      .flat()
      .filter((t) => !t?.disableFeatured)
      .map((t) => {
        return {
          chainId: t.chainId as number,
          contractAddress: t.address,
          decimals: t.decimals,
          name: t.name,
          symbol: t.symbol,
          logoURI: t.logoURI,
        };
      });
  }, [appConfig]);

  const nonFeaturedTokens = useMemo(() => {
    return appConfig.tokens
      ?.map((t) => t.tokens)
      .flat()
      .filter((t) => t?.disableFeatured)
      .map((t) => {
        return {
          chainId: t.chainId as number,
          contractAddress: t.address,
          decimals: t.decimals,
          name: t.name,
          symbol: t.symbol,
          logoURI: t.logoURI,
        };
      });
  }, [appConfig]);

  const renderOptions = useMemo(() => {
    return {
      disableFooter: true,
      disableNotificationsButton: true,
      configsByChain: {},
      featuredTokens: featuredTokens as any,
      nonFeaturedTokens: nonFeaturedTokens as any,
      currency: "usd",
      defaultChainId: chainId || ChainId.Ethereum,
      zeroExApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY || "",
      transakApiKey: process.env.NEXT_PUBLIC_TRANSAK_API_KEY || "",
    } as RenderOptions;
  }, [featuredTokens, chainId]);

  const { createNotification } = useDexKitContext();

  const onNotification = useCallback(
    ({ title, hash, chainId, params }: NotificationCallbackParams) => {
      if (params.type === "swap") {
        createNotification({
          type: "transaction",
          subtype: "swap",
          icon: "swap_vert",
          values: {
            sellTokenSymbol: params.sellToken.symbol.toUpperCase(),
            sellAmount: formatUnits(
              params.sellAmount,
              params.sellToken.decimals
            ),
            buyTokenSymbol: params.buyToken.symbol.toUpperCase(),
            buyAmount: formatUnits(params.buyAmount, params.buyToken.decimals),
          },
          metadata: {
            hash,
            chainId,
          },
        });
      } else if (params.type === "approve") {
        createNotification({
          type: "transaction",
          subtype: "approve",
          icon: "check_circle",
          values: {
            symbol: params.token.symbol.toUpperCase(),
            name: params.token.name,
          },
          metadata: {
            hash,
            chainId,
          },
        });
      }
    },
    []
  );

  const colors = {
    modalBg: theme.palette.background.default,
    primaryButtonBg: theme.palette.action.active,
  };

  const { connect, isConnecting } = useConnectModal();

  async function handleConnect() {
    await connect({
      client,
      wallets,
      appMetadata,
      size: "compact",
      showThirdwebBranding: false,
      theme:
        mode === ThemeMode.light
          ? lightTheme({
            colors,
          })
          : darkTheme({ colors }),
    });
  }

  const onConnectWallet = useCallback(() => {
    handleConnect();
  }, []);

  const onShowTransactions = useCallback(() => {
    // do nothing
  }, []);

  return {
    renderOptions,
    maxSlippage,
    isAutoSlippage,
    onChangeSlippage,
    onAutoSlippage,
    onNotification,
    onConnectWallet,
    onShowTransactions,
    swapFees: appConfig.swapFees,
  };
}

export function useSearchSwapTokens({
  keyword,
  network,
  excludeNative,
  excludeTokenList,
  featuredTokens,
}: {
  keyword?: string;
  network?: string;
  excludeNative?: boolean;
  excludeTokenList?: boolean;
  featuredTokens?: TokenWhitelabelApp[];
}) {
  const tokensFromList = useTokenList({
    chainId: NETWORK_FROM_SLUG(network)?.chainId,
    includeNative: excludeNative ? false : true,
  });

  const nativeToken = useTokenList({
    chainId: NETWORK_FROM_SLUG(network)?.chainId,
    onlyNative: true,
  });

  const coinSearchQuery = usePlatformCoinSearch({ keyword, network });

  const tokens = useMemo(() => {
    if (coinSearchQuery.data) {
      let coins = coinSearchQuery.data
        .filter((c) => Boolean(NETWORK_SLUG(c.chainId)))
        .map((c: DkApiPlatformCoin) => {
          return {
            decimals: c.decimals,
            address: c.address,
            name: c.coin?.name,
            chainId: c.chainId,
            network: NETWORK_SLUG(c.chainId),
            coingeckoId: c.coin?.coingeckoId,
            symbol: c.coin?.symbol,
            logoURI: c.coin?.logoUrl,
          } as TokenWhitelabelApp;
        });

      if (network && !excludeTokenList && !featuredTokens) {
        coins = [...tokensFromList, ...coins];
      }
      if (featuredTokens) {
        coins = [...nativeToken, ...featuredTokens, ...coins];
      }

      if (keyword) {
        coins = coins.filter(
          (c) =>
            c.name.toLowerCase().search(keyword?.toLowerCase()) > -1 ||
            c.symbol.toLowerCase().search(keyword?.toLowerCase()) > -1
        );
      }

      return coins.reduce<TokenWhitelabelApp[]>((acc, current) => {
        const found =
          acc.find(
            (c) =>
              isAddressEqual(c.address, current.address) &&
              c.chainId === current.chainId
          ) !== undefined;

        if (!found) {
          acc.push(current);
        }

        return acc;
      }, []);
    } else {
      let tokens = tokensFromList;

      if (keyword) {
        tokens = tokens.filter(
          (c) =>
            c.name.toLowerCase().search(keyword?.toLowerCase()) > -1 ||
            c.symbol.toLowerCase().search(keyword?.toLowerCase()) > -1
        );
      }
      return tokens;
    }

    return [];
  }, [coinSearchQuery.data, network, keyword, tokensFromList]);

  return { tokens, isLoading: coinSearchQuery.isLoading };
}

export const COIN_PLATFORM_SEARCH_QUERY = "COIN_PLATFORM_SEARCH_QUERY";

export function usePlatformCoinSearch({
  keyword,
  network,
}: {
  keyword?: string;
  network?: string;
}) {
  return useQuery(
    [COIN_PLATFORM_SEARCH_QUERY, keyword, network],
    async ({ signal }) => {
      if (keyword) {
        const req = await getApiCoinPlatforms({ signal, keyword, network });

        return req.data;
      }

      return [];
    }
  );
}

export const useCanGasless = ({
  enabled,
  chainId,
  side,
  sellToken,
  buyToken,
}: {
  enabled: boolean;
  chainId: ChainId;
  side: "buy" | "sell";
  sellToken: Token;
  buyToken: Token;
}): boolean => {
  if (
    chainId &&
    enabled &&
    sellToken?.address &&
    buyToken?.address &&
    SUPPORTED_GASLESS_CHAIN.includes(chainId) &&
    !isNativeInSell({
      side,
      sellToken: {
        address: sellToken.address,
      },
      buyToken: {
        address: buyToken.address,
      },
    })
  ) {
    return true;
  }

  return false;
};
