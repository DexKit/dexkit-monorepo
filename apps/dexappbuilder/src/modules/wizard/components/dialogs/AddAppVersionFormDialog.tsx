import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
} from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { useAddAppVersionMutation } from '../../hooks';
import SendAddAppVersionDialog from './SendAddAppVersionDialog';

interface Props {
  dialogProps: DialogProps;
  siteId?: number;
  versionId?: number;
  version?: string;
  description?: string;
}

interface AddVersion {
  version?: string;
  description?: string;
}

const AddVersionSchema: Yup.SchemaOf<AddVersion> = Yup.object().shape({
  version: Yup.string().required(),
  description: Yup.string(),
});

export default function AddVersionFormDialog({
  dialogProps,
  siteId,
  version,
  description,
  versionId,
}: Props) {
  const { onClose } = dialogProps;
  const [open, setOpen] = useState(false);
  const mutationAddVersion = useAddAppVersionMutation();
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <>
      {open && (
        <SendAddAppVersionDialog
          dialogProps={{
            open: open,
            onClose: () => {
              setOpen(false);
              mutationAddVersion.reset();
            },
          }}
          isLoading={mutationAddVersion.isLoading}
          isSuccess={mutationAddVersion.isSuccess}
          error={mutationAddVersion.error}
        />
      )}

      <Dialog {...dialogProps}>
        <AppDialogTitle
          title={
            <FormattedMessage
              id="add.app.version"
              defaultMessage="Add app version"
            />
          }
          onClose={handleClose}
        />

        <Formik
          initialValues={{
            version: version ? version : '',
            description: description ? description : undefined,
          }}
          validationSchema={AddVersionSchema}
          onSubmit={(value, helper) => {
            setOpen(true);

            mutationAddVersion.mutate({
              siteId,
              versionId,
              version: value?.version,
              description: value?.description,
            });
            helper.setSubmitting(false);
          }}
        >
          {({ submitForm }) => (
            <Form>
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      <Stack spacing={2}>
                        <Field
                          component={TextField}
                          name="version"
                          label={
                            <FormattedMessage
                              id={'version'}
                              defaultMessage={'Version'}
                            />
                          }
                        />
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Stack spacing={2}>
                        <Field
                          component={TextField}
                          name="description"
                          label={
                            <FormattedMessage
                              id={'description'}
                              defaultMessage={'Description'}
                            />
                          }
                        />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Grid item xs={12}>
                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={submitForm}
                    >
                      <FormattedMessage id="save" defaultMessage="Save" />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleClose}
                    >
                      <FormattedMessage id="cancel" defaultMessage="cancel" />
                    </Button>
                  </Stack>
                </Grid>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
