import { Container } from "@mui/material";

import OrdersTable from "@dexkit/exchange/components/OrdersTable";
import { KIT_TOKEN, USDT_TOKEN } from "@dexkit/exchange/constants";
import { DexkitExchangeContext } from "@dexkit/exchange/contexts";
import { useWeb3React } from "@web3-react/core";

export default function OrdersTablePage() {
  const { chainId, account, provider } = useWeb3React();

  return (
    <Container>
      <DexkitExchangeContext.Provider
        value={{
          zrxApiKey: process.env.NEXT_PUBLIC_ZRX_API_KEY,
          baseToken: KIT_TOKEN,
          quoteToken: USDT_TOKEN,
          availNetworks: 
        }}
      >
        <OrdersTable chainId={chainId} account={account} provider={provider} />
      </DexkitExchangeContext.Provider>
    </Container>
  );
}
