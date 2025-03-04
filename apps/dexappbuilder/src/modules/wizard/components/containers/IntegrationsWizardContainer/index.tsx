import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material';

import dynamic from 'next/dynamic';
import { FormattedMessage } from 'react-intl';
import DarkblockForm from './DarkblockForm';
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
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Stack>
                <Typography variant="h6">
                  <FormattedMessage
                    id="integrations"
                    defaultMessage="Integrations"
                  />
                </Typography>
                <Typography variant="body2">
                  <FormattedMessage
                    id="set.integrations.settings.for.your.app"
                    defaultMessage="Integrate external resources and enable additional features to expand your app."
                  />
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <FormattedMessage
                  id="external.resources"
                  defaultMessage="External resources"
                />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    {/* <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        <FormattedMessage id="0x.api" defaultMessage="0x API" />
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle2"
                        color="text.secondary"
                      >
                        <FormattedMessage
                          id="0x.is.a.decentralized.exchange.protocol.description"
                          defaultMessage="0x is a decentralized exchange protocol on Ethereum, enabling peer-to-peer trading of various digital assets through open standards and smart contracts. This API key is used for the swap and limit order features."
                        />
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <FormattedMessage
                          id="access.the.0x.dashboard.to.get.your.api.key"
                          defaultMessage="Access the 0x dashboard to get your API Key"
                        />
                        :{' '}
                        <Link target="_blank" href="https://dashboard.0x.org/">
                          <FormattedMessage
                            id="0x.dashboard"
                            defaultMessage="0x Dashboard"
                          />
                        </Link>
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <ZrxForm siteId={siteId} />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
  </Grid>*/}
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography
                            gutterBottom
                            variant="h6"
                            fontWeight="bold"
                          >
                            <FormattedMessage
                              id="darkblock"
                              defaultMessage="Darkblock"
                            />
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            <FormattedMessage
                              id="darkblock.one.line.description"
                              defaultMessage="Darkblock is a decentralized protocol that enables content creators to publish and share exclusive content tied to their NFTs, without depending on centralized token-gating platforms. By leveraging NFTs, Darkblock provides access to unlockable content exclusively by NFT holders, enhancing the value of digital assets."
                            />
                          </Typography>
                          <Typography
                            gutterBottom
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            <FormattedMessage
                              id="darkblock.one.line.description.two"
                              defaultMessage="In DexAppBuilder, the integration with Darkblock is utilized on the NFTs page (individual asset or collection) for the networks supported by Darkblock."
                            />
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <FormattedMessage
                              id="access.darkblock.to.get.more.information"
                              defaultMessage="Access darkblock to get more information"
                            />
                            :{' '}
                            <Link target="_blank" href="https://darkblock.io/">
                              <FormattedMessage
                                id="darkblock.io"
                                defaultMessage="Darkblock.io"
                              />
                            </Link>
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <DarkblockForm siteId={siteId} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1">
                <FormattedMessage
                  id="additional.features"
                  defaultMessage="Additional features"
                />
              </Typography>
            </Grid>
            {isFetched && (
              <Grid item xs={12}>
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
