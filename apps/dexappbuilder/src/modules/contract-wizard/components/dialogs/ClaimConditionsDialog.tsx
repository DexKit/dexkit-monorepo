import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { ClaimConditionsContainer } from '../containers/ClaimConditionsContainer';

interface Props {
  dialogProps: DialogProps;
  address?: string;
  network?: string;
  tokenId?: string;
}

export default function ClaimConditionsDialog({
  dialogProps,
  network,
  address,
  tokenId,
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
          <FormattedMessage
            id="claim.conditions"
            defaultMessage="claim.conditions"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent sx={{ p: 0 }}>
        <ClaimConditionsContainer
          network={network as string}
          address={address as string}
          tokenId={tokenId}
        />
      </DialogContent>
    </Dialog>
  );
}
