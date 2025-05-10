import { Token } from '@dexkit/core/types';
import { getBlockExplorerUrl } from '@dexkit/core/utils';
import { formatUnits } from '@dexkit/core/utils/ethers/formatUnits';
import { AppDialogTitle } from '@dexkit/ui';
import { useCheckoutData } from '@dexkit/ui/hooks/payments';
import CheckCircle from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  Typography,
} from '@mui/material';
import { BigNumber } from 'ethers';
import { FormattedMessage } from 'react-intl';

export interface CheckoutConfirmDialogProps {
  token?: Token | null;
  txHash?: string;
  isLoading?: boolean;
  DialogProps: DialogProps;
  total?: BigNumber;
  id: string;
  onConfirm: () => void;
}

export default function CheckoutConfirmDialog({
  token,
  txHash,
  isLoading,
  total,
  DialogProps,
  onConfirm,
  id,
}: CheckoutConfirmDialogProps) {
  const checkoutQuery = useCheckoutData({ id });

  const renderContent = () => {
    if (checkoutQuery.data?.status === 'confirmed') {
      return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <CheckCircle color="success" fontSize="large" />

          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="transaction.confirmed"
                defaultMessage="Transaction confirmed"
              />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="your.payment.is.confirmed"
                defaultMessage="Your payment is confirmed"
              />
            </Typography>
          </Box>
        </Stack>
      );
    }

    if (checkoutQuery.data?.status === 'waiting_transaction') {
      return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <CircularProgress color="primary" size="2.5rem" />

          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="waiting.confirmation"
                defaultMessage="Waiting confirmation"
              />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="your.transaction.requires.10.confirmations.for.full.validation"
                defaultMessage="Your transaction requires 10 confirmations for full validation"
              />
            </Typography>
          </Box>
        </Stack>
      );
    }

    if (checkoutQuery.data?.status === 'pending') {
      return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="transfer.amount.symbol"
                defaultMessage="Transfer {amount} {symbol}"
                values={{
                  amount: total ? formatUnits(total, token?.decimals) : '0.0',
                  symbol: token?.symbol,
                }}
              />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="transfering.amount.to.pay"
                defaultMessage="Transfering amount to pay"
                values={{
                  amount: total ? formatUnits(total, token?.decimals) : '0.0',
                  symbol: token?.symbol,
                }}
              />
            </Typography>
          </Box>
        </Stack>
      );
    }
  };

  const renderTransaction = (hash: string) => {
    return (
      <Button
        href={`${getBlockExplorerUrl(token?.chainId)}/tx/${hash}`}
        target="_blank"
        variant="outlined"
      >
        <FormattedMessage
          id="view.transaction"
          defaultMessage="View transaction"
        />
      </Button>
    );
  };

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="confirm.transaction"
            defaultMessage="Confirm transaction"
          />
        }
        onClose={handleClose}
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          {renderContent()}
          {txHash && renderTransaction(txHash)}
        </Stack>
      </DialogContent>
      {checkoutQuery.data?.status === 'pending' && (
        <DialogActions>
          <Button
            startIcon={
              isLoading ? (
                <CircularProgress size="1rem" color="inherit" />
              ) : undefined
            }
            disabled={isLoading}
            onClick={onConfirm}
            variant="contained"
          >
            <FormattedMessage id="confirm" defaultMessage="Confirm" />
          </Button>
          <Button onClick={handleClose} disabled={isLoading}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
