import { Dialog, DialogContent, DialogProps, Divider } from '@mui/material';

import { Elements } from '@stripe/react-stripe-js';

import { AppDialogTitle } from '@dexkit/ui';
import { loadStripe } from '@stripe/stripe-js';
import { FormattedMessage } from 'react-intl';
import useAddPaymentIntent from '../../hooks/settings';
import AddCardForm from '../AddCardForm';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
);

export interface AddPaymentMethodDialogProps {
  DialogProps: DialogProps;
}

export default function AddPaymentMethodDialog({
  DialogProps,
}: AddPaymentMethodDialogProps) {
  const addPaymentIntent = useAddPaymentIntent();
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="add.payment.method"
            defaultMessage="Add Payment Method"
          />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        {addPaymentIntent.data && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: addPaymentIntent.data?.clientSecret,
            }}
          >
            <AddCardForm />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
}
