import { AppDialogTitle } from "@dexkit/ui/components";

import { useIsMobile } from "@dexkit/core";
import { Dialog, DialogContent, DialogProps, Divider, useTheme } from "@mui/material";
import { FormattedMessage } from "react-intl";
import EvmTransferCoin, { EvmTransferCoinProps } from "../EvmTransferCoin";

interface Props {
  dialogProps: DialogProps;
  params: EvmTransferCoinProps;
}

export default function EvmSendDialog({ dialogProps, params }: Props) {
  const isMobile = useIsMobile();
  const theme = useTheme();

  const { onClose } = dialogProps;

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
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            borderRadius: 0,
          }),
          ...(!isMobile && {
            borderRadius: 2,
            maxWidth: '500px',
          }),
        },
      }}
    >
      <AppDialogTitle
        title={<FormattedMessage id="send" defaultMessage="Send" />}
        onClose={handleClose}
        sx={{
          px: isMobile ? theme.spacing(2) : theme.spacing(3),
          py: isMobile ? theme.spacing(1.5) : theme.spacing(2),
        }}
      />
      <Divider />
      <DialogContent
        sx={{
          px: isMobile ? theme.spacing(2) : theme.spacing(3),
          py: isMobile ? theme.spacing(2) : theme.spacing(3),
          '&.MuiDialogContent-root': {
            paddingTop: isMobile ? theme.spacing(2) : theme.spacing(3),
          },
        }}
      >
        <EvmTransferCoin {...params} />
      </DialogContent>
    </Dialog>
  );
}
