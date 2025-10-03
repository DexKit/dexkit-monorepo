// @ts-nocheck
import { isAddressEqual } from "@dexkit/core/utils";
import { OrderMarketType } from "@dexkit/exchange/constants";

import { Container, Grid } from "@mui/material";
import { useMemo } from "react";

import { useTokenList } from "@dexkit/ui/hooks/blockchain";
import TokenInfo from "@dexkit/ui/modules/token/components/TokenInfo";
import { TokenTradePageSection } from "@dexkit/ui/modules/wizard/types/section";
import MarketTradeSection from "./MarketTradeSection";

export interface TokenTradeSectionProps {
  section?: TokenTradePageSection;
}

export default function TokenTradeSection({ section }: TokenTradeSectionProps) {
  const show = section?.config?.show;
  const baseTokenConfig = section?.config?.baseTokenConfig;
  const showTokenDetails = section?.config?.showTokenDetails;
  const slippage = section?.config?.slippage;
  const useGasless = section?.config?.useGasless;

  const appChaind = useMemo(() => {
    return baseTokenConfig?.chainId;
  }, [baseTokenConfig]);

  const tokens = useTokenList({ chainId: appChaind, includeNative: true });

  const baseToken = useMemo(() => {
    if (tokens && baseTokenConfig && tokens.length) {
      return tokens.find((tk: any) =>
        isAddressEqual(baseTokenConfig.address, tk.address)
      );
    }
  }, [tokens, baseTokenConfig]);

  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {showTokenDetails && (
              <TokenInfo
                address={baseToken?.address as string}
                chainId={appChaind as number}
              />
            )}
          </Grid>
          <Grid item xs={12}>
            <MarketTradeSection
              section={{
                type: "market-trade",
                config: {
                  show: show || OrderMarketType.buyAndSell,
                  useGasless: useGasless,
                  slippage: slippage,
                  baseTokenConfig: {
                    address: baseToken?.address as string,
                    chainId: appChaind as number,
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
