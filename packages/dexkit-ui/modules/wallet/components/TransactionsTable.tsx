import { useDexKitContext } from "@dexkit/ui";
import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { TransactionsTableRow } from "./TransactionsTableRow";

export enum TransactionsTableFilter {
  Transactions,
  Trades,
}

export interface TransactionsTableProps {
  filter: TransactionsTableFilter;
}

export function TransactionsTable({ filter }: TransactionsTableProps) {
  const { notifications } = useDexKitContext();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const filteredNotifications = useMemo(() => {
    if (filter === TransactionsTableFilter.Trades) {
      return notifications.filter((n) => n.subtype === "swap");
    }

    return notifications.filter((n) => n.subtype !== "swap");
  }, [notifications, filter]);

  const pageList = useMemo(() => {
    return filteredNotifications.slice(
      page * pageSize,
      page * pageSize + pageSize
    );
  }, [filteredNotifications, page, pageSize]);

  const renderTransactionsList = () => {
    if (pageList.length === 0) {
      return (
        <TableRow>
          <TableCell {...({ colSpan: 5 } as any)}>
            <Stack sx={{ py: 2 }} alignItems="center" justifyContent="center">
              <Typography variant="body1" color="textSecondary">
                <FormattedMessage
                  id="nothing.to.see.here"
                  defaultMessage="Nothing to see here"
                />
              </Typography>
            </Stack>
          </TableCell>
        </TableRow>
      );
    }

    if (pageList.length > 0) {
      return pageList.map((notification, key) => (
        <TransactionsTableRow key={key} notification={notification} />
      ));
    }
  };

  const handlePageChange = (event: any, page: number) => {
    setPage(page);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell {...({ colSpan: 2 } as any)}>
              <FormattedMessage id="transaction" defaultMessage="Transaction" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="date" defaultMessage="Date" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="status" defaultMessage="Status" />
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTransactionsList()}</TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              onRowsPerPageChange={handleChangeRowsPerPage}
              page={page}
              count={filteredNotifications.length}
              onPageChange={handlePageChange}
              rowsPerPage={pageSize}
              rowsPerPageOptions={[5, 10]}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
