import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { Field, Form, Formik } from 'formik';
import { CheckboxWithLabel } from 'formik-mui';
import { FormattedMessage, useIntl } from 'react-intl';
import * as Yup from 'yup';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  isDisabled: boolean;
  hasNFT: boolean;
}

interface HideOptions {
  hide_powered_by?: boolean;
}

const SocialOptionsSchema: Yup.SchemaOf<HideOptions> = Yup.object().shape({
  hide_powered_by: Yup.boolean(),
});

export default function HidePoweredContainer({
  config,
  onSave,
  isDisabled,
  hasNFT,
}: Props) {
  const { formatMessage } = useIntl();
  return (
    <Formik
      initialValues={{
        hide_powered_by: config.hide_powered_by || false,
      }}
      validationSchema={SocialOptionsSchema}
      onSubmit={(values, helpers) => {
        config.hide_powered_by = values.hide_powered_by;
        onSave(config);
      }}
    >
      {({ submitForm }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {!hasNFT && isDisabled && (
                <Alert severity={'warning'}>
                  <FormattedMessage
                    id="powered.by.dexkit.info"
                    defaultMessage='To remove the "Powered by DexKit" branding, click "Create NFT" to associate an NFT with your app.'
                  />
                </Alert>
              )}
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
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1} direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitForm}
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
