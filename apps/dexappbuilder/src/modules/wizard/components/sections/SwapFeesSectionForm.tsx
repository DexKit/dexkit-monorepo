import { isAddress } from '@dexkit/core/utils/ethers/isAddress';
import { Button, Grid, Paper, Stack, TextField } from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { FormattedMessage } from 'react-intl';

import * as Yup from 'yup';
import { SwapFeeForm } from '../../types';

const FormSchema: Yup.SchemaOf<SwapFeeForm> = Yup.object().shape({
  amountPercentage: Yup.number().min(0).max(10).required(),
  recipient: Yup.string()
    .test('recipient', (value) => {
      return value !== undefined ? isAddress(value) : true;
    })
    .required(),
});

interface Props {
  onSubmit: (values: SwapFeeForm) => void;
  onCancel: () => void;
  fee?: SwapFeeForm;
  isMobile?: boolean;
}

export default function SwapFeesSectionForm({
  onSubmit,
  onCancel,
  fee,
  isMobile,
}: Props) {
  const handleSubmit = (
    values: SwapFeeForm,
    helpers: FormikHelpers<SwapFeeForm>,
  ) => {
    onSubmit({ ...values, amountPercentage: values.amountPercentage });
  };

  const formik = useFormik<SwapFeeForm>({
    validationSchema: FormSchema,
    initialValues: {
      recipient: fee?.recipient || '',
      amountPercentage: fee?.amountPercentage || 0,
    },
    onSubmit: handleSubmit,
  });

  return (
    <Paper sx={{ p: isMobile ? 1.5 : 2 }}>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={isMobile ? 1.5 : 2}>
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
              InputProps={{
                style: {
                  fontSize: isMobile ? '0.875rem' : undefined,
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isMobile ? '0.875rem' : undefined,
                }
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: isMobile ? '0.75rem' : undefined,
                }
              }}
              size={isMobile ? "small" : "medium"}
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
              InputProps={{
                style: {
                  fontSize: isMobile ? '0.875rem' : undefined,
                }
              }}
              InputLabelProps={{
                style: {
                  fontSize: isMobile ? '0.875rem' : undefined,
                }
              }}
              FormHelperTextProps={{
                style: {
                  fontSize: isMobile ? '0.75rem' : undefined,
                }
              }}
              size={isMobile ? "small" : "medium"}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1} direction="row" justifyContent="flex-end">
              <Button
                disabled={!formik.isValid}
                type="submit"
                variant="contained"
                color="primary"
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontSize: isMobile ? "0.875rem" : undefined,
                  py: isMobile ? 0.75 : undefined,
                }}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button
                onClick={onCancel}
                size={isMobile ? "small" : "medium"}
                sx={{
                  fontSize: isMobile ? "0.875rem" : undefined,
                }}
              >
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
