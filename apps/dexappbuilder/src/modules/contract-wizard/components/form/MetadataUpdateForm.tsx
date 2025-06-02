import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import Image from '@mui/icons-material/Image';
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Grid,
  Stack,
  styled,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { ContractMetadataFormType } from '../../types';

const CustomImage = styled('img')(({ theme }) => ({
  height: '100%',
  width: '100%',
  aspectRatio: '1/1',
}));

const CustomImageIcon = styled(Image)(({ theme }) => ({
  height: theme.spacing(6),
  width: theme.spacing(6),
}));

export interface MetadataUpdateFormProps {
  data?: ContractMetadataFormType;
  onSubmit: (values: ContractMetadataFormType) => Promise<void>;
}

export default function MetadataUpdateForm({
  onSubmit,
  data,
}: MetadataUpdateFormProps) {
  const [showMediaDialog, setShowMediaDialog] = useState(false);

  return (
    <Formik
      initialValues={data ? data : { image: '', name: '', description: '' }}
      onSubmit={onSubmit}
    >
      {({
        submitForm,
        errors,
        values,
        setFieldValue,
        isValid,
        isSubmitting,
      }) => (
        <>
          <MediaDialog
            dialogProps={{
              open: showMediaDialog,
              maxWidth: 'lg',
              fullWidth: true,
              onClose: () => {
                setShowMediaDialog(false);
              },
            }}
            onConfirmSelectFile={(file) => {
              if (file) {
                setFieldValue('image', file.url);
              }

              setShowMediaDialog(false);
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Box>
                <Stack direction="row" justifyContent="center">
                  <ButtonBase
                    onClick={() => {
                      setShowMediaDialog(true);
                    }}
                    sx={{
                      width: '100%',
                      height: '100%',
                      aspectRatio: '1/1',
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: (theme) => theme.shape.borderRadius / 2,
                      border: (theme) =>
                        `1px solid ${
                          errors.image
                            ? theme.palette.error.main
                            : theme.palette.divider
                        }`,
                    }}
                  >
                    {values.image ? (
                      <CustomImage alt="" src={values.image as string} />
                    ) : (
                      <CustomImageIcon color="primary" />
                    )}
                  </ButtonBase>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CompletationProvider
                    onCompletation={(output: string) => {
                      setFieldValue('name', output);
                    }}
                    initialPrompt={values.name}
                  >
                    {({ ref, inputAdornment }) => (
                      <Field
                        fullWidth
                        label={
                          <FormattedMessage id="name" defaultMessage="name" />
                        }
                        component={TextField}
                        name="name"
                        inputRef={ref}
                        InputProps={{
                          endAdornment: inputAdornment('end'),
                        }}
                      />
                    )}
                  </CompletationProvider>
                </Grid>
                <Grid item xs={12}>
                  <CompletationProvider
                    onCompletation={(output: string) => {
                      setFieldValue('description', output);
                    }}
                    initialPrompt={values.description}
                    multiline
                  >
                    {({ ref, inputAdornment }) => (
                      <Field
                        fullWidth
                        label={
                          <FormattedMessage
                            id="description"
                            defaultMessage="description"
                          />
                        }
                        multiline
                        rows={4}
                        InputProps={{
                          component: 'textarea',
                          endAdornment: inputAdornment('end'),
                        }}
                        component={TextField}
                        name="description"
                        inputRef={ref}
                      />
                    )}
                  </CompletationProvider>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                disabled={isSubmitting || !isValid}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : undefined
                }
                onClick={submitForm}
                variant="contained"
              >
                <FormattedMessage id="Update" defaultMessage="Update" />
              </Button>
            </Grid>
          </Grid>
        </>
      )}
    </Formik>
  );
}
