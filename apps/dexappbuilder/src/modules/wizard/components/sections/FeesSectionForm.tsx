import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { Button, Grid, Paper, Stack, TextField } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { FormattedMessage, useIntl } from 'react-intl';

import { isAddressEqual } from '@dexkit/core/utils/blockchain';
import * as Yup from 'yup';

export interface FeeForm {
  recipient: string;
  amountPercentage: number;
}

const FormSchema: Yup.SchemaOf<FeeForm> = Yup.object().shape({
  amountPercentage: Yup.number().min(0).max(10).required(),
  recipient: Yup.string()
    .test('recipient', (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
});

interface Props {
  onSubmit?: (values: FeeForm) => void;
  onCancel?: () => void;
  fees: FeeForm[];
}

export default function FeesSectionForm({ onSubmit, onCancel, fees }: Props) {
  const { formatMessage } = useIntl();

  const handleSubmit = (values: FeeForm, helpers: FormikHelpers<FeeForm>) => {
    if (fees.find((f) => isAddressEqual(f.recipient, values.recipient))) {
      helpers.setFieldError(
        'recipient',
        formatMessage({
          id: 'recipient.address.already.in.use',
          defaultMessage: 'Recipient address already in use',
        }),
      );
    } else if (onSubmit) {
      onSubmit({ ...values, amountPercentage: values.amountPercentage });
    }
  };

  const formik = useFormik<FeeForm>({
    validationSchema: FormSchema,
    initialValues: { amountPercentage: 0.0, recipient: '' },
    onSubmit: handleSubmit,
  });

  return (
    <Paper sx={{ p: 2 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label={
                <FormattedMessage id="recipient" defaultMessage="Recipient" />
              }
              name="recipient"
              onChange={formik.handleChange}
              fullWidth
              error={Boolean(formik.errors.recipient)}
              value={formik.values.recipient}
              helperText={
                Boolean(formik.errors.recipient)
                  ? formik.errors.recipient
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={
                <FormattedMessage
                  id="fee.percentage"
                  defaultMessage="Fee percentage"
                />
              }
              name="amountPercentage"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.amountPercentage}
              error={Boolean(formik.errors.amountPercentage)}
              helperText={
                Boolean(formik.errors.amountPercentage)
                  ? formik.errors.amountPercentage
                  : undefined
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} direction="row" justifyContent="flex-end">
              <Button
                disabled={!formik.isValid}
                type="submit"
                variant="contained"
                color="primary"
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button onClick={onCancel}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
