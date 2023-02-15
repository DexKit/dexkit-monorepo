import { Box, Stack, Typography } from "@mui/material";
import { BigNumber, ethers } from "ethers";
import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";
import { currencyAtom } from "../../components/atoms";
import { GET_NATIVE_TOKEN } from "../../constants";
import { ChainId } from "../../constants/enum";
import { NETWORK_SYMBOL } from "../../constants/networks";
import { useCoinPrices } from "../../hooks";
import { ZeroExQuoteResponse } from "../../services/zeroex/types";
import { formatBigNumber } from "../../utils";

export interface SwapFeeSummaryProps {
  quote?: ZeroExQuoteResponse | null;
  chainId?: ChainId;
}

export default function SwapFeeSummary({
  quote,
  chainId,
}: SwapFeeSummaryProps) {
  const currency = useAtomValue(currencyAtom);

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

  return (
    <Box>
      <Stack spacing={1}>
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            <FormattedMessage id="gas.price" defaultMessage="Gas Price" />
          </Typography>
          <Typography color="text.secondary">
            <>
              {formatBigNumber(maxFee, 18)} {NETWORK_SYMBOL(chainId)}
            </>
          </Typography>
        </Stack>
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            <FormattedMessage id="gas.price" defaultMessage="Amount" />
          </Typography>
          <Typography color="text.secondary">
            <>
              {formatBigNumber(amount, 18)} {NETWORK_SYMBOL(chainId)}
            </>
          </Typography>
        </Stack>

        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            <FormattedMessage id="price.impact" defaultMessage="Price impact" />
          </Typography>
          <Typography color="text.secondary">{priceImpact}%</Typography>
        </Stack>

        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Typography>
            <FormattedMessage id="total" defaultMessage="Total" />
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
