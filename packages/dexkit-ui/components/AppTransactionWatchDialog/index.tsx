import { Divider, List } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { TxDialogOptions, TxDialogTransaction } from "../../types";
import { AppDialogTitle } from "../AppDialogTitle";
import TransactionWatchContent from "./TransactionWatchContent";
import TransactionWatchItem from "./TransactionWatchItem";

export interface AppTransactionWatchDialogProps {
  DialogProps: DialogProps;
  transactions: TxDialogTransaction[];
  options?: TxDialogOptions;
}

export default function AppTransactionWatchDialog({
  DialogProps,
  transactions,
  options,
}: AppTransactionWatchDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const [conditions, setConditions] = useState<{ [key: string]: any }>({});

  const matchConditions = useCallback(
    (tx: TxDialogTransaction) => {
      if (tx.conditions) {
        for (let condition of tx.conditions) {
          if (!conditions[condition.id]) {
            return false;
          }
        }
      }

      return true;
    },
    [conditions]
  );

  const enableConditions = useCallback((newConditions: string[]) => {
    let newObj: { [key: string]: any } = {};

    for (let newCond of newConditions) {
      newObj[newCond] = true;
    }

    setConditions(newObj);
  }, []);

  const txList = useMemo(() => {
    return transactions.filter((tx) => {
      if (tx.check && tx.check().hidden) {
        return false;
      }

      return true;
    });
  }, [transactions]);

  useEffect(() => {
    for (let tx of transactions) {
      if (tx.check) {
        let conds = tx.check().conditions;

        if (conds) {
          enableConditions(conds);
        }
      }
    }
  }, [transactions, enableConditions]);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="execute.transaction"
            defaultMessage="Execute transaction"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        {transactions.length > 1 ? (
          <List disablePadding>
            {txList.map((tx: TxDialogTransaction, index: number) => (
              <TransactionWatchItem
                transaction={tx}
                key={index}
                enabled={matchConditions(tx)}
                enableConditions={enableConditions}
              />
            ))}
          </List>
        ) : (
          <TransactionWatchContent
            transaction={transactions[0]}
            enabled={matchConditions(transactions[0])}
            enableConditions={enableConditions}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
