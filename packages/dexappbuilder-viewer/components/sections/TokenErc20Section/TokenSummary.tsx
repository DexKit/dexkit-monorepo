import { formatBigNumber } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import { Box, Grid, Typography } from "@mui/material";
import { useContract } from "@thirdweb-dev/react";
import { FormattedMessage } from "react-intl";

export interface TokenSummaryProps {
  address: string;
}

export default function TokenSummary({ address }: TokenSummaryProps) {
  const { data: contract } = useContract(address, "token");
  const { account } = useWeb3React();

  const [info, totalSupply, balance] = useAsyncMemo<any>(
    async () => {
      return [
        await contract?.get(),
        await contract?.totalSupply(),
        account ? await contract?.balanceOf(account) : undefined,
      ];
    },
    [],
    []
  );

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage id="your.balance" defaultMessage="Your balance" />
          </Typography>
          <Typography variant="h5">
            {formatBigNumber(balance?.value, balance?.decimals)}{" "}
            {balance?.symbol}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="caption" color="text.secondary">
            <FormattedMessage id="total.supply" defaultMessage="Total Supply" />
          </Typography>
          <Typography variant="h5">
            {formatBigNumber(totalSupply?.value, totalSupply?.decimals)}{" "}
            {totalSupply?.symbol}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
