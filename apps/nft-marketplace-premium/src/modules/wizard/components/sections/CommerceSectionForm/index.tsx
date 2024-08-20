import {
  Button,
  FormControl,
  Grid,
  Link,
  MenuItem,
  Typography,
} from '@mui/material';

import { CommerceContent } from '@dexkit/ui/modules/wizard/types/section';
import { Field, Formik } from 'formik';
import { Select } from 'formik-mui';
import { FormattedMessage } from 'react-intl';
import ChangeListener from '../../ChangeListener';
import CheckoutForm from './CheckoutForm';
import StoreForm from './StoreForm';

interface Props {
  isEdit?: boolean;
  initialValues?: CommerceContent;
  onSubmit?: (values: CommerceContent) => void;
  onChange?: (form: CommerceContent) => void;
  onHasChanges?: (hasChange: boolean) => void;
  saveOnChange?: boolean;
}

export default function CommerceSectionForm({
  onSubmit,
  onChange,
  onHasChanges,
  initialValues,
  saveOnChange,
}: Props) {
  const handleSubmit = (values: CommerceContent) => {
    if (onSubmit) {
      onSubmit(values);
    }

    if (onHasChanges) {
      onHasChanges(true);
    }
  };

  return (
    <Formik
      initialValues={
        initialValues
          ? initialValues
          : { type: 'store', params: { emailRequired: false } }
      }
      onSubmit={handleSubmit}
      validate={(values: CommerceContent) => {
        if (saveOnChange && onChange) {
          onChange(values);
        }
      }}
    >
      {({ submitForm, values, isValid }) => (
        <div>
          <ChangeListener
            isValid={isValid}
            values={values}
            onChange={onChange}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1">
                <FormattedMessage
                  id="edit.commerce.products.and.settings"
                  defaultMessage="Edit Commerce products and settings"
                />
                :{' '}
                <Link href="/u/account/commerce" target="_blank">
                  <FormattedMessage id="edit.alt" defaultMessage="edit" />
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Field
                  fullWidth
                  label={<FormattedMessage id="type" defaultMessage="Type" />}
                  name="type"
                  component={Select}
                >
                  <MenuItem value="store">
                    <FormattedMessage id="store" defaultMessage="Store" />
                  </MenuItem>
                  <MenuItem value="checkout">
                    <FormattedMessage id="checkout" defaultMessage="Checkout" />
                  </MenuItem>
                  <MenuItem value="collection">
                    <FormattedMessage
                      id="collection"
                      defaultMessage="Collection"
                    />
                  </MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {values.type === 'store' && <StoreForm />}
              {values.type === 'checkout' && <CheckoutForm />}
            </Grid>
            <Grid item xs={12}>
              <Button onClick={submitForm} variant="contained">
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
            </Grid>
          </Grid>
        </div>
      )}
    </Formik>
  );
}
