import { NETWORK_NAME } from "@dexkit/core/constants/networks";
import { EvmCoin } from "@dexkit/core/types";

import { useIsMobile } from "@dexkit/core";
import { useWeb3React } from "@dexkit/wallet-connectors/hooks/useWeb3React";
import { Dialog, DialogContent, DialogProps, Divider, useTheme } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";
import EvmReceive from "../EvmReceive";

interface Props {
  dialogProps: DialogProps;
  receiver?: string;
  ENSName?: string;
  chainId?: number;
  defaultCoin?: EvmCoin;
  coins?: EvmCoin[];
}

export default function EvmReceiveDialog({
  dialogProps,
  receiver,
  chainId,
  coins,
  ENSName,
  defaultCoin,
}: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { chainId: walletChainId } = useWeb3React();
  const { onClose } = dialogProps;
  const effectiveChainId = chainId || walletChainId;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog
      {...dialogProps}
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          ...(isMobile && {
            margin: 0,
            borderRadius: 0,
            maxHeight: '100%',
            height: '100%',
          }),
          ...(!isMobile && {
            minHeight: '70vh',
            maxHeight: '90vh',
            borderRadius: theme.spacing(2),
          }),
        },
      }}
    >
      <AppDialogTitle
        title={
          <FormattedMessage
            id="receive.on.network.value"
            defaultMessage="Receive on {network}"
            values={{
              network: NETWORK_NAME(effectiveChainId),
            }}
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent
        sx={{
          p: isMobile ? theme.spacing(2) : theme.spacing(3),
          overflow: 'auto',
        }}
      >
        <EvmReceive
          receiver={receiver}
          chainId={effectiveChainId}
          coins={coins}
          defaultCoin={defaultCoin}
          ENSName={ENSName}
        />
      </DialogContent>
    </Dialog>
  );
}
