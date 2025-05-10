import { currencyAtom } from '@/modules/common/atoms';
import AppDialogTitle from '@/modules/common/components/AppDialogTitle';
import { getNativeTokenSymbol } from '@/modules/common/utils';
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
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Quote, Token } from '../../types/swap';

interface Props {
  dialogProps: DialogProps;
  confirm: () => void;
  quote?: Quote;
  sellToken?: Token;
  buyToken?: Token;
  errorMessage?: string;
}

function ConfirmSwapDialog({
  dialogProps,
  quote,
  confirm,
  sellToken,
  buyToken,
  errorMessage,
}: Props) {
  // const nativeCurrencyPriceQuery = useNativeCoinPriceQuery();
  const currency = useAtomValue(currencyAtom);
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
            <Grid item xs={12}>
              <Alert severity="error">{String(errorMessage)}</Alert>
            </Grid>
          )}

          {quote && (
            <>
              <Grid item xs={12}>
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
                    {ethers.utils.formatUnits(
                      BigNumber.from(quote.sellAmount),
                      sellToken?.decimals || 18
                    )}{' '}
                    {sellToken?.symbol}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
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
                    {ethers.utils.formatUnits(
                      BigNumber.from(quote.buyAmount),
                      buyToken?.decimals || 18
                    )}{' '}
                    {buyToken?.symbol}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
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
                    {/* {nativeCurrencyPriceQuery.data && (
                      <Typography color="body2">
                        <FormattedNumber
                          value={
                            Number(
                              ethers.utils.formatEther(
                                BigNumber.from(quote.gas).mul(quote.gasPrice)
                              )
                            ) * nativeCurrencyPriceQuery.data
                          }
                          style="currency"
                          currency={currency}
                        />
                      </Typography>
                    )} */}

                    <Typography color="textSecondary">
                      (
                      {ethers.utils.formatEther(
                        BigNumber.from(quote.gas).mul(quote.gasPrice)
                      )}{' '}
                      {getNativeTokenSymbol(chainId)})
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              {/* {appConfig.swapFees?.amount_percentage !== undefined && (
                <Grid item xs={12}>
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
                      {ethers.utils.formatUnits(
                        BigNumber.from(quote.buyAmount)
                          .mul(appConfig.swapFees.amount_percentage * 100)
                          .div(10000),
                        buyToken?.decimals
                      )}{' '}
                      {buyToken?.symbol.toUpperCase()}
                    </Typography>
                  </Stack>
                </Grid>
              )} */}
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
        <Button onClick={handleClose} color="warning">
          <FormattedMessage id="cancel" defaultMessage="cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(ConfirmSwapDialog);
