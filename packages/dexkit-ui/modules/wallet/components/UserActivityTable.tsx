import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
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
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import useUserActivity from "../hooks/useUserActivity";
import UserActivityTableRow from "./UserActivityTableRow";

export interface UserActivityTableProps {}

export default function UserActivityTable({}: UserActivityTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const { account } = useWeb3React();

  const userActivityQuery = useUserActivity({ account, pageSize });

  const renderPages = () => {
    if (
      userActivityQuery.data?.pages &&
      userActivityQuery.data?.pages.length === 0
    ) {
      return (
        <TableRow>
          <TableCell colSpan={5}>
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

    if (
      userActivityQuery.data?.pages &&
      userActivityQuery.data?.pages.length > 0
    ) {
      return userActivityQuery.data?.pages[page]?.data.map(
        (event: any, key: number) => (
          <UserActivityTableRow event={event} key={`event-${page}-${key}`} />
        )
      );
    }
  };

  const handlePageChange = async (event: any, nextPage: number) => {
    if (nextPage > page) {
      await userActivityQuery.fetchNextPage();
    } else {
      await userActivityQuery.fetchPreviousPage();
    }
    setPage(nextPage);
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
            <TableCell>
              <FormattedMessage id="activity" defaultMessage="Activity" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="date" defaultMessage="Date" />
            </TableCell>
            <TableCell>
              <FormattedMessage id="transaction" defaultMessage="Transaction" />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderPages()}</TableBody>
        <TableFooter>
          <TableRow>
            {userActivityQuery.data && (
              <TablePagination
                onRowsPerPageChange={handleChangeRowsPerPage}
                page={page}
                count={userActivityQuery.data?.pages[page]?.count || 0}
                onPageChange={handlePageChange}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[5, 10]}
              />
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
