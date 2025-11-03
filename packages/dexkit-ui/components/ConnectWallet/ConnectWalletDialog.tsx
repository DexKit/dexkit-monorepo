import {
  Dialog,
  DialogContent,
  DialogProps,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";
import { ConnectWalletButton } from "../ConnectWalletButton";

interface Props {
  DialogProps: DialogProps;
  isActive?: boolean;
  isActivating?: boolean;
  activeConnectorName?: string;
  activate?: (params: any) => Promise<void>;
}

export default function ConnectWalletDialog({
  DialogProps,
  isActive,
  isActivating,
  activeConnectorName,
  activate,
}: Props) {
  const { onClose } = DialogProps;

  const handleClose = () => onClose!({}, "backdropClick");

  return (
    <Dialog {...DialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="connect.your.wallet"
            defaultMessage="Connect Your Wallet"
            description="Connect wallet dialog title"
          />
        }
        onClose={handleClose}
      />
      <DialogContent>
        <ConnectWalletButton />
      </DialogContent>
    </Dialog>
  );
}
