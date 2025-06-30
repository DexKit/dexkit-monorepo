import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useMediaQuery, useTheme } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel } from 'formik-mui';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';

interface FooterConfig {
  variant?: 'default' | 'glassmorphic';
  customSignature?: {
    enabled?: boolean;
    text?: string;
    link?: string;
    showAppName?: boolean;
    showLoveBy?: boolean;
  };
}

interface Props {
  config: AppConfig & { footerConfig?: FooterConfig };
  onSave: (config: AppConfig & { footerConfig?: FooterConfig }) => void;
  isDisabled: boolean;
  hasNFT: boolean;
}

interface HideOptions {
  hide_powered_by?: boolean;
  customSignature?: {
    enabled?: boolean;
    text?: string;
    link?: string;
    showAppName?: boolean;
    showLoveBy?: boolean;
  };
}

const SocialOptionsSchema: Yup.SchemaOf<HideOptions> = Yup.object().shape({
  hide_powered_by: Yup.boolean(),
  customSignature: Yup.object().shape({
    enabled: Yup.boolean(),
    text: Yup.string(),
    link: Yup.string().url(),
    showAppName: Yup.boolean(),
    showLoveBy: Yup.boolean(),
  }).optional(),
});

export default function HidePoweredContainer({
  config,
  onSave,
  isDisabled,
  hasNFT,
}: Props) {
  const { formatMessage } = useIntl();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const initialCustomSignature = config.footerConfig?.customSignature || {
    enabled: false,
    text: 'DexKit',
    link: 'https://www.dexkit.com',
    showAppName: true,
    showLoveBy: true,
  };

  return (
    <Formik
      initialValues={{
        hide_powered_by: config.hide_powered_by || false,
        customSignature: initialCustomSignature,
      }}
      validationSchema={SocialOptionsSchema}
      onSubmit={(values, helpers) => {
        const newConfig = {
          ...config,
          hide_powered_by: values.hide_powered_by,
          footerConfig: {
            ...config.footerConfig,
            customSignature: values.customSignature,
          },
        };
        onSave(newConfig);
      }}
    >
      {({ values, setFieldValue, submitForm }) => (
        <Form>
          <Grid container spacing={isMobile ? 1.5 : 3}>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Field
                component={CheckboxWithLabel}
                name="hide_powered_by"
                disabled={isDisabled}
                type={'checkbox'}
                Label={{
                  label: formatMessage({
                    id: 'hide.powered.by.dexkit',
                    defaultMessage: 'Hide Powered by DexKit',
                  }),
                }}
              />
            </Grid>

            {!isDisabled && (
              <>
                <Grid item xs={12}>
                  <Alert severity="info">
                    <FormattedMessage
                      id="powered.by.custom.signature.info"
                      defaultMessage="You can customize the footer signature with your own text and link."
                    />
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values.customSignature?.enabled || false}
                        onChange={(e) => setFieldValue('customSignature.enabled', e.target.checked)}
                      />
                    }
                    label={
                      <FormattedMessage
                        id="enable.custom.signature"
                        defaultMessage="Enable Custom Signature"
                      />
                    }
                  />
                </Grid>

                {values.customSignature?.enabled && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={formatMessage({
                          id: "custom.signature.text",
                          defaultMessage: "Signature Text"
                        })}
                        value={values.customSignature.text || ''}
                        onChange={(e) => setFieldValue('customSignature.text', e.target.value)}
                        placeholder="Your Company Name"
                        size={isMobile ? 'small' : 'medium'}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={formatMessage({
                          id: "custom.signature.link",
                          defaultMessage: "Signature Link"
                        })}
                        value={values.customSignature.link || ''}
                        onChange={(e) => setFieldValue('customSignature.link', e.target.value)}
                        placeholder="https://yourwebsite.com"
                        size={isMobile ? 'small' : 'medium'}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.customSignature.showAppName ?? true}
                            onChange={(e) => setFieldValue('customSignature.showAppName', e.target.checked)}
                          />
                        }
                        label={
                          <FormattedMessage
                            id="show.app.name.in.signature"
                            defaultMessage="Show App Name"
                          />
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.customSignature.showLoveBy ?? true}
                            onChange={(e) => setFieldValue('customSignature.showLoveBy', e.target.checked)}
                          />
                        }
                        label={
                          <FormattedMessage
                            id="show.made.with.love"
                            defaultMessage="Show 'made with ❤️ by'"
                          />
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">
                        <FormattedMessage
                          id="signature.preview"
                          defaultMessage="Preview: {preview}"
                          values={{
                            preview: `${values.customSignature.showAppName ? `${config.name} ` : ''}${values.customSignature.showLoveBy ? 'made with ❤️ by ' : ''
                              }${values.customSignature.text || 'Your Company Name'}`
                          }}
                        />
                      </Typography>
                    </Grid>
                  </>
                )}
              </>
            )}

            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{
                    fontSize: isMobile ? '0.875rem' : undefined,
                    py: isMobile ? 0.75 : undefined,
                    px: isMobile ? 2 : undefined,
                  }}
                >
                  <FormattedMessage id="save" defaultMessage="Save" />
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
