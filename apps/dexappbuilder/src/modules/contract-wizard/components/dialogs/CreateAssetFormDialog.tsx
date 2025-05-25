import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import WizardCreateAssetContainerV2 from '../WizardCreateAssetContainerV2';

interface Props {
  dialogProps: DialogProps;

  address?: string;
  network?: string;
  isERC1155?: boolean;
  isLazyMint?: boolean;
}

export default function CreateAssetFormDialog({
  dialogProps,
  network,
  address,
  isERC1155,
  isLazyMint,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="create.nfts" defaultMessage="Create NFTs" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <WizardCreateAssetContainerV2
          network={network as string}
          address={address as string}
          isERC1155={isERC1155}
          isLazyMint={isLazyMint}
        />
      </DialogContent>
    </Dialog>
  );
}
