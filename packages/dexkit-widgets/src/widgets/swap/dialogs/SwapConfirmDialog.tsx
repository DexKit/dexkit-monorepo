import { useIsMobile } from "@dexkit/core/hooks";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { BigNumber } from "ethers";
import { FormattedMessage } from "react-intl";
import AppDialogTitle from "../../../components/AppDialogTitle";
import { ChainId } from "../../../constants/enum";
import { ZeroExQuoteResponse } from "../../../services/zeroex/types";
import { Token } from "../../../types";
import { formatBigNumber } from "../../../utils";
import SwapFeeSummary from "../SwapFeeSummary";

export interface SwapConfirmDialogProps {
  DialogProps: DialogProps;
  quote?: ZeroExQuoteResponse | null;
  chainId?: ChainId;
  isQuoting?: boolean;
  onConfirm: () => void;
  currency: string;

  sellToken?: Token;
  buyToken?: Token;
}

export default function SwapConfirmDialog({
  DialogProps,
  quote,
  isQuoting,
  chainId,
  onConfirm,
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

  const isMobile = useIsMobile();

  return (
    <Dialog {...DialogProps} onClose={handleClose} fullScreen={isMobile}>
      <AppDialogTitle
        title={
          <FormattedMessage id="confirm.swap" defaultMessage="Confirm swap" />
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
                      BigNumber.from(quote.sellAmount),
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
                      BigNumber.from(quote.buyAmount),
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
        <Button disabled={isQuoting} onClick={onConfirm} variant="contained">
          <FormattedMessage id="confirm" defaultMessage="Confirm" />
        </Button>
        <Button onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
