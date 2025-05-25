import Add from "@mui/icons-material/Add";
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
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Field, getIn, useFormikContext } from "formik";
import { Switch, TextField } from "formik-mui";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import CompletationProvider from "../../../../../components/CompletationProvider";
import { CheckoutFormType, ProductFormType } from "../../../types";

import dynamic from "next/dynamic";

const CheckoutAddProductDialog = dynamic(
  () => import("../../dialogs/CheckoutAddProductDialog")
);

import useParams from "../hooks/useParams";
import CheckoutItemsTable from "./CheckoutItemsTable";

export interface CheckoutFormProps {
  disabled?: boolean;
}

export default function CheckoutForm({ disabled }: CheckoutFormProps) {
  const { submitForm, isValid, isSubmitting, setFieldValue, values } =
    useFormikContext<CheckoutFormType>();

  const { goBack } = useParams();

  const [tab, setTab] = useState("products");

  const [showAdd, setShowAdd] = useState(false);

  const handleAddProduct = () => {
    setShowAdd(true);
  };

  const handleClose = () => {
    setShowAdd(false);
  };

  const handleConfirm = (product: ProductFormType, quantity: number) => {
    setShowAdd(false);

    setFieldValue("items", [
      ...((values as any).items as any[]),
      { productId: product.id, quantity },
    ]);
  };

  return (
    <>
      {showAdd && (
        <CheckoutAddProductDialog
          DialogProps={{ open: showAdd, onClose: handleClose }}
          onConfirm={handleConfirm}
        />
      )}
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Tabs value={tab} onChange={(e, value) => setTab(value)}>
              <Tab
                value="products"
                label={
                  <FormattedMessage id="products" defaultMessage="Products" />
                }
              />
              <Tab
                value="details"
                label={
                  <FormattedMessage id="details" defaultMessage="Details" />
                }
              />
            </Tabs>
          </Grid>
          {tab === "details" && (
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CompletationProvider
                    onCompletation={(output: string) => {
                      setFieldValue(`title`, output);
                    }}
                    initialPrompt={getIn(values, `title`)}
                  >
                    {({ inputAdornment, ref }) => (
                      <Field
                        label={
                          <FormattedMessage id="title" defaultMessage="Title" />
                        }
                        component={TextField}
                        name="title"
                        fullWidth
                        disabled={disabled}
                        inputRef={ref}
                        InputProps={{
                          endAdornment: inputAdornment("end"),
                        }}
                      />
                    )}
                  </CompletationProvider>
                </Grid>
                <Grid item xs={12}>
                  <CompletationProvider
                    onCompletation={(output: string) => {
                      setFieldValue(`title`, output);
                    }}
                    initialPrompt={getIn(values, `title`)}
                  >
                    {({ inputAdornment, ref }) => (
                      <Field
                        label={
                          <FormattedMessage
                            id="description"
                            defaultMessage="description"
                          />
                        }
                        component={TextField}
                        name="description"
                        fullWidth
                        multiline
                        rows={3}
                        disabled={disabled}
                        inputRef={ref}
                        InputProps={{
                          endAdornment: inputAdornment("end"),
                        }}
                      />
                    )}
                  </CompletationProvider>
                </Grid>
              </Grid>
            </Grid>
          )}

          {tab === "products" && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box px={2}>
                    <Typography
                      color="text.secondary"
                      fontWeight="bold"
                      variant="body2"
                    >
                      <FormattedMessage
                        id="checkout.settings"
                        defaultMessage="Checkout settings"
                      />
                    </Typography>
                  </Box>
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
                        defaultMessage="Turn on to require customers to provide an email address to create an order."
                      />
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <FormGroup sx={{ px: 2 }} row>
                      <FormControlLabel
                        control={
                          <Field
                            component={Switch}
                            type="checkbox"
                            name="editable"
                          />
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
                        defaultMessage="Turn on to allow customers to edit the quantity field."
                      />
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    disabled={disabled}
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={handleAddProduct}
                  >
                    <FormattedMessage
                      id="add.product"
                      defaultMessage="Add product"
                    />
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <CheckoutItemsTable name="items" />
                </Grid>
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <Stack justifyContent="flex-end" direction="row" spacing={2}>
                <Button onClick={goBack}>
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
    </>
  );
}
