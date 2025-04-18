import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components';
import { ActiveMenu, UserEditContainer } from '../containers/UserEditContainer';

interface Props {
  dialogProps: DialogProps;
}

function UserEditDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...dialogProps} onClose={handleClose}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="connect.social.media"
            defaultMessage="Connect social media"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <UserEditContainer
          hideHeader={true}
          hideSideBar={true}
          initialActiveMenu={ActiveMenu.Socials}
          hideTitle={true}
        />
      </DialogContent>
    </Dialog>
  );
}

export default UserEditDialog;
