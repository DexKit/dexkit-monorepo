import { Box, Button, Divider, Grid, Stack } from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

export interface CategoryFormProps {
  disabled?: boolean;
}

export default function CategoryForm({ disabled }: CategoryFormProps) {
  const { submitForm, isValid, isSubmitting } = useFormikContext();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Field
            label={<FormattedMessage id="name" defaultMessage="Name" />}
            component={TextField}
            name="name"
            fullWidth
            disabled={disabled}
          />
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12}>
          <Box>
            <Stack justifyContent="flex-end" direction="row" spacing={2}>
              <Button
                LinkComponent={Link}
                href="/u/account/commerce/categories"
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
