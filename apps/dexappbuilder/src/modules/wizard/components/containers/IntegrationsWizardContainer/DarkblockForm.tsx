import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  Tooltip,
} from '@mui/material';
import { FormattedMessage } from 'react-intl';

import {
  useIntegrationDataQuery,
  useSaveIntegrationMutation,
} from '@/modules/wizard/hooks/integrations';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';

export interface DarkblockFormProps {
  siteId?: number;
}

export default function DarkblockForm({ siteId }: DarkblockFormProps) {
  const darkblockQuery = useIntegrationDataQuery({ type: 'darkblock', siteId });
  const saveApiKeyMutation = useSaveIntegrationMutation({
    type: 'darkblock',
    siteId,
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async ({
    enableDarkblock,
    enableDarkblockCollection,
  }: {
    enableDarkblock: boolean;
    enableDarkblockCollection: boolean;
  }) => {
    try {
      if (siteId) {
        await saveApiKeyMutation.mutateAsync({
          data: { enableDarkblock, enableDarkblockCollection },
        });
        enqueueSnackbar(
          <FormattedMessage
            id="saved.successfully"
            defaultMessage="Saved successfully"
          />,
          { variant: 'success' },
        );
      }
    } catch (err) {
      enqueueSnackbar(String(enqueueSnackbar), { variant: 'error' });
    }
  };

  return darkblockQuery.isSuccess ? (
    <Formik
      initialValues={
        darkblockQuery.data
          ? darkblockQuery.data?.settings
          : { enableDarkblock: false }
      }
      onSubmit={handleSubmit}
    >
      {({
        submitForm,
        isSubmitting,
        isValid,
        setFieldValue,
        setFieldTouched,
        values,
        touched,
      }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box>
              <Stack alignItems="flex-start">
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Tooltip
                      title={
                        <FormattedMessage
                          id="enable.darkblock.on.asset.page"
                          defaultMessage="Darkblock on Asset page"
                        />
                      }
                      placement="right-end"
                    >
                      <Switch
                        onChange={(e) => {
                          setFieldValue('enableDarkblock', e.target.checked);
                          setFieldTouched('enableDarkblock', true);
                        }}
                        checked={values.enableDarkblock}
                      />
                    </Tooltip>
                  }
                  labelPlacement="start"
                  label={
                    <FormattedMessage
                      id="enable.darkblock"
                      defaultMessage="Enable Darkblock Asset"
                    />
                  }
                />
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Tooltip
                      title={
                        <FormattedMessage
                          id="enable.darkblock.on.collection.page"
                          defaultMessage="Enable Darkblock on Collection page"
                        />
                      }
                      placement="right-end"
                    >
                      <Switch
                        onChange={(e) => {
                          setFieldValue(
                            'enableDarkblockCollection',
                            e.target.checked,
                          );
                          setFieldTouched('enableDarkblockCollection', true);
                        }}
                        checked={values.enableDarkblockCollection}
                      />
                    </Tooltip>
                  }
                  labelPlacement="start"
                  label={
                    <FormattedMessage
                      id="enable.darkblock.collection"
                      defaultMessage="Enable Darkblock Collection"
                    />
                  }
                />
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              size="small"
              variant="contained"
              disabled={
                isSubmitting ||
                !isValid ||
                !touched ||
                Object.keys(touched).filter((key) =>
                  Boolean((touched as any)?.[key]),
                ).length === 0
              }
              onClick={submitForm}
            >
              <FormattedMessage id="save" defaultMessage="Save" />
            </Button>
          </Grid>
        </Grid>
      )}
    </Formik>
  ) : null;
}
