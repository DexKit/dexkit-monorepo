import { Token } from "@dexkit/core/types";
import {
  Box,
  Button,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber, providers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import { ChainId, useApproveToken, useTokenAllowanceQuery } from "@dexkit/core";
import { UserEvents } from "@dexkit/core/constants/userEvents";
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
import { useMutation } from "@tanstack/react-query";
import { EXCHANGE_NOTIFICATION_TYPES } from "../../constants/messages";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import LazyDecimalInput from "./LazyDecimalInput";
import ReviewMarketOrderDialog from "./ReviewMarketOrderDialog";
export interface MarketSellFormProps {
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
export default function MarketSellForm({
  chainId,
  quoteToken,
  baseToken,
  account,
  signer,
  baseTokenBalance,
  affiliateAddress,
  quoteTokenBalance,
  buyTokenPercentageFee,
  feeRecipient,
  isActive,
}: MarketSellFormProps) {
  const handleChangeAmount = (value?: string) => {
    setAmount(value);
  };

  const { createNotification } = useDexKitContext();
  const [amount, setAmount] = useState<string | undefined>("0.0");

  const baseTokenBalanceFormatted = useMemo(() => {
    if (baseTokenBalance) {
      return formatBigNumber(baseTokenBalance, baseToken.decimals);
    }

    return "0.0";
  }, [baseTokenBalance, baseToken]);

  const quoteMutation = useZrxQuoteMutation({ chainId });

  const [quote, setQuote] = useState<ZeroExQuoteResponse>();

  const [receiveAmountFormatted, hasSufficientBalance] = useMemo(() => {
    if (quote && baseTokenBalance) {
      const total = formatBigNumber(
        BigNumber.from(quote.buyAmount),
        quoteToken.decimals
      );

      const hasAmount = baseTokenBalance?.gte(BigNumber.from(quote.sellAmount));

      return [total, hasAmount, quoteToken];
    }

    return ["0.0", false];
  }, [quote, quoteTokenBalance, quoteToken]);

  const approveMutation = useApproveToken();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    signer,
    spender: SUPPORTED_UNISWAP_V2.includes(chainId as number)
      ? quote?.to
      : quote?.issues.allowance.spender,
    tokenAddress: quote?.sellToken,
  });

  useEffect(() => {
    (async () => {
      if (amount && Number(amount) > 0) {
        let theNewQuote = await quoteMutation.mutateAsync({
          sellToken: baseToken.address,
          buyToken: quoteToken.address,
          affiliateAddress: affiliateAddress ? affiliateAddress : "",
          sellAmount: parseUnits(amount, baseToken.decimals).toString(),
          slippagePercentage: 0.01,
          feeRecipient,
          taker: account!,
          chainId: chainId!,
          buyTokenPercentageFee: buyTokenPercentageFee
            ? buyTokenPercentageFee / 100
            : undefined,
        });

        if (theNewQuote) {
          setQuote(theNewQuote);
        }
      }
    })();
  }, [amount, quoteToken, baseToken, affiliateAddress, feeRecipient]);

  const [showReview, setShowReview] = useState(false);

  const [hash, setHash] = useState<string>();

  const waitTxResult = useWaitTransactionConfirmation({
    transactionHash: hash,
    signer,
  });
  const trackUserEvent = useTrackUserEventsMutation();

  const sendTxMutation = useMutation(async () => {
    if (amount && signer) {
      let res = await signer?.sendTransaction({
        data: quote?.data,
        to: quote?.to,
        value: BigNumber.from(quote?.value),
      });
      const subType = "marketSell";

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
          buyAmount: receiveAmountFormatted,
          buyTokenSymbol: quoteToken.symbol.toUpperCase(),
        },
      });

      trackUserEvent.mutate({
        event: UserEvents.marketSell,
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

  const handleConfirm = async () => {
    await sendTxMutation.mutateAsync();
  };

  const handleExecute = () => {
    setShowReview(true);
  };

  const handleApprove = async () => {
    await approveMutation.mutateAsync({
      onSubmited: (hash: string) => { },
      amount: BigNumber.from(quote?.sellAmount),
      signer,
      spender: SUPPORTED_UNISWAP_V2.includes(chainId as number)
        ? quote?.to
        : quote?.issues.allowance.spender,
      tokenContract: quote?.sellToken,
    });
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
            values={{ symbol: baseToken.symbol.toUpperCase() }}
          />
        ) : (
          <FormattedMessage
            id="sell.symbol"
            defaultMessage="Sell {symbol}"
            values={{ symbol: baseToken.symbol.toUpperCase() }}
          />
        )}
      </Button>
    );
  }, [
    chainId,
    connector,
    providerChainId,
    hasSufficientBalance,
    baseToken,
    handleExecute,
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
        hash={hash}
        price={quote?.price}
        quoteToken={quoteToken}
        baseToken={baseToken}
        baseAmount={
          quote?.sellAmount
            ? BigNumber.from(quote?.sellAmount)
            : BigNumber.from("0")
        }
        quoteAmount={
          quote?.sellAmount
            ? BigNumber.from(quote?.buyAmount)
            : BigNumber.from("0")
        }
        side="sell"
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
              {baseTokenBalanceFormatted} {baseToken.symbol.toUpperCase()}
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
                    <FormattedMessage
                      id="You will.receive"
                      defaultMessage="You will receive"
                    />
                  </Typography>
                  <Typography color="text.secondary">
                    {quoteMutation.isLoading ? (
                      <Skeleton />
                    ) : (
                      <>
                        {receiveAmountFormatted}{" "}
                        {quoteToken.symbol.toUpperCase()}
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
