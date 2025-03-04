import { useDexKitContext } from '@dexkit/ui';
import { AppDialogTitle } from '@dexkit/ui/components';
import { useBurnToken } from '@dexkit/ui/modules/evm-burn-nft/hooks';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogProps,
} from '@mui/material';
import { useContract } from '@thirdweb-dev/react';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { FormattedMessage } from 'react-intl';

export interface BurnTokenDialogProps {
  DialogProps: DialogProps;
  contractAddress: string;
}

export default function BurnTokenDialog({
  DialogProps,
  contractAddress,
}: BurnTokenDialogProps) {
  const { onClose } = DialogProps;

  const contract = useContract(contractAddress, 'token');

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const { chainId } = useWeb3React();

  const { createNotification, watchTransactionDialog } = useDexKitContext();

  const burnToken = useBurnToken({
    contractAddress,
    onSubmit: (hash, quantity, name, symbol) => {
      if (hash && chainId) {
        const values: {
          name: string;
          quantity: string;
          symbol: string;
        } = {
          name,
          quantity,
          symbol,
        };

        if (quantity) {
          createNotification({
            type: 'transaction',
            icon: 'receipt',
            subtype: 'burnToken',
            values,
          });
        }

        watchTransactionDialog.open('burnToken', values);
      }
      watchTransactionDialog.watch(hash);
    },
  });

  const handleSubmit = async ({ amount }: { amount: string }) => {
    await burnToken.mutateAsync({ quantity: amount });
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={<FormattedMessage id="burn.token" defaultMessage="Burn Token" />}
        onClose={handleClose}
      />
      <Formik initialValues={{ amount: '0.0' }} onSubmit={handleSubmit}>
        {({ submitForm, isSubmitting }) => (
          <>
            <DialogContent dividers>
              <Field
                component={TextField}
                name="amount"
                fullWidth
                label={<FormattedMessage id="amount" defaultMessage="amount" />}
              />
            </DialogContent>
            <DialogActions>
              <Button
                startIcon={
                  burnToken.isLoading ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : undefined
                }
                variant="contained"
                disabled={isSubmitting}
                onClick={submitForm}
              >
                <FormattedMessage id="burn" defaultMessage="Burn" />
              </Button>
              <Button disabled={isSubmitting} onClick={handleClose}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </DialogActions>
          </>
        )}
      </Formik>
    </Dialog>
  );
}
