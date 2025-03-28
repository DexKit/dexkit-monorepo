import { ChainId } from '@/modules/common/constants/enums';
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAffiliateEntries } from '../hooks/affiliate';
import { CoinLeagueAffiliateEntry } from '../types';
import AffiliateHistoryTableRow from './AffiliateHistoryTableRow';

interface Props {
  account?: string;
  chainId?: ChainId;
}

export default function AffiliateHistoryTable({ account, chainId }: Props) {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const affiliateHistory = useAffiliateEntries(
    {
      account,
      first: rowsPerPage,
      skip: page * rowsPerPage,
    },
    false
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell component="th">
              <Typography>
                <FormattedMessage id="time" defaultMessage="Time" />
              </Typography>
            </TableCell>
            <TableCell component="th">
              <Typography>
                <FormattedMessage id="game" defaultMessage="Game" />
              </Typography>
            </TableCell>
            <TableCell component="th">
              <Typography>
                <FormattedMessage id="type" defaultMessage="Type" />
              </Typography>
            </TableCell>
            <TableCell component="th">
              <Typography>
                <FormattedMessage id="player" defaultMessage="Player" />
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {affiliateHistory.data?.length > 0 ? (
            affiliateHistory.data?.map(
              (affiliate: CoinLeagueAffiliateEntry, index: number) => (
                <AffiliateHistoryTableRow
                  key={index}
                  affiliate={affiliate}
                  chainId={chainId}
                />
              )
            )
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <Stack
                  sx={{ py: 2 }}
                  spacing={2}
                  alignItems="center"
                  alignContent="center"
                >
                  <Box>
                    <Typography align="center" variant="h5">
                      <FormattedMessage
                        id="no.referrals"
                        defaultMessage="No Referrals"
                      />
                    </Typography>
                    <Typography
                      align="center"
                      variant="body1"
                      color="textSecondary"
                    >
                      <FormattedMessage
                        id="share.your.affiliate.link.to.get.referrals"
                        defaultMessage="Share your affiliate link to get referrals"
                      />
                    </Typography>
                  </Box>
                </Stack>
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={affiliateHistory.data?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Table>
    </TableContainer>
  );
}
