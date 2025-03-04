import { AppDialogTitle } from '@dexkit/ui/components/AppDialogTitle';
import {
  CircularProgress,
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
import { useAddAppRankingMutation } from '../../hooks';

import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

interface Props {
  dialogProps: DialogProps;
  siteId?: number;
  rankingId?: number;
  description?: string;
  title?: string;
}

interface AddRanking {
  title?: string;
  description?: string;
}

const AddRankingSchema: Yup.SchemaOf<AddRanking> = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string(),
});

export default function AddRankingFormDialog({
  dialogProps,
  siteId,
  title,
  description,
  rankingId,
}: Props) {
  const { onClose } = dialogProps;
  const [open, setOpen] = useState(false);
  const mutationAddRanking = useAddAppRankingMutation();
  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();

  return (
    <>
      <Dialog {...dialogProps} maxWidth="xs">
        <AppDialogTitle
          title={
            <FormattedMessage
              id="Create.leaderboard"
              defaultMessage="Create Leaderboard"
            />
          }
          onClose={handleClose}
          sx={{ px: 4, py: 2 }}
        />

        <Formik
          initialValues={{
            title: '',
            description: '',
          }}
          validationSchema={AddRankingSchema}
          onSubmit={async (value, helper) => {
            try {
              setOpen(true);

              await mutationAddRanking.mutateAsync({
                siteId,
                rankingId,
                title: value?.title,
                description: value?.description,
              });

              setOpen(false);

              enqueueSnackbar(
                <FormattedMessage
                  id="leaderboard.created"
                  defaultMessage="Leaderboard created"
                />,
                { variant: 'success' },
              );
            } catch (err) {
              enqueueSnackbar(String(err), { variant: 'error' });
            }
            handleClose();
          }}
        >
          {({ submitForm, values, setFieldValue, isSubmitting, isValid }) => (
            <Form>
              <DialogContent sx={{ p: 4 }} dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box>
                      <Stack spacing={2}>
                        <CompletationProvider
                          onCompletation={(output) =>
                            setFieldValue('title', output)
                          }
                          initialPrompt={values.title}
                        >
                          {({ inputAdornment, ref }) => (
                            <Field
                              inputRef={ref}
                              component={TextField}
                              name="title"
                              InputProps={{
                                endAdornment: inputAdornment('end'),
                              }}
                              label={
                                <FormattedMessage
                                  id="leaderboard.title"
                                  defaultMessage="Leaderboard title"
                                />
                              }
                            />
                          )}
                        </CompletationProvider>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <Stack spacing={2}>
                        <CompletationProvider
                          onCompletation={(output) =>
                            setFieldValue('description', output)
                          }
                          initialPrompt={values.description}
                          multiline
                        >
                          {({ inputAdornment, ref }) => (
                            <Field
                              component={TextField}
                              name="description"
                              InputProps={{
                                endAdornment: inputAdornment('end'),
                              }}
                              label={
                                <FormattedMessage
                                  id="leaderboard.description"
                                  defaultMessage="Leaderboard description"
                                />
                              }
                              inputRef={ref}
                            />
                          )}
                        </CompletationProvider>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ px: 4, py: 2 }}>
                <Grid item xs={12}>
                  <Stack spacing={1} direction="row" justifyContent="flex-end">
                    <Button color="primary" onClick={handleClose}>
                      <FormattedMessage id="cancel" defaultMessage="cancel" />
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={submitForm}
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress color="inherit" size="1rem" />
                        ) : undefined
                      }
                      disabled={isSubmitting || !isValid}
                    >
                      <FormattedMessage id="create" defaultMessage="Create" />
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
