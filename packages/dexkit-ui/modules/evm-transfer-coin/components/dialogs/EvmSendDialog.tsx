import { AppDialogTitle } from "@dexkit/ui/components";

import { useIsMobile } from "@dexkit/core";
import { Dialog, DialogContent, DialogProps, Divider } from "@mui/material";
import { FormattedMessage } from "react-intl";
import EvmTransferCoin, { EvmTransferCoinProps } from "../EvmTransferCoin";

interface Props {
  dialogProps: DialogProps;
  params: EvmTransferCoinProps;
}

export default function EvmSendDialog({ dialogProps, params }: Props) {
  const isMobile = useIsMobile();

  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  return (
    <Dialog {...dialogProps} fullScreen={isMobile}>
      <AppDialogTitle
        title={<FormattedMessage id="send" defaultMessage="Send" />}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <EvmTransferCoin {...params} />
      </DialogContent>
    </Dialog>
  );
}
