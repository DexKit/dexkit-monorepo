import { Notifications } from "@mui/icons-material";

import type { Transaction as CoreTransaction } from "@dexkit/core/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
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

  const [transactions, setTransactions] = useAtom(transactionsAtom);

  const updateTransactions = (
    updater?: (prev: { [key: string]: CoreTransaction } | undefined) => { [key: string]: CoreTransaction } | undefined
  ) => {
    if (updater === undefined) {
      (setTransactions as (value: { [key: string]: CoreTransaction } | undefined) => void)(undefined);
      return;
    }
    (setTransactions as (updater: (prev: { [key: string]: CoreTransaction } | undefined) => { [key: string]: CoreTransaction } | undefined) => void)((prev: { [key: string]: CoreTransaction } | undefined) => {
      const coreTxs = prev as { [key: string]: CoreTransaction } | undefined;
      return updater(coreTxs);
    });
  };

  const transactionList = useMemo(() => {
    if (!transactions) return [];
    const transactionsMap = transactions as { [key: string]: CoreTransaction };
    return Object.keys(transactionsMap).map((key) => {
      const coreTx = transactionsMap[key];
      // Convert Core Transaction to Widget Transaction (add hash field)
      const widgetTx: Transaction = {
        hash: key, // Use the key as hash
        status: coreTx.status,
        created: coreTx.created,
        chainId: coreTx.chainId as Transaction["chainId"],
        checked: coreTx.checked,
        title: coreTx.title,
      };
      return widgetTx;
    });
  }, [transactions]);

  const uncheckedTransactions = useAtomValue(uncheckedTransactionsAtom);

  const handleClearNotifications = () => {
    updateTransactions(undefined);
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
      updateTransactions((txs: { [key: string]: CoreTransaction } | undefined) => {
        if (!txs) return undefined;
        let newTxs: { [key: string]: CoreTransaction } = { ...txs };

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
