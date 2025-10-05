import { ChainId } from "@dexkit/core/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { WidgetContext } from "@dexkit/widgets/src/components/WidgetContext";
import { SwapWidget } from "@dexkit/widgets/src/widgets/swap";
import { Container, useTheme } from "@mui/material";
import Box from "@mui/material/Box";

import { isAddressEqual, parseChainId } from "@dexkit/core/utils";
import { useActiveChainIds, useAppConfig, useCurrency } from "@dexkit/ui/hooks";
import { useSwapState } from "@dexkit/ui/modules/swap/hooks";
import { SwapPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useAtomValue } from "jotai";
import { useMemo } from "react";

import { Token } from "@dexkit/core/types";
import { useSearchParams } from "next/navigation";
import { tokensAtom } from "../../state/atoms";

interface Props {
  section: SwapPageSection;
}

interface Props {
  section: SwapPageSection;
  selectedChainId?: ChainId;
}

export function SwapSection({ section }: Props) {
  const currency = useCurrency();
  const { chainId } = useWeb3React();
  const { activeChainIds } = useActiveChainIds();
  const swapState = useSwapState();
  const params = useSearchParams();
  const { tokens: appTokens } = useAppConfig();
  const userTokens = useAtomValue(tokensAtom) || [];
  const theme = useTheme();


  const allTokens = useMemo(() => {
    const appTokensList = appTokens?.length ? appTokens[0].tokens || [] : [];
    return [...appTokensList, ...userTokens];
  }, [appTokens, userTokens]);



  const getGlassBackgroundStyles = () => {
    if (section.config?.variant !== 'glass' || !section.config?.glassSettings) {
      return {};
    }

    const {
      backgroundType,
      backgroundColor,
      backgroundImage,
      backgroundSize,
      backgroundPosition,
      gradientStartColor,
      gradientEndColor,
      gradientDirection,
      glassOpacity = 0.10,
      disableBackground = false,
    } = section.config.glassSettings;

    if (disableBackground) return {};

    const baseBackground = `rgba(255, 255, 255, ${glassOpacity})`;

    switch (backgroundType) {
      case 'solid':
        return {
          background: backgroundColor || baseBackground,
        };
      case 'gradient':
        const startColor = gradientStartColor || '#ffffff';
        const endColor = gradientEndColor || '#f0f0f0';
        const direction = gradientDirection || 'to bottom';
        return {
          background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
        };
      case 'image':
        return {
          background: backgroundImage
            ? `url(${backgroundImage})`
            : baseBackground,
          backgroundSize: backgroundSize || 'cover',
          backgroundPosition: backgroundPosition || 'center',
          backgroundRepeat: 'no-repeat',
        };
      default:
        return {
          background: baseBackground,
        };
    }
  };

  const configParams = useMemo(() => {
    const chainId = parseChainId(params?.get("chainId") ?? "0");
    const buyTokenAddress = params?.get("buyToken");
    const sellTokenAddress = params?.get("sellToken");

    let tokens = allTokens;

    let buyToken: Token | undefined;
    let sellToken: Token | undefined;

    if (chainId && buyTokenAddress) {
      buyToken = tokens.find(
        (t: any) =>
          isAddressEqual(t.address, buyTokenAddress ?? "") &&
          t.chainId === chainId
      );
    }

    if (chainId && sellTokenAddress) {
      sellToken = tokens.find(
        (t: any) =>
          isAddressEqual(t.address, sellTokenAddress ?? "") &&
          t.chainId === chainId
      );
    }

    const targetChainId = chainId || section.config?.defaultChainId;

    if (targetChainId) {
      const config = {
        ...section.config,
        defaultChainId: targetChainId,
        configByChain: {
          ...section.config?.configByChain,
        },
      };

      config.configByChain[targetChainId] = {
        ...config.configByChain[targetChainId],
        slippage: section.config?.configByChain?.[targetChainId]?.slippage ?? 0,
      };

      if (buyToken) {
        config.configByChain[targetChainId].buyToken = buyToken;
      } else if (section.config?.configByChain?.[targetChainId]?.buyToken) {
        const configuredBuyToken = section.config?.configByChain?.[targetChainId].buyToken;

        if (configuredBuyToken && !configuredBuyToken.logoURI) {
          const tokenWithLogo = allTokens.find((t: any) =>
            isAddressEqual(t.address, configuredBuyToken.address) &&
            t.chainId === configuredBuyToken.chainId
          );
          if (tokenWithLogo?.logoURI) {
            config.configByChain[targetChainId].buyToken = {
              ...configuredBuyToken,
              logoURI: tokenWithLogo.logoURI
            };
          } else {
            config.configByChain[targetChainId].buyToken = configuredBuyToken;
          }
        } else if (configuredBuyToken) {
          config.configByChain[targetChainId].buyToken = configuredBuyToken;
        }
      }

      if (sellToken) {
        config.configByChain[targetChainId].sellToken = sellToken;
      } else if (section.config?.configByChain?.[targetChainId]?.sellToken) {
        const configuredSellToken = section.config?.configByChain?.[targetChainId].sellToken;

        if (configuredSellToken && !configuredSellToken.logoURI) {
          const tokenWithLogo = allTokens.find((t: any) =>
            isAddressEqual(t.address, configuredSellToken.address) &&
            t.chainId === configuredSellToken.chainId
          );
          if (tokenWithLogo?.logoURI) {
            config.configByChain[targetChainId].sellToken = {
              ...configuredSellToken,
              logoURI: tokenWithLogo.logoURI
            };
          } else {
            config.configByChain[targetChainId].sellToken = configuredSellToken;
          }
        } else if (configuredSellToken) {
          config.configByChain[targetChainId].sellToken = configuredSellToken;
        }
      }

      return config;
    }

    return undefined;
  }, [params, allTokens, section]);

  const processedConfig = configParams || section.config;

  const enableUrlParams = Boolean(section.config?.enableUrlParams);
  let selectedChainId = enableUrlParams
    ? processedConfig?.defaultChainId
    : undefined;

  const isGlass = section.config?.variant === 'glass';
  const glassSettings = section.config?.glassSettings;

  const featuredTokens = useMemo(() => {
    return allTokens
      .filter((t: any) => !t?.disableFeatured)
      .map((t: any) => ({
        chainId: t.chainId as number,
        address: t.address,
        decimals: t.decimals,
        name: t.name,
        symbol: t.symbol,
        logoURI: t.logoURI,
      }));
  }, [allTokens]);

  const nonFeaturedTokens = useMemo(() => {
    return allTokens
      .filter((t: any) => t?.disableFeatured)
      .map((t: any) => ({
        chainId: t.chainId as number,
        address: t.address,
        decimals: t.decimals,
        name: t.name,
        symbol: t.symbol,
        logoURI: t.logoURI,
      }));
  }, [allTokens]);

  return (
    <Box
      py={4}
      sx={{
        ...(isGlass && {
          ...getGlassBackgroundStyles(),
          ...(glassSettings && {
            backdropFilter: `blur(${glassSettings.blurIntensity || 30}px)`,
            WebkitBackdropFilter: `blur(${glassSettings.blurIntensity || 30}px)`,
          }),
        }),
      }}
    >
      <Container maxWidth={isGlass ? 'sm' : 'xs'} disableGutters>
        <WidgetContext theme={theme}>
          <SwapWidget
            {...swapState}
            activeChainIds={activeChainIds}
            renderOptions={{
              ...swapState.renderOptions,
              useGasless: section.config?.useGasless,
              myTokensOnlyOnSearch: section.config?.myTokensOnlyOnSearch,
              configsByChain:
                enableUrlParams && processedConfig?.configByChain
                  ? processedConfig.configByChain
                  : processedConfig?.configByChain
                    ? processedConfig.configByChain
                    : {},
              currency: currency.currency,
              variant: section.config?.variant,
              glassSettings: {
                ...section.config?.glassSettings,
                disableBackground: true,
              },
              enableUrlParams: enableUrlParams,
              enableImportExterTokens: section.config?.enableImportExternTokens,
              defaultChainId:
                selectedChainId ||
                chainId ||
                processedConfig?.defaultChainId ||
                ChainId.Ethereum,
              zeroExApiKey: process?.env.NEXT_PUBLIC_ZRX_API_KEY || "",
              transakApiKey: process?.env.NEXT_PUBLIC_TRANSAK_API_KEY || "",
              featuredTokens,
              nonFeaturedTokens,
            }}
            swapFees={swapState.swapFees}
          />
        </WidgetContext>
      </Container>
    </Box>
  );
}

export default SwapSection;