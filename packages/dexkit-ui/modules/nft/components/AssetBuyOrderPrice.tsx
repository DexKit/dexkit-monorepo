import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { Avatar, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { FormattedNumber } from "react-intl";

import { memo, useMemo, useRef } from "react";

import { Asset } from "@dexkit/core/types/nft";
import { isAddressEqual } from "@dexkit/core/utils/blockchain";
import { ipfsUriToUrl } from "@dexkit/core/utils/ipfs";
import { useTokenList } from "@dexkit/ui/hooks/blockchain";
import { useCoinPricesQuery, useCurrency } from "../../../hooks/currency";
import { OrderBookItem } from "../types";

interface Props {
  orderBookItem?: OrderBookItem;
  asset?: Asset;
}

export function AssetBuyOrderPrice({ orderBookItem, asset }: Props) {
  const tokens = useTokenList({
    chainId: parseInt(String(asset?.chainId || "0")),
    includeNative: true,
  });

  const token = tokens.find((t) =>
    isAddressEqual(t.address, orderBookItem?.erc20Token),
  );

  const elRef = useRef<HTMLElement | null>(null);

  const currency = useCurrency();

  const coinPricesQuery = useCoinPricesQuery({
    includeNative: true,
    chainId: asset?.chainId,
  });

  const totalInCurrency = useMemo(() => {
    if (token && currency && orderBookItem) {
      if (coinPricesQuery?.data) {
        let ratio = 0;

        const tokenData = coinPricesQuery.data[token.address.toLowerCase()];

        if (tokenData && currency.currency in tokenData) {
          ratio = tokenData[currency.currency];
        }

        if (ratio) {
          return (
            ratio *
            parseFloat(
              formatUnits(orderBookItem?.erc20TokenAmount, token.decimals),
            )
          );
        } else {
          return 0;
        }
      }
    }
  }, [token, coinPricesQuery, currency, orderBookItem]);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        alignContent="center"
        spacing={1}
      >
        <Tooltip title={token?.symbol || ""}>
          <Avatar
            sx={{ width: "auto", height: "1rem" }}
            src={ipfsUriToUrl(token?.logoURI || "")}
          />
        </Tooltip>
        <Typography variant="body2">
          <b>
            {orderBookItem?.order?.erc20TokenAmount &&
              formatUnits(
                orderBookItem?.order?.erc20TokenAmount,
                token?.decimals || 18,
              )}{" "}
            {token?.symbol.toUpperCase()}
          </b>
        </Typography>
        <Typography variant="caption">
          {totalInCurrency ? (
            <>
              ({" "}
              <FormattedNumber
                value={totalInCurrency}
                currency={currency?.currency}
              />{" "}
              {currency?.currency.toUpperCase()})
            </>
          ) : (
            <Skeleton />
          )}
        </Typography>
      </Stack>
    </>
  );
}

export default memo(AssetBuyOrderPrice);
