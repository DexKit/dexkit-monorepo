import { AppDialogTitle } from '@/modules/common/components/AppDialogTitle';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import { Formik, FormikHelpers } from 'formik';
import { useSnackbar } from 'notistack';
import { FormattedMessage, useIntl } from 'react-intl';
import { AddAccountSchema } from '../../constants/schemas';
import { useAccounts } from '../../hooks';
import { Account } from '../../types';
import EvmAccountForm from '../forms/EvmAccountForm';

interface Props {
  dialogProps: DialogProps;
  account: Account;
}

export default function EvmEditAccountDialog({ dialogProps, account }: Props) {
  const { onClose } = dialogProps;

  const { updateName } = useAccounts({});

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const handleSumbit = async (
    {
      address,
      name,
    }: {
      address: string;
      name: string;
    },
    helpers: FormikHelpers<{
      address: string;
      name: string;
    }>
  ) => {
    try {
      updateName(address, name);

      enqueueSnackbar(
        formatMessage({
          id: 'account.updated.successfully',
          defaultMessage: 'Account updated successfully',
        }),
        {
          variant: 'success',
        }
      );
      helpers.resetForm();
      handleClose();
    } catch (err: any) {
      enqueueSnackbar(
        formatMessage({
          id: 'account.does.not.exists',
          defaultMessage: 'Account does not exists',
        }),
        {
          variant: 'error',
        }
      );
    }
  };

  const handleCancel = (reset: () => void) => {
    return () => {
      reset();
      handleClose();
    };
  };

  return (
    <Formik
      onSubmit={handleSumbit}
      initialValues={{ address: account.address, name: account.name || '' }}
      validationSchema={AddAccountSchema}
    >
      {({ submitForm, isValid, isSubmitting, handleReset }) => (
        <Dialog {...dialogProps}>
          <AppDialogTitle
            title={
              <FormattedMessage
                id="add.account"
                defaultMessage="Edit account"
              />
            }
            onClose={handleClose}
          />

          <DialogContent dividers>
            <EvmAccountForm disableEditAddress />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!isValid || isSubmitting}
              variant="contained"
              color="primary"
              onClick={() => submitForm()}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
            <Button disabled={isSubmitting} onClick={handleCancel(handleReset)}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
