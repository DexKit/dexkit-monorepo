import { useIsMobile } from "@dexkit/core";
import { ConnectWalletMessage } from "@dexkit/ui/components";
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
  customStyles?: any;
  fontFamily?: string;
}

const generateBalanceTextStyles = (customStyles: any, variant: 'balanceLabel' | 'balanceValue' = 'balanceLabel') => {
  if (!customStyles?.textColors) return {};

  let color;
  switch (variant) {
    case 'balanceLabel':
      color = customStyles.textColors.balanceLabel;
      break;
    case 'balanceValue':
      color = customStyles.textColors.balanceValue;
      break;
    default:
      color = undefined;
  }

  return color ? { color } : {};
};

export default function TokenDropSummary({
  contract,
  hideDecimals,
  hideTotalSupply,
  customStyles,
  fontFamily,
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
            sx={{
              ...generateBalanceTextStyles(customStyles, 'balanceLabel'),
              fontFamily: fontFamily || 'inherit',
            }}
          >
            <FormattedMessage id="total.supply" defaultMessage="Total supply" />
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            sx={{
              ...generateBalanceTextStyles(customStyles, 'balanceValue'),
              fontFamily: fontFamily || 'inherit',
              color: generateBalanceTextStyles(customStyles, 'balanceValue').color || 'text.primary',
            }}
          >
            {supplyQuery.isLoading ? (
              <Skeleton />
            ) : (
              `${supplyQuery.data?.displayValue} ${supplyQuery.data?.symbol || ''}`
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
          sx={{
            ...generateBalanceTextStyles(customStyles, 'balanceLabel'),
            fontFamily: fontFamily || 'inherit',
          }}
        >
          <FormattedMessage id="your.balance" defaultMessage="Your balance" />
        </Typography>
        <Typography
          variant={isMobile ? "body1" : "h5"}
          sx={{
            ...generateBalanceTextStyles(customStyles, 'balanceValue'),
            fontFamily: fontFamily || 'inherit',
            color: generateBalanceTextStyles(customStyles, 'balanceValue').color || 'text.primary',
          }}
        >
          {!account ? (
            <ConnectWalletMessage
              variant="inline"
              title={
                <FormattedMessage
                  id="connect.wallet.to.view.balance"
                  defaultMessage="Connect wallet to view balance"
                />
              }
              showButton={false}
            />
          ) : balanceQuery.isLoading ? (
            <Skeleton />
          ) : (
            `${balanceQuery.data?.displayValue} ${balanceQuery.data?.symbol || ''}`
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
            sx={{
              ...generateBalanceTextStyles(customStyles, 'balanceLabel'),
              fontFamily: fontFamily || 'inherit',
            }}
          >
            <FormattedMessage id="decimals" defaultMessage="Decimals" />
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h5"}
            sx={{
              ...generateBalanceTextStyles(customStyles, 'balanceValue'),
              fontFamily: fontFamily || 'inherit',
              color: generateBalanceTextStyles(customStyles, 'balanceValue').color || 'text.primary',
            }}
          >
            {!account ? (
              <ConnectWalletMessage
                variant="inline"
                title={
                  <FormattedMessage
                    id="connect.wallet.to.view.decimals"
                    defaultMessage="Connect wallet to view decimals"
                  />
                }
                showButton={false}
              />
            ) : balanceQuery.isLoading ? (
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
              <Grid size={12}>
                <Grid container spacing={2}>
                  <Grid>
                    <Button onClick={handleBurn} variant="contained">
                      <FormattedMessage id="burn" defaultMessage="Burn" />
                    </Button>
                  </Grid>
                  <Grid>
                    <Button onClick={handleShowTransfer} variant="contained">
                      <FormattedMessage
                        id="transfer"
                        defaultMessage="Transfer"
                      />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
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
              <Grid size={{ xs: 12, sm: 3 }}>
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
              <Grid size={{ xs: 12, sm: 3 }}>
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
