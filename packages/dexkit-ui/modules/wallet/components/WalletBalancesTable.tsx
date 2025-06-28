import { ChainId } from "@dexkit/core/constants";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useCurrency } from "../../../hooks/currency";

import { useSimpleCoinPricesQuery } from "../../../hooks/currency/useSimpleCoinPricesCurrency";
import { useERC20BalancesQuery, useIsBalanceVisible } from "../hooks";
import WalletTableRow from "./WalletTableRow";

interface Props {
  isBalancesVisible: boolean;
  chainId?: ChainId;
  filter?: string;
  isTableVisible: boolean;
  handleToggleTable: () => void;
}

function WalletBalancesTable({ isBalancesVisible, chainId, filter, isTableVisible, handleToggleTable }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const tokenBalancesQuery = useERC20BalancesQuery(undefined, chainId, false);

  const coinPricesQuery = useSimpleCoinPricesQuery({
    includeNative: true,
    chainId,
  });

  const prices = coinPricesQuery.data;
  const currency = useCurrency();

  const tokenBalancesWithPrices = useMemo(() => {
    return tokenBalancesQuery?.data?.map((tb) => {
      return {
        ...tb,
        price:
          prices && prices[tb.token.address.toLowerCase()]
            ? prices[tb.token.address.toLowerCase()][currency.currency]
            : undefined,
      };
    });
  }, [prices, tokenBalancesQuery.data, currency]);

  const tokenBalancesWithPricesFiltered = useMemo(() => {
    if (filter) {
      const lowercasedFilter = filter.toLowerCase();
      return tokenBalancesWithPrices?.filter(
        (t) =>
          t?.token?.name?.toLowerCase().search(lowercasedFilter) !== -1 ||
          t?.token?.symbol?.toLowerCase().search(lowercasedFilter) !== -1 ||
          t?.token?.address?.toLowerCase().search(lowercasedFilter) !== -1
      );
    }

    return tokenBalancesWithPrices;
  }, [tokenBalancesWithPrices, filter]);

  return (
    <>
      {isTableVisible && (
        <TableContainer>
          <Table>
            {!isMobile && (
              <TableHead>
                <TableRow>
                  <TableCell>
                    <FormattedMessage id="token" defaultMessage="Token" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="total" defaultMessage="Total" />
                  </TableCell>
                  <TableCell>
                    <FormattedMessage id="balance" defaultMessage="Balance" />
                  </TableCell>
                </TableRow>
              </TableHead>
            )}
            <TableBody>
              {tokenBalancesWithPricesFiltered?.map((token, index: number) => (
                <WalletTableRow
                  key={index}
                  isLoadingCurrency={coinPricesQuery.isLoading}
                  tokenBalance={token}
                  price={token.price}
                  isBalancesVisible={isBalancesVisible}
                  currency={currency.currency}
                />
              ))}
              {tokenBalancesQuery.isLoading &&
                new Array(4).fill(null).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                    <TableCell>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 1, cursor: 'pointer', width: '100%' }} onClick={handleToggleTable}>
        {isTableVisible ? <KeyboardArrowUpIcon sx={{ mr: 1, color: theme.palette.primary.main }} /> : <KeyboardArrowDownIcon sx={{ mr: 1, color: theme.palette.primary.main }} />}
        <Typography variant="body2" sx={{ fontWeight: 'bold', letterSpacing: 1, color: theme.palette.primary.main }}>
          {isTableVisible ? 'CLOSE' : 'OPEN'}
        </Typography>
      </Box>
    </>
  );
}

function WalletTableSkeleton({ rows = 4 }: { rows: number }) {
  return (
    <Table>
      <TableBody>
        {new Array(rows).fill(null).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton />
            </TableCell>
            <TableCell>
              <Skeleton />
            </TableCell>
            <TableCell>
              <Skeleton />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

interface WalletProps {
  chainId?: ChainId;
  filter?: string;
}

function WalletBalances({ chainId, filter }: WalletProps) {
  const isBalancesVisible = useIsBalanceVisible();
  const [isTableVisible, setIsTableVisible] = useState(false);

  const handleToggleTable = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <WalletBalancesTable
      isBalancesVisible={isBalancesVisible}
      chainId={chainId}
      filter={filter}
      isTableVisible={isTableVisible}
      handleToggleTable={handleToggleTable}
    />
  );
}

export default WalletBalances;
