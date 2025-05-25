import { Box, Button, Divider, Grid, Stack } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
import ProductCollectionFormProducts from './ProductCollectionFormProducts';

export interface ProductCollectionFormProps {
  disabled?: boolean;
}

export default function ProductCollectionForm({
  disabled,
}: ProductCollectionFormProps) {
  const { submitForm, isValid, isSubmitting } = useFormikContext();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            component={TextField}
            name="name"
            fullWidth
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <ProductCollectionFormProducts />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Stack justifyContent="flex-end" direction="row" spacing={2}>
              <Button
                LinkComponent={Link}
                href="/u/account/commerce/collections"
              >
                <FormattedMessage id="Cancel" defaultMessage="Cancel" />
              </Button>
              <Button
                onClick={submitForm}
                disabled={!isValid || isSubmitting || disabled}
                variant="contained"
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
