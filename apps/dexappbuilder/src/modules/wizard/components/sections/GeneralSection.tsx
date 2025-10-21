import {
  Box,
  Button,
  ButtonBase,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useIsMobile } from '@dexkit/core/hooks';
import MediaDialog from '@dexkit/ui/components/mediaDialog';
import { CURRENCIES, LANGUAGES } from '@dexkit/ui/constants';
import ImageIcon from '@mui/icons-material/Image';
import * as Yup from 'yup';
import { StepperButtonProps } from '../../types';
import { StepperButtons } from '../steppers/StepperButtons';
export interface GeneralSectionForm {
  name: string;
  email: string;
  locale: string;
  currency: string;
  logoUrl: string;
  logoDarkUrl?: string;
  faviconUrl: string;
  logoWidth?: number;
  logoHeight?: number;
  logoWidthMobile?: number;
  logoHeightMobile?: number;
}

const FormSchema: Yup.SchemaOf<GeneralSectionForm> = Yup.object().shape({
  email: Yup.string().email().required(),
  name: Yup.string().required(),
  locale: Yup.string().required(),
  currency: Yup.string().required(),
  logoUrl: Yup.string().url().required(),
  logoDarkUrl: Yup.string().url(),
  faviconUrl: Yup.string().url().required(),
  logoWidth: Yup.number().min(0),
  logoHeight: Yup.number().min(0),
  logoWidthMobile: Yup.number().min(0),
  logoHeightMobile: Yup.number().min(0),
});

interface Props {
  isEdit?: boolean;
  initialValues?: GeneralSectionForm;
  onSubmit?: (form: GeneralSectionForm) => void;
  onChange?: (form: GeneralSectionForm) => void;
  onHasChanges?: (hasChange: boolean) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
}

const CustomImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'contain',
  maxWidth: '100%',
  maxHeight: '100%',
}));

const NoImage = styled(ImageIcon)(({ theme }) => ({
  height: theme.spacing(20),
  width: theme.spacing(20),
  [theme.breakpoints.down('sm')]: {
    height: theme.spacing(16),
    width: theme.spacing(16),
  },
}));

const FaviconImage = styled('img')(({ theme }) => ({
  height: theme.spacing(10),
  width: theme.spacing(10),
  [theme.breakpoints.down('sm')]: {
    height: theme.spacing(8),
    width: theme.spacing(8),
  },
}));

function OnChangeListener({
  values,
  isValid,
  onChange,
  onHasChanges,
  dirty,
}: {
  values: any;
  isValid: any;
  onChange: any;
  onHasChanges: any;
  dirty: boolean;
}) {
  useEffect(() => {
    if (onChange) {
      onChange(values);
    }
  }, [values, isValid]);

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(dirty);
    }
  }, [dirty, onHasChanges]);

  return <></>;
}

export default function GeneralSection({
  onSubmit,
  onChange,
  onHasChanges,
  initialValues,
  isOnStepper,
  stepperButtonProps,
}: Props) {
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [mediaFieldToEdit, setMediaFieldToEdit] = useState<string>();
  const isMobile = useIsMobile();
  const theme = useTheme();

  const handleSubmit = useCallback(
    (
      values: GeneralSectionForm,
      formikHelpers: FormikHelpers<GeneralSectionForm>,
    ) => {
      if (onSubmit) {
        onSubmit(values);
      }
    },
    [onSubmit],
  );

  const formik = useFormik<GeneralSectionForm>({
    initialValues: initialValues || {
      email: '',
      name: '',
      currency: 'usd',
      locale: 'en-US',
      logoUrl: '',
      logoDarkUrl: '',
      faviconUrl: '',
      logoHeight: 48,
      logoWidth: 48,
      logoHeightMobile: 48,
      logoWidthMobile: 48,
    },
    enableReinitialize: true,
    onSubmit: handleSubmit,
    validationSchema: FormSchema,
  });

  return (
    <>
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
            formik.setFieldValue(mediaFieldToEdit, file.url);
            if (onChange) {
              onChange({ ...formik.values, [mediaFieldToEdit]: file.url });
            }
          }
          setMediaFieldToEdit(undefined);
          setOpenMediaDialog(false);
        }}
      />
      <Stack sx={{ width: '100%', px: isMobile ? 1 : 0 }}>
        <form onSubmit={formik.handleSubmit} style={{ width: '100%' }}>
          <OnChangeListener
            dirty={formik.dirty}
            values={formik.values}
            onChange={onChange}
            isValid={formik.isValid}
            onHasChanges={onHasChanges}
          />
          <Grid container spacing={isMobile ? 2 : 3} sx={{ width: '100%' }}>
            <Grid size={12}>
              <TextField
                name="name"
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    pr: isMobile ? 1 : undefined
                  },
                  '& .MuiInputBase-input': {
                    pr: isMobile ? 1 : undefined
                  }
                }}
                fullWidth
                size={isMobile ? "small" : "medium"}
                label={
                  <FormattedMessage id="app.name" defaultMessage="App name" />
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={
                  Boolean(formik.errors.name) && formik.touched.name
                    ? formik.errors.name
                    : undefined
                }
              />
            </Grid>
            <Grid size={12}>
              <TextField
                type="email"
                name="email"
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    pr: isMobile ? 1 : undefined
                  },
                  '& .MuiInputBase-input': {
                    pr: isMobile ? 1 : undefined
                  }
                }}
                fullWidth
                size={isMobile ? "small" : "medium"}
                label={
                  <FormattedMessage
                    id="notification.email"
                    defaultMessage="Notification email"
                  />
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                error={Boolean(formik.errors.email) && formik.touched.email}
                helperText={
                  Boolean(formik.errors.email) && formik.touched.email
                    ? formik.errors.email
                    : undefined
                }
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12
              }}></Grid>
            <Grid size={12}>
              <Typography variant={isMobile ? "body1" : undefined}>
                <b>
                  <FormattedMessage id="logo" defaultMessage="Logo" />
                </b>
              </Typography>
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Stack spacing={isMobile ? 1 : 2}>
                <Typography variant="body2">
                  <FormattedMessage
                    id="logo.for.light.mode"
                    defaultMessage="Logo for light mode"
                  />
                </Typography>
                <ButtonBase
                  sx={{
                    position: 'relative',
                    p: isMobile ? 1 : 2,
                    borderRadius: (theme: any) => Number(theme.shape.borderRadius) / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'light'
                        ? 'rgba(0,0,0, 0.2)'
                        : theme.alpha(theme.palette.common.white, 0.1),
                  }}
                  onClick={() => {
                    setOpenMediaDialog(true);
                    setMediaFieldToEdit('logoUrl');
                  }}
                >
                  <Stack
                    sx={{
                      height: (theme) => theme.spacing(isMobile ? 16 : 20),
                      width: (theme) => theme.spacing(isMobile ? 16 : 20),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {formik.values.logoUrl ? (
                      <CustomImage src={formik.values.logoUrl} />
                    ) : (
                      <NoImage />
                    )}
                  </Stack>
                </ButtonBase>
              </Stack>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Stack spacing={isMobile ? 1 : 2}>
                <Typography variant="body2">
                  <FormattedMessage
                    id="logo.for.dark.mode"
                    defaultMessage="Logo for dark mode"
                  />
                </Typography>
                <ButtonBase
                  sx={{
                    backgroundColor: 'black',
                    p: isMobile ? 1 : 2,
                    borderRadius: (theme: any) => Number(theme.shape.borderRadius) / 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                  onClick={() => {
                    setOpenMediaDialog(true);
                    setMediaFieldToEdit('logoDarkUrl');
                  }}
                >
                  <Stack
                    sx={{
                      height: (theme) => theme.spacing(isMobile ? 16 : 20),
                      width: (theme) => theme.spacing(isMobile ? 16 : 20),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {formik.values?.logoDarkUrl ? (
                      <CustomImage src={formik.values.logoDarkUrl} />
                    ) : (
                      <NoImage />
                    )}
                  </Stack>
                </ButtonBase>
              </Stack>
            </Grid>

            <Grid size={12}>
              <Box>
                <Typography variant="body1" sx={{ mb: isMobile ? 1 : 2 }}>
                  <FormattedMessage
                    id="logo.on.desktop"
                    defaultMessage="Logo on desktop"
                  />
                </Typography>

                <Grid container spacing={1} alignItems="center">
                  <Grid size={5}>
                    <TextField
                      type="number"
                      name="logoWidth"
                      size="small"
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          pr: 0
                        }
                      }}
                      label={
                        <FormattedMessage
                          id="width.px"
                          defaultMessage="Width (px)"
                        />
                      }
                      InputLabelProps={{ shrink: true }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.logoWidth}
                      error={
                        Boolean(formik.errors.logoWidth) && formik.touched.logoWidth
                      }
                      helperText={
                        Boolean(formik.errors.logoWidth) && formik.touched.logoWidth
                          ? formik.errors.logoWidth
                          : undefined
                      }
                    />
                  </Grid>
                  <Grid sx={{ textAlign: 'center' }} size={2}>
                    <Typography color="primary">x</Typography>
                  </Grid>
                  <Grid size={5}>
                    <TextField
                      type="number"
                      name="logoHeight"
                      size="small"
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          pr: 0
                        }
                      }}
                      label={
                        <FormattedMessage
                          id="height.px"
                          defaultMessage="Height (px)"
                        />
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.logoHeight}
                      InputLabelProps={{ shrink: true }}
                      error={
                        Boolean(formik.errors.logoHeight) &&
                        formik.touched.logoHeight
                      }
                      helperText={
                        Boolean(formik.errors.logoHeight) &&
                          formik.touched.logoHeight
                          ? formik.errors.logoHeight
                          : undefined
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid size={12}>
              <Box sx={{ mt: isMobile ? 1 : 2 }}>
                <Typography variant="body1" sx={{ mb: isMobile ? 1 : 2 }}>
                  <FormattedMessage
                    id="logo.on.mobile"
                    defaultMessage="Logo on mobile"
                  />
                </Typography>

                <Grid container spacing={1} alignItems="center">
                  <Grid size={5}>
                    <TextField
                      type="number"
                      name="logoWidthMobile"
                      size="small"
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          pr: 0
                        }
                      }}
                      label={
                        <FormattedMessage
                          id="width.px"
                          defaultMessage="Width (px)"
                        />
                      }
                      InputLabelProps={{ shrink: true }}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.logoWidthMobile}
                      error={
                        Boolean(formik.errors.logoWidthMobile) &&
                        formik.touched.logoWidthMobile
                      }
                      helperText={
                        Boolean(formik.errors.logoWidthMobile) &&
                          formik.touched.logoWidthMobile
                          ? formik.errors.logoWidthMobile
                          : undefined
                      }
                    />
                  </Grid>
                  <Grid sx={{ textAlign: 'center' }} size={2}>
                    <Typography color="primary">x</Typography>
                  </Grid>
                  <Grid size={5}>
                    <TextField
                      type="number"
                      name="logoHeightMobile"
                      size="small"
                      fullWidth
                      inputProps={{ min: 0 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          pr: 0
                        }
                      }}
                      label={
                        <FormattedMessage
                          id="height.px"
                          defaultMessage="Height (px)"
                        />
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.logoHeightMobile}
                      InputLabelProps={{ shrink: true }}
                      error={
                        Boolean(formik.errors.logoHeightMobile) &&
                        formik.touched.logoHeightMobile
                      }
                      helperText={
                        Boolean(formik.errors.logoHeightMobile) &&
                          formik.touched.logoHeightMobile
                          ? formik.errors.logoHeightMobile
                          : undefined
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid sx={{ mt: isMobile ? 1 : 2 }} size={12}>
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <Tooltip
                    title={
                      <FormattedMessage
                        id="favicon.helper.explainer"
                        defaultMessage={
                          'Small icon that represents a website and is displayed in the browser tab'
                        }
                      />
                    }
                  >
                    <b>
                      <FormattedMessage id="favicon" defaultMessage="Favicon" />
                    </b>
                  </Tooltip>
                </Typography>
              </Box>
              <Button
                onClick={() => {
                  setOpenMediaDialog(true);
                  setMediaFieldToEdit('faviconUrl');
                }}
                size={isMobile ? "small" : "medium"}
                sx={{ mt: 1 }}
              >
                {formik.values.faviconUrl ? (
                  <FaviconImage src={formik.values.faviconUrl} />
                ) : (
                  <NoImage />
                )}
              </Button>
            </Grid>

            <Grid sx={{ mt: 2 }} size={12}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: isMobile ? '0.9rem' : undefined }}>
                  <FormattedMessage id="language" defaultMessage="Language" />
                </InputLabel>
                <Select
                  name="locale"
                  onChange={formik.handleChange}
                  value={formik.values.locale}
                  label={
                    <FormattedMessage id="language" defaultMessage="Language" />
                  }
                  error={Boolean(formik.errors.locale)}
                  sx={{
                    fontSize: isMobile ? '0.9rem' : undefined,
                    '& .MuiSelect-select': {
                      pr: 6
                    }
                  }}
                >
                  {LANGUAGES.map((lang, index) => (
                    <MenuItem key={index} value={lang.locale}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(formik.errors.locale) && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {formik.errors.locale}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid sx={{ mt: 1 }} size={12}>
              <FormControl fullWidth size="small">
                <InputLabel sx={{ fontSize: isMobile ? '0.9rem' : undefined }}>
                  <FormattedMessage
                    id="default.currency"
                    defaultMessage="Default currency"
                  />
                </InputLabel>
                <Select
                  name="currency"
                  onChange={formik.handleChange}
                  value={formik.values.currency}
                  label={
                    <FormattedMessage
                      id="default.currency"
                      defaultMessage="Default currency"
                    />
                  }
                  error={Boolean(formik.errors.currency)}
                  sx={{
                    fontSize: isMobile ? '0.9rem' : undefined,
                    '& .MuiSelect-select': {
                      pr: 6
                    }
                  }}
                >
                  {CURRENCIES.map((curr, index) => (
                    <MenuItem key={index} value={curr.symbol}>
                      {curr.name} ({curr.symbol.toUpperCase()})
                    </MenuItem>
                  ))}
                </Select>
                {Boolean(formik.errors.currency) && (
                  <FormHelperText
                    sx={{ color: (theme) => theme.palette.error.main }}
                  >
                    {formik.errors.currency}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>



            <Grid sx={{ mt: 2 }} size={12}>
              <Divider />
            </Grid>

            <Grid sx={{ mt: 2 }} size={12}>
              {isOnStepper ? (
                <StepperButtons
                  {...stepperButtonProps}
                  handleNext={() => {
                    formik.submitForm();
                    if (stepperButtonProps?.handleNext) {
                      stepperButtonProps.handleNext();
                    }
                  }}
                  disableContinue={
                    !formik.isValid ||
                    !formik.values.email ||
                    !formik.values.name
                  }
                />
              ) : (
                <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start', width: '100%' }}>
                  <Button
                    disabled={!formik.isValid || !formik.dirty}
                    type="submit"
                    variant="contained"
                    color="primary"
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      width: isMobile ? '100%' : 'auto',
                      py: 1.5
                    }}
                  >
                    <FormattedMessage id="save" defaultMessage="Save" />
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </form>
      </Stack>
    </>
  );
}
