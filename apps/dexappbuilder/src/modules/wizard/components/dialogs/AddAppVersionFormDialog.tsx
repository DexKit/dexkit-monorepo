import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  styled,
  useMediaQuery,
  useTheme
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

const MobileButton = styled(Button)(({ theme }) => ({
  fontSize: '0.85rem',
  padding: theme.spacing(0.75, 1.5),
}));

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
          isLoading={mutationAddVersion.isPending}
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
                <Grid container spacing={isMobile ? 1.5 : 2}>
                  <Grid item xs={12}>
                    <Box>
                      <Stack spacing={isMobile ? 1.5 : 2}>
                        <Field
                          component={TextField}
                          name="version"
                          label={
                            <FormattedMessage
                              id={'version'}
                              defaultMessage={'Version'}
                            />
                          }
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                          InputLabelProps={{
                            style: {
                              fontSize: isMobile ? '0.85rem' : 'inherit',
                            },
                          }}
                          InputProps={{
                            style: {
                              fontSize: isMobile ? '0.85rem' : 'inherit',
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Stack spacing={isMobile ? 1.5 : 2}>
                        <Field
                          component={TextField}
                          name="description"
                          label={
                            <FormattedMessage
                              id={'description'}
                              defaultMessage={'Description'}
                            />
                          }
                          variant="outlined"
                          size={isMobile ? "small" : "medium"}
                          multiline
                          rows={isMobile ? 3 : 4}
                          InputLabelProps={{
                            style: {
                              fontSize: isMobile ? '0.85rem' : 'inherit',
                            },
                          }}
                          InputProps={{
                            style: {
                              fontSize: isMobile ? '0.85rem' : 'inherit',
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions>
                <Grid item xs={12}>
                  <Stack
                    spacing={1}
                    direction={isMobile ? "column-reverse" : "row"}
                    justifyContent={isMobile ? "stretch" : "flex-end"}
                    sx={{ width: isMobile ? '100%' : 'auto', px: isMobile ? 1 : 0 }}
                  >
                    {isMobile ? (
                      <>
                        <MobileButton
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={handleClose}
                        >
                          <FormattedMessage id="cancel" defaultMessage="Cancel" />
                        </MobileButton>
                        <MobileButton
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={submitForm}
                        >
                          <FormattedMessage id="save" defaultMessage="Save" />
                        </MobileButton>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
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
