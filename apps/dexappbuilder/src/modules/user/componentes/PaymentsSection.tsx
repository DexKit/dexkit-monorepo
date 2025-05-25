import { Button, Card, CardContent, Divider } from '@mui/material';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PaymentMethodList from './PaymentMethodsList';
import AddPaymentMethodDialog from './dialogs/AddPaymentMethodDialog';

export default function PaymentsSection() {
  const [open, setOpen] = useState(false);

  const handleCloseAddPaymentMethod = () => {
    setOpen(false);
  };

  const handleAdd = () => {
    setOpen(true);
  };

  return (
    <>
      {open && (
        <AddPaymentMethodDialog
          DialogProps={{
            open,
            onClose: handleCloseAddPaymentMethod,
            maxWidth: 'sm',
            fullWidth: true,
          }}
        />
      )}
      <Card>
        <CardContent>
          <Button onClick={handleAdd} variant="contained">
            <FormattedMessage id="add" defaultMessage="Add" />
          </Button>
        </CardContent>
        <Divider />
        <PaymentMethodList />
      </Card>
    </>
  );
}
