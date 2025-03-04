import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useMediaQuery, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useSendConfigMutation } from 'src/hooks/whitelabel';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { SiteResponse } from 'src/types/whitelabel';
import theDefaultConfig from '../../../../../../config/quick.store.default.app.json';
import { PreviewAppButton } from '../../PreviewAppButton';
import SignConfigDialog from '../../dialogs/SignConfigDialog';
import AssetStoreStepper from '../AssetStoreStepper.tsx';

import { WelcomeMessage } from '../../WelcomeMessage';
const defaultConfig = theDefaultConfig as unknown as AppConfig;

interface Props {
  site?: SiteResponse | null;
}

export default function AssetStoreStepperContainer({ site }: Props) {
  const sendConfigMutation = useSendConfigMutation({ slug: site?.slug });
  const [showConfirmSendConfig, setShowConfirmSendConfig] = useState(false);
  const router = useRouter();
  const [wizardConfig, setWizardConfig] = useState(defaultConfig);
  const config = useMemo(() => {
    if (site?.config) {
      return JSON.parse(site?.config);
    }
  }, [site?.config]);

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showSendingConfig, setShowSendingConfig] = useState(false);
  useEffect(() => {
    if (config) {
      setWizardConfig(config);
    }
  }, [config]);
  // Pages forms
  const handleCloseConfirmSendConfig = () => {
    setShowConfirmSendConfig(false);
  };

  const handleConfirmSendConfig = async () => {
    setShowConfirmSendConfig(false);
    setShowSendingConfig(true);
  };

  const handleSave = (_config: AppConfig) => {
    setShowConfirmSendConfig(true);
    const newSite = { ...site, config: _config };
    sendConfigMutation.mutate(newSite);
  };

  const handleChange = useCallback(
    (_config: AppConfig) => {
      const newConfig = { ...wizardConfig, ..._config };
      setWizardConfig(newConfig);
    },

    [wizardConfig, setWizardConfig],
  );

  const handleCloseSendingConfig = () => {
    setShowSendingConfig(false);
    const data = sendConfigMutation?.data;
    if (data && data?.slug) {
      router.push(`/admin/edit/${data.slug}`);
    }
    sendConfigMutation.reset();
  };

  return (
    <Container maxWidth={'xl'}>
      <AppConfirmDialog
        DialogProps={{
          open: showConfirmSendConfig,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseConfirmSendConfig,
        }}
        onConfirm={handleConfirmSendConfig}
      >
        <Stack>
          <Typography variant="h5" align="center">
            <FormattedMessage
              id="create.nft.store.app"
              defaultMessage="Create nft store app"
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="do.you.really.want.to.create.a.nft.store.app"
              defaultMessage="Do you really want to create a nft store app?"
            />
          </Typography>
        </Stack>
      </AppConfirmDialog>
      <SignConfigDialog
        dialogProps={{
          open: showSendingConfig,
          maxWidth: 'xs',
          fullWidth: true,
          onClose: handleCloseSendingConfig,
        }}
        isLoading={sendConfigMutation.isLoading}
        isSuccess={sendConfigMutation.isSuccess}
        error={sendConfigMutation.error}
        isEdit={true}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            alignContent="center"
            justifyContent="space-between"
          >
            <PageHeader
              breadcrumbs={[
                {
                  caption: (
                    <FormattedMessage id="admin" defaultMessage="Admin" />
                  ),
                  uri: '/admin',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="manage.apps"
                      defaultMessage="Manage Apps"
                    />
                  ),
                  uri: '/admin',
                },
                {
                  caption: (
                    <FormattedMessage
                      id="nft.store.quick.builder.title"
                      defaultMessage="NFT Store - Quick Builder"
                    />
                  ),
                  uri: '/admin/quick-wizard/builder',
                  active: true,
                },
              ]}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <WelcomeMessage />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            {!isMobile && (
              <Typography variant="h5">
                <FormattedMessage
                  id="build.your.nft.store.quickly"
                  defaultMessage="Build your NFT Store quickly"
                />
              </Typography>
            )}
            <Stack direction={'row'} spacing={2}>
              <PreviewAppButton appConfig={wizardConfig} />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <AssetStoreStepper
            onSave={handleSave}
            onChange={handleChange}
            config={wizardConfig}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
