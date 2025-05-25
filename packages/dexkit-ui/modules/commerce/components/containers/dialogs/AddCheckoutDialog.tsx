import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Grid,
} from "@mui/material";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../../../../../components";

import { Field, getIn, useFormikContext } from "formik";
import { TextField } from "formik-mui";
import CompletationProvider from "../../../../../components/CompletationProvider";

export interface AddCheckoutDialogProps {
  DialogProps: DialogProps;
  isLoading?: boolean;
}

export default function AddCheckoutDialog({
  DialogProps,
  isLoading,
}: AddCheckoutDialogProps) {
  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const { values, setFieldValue, submitForm } = useFormikContext();

  return (
    <Dialog maxWidth="sm" fullWidth {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="create.checkout"
            defaultMessage="Create Checkout"
          />
        }
        onClose={handleClose}
        sx={{ px: 4, py: 2 }}
      />
      <DialogContent dividers sx={{ px: 4, py: 2 }}>
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
                    <FormattedMessage
                      id="checkout.title"
                      defaultMessage="Checkout title"
                    />
                  }
                  component={TextField}
                  name="title"
                  fullWidth
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
                setFieldValue(`description`, output);
              }}
              initialPrompt={getIn(values, `description`)}
            >
              {({ inputAdornment, ref }) => (
                <Field
                  label={
                    <FormattedMessage
                      id="checkout.description"
                      defaultMessage="Checkout description"
                    />
                  }
                  component={TextField}
                  name="description"
                  fullWidth
                  inputRef={ref}
                  InputProps={{
                    endAdornment: inputAdornment("end"),
                  }}
                />
              )}
            </CompletationProvider>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 4, py: 2 }}>
        <Button disabled={isLoading} onClick={handleClose}>
          <FormattedMessage id="cancel" defaultMessage="Cancel" />
        </Button>
        <Button
          startIcon={
            isLoading && <CircularProgress color="inherit" size="1rem" />
          }
          disabled={isLoading}
          onClick={submitForm}
          variant="contained"
        >
          <FormattedMessage id="create" defaultMessage="Create" />
        </Button>
      </DialogActions>
    </Dialog>
  );
}
