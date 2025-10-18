import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
const ZrxForm = dynamic(() => import('./ZrxForm'));

import CommerceIntegrationCard from '@dexkit/ui/modules/commerce/components/CommerceIntegrationCard';
import {
  AppConfig,
  CommerceConfig,
} from '@dexkit/ui/modules/wizard/types/config';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';
import {
  useAdminWhitelabelConfigQuery,
  useSendConfigMutation,
} from 'src/hooks/whitelabel';

export interface IntegrationsWizardContainerProps {
  siteId?: number;
}

export default function IntegrationsWizardContainer({
  siteId,
}: IntegrationsWizardContainerProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { slug } = router.query;

  const {
    data: config,
    error: configError,
    isLoading: isConfigLoading,
    isFetched,
    isError: isConfigError,
    refetch,
  } = useAdminWhitelabelConfigQuery({
    slug: slug as string,
  });

  const parsedConfig = useMemo(() => {
    const oldConfig: AppConfig = JSON.parse(
      config?.config || `{}`,
    ) as AppConfig;

    return oldConfig;
  }, [config]);

  const { enqueueSnackbar } = useSnackbar();

  const sendConfigMutation = useSendConfigMutation({ slug: config?.slug });

  const handleSaveCommerce = async (commerce: CommerceConfig) => {
    const newConfig = { ...parsedConfig, commerce } as AppConfig;

    try {
      await sendConfigMutation.mutateAsync({ config: newConfig });
      enqueueSnackbar(
        <FormattedMessage
          id="integration.updated.alt"
          defaultMessage="Integration updated"
        />,
        { variant: 'success' },
      );
    } catch (err) {
      enqueueSnackbar(String(err), { variant: 'error' });
    }

    await refetch();
  };

  return (
    <Box>
      <Grid container spacing={isMobile ? 1.5 : 3}>
        <Grid
          size={{
            xs: 12,
            sm: 8
          }}>
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
                    id="integrations"
                    defaultMessage="Integrations"
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
                    id="set.integrations.settings.for.your.app"
                    defaultMessage="Enable additional features to expand your app functionality."
                  />
                </Typography>
              </Stack>
            </Grid>
            <Grid size={12}>
              <Divider />
            </Grid>

            <Grid size={12}>
              <Typography
                variant={isMobile ? 'subtitle1' : 'h6'}
                sx={{
                  fontWeight: 600,
                  fontSize: isMobile ? '1rem' : '1.25rem',
                }}
              >
                <FormattedMessage
                  id="additional.features"
                  defaultMessage="Additional features"
                />
              </Typography>
            </Grid>
            {isFetched && (
              <Grid size={12}>
                <CommerceIntegrationCard
                  onSave={handleSaveCommerce}
                  commerce={parsedConfig.commerce}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
