import CheckoutItemsTable from '@/modules/commerce/components/CheckoutItemsTable';
import { Product } from '@/modules/commerce/components/dialogs/AddProductsDialog';

const AddProductsDialog = dynamic(
  () => import('@/modules/commerce/components/dialogs/AddProductsDialog'),
);

import DashboardLayout from '@/modules/commerce/components/layout/DashboardLayout';
import { CheckoutSchema } from '@/modules/commerce/schemas';
import { CheckoutFormType, CheckoutItemType } from '@/modules/commerce/types';
import { PageHeader } from '@dexkit/ui/components/PageHeader';
import Add from '@mui/icons-material/Add';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from '@mui/material';
import { Field, FieldArray, Formik } from 'formik';
import { Checkbox, TextField } from 'formik-mui';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { toFormikValidationSchema } from 'zod-formik-adapter';

function CreateCheckoutComponent() {
  const handleSubmit = async (values: CheckoutFormType) => {};

  const [showAddProducts, setShowAddProducts] = useState(false);

  const handleAddProducts = () => {
    setShowAddProducts(true);
  };

  const handleCloseAddProducts = () => {
    setShowAddProducts(false);
  };

  const handleConfirm = (product: Product[]) => {};

  return (
    <>
      {showAddProducts && (
        <AddProductsDialog
          DialogProps={{
            open: showAddProducts,
            onClose: handleCloseAddProducts,
          }}
          defaultSelection={[]}
          products={[
            { id: '372834', name: 'Camiseta X', price: 3050 },
            { id: '37283444434', name: 'Camiseta X', price: 43050 },
          ]}
          onConfirm={handleConfirm}
        />
      )}
      <Formik
        initialValues={{
          requireEmail: false,
          requireAccount: false,
          name: '',
          description: '',
          items: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={toFormikValidationSchema(CheckoutSchema)}
      >
        {({ submitForm, isSubmitting, isValid }) => (
          <Container>
            <Stack spacing={2}>
              <PageHeader
                breadcrumbs={[
                  {
                    caption: (
                      <FormattedMessage
                        id="commerce"
                        defaultMessage="Commerce"
                      />
                    ),
                    uri: '/u/account/commerce',
                  },
                  {
                    caption: (
                      <FormattedMessage
                        id="checkouts"
                        defaultMessage="Checkouts"
                      />
                    ),
                    uri: '/u/account/commerce/checkouts',
                  },
                  {
                    caption: (
                      <FormattedMessage id="create" defaultMessage="Create" />
                    ),
                    uri: '/u/account/commerce/checkout/create',
                    active: true,
                  },
                ]}
              />
              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      label={
                        <FormattedMessage id="title" defaultMessage="Title" />
                      }
                      component={TextField}
                      name="title"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Field component={Checkbox} name="requireEmail" />
                        }
                        label="Require email"
                      />
                      <FormControlLabel
                        control={
                          <Field component={Checkbox} name="requireAccount" />
                        }
                        label="Require account"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <CheckoutItemsTable name="items" />
                  </Grid>
                  <Grid item xs={12}>
                    <FieldArray
                      name="items"
                      render={({ handlePush }) => (
                        <Button
                          variant="outlined"
                          onClick={handlePush({
                            productId: '',
                            quantity: 1,
                          } as CheckoutItemType)}
                        >
                          <FormattedMessage
                            id="add.item"
                            defaultMessage="Add item"
                          />
                        </Button>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      startIcon={<Add />}
                      onClick={handleAddProducts}
                      variant="outlined"
                    >
                      <FormattedMessage
                        id="add.products"
                        defaultMessage="Add products"
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Stack justifyContent="flex-end" direction="row">
                        <Button
                          onClick={submitForm}
                          disabled={!isValid || isSubmitting}
                          variant="contained"
                        >
                          <FormattedMessage
                            id="create"
                            defaultMessage="Create"
                          />
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </div>
            </Stack>
          </Container>
        )}
      </Formik>
    </>
  );
}

export default function CheckoutCreatePage() {
  return (
    <DashboardLayout page="checkout">
      <CreateCheckoutComponent />
    </DashboardLayout>
  );
}
