import { ChainId, useErc20BalanceQuery } from "@dexkit/core";
import ReviewOrderDialog from "@dexkit/exchange/components/TradeWidget/ReviewOrderDialog";
import { Container } from "@mui/material";

import { useWeb3React } from "@web3-react/core";

export default function ReviewOrderPage() {
  const { account, provider } = useWeb3React();

  const erc20Query = useErc20BalanceQuery({
    account,
    contractAddress: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
    provider,
  });

  return (
    <Container>
      <ReviewOrderDialog
        DialogProps={{ open: true, maxWidth: "sm", fullWidth: true }}
        amount={}
        makerToken={{
          chainId: ChainId.Mumbai,
          contractAddress: "0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa",
          decimals: 18,
          name: "WETH",
          symbol: "WETH",
        }}
      />
    </Container>
  );
}
