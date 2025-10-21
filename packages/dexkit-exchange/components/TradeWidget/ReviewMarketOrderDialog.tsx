import { ChainId } from "@dexkit/core";
import { Token } from "@dexkit/core/types";
import { formatBigNumber, getBlockExplorerUrl } from "@dexkit/core/utils";
import { AppDialogTitle } from "@dexkit/ui/components/AppDialogTitle";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import ErrorIcon from "@mui/icons-material/Error";

export interface ReviewMarketOrderDialogProps {
  DialogProps: DialogProps;
  canGasless?: boolean;
  isPlacingOrder?: boolean;
  quoteAmount?: BigNumber;
  baseAmount?: BigNumber;
  price?: string;
  quoteToken?: Token;
  pendingHash?: string;
  baseToken?: Token;
  side?: "sell" | "buy";
  hash?: string;
  chainId?: ChainId;
  reasonFailedGasless?: string;
  onConfirm: () => void;
}

export default function ReviewMarketOrderDialog({
  DialogProps,
  quoteToken,
  quoteAmount,
  isPlacingOrder,
  price,
  baseToken,
  onConfirm,
  reasonFailedGasless,
  side,
  baseAmount: amount,
  chainId,
  canGasless,
  hash,
  pendingHash,
}: ReviewMarketOrderDialogProps) {
  const [swapPrices, setSwapPrices] = useState(true);

  const pricePerTokenFormatted = useMemo(() => {
    if (quoteAmount && amount && amount.gt(0)) {
      const sellAmount = parseFloat(
        formatBigNumber(BigNumber.from(quoteAmount), quoteToken?.decimals)
      );

      const buyAmount = parseFloat(
        formatBigNumber(BigNumber.from(amount), baseToken?.decimals)
      );
      const division = swapPrices
        ? sellAmount / buyAmount
        : buyAmount / sellAmount;

      return new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
      }).format(division || 0);
    }
  }, [quoteAmount, amount, swapPrices]);

  const amountFormatted = useMemo(() => {
    if (amount) {
      return formatBigNumber(amount, baseToken?.decimals);
    }
  }, [amount, baseToken]);

  const total = useMemo(() => {
    if (quoteAmount) {
      return formatBigNumber(quoteAmount, quoteToken?.decimals);
    }
  }, [quoteAmount, quoteToken]);

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const gaslessConfirmed = canGasless && hash && !isPlacingOrder;
  const gaslessPending = canGasless && pendingHash;

  const renderActions = () => {
    return (
      <Stack spacing={1} direction={"row"} justifyContent={"center"}>
        {reasonFailedGasless ? (
          <Button
            size="large"
            onClick={handleClose}
            variant="contained"
            color="primary"
          >
            <FormattedMessage id="back" defaultMessage="Back" />
          </Button>
        ) : (
          <Button
            size="large"
            startIcon={
              isPlacingOrder && !gaslessConfirmed ? (
                <CircularProgress size="1rem" color="inherit" />
              ) : undefined
            }
            disabled={isPlacingOrder && !gaslessConfirmed}
            onClick={gaslessConfirmed ? handleClose : onConfirm}
            variant="contained"
            color="primary"
          >
            {gaslessConfirmed ? (
              <FormattedMessage id="new.trade" defaultMessage="New trade" />
            ) : (
              <FormattedMessage id="place.order" defaultMessage="Place Order" />
            )}
          </Button>
        )}
        {(hash || pendingHash) && (
          <Button
            size="large"
            href={`${getBlockExplorerUrl(chainId)}/tx/${hash || pendingHash}`}
            target="_blank"
            variant="outlined"
            color="primary"
          >
            <FormattedMessage
              id="view.transaction"
              defaultMessage="View transaction"
            />
          </Button>
        )}
      </Stack>
    );
  };

  const handleSwapPrices = () => setSwapPrices((val: any) => !val);

  const dialogTitle = () => {
    if (gaslessPending) {
      return (
        <FormattedMessage
          id="confirming.trade"
          defaultMessage="Confirming trade"
        />
      );
    }

    if (gaslessConfirmed) {
      return (
        <FormattedMessage
          id="trade.confirmed"
          defaultMessage="Trade confirmed"
        />
      );
    }
    if (reasonFailedGasless) {
      return (
        <FormattedMessage id="trade.failed" defaultMessage="Trade failed" />
      );
    }

    return <FormattedMessage id="review.order" defaultMessage="Review Order" />;
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle title={dialogTitle()} onClose={handleClose} />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          {gaslessConfirmed && (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="body1">
                <FormattedMessage
                  id="trade.confirmed"
                  defaultMessage="Trade confirmed"
                />
              </Typography>
            </Stack>
          )}

          {reasonFailedGasless && (
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
            >
              <ErrorIcon color="success" sx={{ fontSize: 60 }} />
              <Typography variant="body1">
                <FormattedMessage
                  id="trade.gasless.failed.reason.explanation"
                  defaultMessage="Trade failed reason: {reason}"
                  values={{ reason: reasonFailedGasless.split("_").join(" ") }}
                />
              </Typography>
            </Stack>
          )}

          <Stack>
            <Typography align="center" variant="body1" color="text.secondary">
              {side === "sell" ? (
                gaslessConfirmed ? (
                  <FormattedMessage
                    id="you.selled"
                    defaultMessage="You selled"
                  />
                ) : (
                  <FormattedMessage
                    id="you.are.selling"
                    defaultMessage="You are selling"
                  />
                )
              ) : gaslessConfirmed ? (
                <FormattedMessage id="you.bought" defaultMessage="You bought" />
              ) : (
                <FormattedMessage
                  id="you.are.buying"
                  defaultMessage="You are buying"
                />
              )}
            </Typography>
            <Stack
              justifyContent="center"
              direction="row"
              alignItems="center"
              spacing={2}
            >
              {amountFormatted ? (
                <Typography
                  sx={(theme) => ({
                    fontWeight: 600,
                    color:
                      side === "sell"
                        ? theme.palette.error.main
                        : theme.palette.success.main,
                  })}
                  align="right"
                  variant="h5"
                >
                  {amountFormatted} {baseToken?.symbol.toUpperCase()}
                </Typography>
              ) : (
                <>
                  <Skeleton sx={{ minWidth: "50px" }} />
                  {"  "}
                  <Typography
                    sx={(theme) => ({
                      fontWeight: 600,
                      color:
                        side === "sell"
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                    })}
                    align="right"
                    variant="h5"
                  >
                    {baseToken?.symbol.toUpperCase()}
                  </Typography>
                </>
              )}
            </Stack>
          </Stack>
          <Stack spacing={2}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: (theme) =>
                  theme.lighten(theme.palette.background.default, 0.2),
              }}
            >
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">
                    <FormattedMessage id="price" defaultMessage="Price" />
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {swapPrices ? (
                      <Typography color="text.secondary" variant="body1">
                        1 {baseToken?.symbol.toUpperCase()} ={" "}
                        {pricePerTokenFormatted}{" "}
                        {quoteToken?.symbol.toUpperCase()}
                      </Typography>
                    ) : (
                      <Typography color="text.secondary" variant="body1">
                        1 {quoteToken?.symbol.toUpperCase()} ={" "}
                        {pricePerTokenFormatted}{" "}
                        {baseToken?.symbol.toUpperCase()}
                      </Typography>
                    )}
                    <IconButton onClick={handleSwapPrices} size="small">
                      <SwapHorizIcon />
                    </IconButton>
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1">
                    {side === "sell" ? (
                      <FormattedMessage id="total" defaultMessage="Total" />
                    ) : (
                      <FormattedMessage id="cost" defaultMessage="Cost" />
                    )}
                  </Typography>
                  <Typography color="text.secondary" variant="body1">
                    {total} {quoteToken?.symbol.toUpperCase()}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
          {renderActions()}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
