import {
  Alert,
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
import CollectionForm from './CollectionForm';
import SingleProductForm from './SingleProductForm';
import StoreForm from './StoreForm';

import useCheckoutSettings from '@dexkit/ui/modules/commerce/hooks/useCheckoutSettings';

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

  const { data: settings, isFetched } = useCheckoutSettings();

  return (
    <Formik
      initialValues={
        initialValues
          ? initialValues
          : { type: 'store', params: { emailRequired: false } }
      }
      onSubmit={handleSubmit}
      validate={(values: CommerceContent) => {
        console.log('values', values);
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
            {isFetched &&
              (!settings?.notificationEmail || !settings?.receiverAddress) && (
                <Grid item xs={12}>
                  <Alert
                    severity="error"
                    action={
                      <Button
                        LinkComponent={Link}
                        href="/u/account/commerce/settings"
                        variant="outlined"
                        color="inherit"
                      >
                        <FormattedMessage
                          id="settings"
                          defaultMessage="Settings"
                        />
                      </Button>
                    }
                  >
                    <FormattedMessage
                      id="email.and.receiver.error.message"
                      defaultMessage="It is not possible to create a checkout without setting up the receiver's email and address."
                    />
                  </Alert>
                </Grid>
              )}

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
                  <MenuItem value="single-product">
                    <FormattedMessage
                      id="single.product"
                      defaultMessage="Single Product"
                    />
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
              {values.type === 'single-product' && <SingleProductForm />}
              {values.type === 'collection' && <CollectionForm />}
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
