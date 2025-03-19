import { ZEROEX_NATIVE_TOKEN_ADDRESS } from "@dexkit/core/constants";
import TradeWidgetSimpleVariant from "@dexkit/exchange/components/TradeWidget/SimpleVariant";

import { isAddressEqual } from "@dexkit/core/utils";
import { OrderMarketType } from "@dexkit/exchange/constants";
import { ZEROEX_AFFILIATE_ADDRESS } from "@dexkit/exchange/constants/zrx";
import { useAppConfig, useTokenList } from "@dexkit/ui";
import { MarketTradePageSection } from "@dexkit/ui/modules/wizard/types/section";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Box, Container, Grid, Stack } from "@mui/material";
import { useMemo } from "react";

export interface MarketTradeSectionProps {
  section: MarketTradePageSection;
}

export default function MarketTradeSection({
  section,
}: MarketTradeSectionProps) {
  const { show, baseTokenConfig, slippage, useGasless } = section.config;
  const { account, provider } = useWeb3React();
  const appConfig = useAppConfig();

  const appChaind = useMemo(() => {
    return baseTokenConfig.chainId;
  }, [baseTokenConfig]);

  const tokens = useTokenList({ chainId: appChaind, includeNative: true });

  const baseToken = useMemo(() => {
    if (tokens && baseTokenConfig && tokens.length) {
      return tokens.find((tk) =>
        isAddressEqual(baseTokenConfig.address, tk.address),
      );
    }
  }, [tokens, baseTokenConfig]);

  const quoteToken = useMemo(() => {
    if (tokens) {
      if (baseTokenConfig?.address !== ZEROEX_NATIVE_TOKEN_ADDRESS) {
        return tokens.find((tk) =>
          isAddressEqual(ZEROEX_NATIVE_TOKEN_ADDRESS, tk.address),
        );
      } else {
        return tokens.find(
          (tk) => !isAddressEqual(ZEROEX_NATIVE_TOKEN_ADDRESS, tk.address),
        );
      }
    }
  }, [tokens, baseTokenConfig]);

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display={"flex"} justifyContent={"center"}>
              <Stack
                spacing={2}
                direction={{ xs: "column", sm: "row" }}
                maxWidth={"500px"}
              >
                <TradeWidgetSimpleVariant
                  isActive={true}
                  defaultSlippage={slippage}
                  feeRecipient={
                    appConfig.swapFees?.recipient || ZEROEX_AFFILIATE_ADDRESS
                  }
                  affiliateAddress={ZEROEX_AFFILIATE_ADDRESS}
                  buyTokenPercentageFee={
                    appConfig.swapFees?.amount_percentage
                      ? appConfig.swapFees?.amount_percentage / 100
                      : undefined
                  }
                  baseToken={baseToken}
                  quoteToken={quoteToken}
                  quoteTokens={tokens}
                  defaultOrderSide={
                    show === OrderMarketType.sell ? "sell" : "buy"
                  }
                  account={account}
                  provider={provider}
                  chainId={appChaind}
                  show={show}
                  useGasless={useGasless}
                />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
