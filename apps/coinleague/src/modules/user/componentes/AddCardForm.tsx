import { Box, Button, Stack } from '@mui/material';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { FormEvent } from 'react';
import { FormattedMessage } from 'react-intl';

export default function AddCardForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: FormEvent) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (elements) {
      const result = await stripe?.confirmSetup({
        elements,
        confirmParams: {
          return_url: '',
        },
      });

      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Box>
          <PaymentElement />
        </Box>
        <Button variant="contained" type="submit">
          <FormattedMessage id="save.payment" defaultMessage="Save payment" />
        </Button>
      </Stack>
    </form>
  );
}
