import ShareIcon from "@mui/icons-material/Share";

import { Dialog, DialogContent, DialogProps, Divider } from "@mui/material";

import { FormattedMessage } from "react-intl";

import { AppDialogTitle } from "../../../../components/AppDialogTitle";
import CreateAssetOrderContainer from "../container/CreateAssetOrderContainer";

interface Props {
  dialogProps: DialogProps;
}

function CreateAssetOrderDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    onClose!({}, "backdropClick");
  };

  return (
    <Dialog {...dialogProps} fullScreen={true}>
      <AppDialogTitle
        icon={<ShareIcon />}
        title={
          <FormattedMessage
            id="create.nft.order"
            defaultMessage="Create NFT order"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <CreateAssetOrderContainer />
      </DialogContent>
    </Dialog>
  );
}

export default CreateAssetOrderDialog;
