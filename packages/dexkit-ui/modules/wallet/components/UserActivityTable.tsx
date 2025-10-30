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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import useUserActivity from "../hooks/useUserActivity";
import UserActivityTableRow from "./UserActivityTableRow";

export interface UserActivityTableProps { }

export default function UserActivityTable({ }: UserActivityTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { account } = useWeb3React();

  const userActivityQuery = useUserActivity({ account, pageSize });

  const renderPages = () => {
    const hasNoPages =
      userActivityQuery.data?.pages &&
      userActivityQuery.data?.pages.length === 0;

    const currentPageData = userActivityQuery.data?.pages?.[page]?.data || [];

    if (hasNoPages || currentPageData.length === 0) {
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

    if (
      userActivityQuery.data?.pages &&
      userActivityQuery.data?.pages.length > 0
    ) {
      return currentPageData.map(
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
              <FormattedMessage id="action" defaultMessage="Action" />
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
                // Reflect filtered results; fall back to 0 when no data
                count={userActivityQuery.data?.pages?.[page]?.data?.length || 0}
                onPageChange={handlePageChange}
                rowsPerPage={pageSize}
                rowsPerPageOptions={isMobile ? [5] : [5, 10]}
                labelRowsPerPage={isMobile ? "Filas:" : "Rows per page:"}
                labelDisplayedRows={({ from, to, count }) =>
                  isMobile ? `${from}-${to}/${count}` : `${from}-${to} of ${count}`
                }
                sx={{
                  '& .MuiTablePagination-toolbar': {
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                    minHeight: isMobile ? 'auto' : 52,
                    paddingLeft: isMobile ? theme.spacing(1) : theme.spacing(2),
                    paddingRight: isMobile ? theme.spacing(1) : theme.spacing(2),
                  },
                  '& .MuiTablePagination-spacer': {
                    display: isMobile ? 'none' : 'flex',
                  },
                  '& .MuiTablePagination-selectLabel': {
                    fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
                    margin: isMobile ? theme.spacing(0.5, 0.5, 0.5, 0) : 'inherit',
                    order: isMobile ? 1 : 'inherit',
                  },
                  '& .MuiTablePagination-select': {
                    fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
                    marginLeft: isMobile ? theme.spacing(0.5) : theme.spacing(1),
                    marginRight: isMobile ? theme.spacing(1) : theme.spacing(2),
                    order: isMobile ? 2 : 'inherit',
                  },
                  '& .MuiTablePagination-displayedRows': {
                    fontSize: isMobile ? theme.typography.caption.fontSize : theme.typography.body2.fontSize,
                    margin: isMobile ? theme.spacing(0.5, 0) : 'inherit',
                    order: isMobile ? 3 : 'inherit',
                    width: isMobile ? '100%' : 'auto',
                    textAlign: isMobile ? 'center' : 'inherit',
                  },
                  '& .MuiTablePagination-actions': {
                    marginLeft: isMobile ? 'auto' : theme.spacing(2.5),
                    order: isMobile ? 4 : 'inherit',
                    '& .MuiIconButton-root': {
                      padding: isMobile ? theme.spacing(0.5) : theme.spacing(1),
                      '& .MuiSvgIcon-root': {
                        fontSize: isMobile ? theme.typography.body1.fontSize : theme.typography.h6.fontSize,
                      },
                    },
                  },
                  [theme.breakpoints.down('xs')]: {
                    '& .MuiTablePagination-toolbar': {
                      padding: theme.spacing(1, 0.5),
                    },
                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                      fontSize: theme.typography.caption.fontSize,
                    },
                  },
                }}
              />
            )}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
