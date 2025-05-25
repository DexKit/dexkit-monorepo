import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  Stack,
} from '@mui/material';
import { Field, FieldArray, useFormikContext } from 'formik';
import { Switch, TextField } from 'formik-mui';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';
import { CheckoutItemType } from '../types';
import CheckoutItemsTable from './CheckoutItemsTable';

export interface CheckoutFormProps {
  disabled?: boolean;
}

export default function CheckoutForm({ disabled }: CheckoutFormProps) {
  const { submitForm, isValid, isSubmitting } = useFormikContext();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Field
            label={<FormattedMessage id="title" defaultMessage="Title" />}
            component={TextField}
            name="title"
            fullWidth
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <Field
            label={
              <FormattedMessage id="description" defaultMessage="description" />
            }
            component={TextField}
            name="description"
            fullWidth
            multiline
            rows={3}
            disabled={disabled}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormGroup sx={{ px: 2 }} row>
              <FormControlLabel
                control={
                  <Field
                    component={Switch}
                    type="checkbox"
                    name="requireEmail"
                  />
                }
                disabled={disabled}
                label="Require email"
              />
            </FormGroup>
            <FormHelperText>
              <FormattedMessage
                id="checkbox.required.email.message"
                defaultMessage="If you check this box, the customer will be required to provide an email address to create an order."
              />
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <FormGroup sx={{ px: 2 }} row>
              <FormControlLabel
                control={
                  <Field component={Switch} type="checkbox" name="editable" />
                }
                disabled={disabled}
                label={
                  <FormattedMessage
                    id="editable.quantity"
                    defaultMessage="Editable quantity"
                  />
                }
              />
            </FormGroup>
            <FormHelperText>
              <FormattedMessage
                id="checkbox.editable"
                defaultMessage="Check this if you want to make quantity field editable"
              />
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <CheckoutItemsTable name="items" />
        </Grid>
        <Grid item xs={12}>
          <FieldArray
            name="items"
            render={({ handlePush }) => (
              <Button
                disabled={disabled}
                variant="outlined"
                onClick={handlePush({
                  productId: '',
                  quantity: 1,
                } as CheckoutItemType)}
              >
                <FormattedMessage id="add.item" defaultMessage="Add item" />
              </Button>
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Stack justifyContent="flex-end" direction="row" spacing={2}>
              <Button LinkComponent={Link} href="/u/account/commerce/checkouts">
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
