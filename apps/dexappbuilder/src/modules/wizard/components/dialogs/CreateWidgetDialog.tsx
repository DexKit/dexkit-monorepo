import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Stack,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import * as Yup from 'yup';

import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import { Grid, LinearProgress } from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';

interface WidgetOptions {
  name?: string;
}

const WidgetSchema: Yup.SchemaOf<WidgetOptions> = Yup.object().shape({
  name: Yup.string().required(),
});

interface Props {
  onCancel: () => void;
  onSubmit: (item: WidgetOptions) => void;
  item?: WidgetOptions;
  dialogProps: DialogProps;
}

export default function CreateWidgetDialog({
  item,
  onCancel,
  onSubmit,
  dialogProps,
}: Props) {
  const { onClose } = dialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
    onCancel();
  };

  return (
    <Dialog {...dialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage
            id="create.new.widget.uppercased"
            defaultMessage="Create New Widget"
          />
        }
        onClose={handleClose}
      />
      <Formik
        initialValues={{ ...item }}
        onSubmit={(values, helpers) => {
          if (values) {
            onSubmit({ ...values });
          }

          handleClose();
        }}
        validationSchema={WidgetSchema}
      >
        {({ submitForm, isSubmitting, isValid }) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box py={2}>
                    <Field
                      component={TextField}
                      name="name"
                      fullWidth
                      label={
                        <FormattedMessage
                          id="widget.name"
                          defaultMessage="Widget name"
                        />
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {isSubmitting && <LinearProgress />}
              <Stack
                py={0.5}
                px={2}
                direction="row"
                spacing={1}
                justifyContent="flex-end"
              >
                <Button onClick={onCancel}>
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button
                  disabled={!isValid || isSubmitting}
                  variant="contained"
                  onClick={submitForm}
                >
                  <FormattedMessage id="create" defaultMessage="Create" />
                </Button>
              </Stack>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
