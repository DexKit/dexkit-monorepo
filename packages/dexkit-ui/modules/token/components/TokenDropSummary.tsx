import { useIsMobile } from "@dexkit/core";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Skeleton, Stack, Typography } from "@mui/material";
import {
  TokenDrop,
  useTokenBalance,
  useTokenSupply,
} from "@thirdweb-dev/react";
import { FormattedMessage } from "react-intl";

export interface TokenDropSummaryProps {
  contract?: TokenDrop;
  hideTotalSupply?: boolean;
  hideDecimals?: boolean;
}

export default function TokenDropSummary({
  contract,
  hideDecimals,
  hideTotalSupply,
}: TokenDropSummaryProps) {
  const isMobile = useIsMobile();

  const { account } = useWeb3React();
  const supplyQuery = useTokenSupply(contract);
  const balanceQuery = useTokenBalance(contract, account || "");

  return (
    <Stack spacing={{ sm: 2, xs: 0 }} direction={{ sm: "row", xs: "column" }}>
      {!hideTotalSupply && (
        <Stack
          justifyContent="space-between"
          direction={{ xs: "row", sm: "column" }}
        >
          <Typography
            color="text.secondary"
            variant={isMobile ? "body1" : "caption"}
          >
            <FormattedMessage id="total.supply" defaultMessage="Total supply" />
          </Typography>
          <Typography variant={isMobile ? "body1" : "h5"}>
            {supplyQuery.isLoading ? (
              <Skeleton />
            ) : (
              supplyQuery.data?.displayValue
            )}
          </Typography>
        </Stack>
      )}
      <Stack
        justifyContent="space-between"
        direction={{ xs: "row", sm: "column" }}
      >
        <Typography
          color="text.secondary"
          variant={isMobile ? "body1" : "caption"}
        >
          <FormattedMessage id="your.balance" defaultMessage="Your balance" />
        </Typography>
        <Typography variant={isMobile ? "body1" : "h5"}>
          {balanceQuery.isLoading ? (
            <Skeleton />
          ) : (
            balanceQuery.data?.displayValue
          )}
        </Typography>
      </Stack>
      {!hideDecimals && (
        <Stack
          justifyContent="space-between"
          direction={{ xs: "row", sm: "column" }}
        >
          <Typography
            color="text.secondary"
            variant={isMobile ? "body1" : "caption"}
          >
            <FormattedMessage id="decimals" defaultMessage="Decimals" />
          </Typography>
          <Typography variant={isMobile ? "body1" : "h5"}>
            {balanceQuery.isLoading ? (
              <Skeleton />
            ) : (
              balanceQuery.data?.decimals
            )}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

{
  /* <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button onClick={handleBurn} variant="contained">
                      <FormattedMessage id="burn" defaultMessage="Burn" />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={handleShowTransfer} variant="contained">
                      <FormattedMessage
                        id="transfer"
                        defaultMessage="Transfer"
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage
                        id="total.supply"
                        defaultMessage="Total Supply"
                      />
                    </Typography>
                    <Typography variant="h5">
                      {contractData ? contractData?.displayValue : <Skeleton />}{' '}
                      {contractData?.symbol.toUpperCase()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage
                        id="your.balance"
                        defaultMessage="Your Balance"
                      />
                    </Typography>
                    <Typography variant="h5">
                      {contractData ? balance : <Skeleton />}{' '}
                      {contractData?.symbol.toUpperCase()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      <FormattedMessage
                        id="decimals"
                        defaultMessage="Decimals"
                      />
                    </Typography>
                    <Typography variant="h5">
                      {contractData?.decimals ? (
                        contractData?.decimals
                      ) : (
                        <Skeleton />
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid> */
}
