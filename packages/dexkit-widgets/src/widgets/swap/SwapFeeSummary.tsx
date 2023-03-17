import { Info, Sync } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useMemo, useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { GET_NATIVE_TOKEN } from "../../constants";
import { ChainId } from "../../constants/enum";
import { NETWORK_SYMBOL } from "../../constants/networks";
import { useCoinPrices, useGasPrice } from "../../hooks";
import { ZeroExQuoteResponse } from "../../services/zeroex/types";
import { Token } from "../../types";
import { formatBigNumber } from "../../utils";

export interface SwapFeeSummaryProps {
  quote?: ZeroExQuoteResponse | null;
  chainId?: ChainId;
  currency: string;
  sellToken?: Token;
  buyToken?: Token;
  provider?: ethers.providers.BaseProvider;
}

export default function SwapFeeSummary({
  quote,
  chainId,
  currency,
  sellToken,
  buyToken,
  provider,
}: SwapFeeSummaryProps) {
  const coinPrices = useCoinPrices({
    currency,
    tokens: chainId ? [GET_NATIVE_TOKEN(chainId)] : [],
    chainId,
  });

  const maxFee = useMemo(() => {
    if (quote) {
      return BigNumber.from(quote.gas).mul(quote.gasPrice);
    }

    return BigNumber.from(0);
  }, [quote]);

  const amount = useMemo(() => {
    if (quote) {
      return BigNumber.from(quote.value);
    }

    return BigNumber.from(0);
  }, [quote]);

  const totalFee = useMemo(() => {
    return maxFee.add(amount);
  }, [amount, maxFee]);

  const totalFiat = useMemo(() => {
    const amount = parseFloat(ethers.utils.formatEther(totalFee));

    if (coinPrices.data && chainId && currency) {
      const t = coinPrices.data[chainId];

      if (t) {
        const price = t[ethers.constants.AddressZero];

        return amount * price[currency];
      }
    }

    return 0;
  }, [totalFee, coinPrices.data, chainId, currency]);

  const priceImpact = useMemo(() => {
    if (quote) {
      return parseFloat(quote.estimatedPriceImpact);
    }

    return 0;
  }, [quote]);

  const [toggleSide, setToggleSide] = useState(false);

  const gasPriceQuery = useGasPrice({ provider });

  const handelToggle = () => setToggleSide((value) => !value);

  const sellTokenByBuyToken = useMemo(() => {
    if (buyToken && sellToken && quote) {
      const sellAmount = parseFloat(
        formatBigNumber(BigNumber.from(quote.sellAmount), sellToken.decimals)
      );
      const buyAmount = parseFloat(
        formatBigNumber(BigNumber.from(quote.buyAmount), buyToken.decimals)
      );

      return toggleSide ? buyAmount / sellAmount : sellAmount / buyAmount;
    }

    return 0.0;
  }, [sellToken, buyToken, quote, toggleSide]);

  return (
    <Box>
      <Stack spacing={1}>
        {/* <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            <FormattedMessage id="gas.price" defaultMessage="Gas Price" />
          </Typography>
          <Typography color="text.secondary">
            <>
              {formatBigNumber(maxFee, 18)} {NETWORK_SYMBOL(chainId)}
            </>
          </Typography>
        </Stack> */}
        {sellToken && buyToken && sellTokenByBuyToken > 0 && (
          <Stack spacing={1} direction="row" alignItems="center">
            {toggleSide ? (
              <Typography>
                1 {sellToken?.symbol.toUpperCase()} = {sellTokenByBuyToken}{" "}
                {buyToken?.symbol.toUpperCase()}
              </Typography>
            ) : (
              <Typography>
                1 {buyToken?.symbol.toUpperCase()} = {sellTokenByBuyToken}{" "}
                {sellToken?.symbol.toUpperCase()}
              </Typography>
            )}
            <IconButton onClick={handelToggle} size="small">
              <Sync fontSize="inherit" />
            </IconButton>
          </Stack>
        )}

        <Stack
          spacing={1}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>
            <FormattedMessage id="price.impact" defaultMessage="Price impact" />
          </Typography>
          <Stack
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              color="text.secondary"
              sx={(theme) => ({
                color:
                  priceImpact > 10
                    ? theme.palette.error.main
                    : theme.palette.text.secondary,
              })}
            >
              {priceImpact}%{" "}
            </Typography>
            <Tooltip
              title={
                <FormattedMessage
                  id="if.price.impact.is.too.high.you.will.lose.a.large.portion.of.your.money.to.complete.the.transaction"
                  defaultMessage="if price impact is too high, you will lose a large portion of your money to complete the transaction"
                />
              }
            >
              <Info fontSize="inherit" />
            </Tooltip>
          </Stack>
        </Stack>
        {/* <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            <FormattedMessage id="amount" defaultMessage="Amount" />
          </Typography>
          <Typography color="text.secondary">
            <>
              {formatBigNumber(amount, 18)} {NETWORK_SYMBOL(chainId)}{" "}
            </>
          </Typography>
        </Stack> */}

        <Stack
          spacing={1}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography>
            <FormattedMessage
              id="transaction.cost"
              defaultMessage="Transaction cost"
            />
          </Typography>

          <Stack
            spacing={1}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography color="text.secondary">
              <>
                <FormattedNumber
                  currencyDisplay="narrowSymbol"
                  style="currency"
                  value={totalFiat}
                  currency={currency}
                />{" "}
                ({formatBigNumber(totalFee, 18)} {NETWORK_SYMBOL(chainId)})
              </>
            </Typography>
            <Tooltip
              title={
                <>
                  <FormattedMessage
                    id="gas.gas"
                    defaultMessage="Gas: {gas}"
                    values={{
                      gas: gasPriceQuery.data
                        ? formatBigNumber(gasPriceQuery.data, 9)
                        : "0.0",
                    }}
                  />
                </>
              }
            >
              <Info fontSize="inherit" />
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
