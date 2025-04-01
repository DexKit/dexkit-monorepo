import { ChainId } from "@dexkit/core/constants";
import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { useCurrency } from "../../../hooks/currency";

import { useSimpleCoinPricesQuery } from "../../../hooks/currency/useSimpleCoinPricesCurrency";
import { useERC20BalancesQuery, useIsBalanceVisible } from "../hooks";
import WalletTableRow from "./WalletTableRow";

interface Props {
  isBalancesVisible: boolean;
  chainId?: ChainId;
  filter?: string;
}

function WalletBalancesTable({ isBalancesVisible, chainId, filter }: Props) {
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
          t?.token?.address?.toLowerCase().search(lowercasedFilter) !== -1,
      );
    }

    return tokenBalancesWithPrices;
  }, [tokenBalancesWithPrices, filter]);

  return (
    <TableContainer>
      <Table>
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

/*function WalletBalances({ chainId }: WalletProps) {
  const isBalancesVisible = useIsBalanceVisible();

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => (
            <Paper sx={{ p: 1 }}>
              <Stack justifyContent="center" alignItems="center">
                <Typography variant="h6">
                  <FormattedMessage
                    id="something.went.wrong"
                    defaultMessage="Oops, something went wrong"
                    description="Something went wrong error message"
                  />
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {String(error)}
                </Typography>
                <Button color="primary" onClick={resetErrorBoundary}>
                  <FormattedMessage
                    id="try.again"
                    defaultMessage="Try again"
                    description="Try again"
                  />
                </Button>
              </Stack>
            </Paper>
          )}
        >
          <Suspense fallback={<WalletTableSkeleton rows={4} />}>
            <WalletBalancesTable
              isBalancesVisible={isBalancesVisible}
              chainId={chainId}
            />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}*/
function WalletBalances({ chainId, filter }: WalletProps) {
  const isBalancesVisible = useIsBalanceVisible();

  return (
    <WalletBalancesTable
      isBalancesVisible={isBalancesVisible}
      chainId={chainId}
      filter={filter}
    />
  );
}

export default WalletBalances;
