import LaunchIcon from "@mui/icons-material/Launch";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  getBlockExplorerUrl,
  isAddressEqual,
  truncateAddress,
} from "@dexkit/core/utils/blockchain";
import moment from "moment";
import { FormattedMessage, FormattedNumber } from "react-intl";

import { Asset, SwapApiOrder } from "@dexkit/core/types/nft";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { ipfsUriToUrl } from "@dexkit/core/utils/ipfs";
import CancelIcon from "@mui/icons-material/Cancel";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { memo, useMemo, useRef } from "react";
import Link from "../../../../components/AppLink";
import MomentFromNow from "../../../../components/MomentFromNow";
import { useTokenList } from "../../../../hooks/blockchain";
import { useCoinPricesQuery, useCurrency } from "../../../../hooks/currency";

interface Props {
  chainId: string;
  order: any;
  asset?: Asset;
  account?: string;
  onCancel?: (order: SwapApiOrder) => void;
  onBuy?: (order: SwapApiOrder) => void;
  onMenu?: (el: HTMLElement | null, order?: SwapApiOrder) => void;
}

export function ListingsTableRow({
  chainId,
  order,
  asset,
  account,
  onBuy,
  onCancel,
  onMenu,
}: Props) {
  const tokens = useTokenList({
    chainId: parseInt(String(asset?.chainId || "0")),
    includeNative: true,
  });

  const token = tokens.find((t) =>
    isAddressEqual(t.address, order?.erc20Token)
  );

  const elRef = useRef<HTMLElement | null>(null);

  const { currency } = useCurrency();

  const coinPricesQuery = useCoinPricesQuery({
    includeNative: true,
    chainId: asset?.chainId,
  });

  const totalInCurrency = useMemo(() => {
    if (token && currency && order) {
      if (
        coinPricesQuery?.data &&
        `${token.address.toLowerCase()}` in coinPricesQuery.data
      ) {
        let ratio = 0;

        const tokenData = coinPricesQuery.data[token.address.toLowerCase()];

        if (tokenData && currency in tokenData) {
          ratio = tokenData[currency];
        }

        if (
          ratio &&
          order?.erc20TokenAmount !== undefined &&
          token.decimals !== undefined
        ) {
          return (
            ratio *
            parseFloat(formatUnits(order?.erc20TokenAmount, token.decimals))
          );
        } else {
          return 0;
        }
      }
    }
  }, [token, coinPricesQuery, currency, order]);

  return (
    <TableRow>
      <TableCell>
        <Stack
          direction="row"
          alignItems="center"
          alignContent="center"
          spacing={0.5}
        >
          <Tooltip title={token?.symbol || ""}>
            <Avatar
              sx={{ width: "auto", height: "1rem" }}
              src={ipfsUriToUrl(token?.logoURI || "")}
            />
          </Tooltip>
          <Typography variant="body1">
            {order.erc20TokenAmount !== undefined &&
              formatUnits(order.erc20TokenAmount, token?.decimals || 18)}{" "}
            {token?.symbol.toUpperCase()}
          </Typography>
        </Stack>
      </TableCell>
      <TableCell>
        {totalInCurrency ? (
          <>
            <FormattedNumber value={totalInCurrency} currency={currency} />{" "}
            {currency.toUpperCase()}
          </>
        ) : coinPricesQuery.isLoading ? (
          <Skeleton />
        ) : (
          ""
        )}
      </TableCell>
      <TableCell>
        <MomentFromNow from={moment.unix(parseInt(order.expiry))} />
      </TableCell>
      <TableCell>
        <Link
          color="primary"
          href={
            chainId !== undefined
              ? `${getBlockExplorerUrl(parseInt(chainId))}/address/${
                  order.maker
                }`
              : "/"
          }
          target="_blank"
        >
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            spacing={0.5}
          >
            <Box>
              {isAddressEqual(account, order?.maker) ? (
                <FormattedMessage
                  defaultMessage="you"
                  id="you"
                  description="You"
                />
              ) : (
                truncateAddress(order.maker)
              )}
            </Box>
            <LaunchIcon fontSize="inherit" />
          </Stack>
        </Link>
      </TableCell>
      <TableCell>
        {isAddressEqual(account, order.maker) ? (
          <Button
            startIcon={<CancelIcon />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => onCancel!(order)}
          >
            <FormattedMessage
              id="cancel"
              defaultMessage="Cancel"
              description="Cancel"
            />
          </Button>
        ) : (
          <Button
            startIcon={<CancelIcon />}
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => onBuy!(order)}
          >
            <FormattedMessage
              id="buy"
              defaultMessage="Buy"
              description="Buy asset button text"
            />
          </Button>
        )}
      </TableCell>
      <TableCell>
        <IconButton
          ref={(ref) => {
            elRef.current = ref;
          }}
          onClick={() => onMenu!(elRef.current, order)}
        >
          <MoreVertIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

export default memo(ListingsTableRow);
