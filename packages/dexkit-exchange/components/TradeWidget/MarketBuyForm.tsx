import { ChainId, useApproveToken, useTokenAllowanceQuery } from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
import { Token } from "@dexkit/core/types";
import { formatBigNumber, getChainName } from "@dexkit/core/utils";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import {
  useDexKitContext,
  useSwitchNetworkMutation,
  useWaitTransactionConfirmation,
} from "@dexkit/ui/hooks";
import { useTrackUserEventsMutation } from "@dexkit/ui/hooks/userEvents";
import { SUPPORTED_UNISWAP_V2 } from "@dexkit/ui/modules/swap/constants";
import { ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import { AppNotificationType } from "@dexkit/ui/types";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import {
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { BigNumber, providers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { EXCHANGE_NOTIFICATION_TYPES } from "../../constants/messages";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import { getZrxExchangeAddress } from "../../utils";
import LazyDecimalInput from "./LazyDecimalInput";
import ReviewMarketOrderDialog from "./ReviewMarketOrderDialog";
export interface MarketBuyFormProps {
  quoteToken: Token;
  baseToken: Token;
  signer?: providers.JsonRpcSigner;
  account?: string;
  baseTokenBalance?: BigNumber;
  quoteTokenBalance?: BigNumber;
  feeRecipient?: string;
  buyTokenPercentageFee?: number;
  affiliateAddress?: string;
  chainId?: ChainId;
  isActive?: boolean;
}

/**
 *
 * TODO: REMOVE THIS COMPONENT
 *
 *
 *
 * @returns
 */

export default function MarketBuyForm({
  chainId,
  baseToken: baseToken,
  quoteToken: quoteToken,
  account,
  signer,
  baseTokenBalance,
  affiliateAddress,
  quoteTokenBalance,
  buyTokenPercentageFee,
  feeRecipient,
  isActive,
}: MarketBuyFormProps) {
  const { createNotification } = useDexKitContext();
  const [showReview, setShowReview] = useState(false);

  const handleChangeAmount = useCallback((value?: string) => {
    setAmount(value);
  }, []);

  const [amount, setAmount] = useState<string | undefined>("0.0");

  const quoteTokenBalanceFormatted = useMemo(() => {
    if (quoteTokenBalance) {
      return formatBigNumber(quoteTokenBalance, quoteToken.decimals);
    }

    return "0.0";
  }, [quoteTokenBalance, quoteToken]);

  const quoteMutation = useZrxQuoteMutation({ chainId });

  const [quote, setQuote] = useState<ZeroExQuoteResponse>();

  const [formattedCost, hasSufficientBalance] = useMemo(() => {
    if (quote && quoteTokenBalance) {
      const total = formatBigNumber(
        BigNumber.from(quote.sellAmount),
        quoteToken.decimals
      );

      const hasAmount = quoteTokenBalance.gte(BigNumber.from(quote.sellAmount));

      return [total, hasAmount];
    }

    return ["0.0", false];
  }, [quote, quoteTokenBalance, quoteToken]);

  const approveMutation = useApproveToken();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    signer,
    spender: SUPPORTED_UNISWAP_V2.includes(chainId as number)
      ? quote?.to
      : getZrxExchangeAddress(chainId),
    tokenAddress: quote?.sellToken,
  });

  useEffect(() => {
    (async () => {
      if (amount && Number(amount) > 0) {
        let newQuote = await quoteMutation.mutateAsync({
          buyToken: baseToken.address,
          sellToken: quoteToken.address,
          affiliateAddress: affiliateAddress ? affiliateAddress : "",
          buyAmount: parseUnits(amount, baseToken.decimals).toString(),
          skipValidation: showReview ? false : true,
          slippagePercentage: 0.01,
          feeRecipient,
          buyTokenPercentageFee,
        });

        if (newQuote) {
          setQuote(newQuote);
        }
      }
    })();
  }, [amount, isActive, showReview]);

  const [hash, setHash] = useState<string>();
  const trackUserEvent = useTrackUserEventsMutation();
  const waitTxResult = useWaitTransactionConfirmation({
    transactionHash: hash,
    signer,
  });

  const sendTxMutation = useMutation(async () => {
    if (amount && signer) {
      let res = await signer?.sendTransaction({
        data: quote?.data,
        to: quote?.to,
        value: BigNumber.from(quote?.value),
      });
      const subType = "marketBuy";
      const messageType = EXCHANGE_NOTIFICATION_TYPES[
        subType
      ] as AppNotificationType;
      createNotification({
        type: "transaction",
        icon: messageType.icon,
        subtype: subType,
        metadata: {
          hash: res?.hash,
          chainId: chainId,
        },
        values: {
          sellAmount: amount,
          sellTokenSymbol: baseToken.symbol.toUpperCase(),
          buyAmount: formattedCost,
          buyTokenSymbol: quoteToken.symbol.toUpperCase(),
        },
      });
      trackUserEvent.mutate({
        event: UserEvents.marketBuy,
        hash: res?.hash,
        chainId,
        metadata: JSON.stringify({
          quote,
        }),
      });

      setHash(res?.hash);
    }
  });

  const handleCloseReview = () => {
    setShowReview(false);
  };

  const handleApprove = async () => {
    await approveMutation.mutateAsync({
      onSubmited: (hash: string) => { },
      amount: BigNumber.from(quote?.sellAmount),
      signer,
      spender: SUPPORTED_UNISWAP_V2.includes(chainId as number)
        ? quote?.to
        : getZrxExchangeAddress(chainId),
      tokenContract: quote?.sellToken,
    });
  };

  const handleConfirm = async () => {
    await sendTxMutation.mutateAsync();
  };

  const handleExecute = () => {
    setShowReview(true);
  };

  const { chainId: providerChainId, connector } = useWeb3React();
  const switchNetworkMutation = useSwitchNetworkMutation();

  const renderActionButton = useCallback(() => {
    if (providerChainId && chainId && providerChainId !== chainId) {
      return (
        <Button
          disabled={switchNetworkMutation.isLoading}
          size="large"
          fullWidth
          variant="contained"
          onClick={async () => {
            switchNetworkMutation.mutateAsync({ chainId });
          }}
        >
          <FormattedMessage
            id="switch.to.network"
            defaultMessage="Switch to {network}"
            values={{ network: getChainName(chainId) }}
          />
        </Button>
      );
    }

    return (
      <Button
        disabled={quoteMutation.isLoading || !hasSufficientBalance}
        size="large"
        fullWidth
        variant="contained"
        onClick={handleExecute}
      >
        {!hasSufficientBalance ? (
          <FormattedMessage
            id="insufficient"
            defaultMessage="Insufficient {symbol}"
            values={{ symbol: quoteToken.symbol.toUpperCase() }}
          />
        ) : (
          <FormattedMessage
            id="buy.symbol"
            defaultMessage="Buy {symbol}"
            values={{ symbol: baseToken.symbol.toUpperCase() }}
          />
        )}
      </Button>
    );
  }, [
    chainId,
    connector,
    providerChainId,
    baseToken,
    quoteToken,
    handleExecute,
    hasSufficientBalance,
  ]);

  return (
    <>
      <ReviewMarketOrderDialog
        DialogProps={{
          open: showReview,
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleCloseReview,
        }}
        isApproving={approveMutation.isLoading}
        isApproval={
          tokenAllowanceQuery.data !== null &&
          tokenAllowanceQuery.data?.lt(BigNumber.from(quote?.sellAmount || "0"))
        }
        chainId={chainId}
        price={quote?.price}
        hash={hash}
        quoteToken={quoteToken}
        baseToken={baseToken}
        baseAmount={
          quote?.sellAmount
            ? BigNumber.from(quote?.buyAmount)
            : BigNumber.from("0")
        }
        quoteAmount={
          quote?.sellAmount
            ? BigNumber.from(quote?.sellAmount)
            : BigNumber.from("0")
        }
        side="buy"
        isPlacingOrder={sendTxMutation.isLoading || waitTxResult.isFetching}
        onConfirm={handleConfirm}
        onApprove={handleApprove}
      />
      <Box>
        <Grid container spacing={2}>
          <Grid size={12}>
            <LazyDecimalInput onChange={handleChangeAmount} token={baseToken} />
          </Grid>
          <Grid size={12}>
            <Typography variant="body2">
              <FormattedMessage id="available" defaultMessage="Available" />:{" "}
              {quoteTokenBalanceFormatted} {quoteToken.symbol.toUpperCase()}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Divider />
          </Grid>
          <Grid size={12}>
            <Box>
              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography>
                    <FormattedMessage id="cost" defaultMessage="Cost" />
                  </Typography>
                  <Typography color="text.secondary">
                    {quoteMutation.isLoading ? (
                      <Skeleton />
                    ) : (
                      <>
                        {formattedCost} {quoteToken.symbol.toUpperCase()}
                      </>
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid size={12}>
            {renderActionButton()}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
