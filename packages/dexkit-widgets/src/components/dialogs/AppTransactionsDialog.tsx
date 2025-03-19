import { Notifications } from "@mui/icons-material";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { transactionsAtom, uncheckedTransactionsAtom } from "../../state/atoms";
import { Transaction } from "../../types";
import AppDialogTitle from "../AppDialogTitle";
import AppTransactionList from "../AppTransactionList";

interface AppTransactionsDialogProps {
  DialogProps: DialogProps;
}

export default function AppTransactionsDialog({
  DialogProps,
}: AppTransactionsDialogProps) {
  const { onClose } = DialogProps;
  const { chainId } = useWeb3React();

  const [transactions, updateTransactions] = useAtom(transactionsAtom);

  const transactionList = useMemo(() => {
    return Object.keys(transactions as { [key: string]: Transaction }).map(
      (key) => (transactions as { [key: string]: Transaction })[key],
    );
  }, [transactions]);

  const uncheckedTransactions = useAtomValue(uncheckedTransactionsAtom);

  const handleClearNotifications = () => {
    updateTransactions({});
  };

  const renderNotificationsList = () => {
    if (transactionList.length === 0) {
      return (
        <Stack sx={{ py: 2 }} alignItems="center" justifyContent="center">
          <Typography variant="body1">
            <FormattedMessage
              id="nothing.to.see.here"
              defaultMessage="Nothing to see here"
            />
          </Typography>
        </Stack>
      );
    }

    return <AppTransactionList transactions={transactionList.reverse()} />;
  };

  const handleClose = () => {
    if (uncheckedTransactions.length > 0) {
      updateTransactions((txs: { [key: string]: Transaction }) => {
        let newTxs: { [key: string]: Transaction } = { ...txs };

        for (let tx of Object.keys(newTxs)) {
          newTxs[tx] = { ...newTxs[tx], checked: true };
        }

        return newTxs;
      });
    }

    onClose!({}, "backdropClick");
  };

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        icon={<Notifications />}
        title={
          <FormattedMessage
            id="notifications"
            defaultMessage="Notifications"
            description="Notifications"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>{renderNotificationsList()}</DialogContent>
      <DialogActions>
        {transactionList.length > 0 && (
          <Button onClick={handleClearNotifications}>
            <FormattedMessage
              id="clear"
              defaultMessage="Clear"
              description="Clear button label"
            />
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
