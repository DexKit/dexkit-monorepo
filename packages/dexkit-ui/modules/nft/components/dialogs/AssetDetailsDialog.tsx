import ShareIcon from "@mui/icons-material/Share";

import { Dialog, DialogContent, DialogProps, Divider } from "@mui/material";

import { FormattedMessage } from "react-intl";

import { Asset } from "@dexkit/core/types/nft";
import { AppDialogTitle } from "../../../../components/AppDialogTitle";
import { AssetDetailsBase } from "../AssetDetailsBase";
import { AssetMedia } from "../AssetMedia";

interface Props {
  dialogProps: DialogProps;
  asset?: Asset;
}

function AssetDetailsDialog({ dialogProps, asset }: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    onClose!({}, "backdropClick");
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        icon={<ShareIcon />}
        title={<FormattedMessage id="nft.detail" defaultMessage="NFT detail" />}
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        {asset && <AssetMedia asset={asset} showVideoControls={true} />}
        <AssetDetailsBase asset={asset} metadata={asset?.metadata} />
      </DialogContent>
    </Dialog>
  );
}

export default AssetDetailsDialog;
