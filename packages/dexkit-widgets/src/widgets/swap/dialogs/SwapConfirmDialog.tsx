import { ChainId } from "@dexkit/core/constants/enums";
import { useIsMobile } from "@dexkit/core/hooks";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { FormattedMessage } from "react-intl";
import AppDialogTitle from "../../../components/AppDialogTitle";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { ZeroExQuoteResponse } from "@dexkit/ui/modules/swap/types";
import ErrorIcon from "@mui/icons-material/Error";

import { Token } from "@dexkit/core/types";
import { useMemo } from "react";
import { formatBigNumber, getBlockExplorerUrl } from "../../../utils";
import SwapFeeSummary from "../SwapFeeSummary";
import { ExecSwapState } from "../constants/enum";

export interface SwapConfirmDialogProps {
  DialogProps: DialogProps;
  quote?: ZeroExQuoteResponse | null;
  chainId?: ChainId;
  execSwapState: ExecSwapState;
  isApproving?: boolean;
  execType: string;
  isQuoting?: boolean;
  isLoadingStatusGasless?: boolean;
  reasonFailedGasless?: string;
  onConfirm: () => void;
  currency: string;
  isLoadingSignGasless?: boolean;
  successTxGasless?: { hash: string };
  confirmedTxGasless?: { hash: string };
  sellToken?: Token;
  buyToken?: Token;
}

export default function SwapConfirmDialog({
  DialogProps,
  quote,
  isQuoting,
  chainId,
  onConfirm,
  execSwapState,
  isApproving,
  execType,
  isLoadingSignGasless,
  isLoadingStatusGasless,
  reasonFailedGasless,
  confirmedTxGasless,
  successTxGasless,
  currency,
  sellToken,
  buyToken,
}: SwapConfirmDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const btnMessage = useMemo(() => {
    if (execType === "approve") {
      return (
        <FormattedMessage
          id="approve.token.gasless"
          defaultMessage="Approve {symbol}"
          values={{ symbol: sellToken?.symbol?.toUpperCase() || "" }}
        />
      );
    }

    if (execSwapState === ExecSwapState.gasless_approval) {
      return (
        <FormattedMessage
          id="approve.token.gasless"
          defaultMessage="Approve {symbol}"
          values={{ symbol: sellToken?.symbol?.toUpperCase() || "" }}
        />
      );
    }
    if (
      execSwapState === ExecSwapState.gasless_trade_submit ||
      isLoadingStatusGasless
    ) {
      return (
        <FormattedMessage
          id="submitting.trade"
          defaultMessage="Submitting trade"
        />
      );
    }
    if (execSwapState === ExecSwapState.gasless_trade) {
      return (
        <FormattedMessage id="submit.trade" defaultMessage="Submit trade" />
      );
    }

    return <FormattedMessage id="confirm" defaultMessage="Confirm" />;
  }, [execSwapState, sellToken, isLoadingStatusGasless, execType]);

  const isMobile = useIsMobile();

  return (
    <Dialog {...DialogProps} onClose={handleClose} fullScreen={isMobile}>
      <AppDialogTitle
        title={
          confirmedTxGasless ? (
            <FormattedMessage
              id="trade.confirmed"
              defaultMessage="Trade confirmed"
            />
          ) : (
            <FormattedMessage id="confirm.swap" defaultMessage="Confirm swap" />
          )
        }
        onClose={handleClose}
      />
      {isQuoting ? (
        <LinearProgress color="primary" sx={{ height: "1px" }} />
      ) : (
        <Divider />
      )}
      <DialogContent>
        <Stack spacing={2}>
          {quote && sellToken && buyToken && (
            <>
              <Stack>
                {confirmedTxGasless && (
                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <CheckCircleOutlineIcon
                      color="success"
                      sx={{ fontSize: 60 }}
                    />
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
                        values={{
                          reason: reasonFailedGasless.split("_").join(" "),
                        }}
                      />
                    </Typography>
                  </Stack>
                )}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    <FormattedMessage id="you.send" defaultMessage="You send" />
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {formatBigNumber(
                      BigInt(quote.sellAmount),
                      sellToken.decimals
                    )}{" "}
                    {sellToken?.symbol?.toUpperCase()}
                  </Typography>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1">
                    <FormattedMessage
                      id="you.receive"
                      defaultMessage="You receive"
                    />
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {formatBigNumber(
                      BigInt(quote.buyAmount),
                      buyToken.decimals
                    )}{" "}
                    {buyToken?.symbol?.toUpperCase()}
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
            </>
          )}
          <SwapFeeSummary
            quote={quote}
            chainId={chainId}
            currency={currency}
            sellToken={sellToken}
            buyToken={buyToken}
          />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        {isLoadingSignGasless ? (
          <Button
            disabled={isLoadingSignGasless}
            onClick={onConfirm}
            variant="contained"
            startIcon={<CircularProgress size={20} />}
          >
            <FormattedMessage
              id="confirm.on.wallet"
              defaultMessage="Confirm on wallet"
            />
          </Button>
        ) : successTxGasless ? (
          <Stack
            display={"flex"}
            spacing={2}
            direction={"row"}
            justifyContent={"center"}
          >
            <Button
              disabled={true}
              startIcon={<CircularProgress size={20} />}
              onClick={onConfirm}
              variant="contained"
            >
              <FormattedMessage
                id="confirming.trade"
                defaultMessage="Confirming Trade"
              />
            </Button>

            <Button
              size="large"
              href={`${getBlockExplorerUrl(chainId)}/tx/${
                successTxGasless.hash
              }`}
              target="_blank"
              variant="outlined"
              color="primary"
            >
              <FormattedMessage
                id="view.transaction"
                defaultMessage="View transaction"
              />
            </Button>
          </Stack>
        ) : confirmedTxGasless ? (
          <Stack
            display={"flex"}
            spacing={2}
            direction={"row"}
            justifyContent={"center"}
          >
            <Button onClick={handleClose} variant="contained">
              <FormattedMessage id="new.trade" defaultMessage="new trade" />
            </Button>

            <Button
              size="large"
              href={`${getBlockExplorerUrl(chainId)}/tx/${
                confirmedTxGasless.hash
              }`}
              target="_blank"
              variant="outlined"
              color="primary"
            >
              <FormattedMessage
                id="view.transaction"
                defaultMessage="View transaction"
              />
            </Button>
          </Stack>
        ) : reasonFailedGasless ? (
          <Button onClick={handleClose} variant="contained">
            <FormattedMessage id="back" defaultMessage="back" />
          </Button>
        ) : (
          <Button
            disabled={
              isQuoting ||
              isLoadingStatusGasless ||
              execSwapState === ExecSwapState.gasless_trade_submit ||
              isApproving
            }
            startIcon={
              (isQuoting ||
                isLoadingStatusGasless ||
                execSwapState === ExecSwapState.gasless_trade_submit ||
                isApproving) && <CircularProgress size={20} />
            }
            onClick={onConfirm}
            variant="contained"
          >
            {btnMessage}
          </Button>
        )}
        {!successTxGasless &&
          !confirmedTxGasless &&
          !isLoadingSignGasless &&
          !(execSwapState === ExecSwapState.gasless_trade_submit) && (
            <Button onClick={handleClose}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
          )}
      </DialogActions>
    </Dialog>
  );
}
