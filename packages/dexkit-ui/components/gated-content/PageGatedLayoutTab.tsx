import { Box, ButtonBase, Grid, Stack, Typography } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { AccountFile } from '@dexkit/ui/modules/file/types';
import { GatedPageLayout } from '@dexkit/ui/modules/wizard/types';
import { Field, Formik, FormikHelpers } from 'formik';
import { TextField } from 'formik-mui';
import { useState } from 'react';
import ChangeListener from '../../../../apps/dexappbuilder/src/modules/wizard/components/ChangeListener';

import CompletationProvider from '@dexkit/ui/components/CompletationProvider';
import ImageIcon from '@mui/icons-material/Image';

export interface PageGatedLayoutTabProps {
  layout?: GatedPageLayout;
  onSaveGatedLayout: (layout?: GatedPageLayout) => void;
}

export default function PageGatedLayoutTab({
  layout,
  onSaveGatedLayout,
}: PageGatedLayoutTabProps) {
  const handleSubmit = async (
    values: { layout: GatedPageLayout },
    helpers: FormikHelpers<any>,
  ) => {
    onSaveGatedLayout(values.layout);
    helpers.resetForm();
  };

  const [showSelect, setShowSelect] = useState(false);
  const [mode, setMode] = useState<string>();

  const handleSelectImage = (mode: string) => {
    return () => {
      setShowSelect(true);
      setMode(mode);
    };
  };

  const handleSelectClose = () => {
    setShowSelect(false);
  };

  const handleSelectFile = (
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => void,
    setFieldTouched: (
      field: string,
      isTouched?: boolean | undefined,
      shouldValidate?: boolean | undefined,
    ) => void,
  ) => {
    return (file: AccountFile) => {
      if (mode === 'light') {
        setFieldValue('layout.frontImage', file.url);
        setFieldTouched('layout.frontImage');
      } else if (mode === 'dark') {
        setFieldValue('layout.frontImageDark', file.url);
        setFieldTouched('layout.frontImageDark');
      }
    };
  };

  return (
    <Formik
      initialValues={
        layout
          ? { layout }
          : {
            layout: {
              accessRequirementsMessage: '',
              frontImage: '',
              frontImageHeight: 150,
              frontImageWidth: 150,
            },
          }
      }
      onSubmit={handleSubmit}
    >
      {({
        submitForm,
        setFieldValue,
        values,
        isValid,
        touched,
        setFieldTouched,
      }) => (
        <>
          {touched.layout && (
            <ChangeListener
              values={values}
              isValid={isValid}
              onChange={(values: any) => onSaveGatedLayout(values.layout)}
            />
          )}

          {showSelect && (
            <MediaDialog
              dialogProps={{
                open: showSelect,
                maxWidth: 'lg',
                fullWidth: true,
                onClose: handleSelectClose,
              }}
              onConfirmSelectFile={handleSelectFile(
                setFieldValue,
                setFieldTouched,
              )}
            />
          )}

          <Box>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Typography variant="body1" fontWeight="bold">
                  <FormattedMessage
                    id="cover.image"
                    defaultMessage="Cover image"
                  />
                </Typography>
              </Grid>
              <Grid size={12}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Stack spacing={2}>
                        <Typography variant="body1">
                          <FormattedMessage
                            id="cover.image.for.light.mode"
                            defaultMessage="Cover image for light mode"
                          />
                        </Typography>
                        <ButtonBase
                          sx={{
                            position: 'relative',
                            p: 2,
                            borderRadius: (theme) =>
                              typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            backgroundColor: (theme) =>
                              theme.palette.mode === 'light'
                                ? 'rgba(0,0,0, 0.2)'
                                : theme.alpha(theme.palette.common.white, 0.1),

                            backgroundImage: `url('${values.layout.frontImage}')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }}
                          onClick={handleSelectImage('light')}
                        >
                          <Stack
                            sx={{
                              height: (theme) => values.layout.frontImageHeight,
                              maxHeight: 300,
                              minHeight: 50,
                              width: '100%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: (theme) =>
                                theme.palette.getContrastText(
                                  theme.palette.mode === 'light'
                                    ? 'rgba(0,0,0, 0.2)'
                                    : theme.alpha(theme.palette.common.white, 0.1),
                                ),
                            }}
                          >
                            {!values.layout.frontImage && (
                              <ImageIcon
                                color="inherit"
                                sx={{ fontSize: '6rem' }}
                              />
                            )}
                          </Stack>
                        </ButtonBase>
                      </Stack>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box>
                      <Stack spacing={2}>
                        <Typography variant="body1">
                          <FormattedMessage
                            id="cover.image.for.dark.mode"
                            defaultMessage="Cover image for dark mode"
                          />
                        </Typography>
                        <ButtonBase
                          sx={{
                            backgroundColor: 'black',
                            width: '100%',
                            borderRadius: (theme) =>
                              typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius / 2 : theme.shape.borderRadius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            p: 2,
                            backgroundImage: `url('${values.layout.frontImageDark}')`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                          }}
                          onClick={handleSelectImage('dark')}
                        >
                          <Stack
                            sx={{
                              height: values.layout.frontImageHeight,
                              maxHeight: 300,
                              minHeight: 50,
                              width: '100%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: (theme) =>
                                theme.palette.getContrastText('#000'),
                            }}
                          >
                            {!values.layout.frontImage && (
                              <ImageIcon
                                sx={{ fontSize: '6rem' }}
                                color="inherit"
                              />
                            )}
                          </Stack>
                        </ButtonBase>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography variant="body1">
                      <FormattedMessage
                        id="cover.image.size"
                        defaultMessage="Cover image size"
                      />
                    </Typography>
                  </Grid>
                  {/*
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Field
                      component={TextField}
                      type="text"
                      fullWidth
                      label={
                        <FormattedMessage
                          id="width.px"
                          defaultMessage="Width(px)"
                        />
                      }
                      name="layout.frontImageWidth"
                    />
                  </Grid> */}
                  <Grid size={{ xs: 12, sm: 3 }}>
                    <Field
                      component={TextField}
                      type="number"
                      fullWidth
                      min={50}
                      max={300}
                      label={
                        <FormattedMessage
                          id="heigth.px"
                          defaultMessage="Height(px)"
                        />
                      }
                      name="layout.frontImageHeight"
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={12}>
                <CompletationProvider
                  onCompletation={(output: string) => {
                    setFieldValue('layout.accessRequirementsMessage', output);
                  }}
                  initialPrompt={values.layout.accessRequirementsMessage}
                >
                  {({ inputAdornment, ref }) => (
                    <Field
                      component={TextField}
                      type="text"
                      fullWidth
                      label={
                        <FormattedMessage
                          id="access.requirements.message"
                          defaultMessage="Access requirements message"
                        />
                      }
                      name="layout.accessRequirementsMessage"
                      inputRef={ref}
                      InputProps={{ endAdornment: inputAdornment('end') }}
                    />
                  )}
                </CompletationProvider>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </Formik>
  );
}
