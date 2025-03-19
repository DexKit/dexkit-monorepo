import TradeWidget from "@dexkit/exchange/components/TradeWidget";
import { KIT_TOKEN, USDT_TOKEN } from "@dexkit/exchange/constants";
import { DexkitExchangeContext } from "@dexkit/exchange/contexts";
import { Container, Grid } from "@mui/material";

export default function ExchangeLimitOrderPage() {
  return (
    <Container>
      <Grid container spacing={12} justifyContent="center">
        <Grid item xs={12} sm={5}>
          <DexkitExchangeContext.Provider
            value={{
              zrxApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY,
              baseToken: KIT_TOKEN,
              quoteToken: USDT_TOKEN,
            }}
          >
            <TradeWidget />
          </DexkitExchangeContext.Provider>
        </Grid>
      </Grid>
    </Container>
  );
}
