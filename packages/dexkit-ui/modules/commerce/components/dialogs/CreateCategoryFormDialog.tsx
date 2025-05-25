import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
} from "@mui/material";

import { toFormikValidationSchema } from "zod-formik-adapter";

import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../../../../components";

import { Field, Formik } from "formik";
import useCreateCategory from "../../hooks/category/useCreateCategory";
import { CategoryType } from "../../types";

import { useSnackbar } from "notistack";

import { TextField } from "formik-mui";
import { CategoryFormSchema } from "../../schemas";

export interface CreateCategoryFormDialogProps {
  DialogProps: DialogProps;
  onRefetch: () => void;
}

export default function CreateCategoryFormDialog({
  DialogProps,
  onRefetch,
}: CreateCategoryFormDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const { mutateAsync: createCategory, isLoading } = useCreateCategory();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: CategoryType) => {
    try {
      await createCategory(values);
      enqueueSnackbar(
        <FormattedMessage
          id="category.created"
          defaultMessage="Category created"
        />,
        { variant: "success" }
      );
      handleClose();
      onRefetch();
    } catch (err) {
      enqueueSnackbar(String(err), { variant: "error" });
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{ name: "" }}
      validationSchema={toFormikValidationSchema(CategoryFormSchema)}
    >
      {({ submitForm, isValid }) => (
        <Dialog {...DialogProps} maxWidth="xs" fullWidth>
          <AppDialogTitle
            title={
              <FormattedMessage
                id="create.new.category"
                defaultMessage="Create New Category"
              />
            }
            onClose={handleClose}
            sx={{ px: 4, py: 2 }}
          />
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field
                  label={<FormattedMessage id="name" defaultMessage="Name" />}
                  component={TextField}
                  name="name"
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ py: 2, px: 4 }}>
            <Button disabled={isLoading} onClick={handleClose}>
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button
              startIcon={
                isLoading ? (
                  <CircularProgress size="1rem" color="inherit" />
                ) : undefined
              }
              disabled={isLoading || !isValid}
              variant="contained"
              onClick={submitForm}
            >
              <FormattedMessage id="create" defaultMessage="Create" />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
