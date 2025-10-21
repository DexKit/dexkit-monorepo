import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onHasChanges: (hasChanges: boolean) => void;
}

interface AnalyticsOptions {
  googleAnalytics?: string;
}

const AnalyticOptionsSchema: Yup.SchemaOf<AnalyticsOptions> =
  Yup.object().shape({
    googleAnalytics: Yup.string(),
  });

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

export default function AnalyticsWizardContainer({
  config,
  onSave,
  onHasChanges,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Formik
      initialValues={{
        googleAnalytics: config.analytics?.gtag,
      }}
      validationSchema={AnalyticOptionsSchema}
      onSubmit={(value, helpers) => {
        let analytics = { ...config?.analytics };
        analytics.gtag = value.googleAnalytics;
        config.analytics = analytics;
        onSave(config);
        helpers.resetForm();
      }}
    >
      {({ submitForm, dirty }: any) => (
        <>
          <ListenDirty onHasChanges={onHasChanges} dirty={dirty} />
          <Form>
            <Grid container spacing={isMobile ? 1.5 : 3}>
              <Grid size={12}>
                <Stack spacing={isMobile ? 0.5 : 1} sx={{ mb: isMobile ? 1.5 : 2 }}>
                  <Typography
                    variant={isMobile ? 'h6' : 'h5'}
                    sx={{
                      fontSize: isMobile ? '1.15rem' : '1.5rem',
                      fontWeight: 600,
                      mb: 0.5
                    }}
                  >
                    <FormattedMessage
                      id="Analytics"
                      defaultMessage="Analytics"
                    />
                  </Typography>
                  <Typography
                    variant={isMobile ? 'body2' : 'body1'}
                    color="text.secondary"
                    sx={{
                      fontSize: isMobile ? '0.85rem' : 'inherit',
                    }}
                  >
                    <FormattedMessage
                      id="analytics.wizard.description"
                      defaultMessage="Add Google Analytics to your app"
                    />
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Divider />
              </Grid>

              <Grid size={12}>
                <Stack spacing={isMobile ? 1 : 2}>
                  <Box>
                    <Field
                      component={TextField}
                      name="googleAnalytics"
                      label={
                        <FormattedMessage
                          id={'google.analytics.tag'}
                          defaultMessage={'Google analytics tag'}
                        />
                      }
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant={isMobile ? 'body2' : 'body1'}
                      color="text.secondary"
                      sx={{
                        fontSize: isMobile ? '0.85rem' : 'inherit',
                      }}
                    >
                      <FormattedMessage
                        id={'google.analytics.example.tag'}
                        defaultMessage={' Example of tag: G-LWRHJH7JLF'}
                      />
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              <Grid size={12}>
                <Divider />
              </Grid>
              <Grid size={12}>
                <Stack spacing={1} direction="row" justifyContent="flex-end">
                  <Button
                    disabled={!dirty}
                    variant="contained"
                    color="primary"
                    onClick={submitForm}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      fontSize: isMobile ? "0.875rem" : undefined,
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
        </>
      )}
    </Formik>
  );
}
