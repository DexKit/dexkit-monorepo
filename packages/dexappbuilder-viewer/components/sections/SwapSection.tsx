import { ChainId } from "@dexkit/core/constants";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { SwapWidget } from "@dexkit/widgets/src/widgets/swap";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";

import { isAddressEqual, parseChainId } from "@dexkit/core/utils";
import { useActiveChainIds, useAppConfig, useCurrency } from "@dexkit/ui/hooks";
import { useSwapState } from "@dexkit/ui/modules/swap/hooks";
import { SwapPageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useMemo } from "react";

import { Token } from "@dexkit/core/types";
import { useSearchParams } from "next/navigation";

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

    let tokens = appTokens?.length ? appTokens[0].tokens || [] : [];

    let buyToken: Token | undefined;
    let sellToken: Token | undefined;

    if (chainId && buyTokenAddress) {
      buyToken = tokens.find(
        (t) =>
          isAddressEqual(t.address, buyTokenAddress ?? "") &&
          t.chainId === chainId
      );
    }

    if (chainId && sellTokenAddress) {
      sellToken = tokens.find(
        (t) =>
          isAddressEqual(t.address, sellTokenAddress ?? "") &&
          t.chainId === chainId
      );
    }

    if (chainId) {
      const config = {
        ...section.config,
        defaultChainId: chainId,
        configByChain: {
          ...section.config?.configByChain,
        },
      };

      config.configByChain[chainId] = {
        slippage: 0,
      };

      if (section.config?.configByChain?.[chainId]?.slippage) {
        config.configByChain[chainId].slippage =
          section.config?.configByChain?.[chainId].slippage;
      }

      if (buyToken) {
        config.configByChain[chainId].buyToken = buyToken;
      } else if (section.config?.configByChain?.[chainId]?.buyToken) {
        config.configByChain[chainId].buyToken =
          section.config?.configByChain?.[chainId].buyToken;
      }

      if (sellToken) {
        config.configByChain[chainId].sellToken = sellToken;
      } else if (section.config?.configByChain?.[chainId]?.sellToken) {
        config.configByChain[chainId].sellToken =
          section.config?.configByChain?.[chainId].sellToken;
      }

      return config;
    }
  }, [params, appTokens, section]);

  const enableUrlParams = Boolean(section.config?.enableUrlParams);
  let selectedChainId = enableUrlParams
    ? configParams?.defaultChainId
    : undefined;

  const isGlass = section.config?.variant === 'glass';
  const glassSettings = section.config?.glassSettings;

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
        <SwapWidget
          {...swapState}
          activeChainIds={activeChainIds}
          renderOptions={{
            ...swapState.renderOptions,
            useGasless: section.config?.useGasless,
            myTokensOnlyOnSearch: section.config?.myTokensOnlyOnSearch,
            configsByChain:
              enableUrlParams && configParams?.configByChain
                ? configParams.configByChain
                : section.config?.configByChain
                  ? section.config?.configByChain
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
              section.config?.defaultChainId ||
              ChainId.Ethereum,
            zeroExApiKey: process?.env.NEXT_PUBLIC_ZRX_API_KEY || "",
            transakApiKey: process?.env.NEXT_PUBLIC_TRANSAK_API_KEY || "",
          }}
        />
      </Container>
    </Box>
  );
}

export default SwapSection;
