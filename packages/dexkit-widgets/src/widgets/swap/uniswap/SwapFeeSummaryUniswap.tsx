import { ChainId } from "@dexkit/core/constants/enums";
import { NETWORK_COIN_SYMBOL } from "@dexkit/core/constants/networks";
import { ExpandMore, Info } from "@mui/icons-material";
import {
  Box,
  Collapse,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { BigNumber, constants, providers } from "ethers";
import { useMemo, useState } from "react";
import { FormattedMessage, FormattedNumber } from "react-intl";

import { GET_NATIVE_TOKEN } from "@dexkit/core/constants";
import { Token } from "@dexkit/core/types";
import { formatStringNumber } from "@dexkit/core/utils";
import { formatEther } from "@dexkit/core/utils/ethers/formatEther";
import { ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { useCoinPrices, useGasPrice } from "../../../hooks";
import { formatBigNumber } from "../../../utils";

import ExpandLess from "@mui/icons-material/ExpandLess";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";

export interface SwapFeeSummaryUniswapProps {
  quote?: ZeroExQuoteResponse | null;
  chainId?: ChainId;
  currency: string;
  sellToken?: Token;
  buyToken?: Token;
  provider?: providers.BaseProvider;
}

export default function SwapFeeSummaryUniswap({
  quote,
  chainId,
  currency,
  sellToken,
  buyToken,
  provider,
}: SwapFeeSummaryUniswapProps) {
  const coinPrices = useCoinPrices({
    currency,
    tokens: chainId ? [GET_NATIVE_TOKEN(chainId)] : [],
    chainId,
  });

  const maxFee = useMemo(() => {
    if (quote && quote?.gas && quote?.gasPrice) {
      return BigNumber.from(quote.gas).mul(quote.gasPrice);
    }

    return BigNumber.from(0);
  }, [quote]);

  const amount = useMemo(() => {
    if (quote && quote?.value) {
      return BigNumber.from(quote.value);
    }

    return BigNumber.from(0);
  }, [quote]);

  const totalFee = useMemo(() => {
    return maxFee;
  }, [amount, maxFee]);

  const totalFiat = useMemo(() => {
    const amount = parseFloat(formatEther(totalFee));

    if (coinPrices.data && chainId && currency) {
      const t = coinPrices.data[chainId];

      if (t) {
        const price = t[constants.AddressZero];

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
    if (buyToken && sellToken && quote && quote.sellAmount && quote.buyAmount) {
      const sellAmount = parseFloat(
        formatBigNumber(BigNumber.from(quote.sellAmount), sellToken.decimals),
      );
      const buyAmount = parseFloat(
        formatBigNumber(BigNumber.from(quote.buyAmount), buyToken.decimals),
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

  const [showSummary, setShowSummary] = useState(false);

  return (
    <Box>
      <Stack spacing={0.5}>
        {sellToken && buyToken && sellTokenByBuyToken > 0 && (
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {toggleSide ? (
              <Typography
                variant="caption"
                component="div"
                onClick={handelToggle}
                sx={{ cursor: "pointer" }}
              >
                1 {sellToken?.symbol.toUpperCase()} ={" "}
                {formatStringNumber(sellTokenByBuyToken.toString())}{" "}
                {buyToken?.symbol.toUpperCase()}
              </Typography>
            ) : (
              <Typography
                variant="caption"
                component="div"
                onClick={handelToggle}
                sx={{ cursor: "pointer" }}
              >
                1 {buyToken?.symbol.toUpperCase()} ={" "}
                {formatStringNumber(sellTokenByBuyToken.toString())}{" "}
                {sellToken?.symbol.toUpperCase()}
              </Typography>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              {!showSummary && (
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <LocalGasStationIcon
                    sx={{ color: (theme) => theme.palette.grey[300] }}
                    fontSize="inherit"
                  />
                  <Typography variant="body2" color="text.secondary">
                    <FormattedNumber
                      currencyDisplay="narrowSymbol"
                      style="currency"
                      value={totalFiat}
                      currency={currency}
                    />
                  </Typography>
                </Stack>
              )}
              <IconButton
                size="small"
                onClick={() => setShowSummary((value) => !value)}
              >
                {showSummary ? (
                  <ExpandLess fontSize="small" />
                ) : (
                  <ExpandMore fontSize="small" />
                )}
              </IconButton>
            </Stack>
          </Stack>
        )}

        <Collapse in={showSummary}>
          <Stack spacing={0.5}>
            <Stack
              spacing={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography color="text.secondary" variant="body2">
                <FormattedMessage
                  id="price.impact"
                  defaultMessage="Price impact"
                />
              </Typography>
              <Stack
                spacing={1}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="body2"
                  sx={(theme) => ({
                    color:
                      priceImpact > 10
                        ? theme.palette.error.main
                        : theme.palette.text.primary,
                  })}
                >
                  {priceImpact}%{" "}
                </Typography>
                <Tooltip
                  title={
                    <FormattedMessage
                      id="price.impact.swap.message.info"
                      defaultMessage="Price impact refers to the fluctuation in the price of a coin that happens when a trade takes place. When the price impact is high, it can sometimes lead to buying coins at a price lower than what was initially expected."
                    />
                  }
                >
                  <Info fontSize="inherit" />
                </Tooltip>
              </Stack>
            </Stack>

            <Stack
              spacing={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="text.secondary">
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
                <Typography variant="body2">
                  <>
                    <FormattedNumber
                      currencyDisplay="narrowSymbol"
                      style="currency"
                      value={totalFiat}
                      currency={currency}
                    />{" "}
                    ({formatBigNumber(totalFee, 18)}{" "}
                    {NETWORK_COIN_SYMBOL(chainId)})
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
        </Collapse>
      </Stack>
    </Box>
  );
}
