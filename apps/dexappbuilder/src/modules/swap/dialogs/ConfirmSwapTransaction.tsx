import { getNativeCurrencySymbol } from '@dexkit/core/utils/blockchain';
import { formatEther } from '@dexkit/core/utils/ethers/formatEther';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { BigNumber } from 'ethers';
import { memo } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { useAppConfig } from '../../../hooks/app';
import { useCurrency, useNativeCoinPriceQuery } from '../../../hooks/currency';
import { Quote, Token } from '../../../types/blockchain';

interface Props {
  dialogProps: DialogProps;
  confirm: () => void;
  quote?: Quote;
  sellToken?: Token;
  buyToken?: Token;
  errorMessage?: string;
}

function ConfirmSwapTransaction({
  dialogProps,
  quote,
  confirm,
  sellToken,
  buyToken,
  errorMessage,
}: Props) {
  const appConfig = useAppConfig();
  const nativeCurrencyPriceQuery = useNativeCoinPriceQuery();
  const currency = useCurrency();
  const { onClose } = dialogProps;
  const { chainId } = useWeb3React();

  const handleClose = () => {
    onClose!({}, 'backdropClick');
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="confirm.swap"
            defaultMessage={'Confirm swap'}
            description={'Confirm swap'}
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Grid container spacing={2}>
          {errorMessage && (
            <Grid size={12}>
              <Alert severity="error">{String(errorMessage)}</Alert>
            </Grid>
          )}

          {quote && (
            <>
              <Grid size={12}>
                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    <FormattedMessage id="you.pay" defaultMessage="You pay" />
                  </Typography>
                  <Typography color="textSecondary">
                    {formatUnits(
                      BigNumber.from(quote.sellAmount),
                      sellToken?.decimals || 18,
                    )}{' '}
                    {sellToken?.symbol}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    <FormattedMessage
                      id="you.receive"
                      defaultMessage="You receive"
                    />
                  </Typography>
                  <Typography color="textSecondary">
                    {formatUnits(
                      BigNumber.from(quote.buyAmount),
                      buyToken?.decimals || 18,
                    )}{' '}
                    {buyToken?.symbol}
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Stack
                  direction="row"
                  alignItems="center"
                  alignContent="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{ fontWeight: 600 }}>
                    <FormattedMessage
                      id="transaction.cost"
                      defaultMessage="Transaction cost"
                    />
                  </Typography>
                  <Stack direction={'row'} spacing={2}>
                    {nativeCurrencyPriceQuery.data && (
                      <Typography color="body2">
                        {(() => {
                          const totalFeeWei = (quote as any).totalNetworkFee;

                          if (!totalFeeWei) {
                            return 'Fee not available';
                          }

                          const ethAmount = Number(formatEther(BigNumber.from(totalFeeWei)));
                          const usdAmount = ethAmount * nativeCurrencyPriceQuery.data;

                          return (
                            <FormattedNumber
                              value={usdAmount}
                              style="currency"
                              currency={currency}
                            />
                          );
                        })()}
                      </Typography>
                    )}

                    <Typography color="textSecondary">
                      (
                      {(() => {
                        const totalFeeWei = (quote as any).totalNetworkFee;

                        if (!totalFeeWei) {
                          return '0';
                        }

                        return formatEther(BigNumber.from(totalFeeWei));
                      })()}{' '}
                      {getNativeCurrencySymbol(chainId)})
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              {appConfig.swapFees?.amount_percentage !== undefined && (
                <Grid size={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    alignContent="center"
                    justifyContent="space-between"
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      <FormattedMessage
                        id="marketplace.fee"
                        defaultMessage="Marketplace fee"
                      />
                    </Typography>
                    <Typography color="textSecondary">
                      {formatUnits(
                        BigNumber.from(quote.buyAmount)
                          .mul(appConfig.swapFees.amount_percentage * 100)
                          .div(10000),
                        buyToken?.decimals,
                      )}{' '}
                      {buyToken?.symbol.toUpperCase()}
                    </Typography>
                  </Stack>
                </Grid>
              )}
            </>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => confirm()}
          disabled={errorMessage ? true : false}
          variant={'contained'}
          color={'primary'}
        >
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose} color={'warning'}>
          <FormattedMessage id="cancel" defaultMessage="cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(ConfirmSwapTransaction);
