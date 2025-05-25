import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import DecimalInput from "./DecimalInput";

import { useSnackbar } from "notistack";

import { ChainId, useApproveToken, useTokenAllowanceQuery } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { formatBigNumber, getChainName } from "@dexkit/core/utils";
import { formatUnits } from "@dexkit/core/utils/ethers/formatUnits";
import { parseUnits } from "@dexkit/core/utils/ethers/parseUnits";
import { useSwitchNetworkMutation } from "@dexkit/ui/hooks";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import RefreshIcon from "@mui/icons-material/Refresh";
import { BigNumber, providers } from "ethers";
import { ORDER_LIMIT_DURATIONS } from "../../constants";
import { useSendLimitOrderMutation } from "../../hooks";
import { useZrxQuoteMutation } from "../../hooks/zrx";
import { BigNumberUtils, getZrxExchangeAddress } from "../../utils";
import DurationSelect from "./DurationSelect";
import ReviewOrderDialog from "./ReviewOrderDialog";

export interface BuyFormProps {
  chainId?: ChainId;
  quoteToken: Token;
  baseToken: Token;
  slippage?: number;
  quoteTokenBalance?: BigNumber;
  maker?: string;
  provider?: providers.Web3Provider;
  buyTokenPercentageFee?: number;
  feeRecipient?: string;
  affiliateAddress?: string;
}

export default function BuyForm({
  quoteToken: quoteToken,
  baseToken: baseToken,
  quoteTokenBalance,
  buyTokenPercentageFee,
  slippage,
  affiliateAddress,
  feeRecipient,
  maker,
  provider,
  chainId,
}: BuyFormProps) {
  const [amount, setAmount] = useState<string | undefined>("0.0");
  const [amountPerToken, setAmountPerToken] = useState<string | undefined>(
    "0.0"
  );
  const [duration, setDuration] = useState(ORDER_LIMIT_DURATIONS[0].value);

  const [showReview, setShowReview] = useState(false);

  const handleChangeAmount = (value?: string) => setAmount(value);

  const handleChangeAmountPerToken = (value?: string) =>
    setAmountPerToken(value);

  const handleChangeDuration = (value: number) => setDuration(value);

  const parsedAmount = useMemo(() => {
    if (amount) {
      return amount !== "" ? amount : "0.0";
    }
  }, [amount]);

  const parsedAmountPerToken = useMemo(() => {
    return parseUnits(amountPerToken || "0.0", quoteToken.decimals);
  }, [amountPerToken, quoteToken]);

  const cost = useMemo(() => {
    if (parsedAmount) {
      return new BigNumberUtils().multiply(parsedAmountPerToken, parsedAmount);
    }
  }, [parsedAmountPerToken, parsedAmount]);

  const hasSufficientBalance = useMemo(() => {
    if (cost) {
      return quoteTokenBalance?.gte(cost) && !cost.isZero();
    }
  }, [cost, quoteTokenBalance]);

  const formattedCost = useMemo(() => {
    return formatBigNumber(cost, quoteToken.decimals);
  }, [quoteToken, cost]);

  const buttonMessage = useMemo(() => {
    if (!amount || amount === "0.0") {
      return <FormattedMessage id="fill.amount" defaultMessage="Fill amount" />;
    }

    if (!amountPerToken || amountPerToken === "0.0") {
      return (
        <FormattedMessage
          id="fill.amount.per.token"
          defaultMessage="Fill amount per token"
        />
      );
    }

    if (!hasSufficientBalance) {
      return (
        <FormattedMessage
          id="insufficient.symbol"
          defaultMessage="insufficient {symbol}"
          values={{ symbol: quoteToken.symbol }}
        />
      );
    }

    return (
      <FormattedMessage
        id="buy.symbol"
        defaultMessage="buy {symbol}"
        values={{ symbol: baseToken.symbol }}
      />
    );
  }, [hasSufficientBalance, baseToken, quoteToken, cost]);

  const quoteMutation = useZrxQuoteMutation({ chainId });

  const handleQuotePrice = useCallback(async () => {
    const quote = await quoteMutation.mutateAsync({
      buyToken: baseToken.address,
      chainId: chainId!,
      sellToken: quoteToken.address,
      affiliateAddress: affiliateAddress ? affiliateAddress : "",
      buyAmount: parseUnits("1.0", baseToken.decimals).toString(),
      slippagePercentage: slippage ? slippage / 100 : 0.01,
      feeRecipient,
      buyTokenPercentageFee,
      taker: maker || "",
    });

    const sellAmount = BigNumber.from(quote?.sellAmount || "0");

    setAmountPerToken(formatUnits(sellAmount, quoteToken.decimals));
  }, [baseToken, quoteToken]);

  const sendLimitOrderMutation = useSendLimitOrderMutation();

  const handleBuy = () => {
    setShowReview(true);
  };

  const { formatMessage } = useIntl();

  const { enqueueSnackbar } = useSnackbar();

  const takerAmount = useMemo(() => {
    if (parsedAmount) {
      return parseUnits(parsedAmount.toString(), baseToken.decimals);
    }
  }, [parsedAmount, baseToken]);

  const handleConfirmBuy = async () => {
    if (
      !chainId ||
      !maker ||
      !quoteToken ||
      !provider ||
      !cost ||
      !takerAmount
    ) {
      return;
    }

    try {
      await sendLimitOrderMutation.mutateAsync({
        chainId: chainId as number,
        expirationTime: duration,
        maker,
        makerAmount: cost.toString(),
        makerToken: quoteToken.address,
        provider,
        takerAmount: takerAmount.toString(),
        takerToken: baseToken.address,
      });
      enqueueSnackbar(
        formatMessage({
          id: "order.created.message",
          defaultMessage: "Order created",
        }),
        { variant: "success" }
      );
      setShowReview(false);
    } catch (err) {
      enqueueSnackbar(
        formatMessage({
          id: "order.failed",
          defaultMessage: "Order failed",
        }),
        { variant: "error" }
      );
    }
  };

  const handleCloseReview = () => {
    setShowReview(false);
  };

  const { account } = useWeb3React();

  const tokenAllowanceQuery = useTokenAllowanceQuery({
    account,
    provider,
    spender: getZrxExchangeAddress(chainId),
    tokenAddress: quoteToken?.address,
  });

  const approveTokenMutation = useApproveToken();

  const handleApprove = async () => {
    await approveTokenMutation.mutateAsync({
      onSubmited: (hash: string) => {},
      spender: getZrxExchangeAddress(chainId),
      provider,
      tokenContract: quoteToken?.address,
      amount: cost,
    });

    await tokenAllowanceQuery.refetch();
  };

  /*useEffect(() => {
    handleQuotePrice();
  }, [handleQuotePrice]);*/

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
        disabled={!hasSufficientBalance}
        onClick={handleBuy}
        fullWidth
        size="large"
        variant="contained"
      >
        {buttonMessage}
      </Button>
    );
  }, [
    chainId,
    buttonMessage,
    connector,
    providerChainId,
    baseToken,
    quoteToken,
    handleBuy,
    hasSufficientBalance,
  ]);

  return (
    <>
      <ReviewOrderDialog
        DialogProps={{
          open: showReview,
          maxWidth: "sm",
          fullWidth: true,
          onClose: handleCloseReview,
        }}
        total={cost}
        isApproving={approveTokenMutation.isLoading}
        isApproval={
          tokenAllowanceQuery.data !== null &&
          cost &&
          tokenAllowanceQuery.data?.lt(cost)
        }
        side="buy"
        baseAmount={takerAmount}
        amountPerToken={parsedAmountPerToken}
        quoteToken={quoteToken}
        baseToken={baseToken}
        isPlacingOrder={sendLimitOrderMutation.isLoading}
        onConfirm={handleConfirmBuy}
        onApprove={handleApprove}
        expiresIn={duration}
      />
      <Stack spacing={2}>
        <DecimalInput
          TextFieldProps={{
            label: <FormattedMessage id="amount" defaultMessage="Amount" />,
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  {baseToken.symbol.toUpperCase()}
                </InputAdornment>
              ),
            },
          }}
          decimals={baseToken.decimals}
          value={amount}
          onChange={handleChangeAmount}
        />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1">
            <FormattedMessage
              id="available.balance.amount.symbol"
              defaultMessage="Available: {amount} {symbol}"
              values={{
                amount: quoteTokenBalance
                  ? formatBigNumber(quoteTokenBalance, quoteToken.decimals)
                  : "0.0",
                symbol: quoteToken.symbol.toUpperCase(),
              }}
            />
          </Typography>
          <IconButton onClick={handleQuotePrice} size="small">
            <RefreshIcon />
          </IconButton>
        </Stack>
        <DecimalInput
          TextFieldProps={{
            label: (
              <FormattedMessage
                id="amount.per.token"
                defaultMessage="Amount per token"
              />
            ),
            InputProps: {
              endAdornment: (
                <InputAdornment position="end">
                  {quoteToken.symbol.toUpperCase()}
                </InputAdornment>
              ),
            },
          }}
          decimals={quoteToken.decimals}
          value={amountPerToken}
          onChange={handleChangeAmountPerToken}
        />
        <DurationSelect
          SelectProps={{
            label: (
              <FormattedMessage id="expires.in" defaultMessage="Expires in" />
            ),
          }}
          value={duration}
          onChange={handleChangeDuration}
        />
        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body1">
            <FormattedMessage id="cost" defaultMessage="Cost" />
          </Typography>
          <Typography variant="body1">
            {formattedCost} {quoteToken.symbol.toUpperCase()}
          </Typography>
        </Stack>

        {renderActionButton()}
      </Stack>
    </>
  );
}
