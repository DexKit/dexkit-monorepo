import Check from '@mui/icons-material/Check';
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Field, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import * as Yup from 'yup';
import { SeoForm } from '../../types';

import CompletationProvider from '@dexkit/ui/components/CompletationProvider';

const FormSchema: Yup.SchemaOf<SeoForm> = Yup.object().shape({
  title: Yup.string().required(),
  description: Yup.string().required(),
  shareImageUrl: Yup.string().url().required(),
});

const CustomImage = styled('img')(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(40),
  objectFit: 'contain',
  [theme.breakpoints.down('sm')]: {
    height: theme.spacing(15),
    width: theme.spacing(30),
  },
}));

interface Props {
  initialValues: SeoForm;
  onSubmit: (form: SeoForm) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

function ListenDirty({
  dirty,
  onHasChanges,
}: {
  dirty: any;
  onHasChanges: any;
}) {
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(dirty);
    }
  }, [dirty, onHasChanges]);

  return null;
}

export default function SeoSectionForm({
  initialValues,
  onSubmit,
  onHasChanges,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaFieldToEdit, setMediaFieldToEdit] = useState<string>();
  const handleSubmit = useCallback(
    (values: SeoForm, helpers: FormikHelpers<SeoForm>) => {
      onSubmit(values);
      helpers.setSubmitting(false);
    },
    [onSubmit],
  );

  const defaultImageUrl = '/assets/kittygotchi/kittygotchi_banner.jpg';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = defaultImageUrl;
  };

  return (
    <>
      {initialValues && (
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={FormSchema}
        >
          {({ submitForm, isValid, values, setFieldValue, dirty }: any) => (
            <>
              <ListenDirty onHasChanges={onHasChanges} dirty={dirty} />
              <MediaDialog
                dialogProps={{
                  open: openMediaDialog,
                  maxWidth: 'lg',
                  fullWidth: true,
                  onClose: () => {
                    setOpenMediaDialog(false);
                    setMediaFieldToEdit(undefined);
                  },
                }}
                onConfirmSelectFile={(file) => {
                  if (mediaFieldToEdit && file) {
                    setFieldValue(mediaFieldToEdit, file.url);
                  }
                  setMediaFieldToEdit(undefined);
                  setOpenMediaDialog(false);
                }}
              />
              <Box sx={{
                width: '100%',
                pl: isMobile ? 0 : undefined,
                maxWidth: isMobile ? '100%' : undefined,
              }}>
                <Grid container spacing={isMobile ? 1.5 : 2}>
                  <Grid size={12}>
                    <CompletationProvider
                      onCompletation={(output) => setFieldValue('title', output)}
                      initialPrompt={values.title}
                    >
                      {({ inputAdornment, ref }) => (
                        <Field
                          component={TextField}
                          type="text"
                          label={
                            <FormattedMessage id="title" defaultMessage="Title" />
                          }
                          inputRef={ref}
                          name="title"
                          fullWidth
                          InputProps={{
                            endAdornment: inputAdornment('end'),
                            style: {
                              fontSize: isMobile ? '0.875rem' : undefined,
                              padding: isMobile ? '10px 8px' : undefined,
                            }
                          }}
                          InputLabelProps={{
                            style: {
                              fontSize: isMobile ? '0.875rem' : undefined,
                            }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: isMobile ? 1 : undefined,
                            }
                          }}
                        />
                      )}
                    </CompletationProvider>
                  </Grid>
                  <Grid size={12}>
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
                          type="text"
                          multiline
                          rows={isMobile ? 4 : 5}
                          label={
                            <FormattedMessage
                              id="description"
                              defaultMessage="Description"
                            />
                          }
                          inputRef={ref}
                          InputProps={{
                            endAdornment: inputAdornment('end'),
                            style: {
                              fontSize: isMobile ? '0.875rem' : undefined,
                              padding: isMobile ? '10px 8px' : undefined,
                            }
                          }}
                          InputLabelProps={{
                            style: {
                              fontSize: isMobile ? '0.875rem' : undefined,
                            }
                          }}
                          name="description"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: isMobile ? 1 : undefined,
                            }
                          }}
                        />
                      )}
                    </CompletationProvider>
                  </Grid>
                  <Grid size={12}>
                    <Typography variant={isMobile ? "body2" : "body1"} sx={{ mb: 1 }}>
                      <FormattedMessage
                        id="share.image"
                        defaultMessage="Share image"
                      />
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start' }}>
                      <Button
                        onClick={() => {
                          setOpenMediaDialog(true);
                          setMediaFieldToEdit('shareImageUrl');
                        }}
                        size={isMobile ? "small" : "medium"}
                        sx={{ p: 0, mt: 0.5 }}
                      >
                        <CustomImage
                          src={values.shareImageUrl || defaultImageUrl}
                          onError={handleImageError}
                          alt="Share image preview"
                        />
                      </Button>
                    </Box>
                  </Grid>
                  <Grid size={12}>
                    <Divider />
                  </Grid>

                  <Grid size={12}>
                    <Stack spacing={1} direction="row" justifyContent="flex-end">
                      <Button
                        startIcon={<Check fontSize={isMobile ? "small" : "medium"} />}
                        disabled={!isValid || !dirty}
                        onClick={submitForm}
                        type="submit"
                        variant="contained"
                        color="primary"
                        size={isMobile ? "small" : "medium"}
                        sx={{
                          fontSize: isMobile ? '0.875rem' : undefined,
                          py: isMobile ? 0.75 : undefined,
                          px: isMobile ? 2 : undefined,
                          borderRadius: isMobile ? 1 : undefined,
                        }}
                      >
                        <FormattedMessage id="save" defaultMessage="Save" />
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        </Formik>
      )}
    </>
  );
}
