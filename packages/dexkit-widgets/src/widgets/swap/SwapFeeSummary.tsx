import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORK_COIN_SYMBOL } from "@dexkit/core/constants/networks";
import { Info, Sync } from "@mui/icons-material";
import { Box, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { BigNumber, constants, providers } from "ethers";
import { useMemo, useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

import { GET_NATIVE_TOKEN } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { formatEther } from "@dexkit/core/utils/ethers/formatEther";
import {
  ZeroExGaslessQuoteResponse,
  ZeroExQuoteResponse,
} from "@dexkit/ui/modules/swap/types";
import { useCoinPrices, useGasPrice } from "../../hooks";
import { formatBigNumber } from "../../utils";

export interface SwapFeeSummaryProps {
  quote?: ZeroExQuoteResponse | ZeroExGaslessQuoteResponse | null;
  chainId?: ChainId;
  currency: string;
  sellToken?: Token;
  buyToken?: Token;
  provider?: providers.BaseProvider;
  swapFees?: {
    recipient: string;
    amount_percentage: number;
  };
}

export default function SwapFeeSummary({
  quote,
  chainId,
  currency,
  sellToken,
  buyToken,
  provider,
  swapFees,
}: SwapFeeSummaryProps) {
  const coinPrices = useCoinPrices({
    currency,
    tokens: chainId ? [GET_NATIVE_TOKEN(chainId)] : [],
    chainId,
  });

  const maxFee = useMemo(() => {
    const { fees } = (quote as ZeroExQuoteResponse) || {};
    if (fees) {
      return BigNumber.from(fees.gasFee?.amount || 0)
        .add(BigNumber.from(fees.integratorFee?.amount || 0))
        .add(BigNumber.from(fees.zeroExFee?.amount || 0));
    }

    return BigNumber.from(0);
  }, [quote]);

  const amount = useMemo(() => {
    if (quote && quote?.value) {
      return BigNumber.from(quote.value);
    }

    return BigNumber.from(0);
  }, [quote]);

  const totalFiat = useMemo(() => {
    const amount = parseFloat(formatEther(maxFee));

    if (coinPrices.data && chainId && currency) {
      const t = coinPrices.data[chainId];

      if (t) {
        const price = t[constants.AddressZero];

        return amount * price[currency];
      }
    }

    return 0;
  }, [maxFee, coinPrices.data, chainId, currency]);

  const [toggleSide, setToggleSide] = useState(false);

  const gasPriceQuery = useGasPrice({ provider });

  const handelToggle = () => setToggleSide((value) => !value);

  const sellTokenByBuyToken = useMemo(() => {
    if (buyToken && sellToken && quote && quote.sellAmount && quote.buyAmount) {
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

  /* const fiatNativePrice = useMemo(() => {
  if (coinPrices.data && chainId && currency) {
    const t = coinPrices.data[chainId];

    if (t) {
      const price = t[constants.AddressZero];
      return price[currency];
    }
  }
}, [coinPrices.data, chainId, currency]);*/

  /*const unitPriceFiat = useMemo(() => {
    if (
      buyToken &&
      sellToken &&
      quote &&
      fiatNativePrice &&
      quote.sellTokenToEthRate &&
      quote.buyTokenToEthRate
    ) {
      return toggleSide
        ? Number(fiatNativePrice) / Number(quote.sellTokenToEthRate || 0)
        : Number(fiatNativePrice) / Number(quote.buyTokenToEthRate || 0);
    }
  }, [sellToken, buyToken, quote, toggleSide, fiatNativePrice]);*/

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
            {/*unitPriceFiat && (
              <Typography variant="body2">
                (
                <FormattedNumber
                  currencyDisplay="narrowSymbol"
                  style="currency"
                  value={unitPriceFiat}
                  currency={currency}
                />
                )
              </Typography>
            )*/}
            <IconButton onClick={handelToggle} size="small">
              <Sync fontSize="inherit" />
            </IconButton>
          </Stack>
        )}

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
                ({formatBigNumber(maxFee, 18)} {NETWORK_COIN_SYMBOL(chainId)})
              </>
            </Typography>
            <Tooltip
              title={
                <>
                  <FormattedMessage
                    id="gas.gas"
                    defaultMessage="Gas: {gas} Gwei"
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
