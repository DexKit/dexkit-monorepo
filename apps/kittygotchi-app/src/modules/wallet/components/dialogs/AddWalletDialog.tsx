import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
  TextField,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';
import { useWallets } from '../../hooks';

interface Props {
  dialogProps: DialogProps;
}

export default function AddWalletDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const { addWallet } = useWallets();

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleSubmit = async ({ name }: { name: string }) => {
    addWallet({ id: uuidv4(), name });
  };

  const handleCancel = () => {
    return () => {
      handleClose();
    };
  };

  return (
    <Formik onSubmit={handleSubmit} initialValues={{ name: '' }}>
      {({ submitForm, isSubmitting }) => (
        <Dialog {...dialogProps}>
          <AppDialogTitle
            title={
              <FormattedMessage id="add.wallet" defaultMessage="Add Wallet" />
            }
            onClose={handleClose}
          />
          <DialogContent dividers>
            <Stack>
              <Field component={TextField} name="name" />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={isSubmitting}
              onClick={() => submitForm()}
              variant="contained"
              color="primary"
            >
              <FormattedMessage id="add" defaultMessage="Add" />
            </Button>
            <Button disabled={isSubmitting} onClick={handleCancel()}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
