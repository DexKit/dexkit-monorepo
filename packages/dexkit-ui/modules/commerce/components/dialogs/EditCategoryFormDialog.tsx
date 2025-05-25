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
import { CategoryType } from "../../types";

import { useSnackbar } from "notistack";

import { TextField } from "formik-mui";
import useUpdateCategory from "../../hooks/category/useUpdateCategory";
import { CategoryFormSchema } from "../../schemas";

export interface CreateCategoryFormDialogProps {
  DialogProps: DialogProps;
  onRefetch: () => void;
  category?: CategoryType;
}

export default function EditCategoryFormDialog({
  DialogProps,
  onRefetch,
  category,
}: CreateCategoryFormDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const { mutateAsync: updateCategory, isLoading } = useUpdateCategory();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values: CategoryType) => {
    try {
      await updateCategory(values);
      enqueueSnackbar(
        <FormattedMessage
          id="category.updated"
          defaultMessage="Category updated"
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
      initialValues={
        category ? { name: category.name, id: category.id } : { name: "" }
      }
      validationSchema={toFormikValidationSchema(CategoryFormSchema)}
    >
      {({ submitForm, isValid }) => (
        <Dialog {...DialogProps} maxWidth="xs" fullWidth>
          <AppDialogTitle
            title={
              <FormattedMessage
                id="edit.category.name"
                defaultMessage="Edit Category Name"
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
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}
