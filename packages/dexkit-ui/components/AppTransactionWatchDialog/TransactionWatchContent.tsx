import { getBlockExplorerUrl } from "@dexkit/core/utils";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Icon,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FormattedMessage } from "react-intl";
import { useWaitTransactionConfirmation } from "../../hooks";
import { TxDialogTransaction } from "../../types";

export interface TransactionWatchContentProps {
  transaction: TxDialogTransaction;
  enabled?: boolean;
  enableConditions: (newConditions: string[]) => void;
}

export default function TransactionWatchContent({
  transaction,
  enabled,
  enableConditions,
}: TransactionWatchContentProps) {
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
    <Box p={2}>
      <Stack spacing={2}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Avatar>
            {action.isLoading || waitTxQuery.isFetching ? (
              <CircularProgress />
            ) : waitTxQuery.isSuccess ? (
              <Icon color="success">check</Icon>
            ) : (
              <Icon>{transaction.icon ? transaction.icon : "receipt"}</Icon>
            )}
          </Avatar>
          <Typography variant="h5">
            <FormattedMessage
              id={transaction.title.id}
              defaultMessage={transaction.title.defaultMessage}
              values={transaction.title.values}
            />
          </Typography>
        </Stack>
        {!waitTxQuery.isSuccess && (
          <Button
            fullWidth
            disabled={action.isLoading || waitTxQuery.isFetching || !enabled}
            onClick={handleExecute}
            variant="contained"
          >
            {action.isError ? (
              <FormattedMessage id="try.again" defaultMessage="Try again" />
            ) : (
              <FormattedMessage id="execute" defaultMessage="Execute" />
            )}
          </Button>
        )}
        {action.data && waitTxQuery.isError ? (
          <Typography>
            <FormattedMessage
              id="transaction.failed"
              defaultMessage="Transaction failed"
            />
          </Typography>
        ) : undefined}

        {action.data?.hash && (
          <Button
            variant="outlined"
            href={`${getBlockExplorerUrl(chainId)}/tx/${action.data.hash}`}
            target="_blank"
          >
            <FormattedMessage
              id="view.transaction"
              defaultMessage="View transaction"
            />
          </Button>
        )}
      </Stack>
    </Box>
  );
}
