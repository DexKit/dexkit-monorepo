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
import { AccountType } from '../../constants/enums';
import { AddAccountSchema } from '../../constants/schemas';
import { useAccounts } from '../../hooks';
import EvmAccountForm from '../forms/EvmAccountForm';

interface Props {
  dialogProps: DialogProps;
}

export default function EvmAddAccountDialog({ dialogProps }: Props) {
  const { onClose } = dialogProps;

  const { addAccount } = useAccounts({});

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
      addAccount({
        address: address.toLowerCase(),
        name,
        type: AccountType.EVM,
      });

      enqueueSnackbar(
        formatMessage({
          id: 'account.added.successfully',
          defaultMessage: 'Account added successfully',
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
          id: 'account.already.exists',
          defaultMessage: 'Account already exists',
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
      initialValues={{ address: '', name: '' }}
      validationSchema={AddAccountSchema}
    >
      {({ submitForm, isValid, isSubmitting, handleReset }) => (
        <Dialog {...dialogProps}>
          <AppDialogTitle
            title={
              <FormattedMessage id="add.account" defaultMessage="Add account" />
            }
            onClose={handleClose}
          />

          <DialogContent dividers>
            <EvmAccountForm />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!isValid || isSubmitting}
              variant="contained"
              color="primary"
              onClick={() => submitForm()}
            >
              <FormattedMessage id="add" defaultMessage="Add" />
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
