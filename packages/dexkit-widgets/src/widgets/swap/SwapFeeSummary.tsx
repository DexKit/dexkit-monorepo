import { Info } from "@mui/icons-material";
import { Box, Stack, Tooltip, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { GET_NATIVE_TOKEN } from "../../constants";
import { ChainId } from "../../constants/enum";
import { NETWORK_SYMBOL } from "../../constants/networks";
import { useCoinPrices } from "../../hooks";
import { ZeroExQuoteResponse } from "../../services/zeroex/types";
import { Token } from "../../types";
import { formatBigNumber } from "../../utils";

export interface SwapFeeSummaryProps {
  quote?: ZeroExQuoteResponse | null;
  chainId?: ChainId;
  currency: string;
  sellToken?: Token;
  buyToken?: Token;
}

export default function SwapFeeSummary({
  quote,
  chainId,
  currency,
  sellToken,
  buyToken,
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

  const sellTokenByBuyToken = useMemo(() => {
    if (buyToken && sellToken && quote) {
      const sellAmount = parseFloat(
        formatBigNumber(BigNumber.from(quote.sellAmount), sellToken.decimals)
      );
      const buyAmount = parseFloat(
        formatBigNumber(BigNumber.from(quote.buyAmount), buyToken.decimals)
      );

      return sellAmount / buyAmount;
    }

    return 0.0;
  }, [sellToken, buyToken, quote]);

  const total = useMemo(() => {}, [sellTokenByBuyToken]);

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

        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            1 {buyToken?.symbol.toUpperCase()} = {sellTokenByBuyToken}{" "}
            {sellToken?.symbol.toUpperCase()}
          </Typography>
          <Typography color="text.secondary"></Typography>
        </Stack>

        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            <FormattedMessage id="price.impact" defaultMessage="Price impact" />
          </Typography>
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
            <Tooltip
              title={
                <FormattedMessage
                  id="you.will.lose.a.large.portion.of.your.money.to.complete.the.transaction"
                  defaultMessage="You will lose a large portion of your money to complete the transaction"
                />
              }
            >
              <Info fontSize="inherit" />
            </Tooltip>
          </Typography>
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

        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            <FormattedMessage
              id="transaction.cost"
              defaultMessage="Transaction cost"
            />
          </Typography>
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
        </Stack>
      </Stack>
    </Box>
  );
}
