import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import { AppDialogTitle } from '@dexkit/ui/components';
import { useAuthUserQuery } from '../../hooks';
import { UserCreateContainer } from '../containers/UserCreateContainer';

interface Props {
  dialogProps: DialogProps;
}

function UserCreateDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;
  const authUserQuery = useAuthUserQuery();

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
            id="sending.user.profile.data"
            defaultMessage="Complete profile data"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <UserCreateContainer
          hideHeader={true}
          onComplete={() => {
            handleClose();
            authUserQuery.refetch();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

export default UserCreateDialog;
