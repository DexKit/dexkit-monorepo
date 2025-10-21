import { TransactionStatus } from "@dexkit/core/constants";
import { getBlockExplorerUrl } from "@dexkit/core/utils";
import { formatTransactionError } from "@dexkit/ui/modules/contract-wizard/hooks/thirdweb";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Receipt from "@mui/icons-material/Receipt";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useDexKitContext } from "../../hooks";
import { AppDialogTitle } from "../AppDialogTitle";
import { NotificationMessage } from "../NotificationMessage";

export interface WatchTransactionDialogProps {
  hash?: string;
  type?: string;
  values?: Record<string, any>;
  DialogProps: DialogProps;
  error?: Error;
}

function WatchTransactionDialog({
  DialogProps,
  error,
  type,
  values,
  hash,
}: WatchTransactionDialogProps) {
  const { transactions, notificationTypes } = useDexKitContext();

  const { onClose } = DialogProps;

  const handleClose = () => onClose!({}, "backdropClick");

  const transaction = useMemo(() => {
    if (hash) {
      return transactions[hash];
    }
  }, [hash, transactions]);

  const renderTransactionState = useCallback(() => {
    if (transaction !== undefined) {
      if (transaction.status === TransactionStatus.Pending) {
        return <CircularProgress />;
      } else if (transaction.status === TransactionStatus.Confirmed) {
        return <CheckCircleIcon color="success" fontSize="large" />;
      } else if (transaction.status === TransactionStatus.Failed) {
        return <CloseIcon color="error" />;
      }
    } else {
      return <CircularProgress />;
    }
  }, [transaction]);

  const renderTitle = useCallback(() => {
    if (transaction !== undefined) {
      if (transaction.status === TransactionStatus.Pending) {
        return (
          <FormattedMessage
            id="transaction.waiting.confirmation"
            defaultMessage="Waiting confirmation"
          />
        );
      } else if (transaction.status === TransactionStatus.Confirmed) {
        return (
          <FormattedMessage
            id="transaction.confirmed"
            defaultMessage="Transaction confirmed"
          />
        );
      } else if (transaction.status === TransactionStatus.Failed) {
        return (
          <FormattedMessage
            id="transaction.failed"
            defaultMessage="Transaction Failed"
          />
        );
      }
    } else {
      return (
        <FormattedMessage
          id="transaction.confirm.transaction"
          defaultMessage="Confirm transaction"
        />
      );
    }
  }, [transaction]);

  const isTransactionFailed = transaction?.status === TransactionStatus.Failed;
  const isTransactionConfirmed =
    transaction?.status === TransactionStatus.Confirmed;

  const renderMessage = () => {
    if (isTransactionConfirmed) {
      return (
        <FormattedMessage
          id="your.transaction.has.been.confirmed"
          defaultMessage="Your transaction has been confirmed"
          description="Your transaction has been confirmed"
        />
      );
    } else if (isTransactionFailed) {
      return (
        <FormattedMessage
          id="confirm.the.transaction.on.your.wallet"
          defaultMessage="Please, confirm the transaction on your wallet"
          description="Transaction dialog message before transaction be confirmed in the wallet"
        />
      );
    } else if (transaction === undefined) {
      return (
        <FormattedMessage
          id="confirm.the.transaction.on.your.wallet"
          defaultMessage="Please, confirm the transaction on your wallet"
          description="Transaction dialog message before transaction be confirmed in the wallet"
        />
      );
    } else {
      return (
        <FormattedMessage
          id="please.wait.for.the.block.confirmation"
          defaultMessage="Wait for the block confirmation"
          description="Transaction dialog message after transaction confirmation in the wallet"
        />
      );
    }
  };

  const renderContent = () => {
    if (error !== undefined) {
      const formattedError = formatTransactionError(error.message || 'Unknown error');

      return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <CloseIcon color="error" fontSize="large" />
          <Box>
            <Typography align="center" variant="h5">
              <FormattedMessage id="error" defaultMessage="Error" />
            </Typography>
            <Typography align="center" variant="body1" color="textSecondary" sx={{ maxWidth: 400, wordWrap: 'break-word' }}>
              {formattedError}
            </Typography>
          </Box>
          {hash !== undefined && (
            <Button color="primary">
              <FormattedMessage
                id="view.transaction"
                defaultMessage="View Transaction"
                description="View transaction"
              />
            </Button>
          )}
        </Stack>
      );
    } else {
      return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
          {renderTransactionState()}
          <Box>
            <Typography align="center" variant="h5">
              {renderTitle()}
            </Typography>
            <Typography align="center" variant="body1" color="textSecondary">
              {renderMessage()}
            </Typography>
          </Box>
          {type && values && (
            <Typography align="center" variant="body2">
              <NotificationMessage
                type={type}
                values={values}
                types={notificationTypes}
              />
            </Typography>
          )}

          {transaction !== undefined && hash && (
            <>
              <Button
                color="primary"
                href={`${getBlockExplorerUrl(transaction?.chainId)}/tx/${hash}`}
                target="_blank"
              >
                <FormattedMessage
                  id="view.transaction"
                  defaultMessage="View Transaction"
                  description="View transaction"
                />
              </Button>
            </>
          )}
        </Stack>
      );
    }
  };

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={<Receipt />}
        title={
          <FormattedMessage
            id="transaction"
            defaultMessage="Transaction"
            description="Transaction dialog title"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>{renderContent()}</DialogContent>
    </Dialog>
  );
}

export default WatchTransactionDialog;
