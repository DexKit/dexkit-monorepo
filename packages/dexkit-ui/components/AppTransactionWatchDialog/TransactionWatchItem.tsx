import { getBlockExplorerUrl } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Avatar,
  Button,
  CircularProgress,
  Icon,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FormattedMessage } from "react-intl";
import { useWaitTransactionConfirmation } from "../../hooks";
import { TxDialogTransaction } from "../../types";

export interface TransactionWatchItemProps {
  transaction: TxDialogTransaction;
  enabled?: boolean;
  enableConditions: (newConditions: string[]) => void;
}

export default function TransactionWatchItem({
  transaction,
  enabled,
  enableConditions,
}: TransactionWatchItemProps) {
  const { provider, chainId } = useWeb3React();

  const action = useMutation(async () => {
    let result = await transaction.action();

    if (result.conditions) {
      enableConditions(result.conditions);
    }

    return result;
  });

  const waitTxQuery = useWaitTransactionConfirmation({
    provider,
    transactionHash: action.data?.hash,
  });

  const handleExecute = async () => {
    await action.mutateAsync();
  };

  return (
    <ListItem divider>
      <ListItemAvatar>
        <Avatar>
          {action.isLoading || waitTxQuery.isFetching ? (
            <CircularProgress />
          ) : waitTxQuery.isSuccess ? (
            <Icon color="success">check</Icon>
          ) : (
            <Icon>{transaction.icon ? transaction.icon : "receipt"}</Icon>
          )}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <FormattedMessage
            id={transaction.title.id}
            defaultMessage={transaction.title.defaultMessage}
            values={transaction.title.values}
          />
        }
        secondary={
          action.data?.hash ? (
            waitTxQuery.isError ? (
              <FormattedMessage
                id="transaction.failed"
                defaultMessage="Transaction failed"
              />
            ) : (
              <Link
                href={`${getBlockExplorerUrl(chainId)}/tx/${action.data.hash}`}
                target="_blank"
              >
                <FormattedMessage
                  id="view.transaction"
                  defaultMessage="View transaction"
                />
              </Link>
            )
          ) : undefined
        }
      />
      {!waitTxQuery.isSuccess && (
        <ListItemSecondaryAction>
          <Button
            size="small"
            disabled={action.isLoading || waitTxQuery.isFetching || !enabled}
            onClick={handleExecute}
            variant="outlined"
          >
            {action.isError ? (
              <FormattedMessage id="try.again" defaultMessage="Try again" />
            ) : (
              <FormattedMessage id="execute" defaultMessage="Execute" />
            )}
          </Button>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}
