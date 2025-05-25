import { Token } from "@dexkit/core/types";
import { getBlockExplorerUrl } from "@dexkit/core/utils";
import { AppDialogTitle } from "@dexkit/ui";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import CheckCircle from "@mui/icons-material/CheckCircle";
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
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import { FormattedMessage } from "react-intl";

export interface ConfirmPaymentDialogProps {
  token?: Token | null;
  txHash?: string;
  isLoading?: boolean;
  DialogProps: DialogProps;
  total?: Decimal;
  onConfirm: () => void;
}

export default function ConfirmPaymentDialog({
  token,
  txHash,
  isLoading,
  total,
  DialogProps,
  onConfirm,
}: ConfirmPaymentDialogProps) {
  const GET_TX_STATUS_QUERY = "GET_TX_STATUS_QUERY";

  const { provider } = useWeb3React();

  const txQuery = useQuery(
    [GET_TX_STATUS_QUERY, txHash],
    async () => {
      if (!txHash || !provider) {
        return "waiting_transfer";
      }

      const receipt = await provider.getTransactionReceipt(txHash);

      if (receipt.status === 1 && receipt.confirmations >= 1) {
        return "confirmed";
      }

      return "pending";
    },
    { refetchInterval: 5000 }
  );

  const renderContent = () => {
    if (txQuery.isLoading) {
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

    if (txQuery.data === "confirmed") {
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

    if (txQuery.data === "waiting_transfer") {
      return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage
                id="transfer.amount.symbol"
                defaultMessage="Transfer {amount} {symbol}"
                values={{
                  amount: total?.toString(),
                  symbol: token?.symbol,
                }}
              />
            </Typography>
            <Typography align="center" variant="body1" color="text.secondary">
              <FormattedMessage
                id="transfering.amount.to.pay"
                defaultMessage="Transfering amount to pay"
                values={{
                  amount: total?.toString(),
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
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...DialogProps} maxWidth="sm" fullWidth>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="confirm.transaction"
            defaultMessage="Confirm transaction"
          />
        }
        onClose={handleClose}
        sx={{ px: 4, py: 2 }}
      />
      <DialogContent dividers>
        <Stack spacing={2}>
          {renderContent()}
          {txHash && renderTransaction(txHash)}
        </Stack>
      </DialogContent>
      {txQuery.data === "waiting_transfer" && (
        <DialogActions sx={{ py: 2, px: 4 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
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
        </DialogActions>
      )}
    </Dialog>
  );
}
