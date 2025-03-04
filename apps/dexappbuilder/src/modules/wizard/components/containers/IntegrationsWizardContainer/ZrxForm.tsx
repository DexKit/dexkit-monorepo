import { Button, Grid } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import {
  useGetApiKeyQuery,
  useSaveApiKeyMutation,
} from '@/modules/wizard/hooks/integrations';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-mui';
import { useSnackbar } from 'notistack';

export interface ZrxFormProps {
  siteId?: number;
  dialog?: boolean;
}

export default function ZrxForm({ siteId, dialog }: ZrxFormProps) {
  const apiKeyQuery = useGetApiKeyQuery({ type: 'zrx', siteId: siteId });
  const saveApiKeyMutation = useSaveApiKeyMutation();

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async ({ apiKey }: { apiKey: string }) => {
    try {
      if (siteId) {
        await saveApiKeyMutation.mutateAsync({
          siteId: siteId,
          value: apiKey,
          type: 'zrx',
        });
        enqueueSnackbar(
          <FormattedMessage
            id="saved.successfully"
            defaultMessage="Saved successfully"
          />,
          { variant: 'success' }
        );
      }
    } catch (err) {
      enqueueSnackbar(String(enqueueSnackbar), { variant: 'error' });
    }
  };

  return apiKeyQuery.isSuccess ? (
    <Formik
      initialValues={{ apiKey: apiKeyQuery.data?.value || '' }}
      onSubmit={handleSubmit}
    >
      {({ submitForm, isSubmitting, isValid }) => (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={dialog ? 12 : 4}>
            <Field
              component={TextField}
              name="apiKey"
              size="small"
              fullWidth
              label={<FormattedMessage id="api.key" defaultMessage="API Key" />}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              disabled={isSubmitting || !isValid}
              onClick={submitForm}
              fullWidth={dialog}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  ) : null;
}
