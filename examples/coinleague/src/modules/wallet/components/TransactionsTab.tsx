import { notificationsAtom, transactionsAtom } from '@/modules/common/atoms';
import Link from '@/modules/common/components/Link';
import MomentSpan from '@/modules/common/components/MomentSpan';
import { AppNotificationType } from '@/modules/common/types/app';
import { TransactionStatus } from '@/modules/common/types/transactions';
import { getChainName } from '@/modules/common/utils';
import { getBlockExplorerUrl } from '@/modules/common/utils/blockchain';
import { CheckCircle, Error, TipsAndUpdates } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useAtomValue } from 'jotai';
import moment from 'moment';
import { useCallback, useEffect, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

export default function TransactionsTab() {
  const notifications = useAtomValue(notificationsAtom);
  const transactions = useAtomValue(transactionsAtom);

  const notificationsTransaction = useMemo(() => {
    return notifications.filter(
      (n) => n.type === AppNotificationType.Transaction
    );
  }, [notifications]);

  const renderStatus = useCallback((status: TransactionStatus) => {
    if (status === TransactionStatus.Confirmed) {
      return <CheckCircle />;
    }

    if (status === TransactionStatus.Pending) {
      return <CircularProgress color="primary" />;
    }

    if (status === TransactionStatus.Failed) {
      return <Error />;
    }
  }, []);

  useEffect(() => {});

  return (
    <Box>
      {notificationsTransaction.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <FormattedMessage id="title" defaultMessage="Title" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="title" defaultMessage="Date" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="title" defaultMessage="Status" />
                </TableCell>
                <TableCell>
                  <FormattedMessage id="title" defaultMessage="Network" />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notificationsTransaction.map((t, index: number) => (
                <TableRow key={index}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>
                    <MomentSpan from={moment(new Date(t.created))} />
                  </TableCell>
                  <TableCell>
                    {renderStatus(transactions[t.hash].status)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={getChainName(transactions[t.hash].chainId)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      LinkComponent={Link}
                      href={`${getBlockExplorerUrl(
                        transactions[t.hash].chainId
                      )}/tx/${t.hash}`}
                      target="_blank"
                    >
                      <FormattedMessage
                        id="view.transaction"
                        defaultMessage="View Transaction"
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          <Stack spacing={2} alignItems="center" justifyContent="center">
            <TipsAndUpdates fontSize="large" />
            <Box>
              <Typography align="center" variant="h5">
                <FormattedMessage
                  id="no.transactions"
                  defaultMessage="No transactions"
                />
              </Typography>
              <Typography align="center" variant="body1">
                <FormattedMessage
                  id="create.transactions.in.the.dexkit.app.to.see.it.here"
                  defaultMessage="Create transactions in the DexKit app to see it here."
                />
              </Typography>
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
