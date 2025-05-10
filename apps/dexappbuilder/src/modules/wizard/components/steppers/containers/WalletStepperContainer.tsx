import AppConfirmDialog from '@dexkit/ui/components/AppConfirmDialog';
import { useMediaQuery, useTheme } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { PageHeader } from '@dexkit/ui/components/PageHeader';
import { useSendConfigMutation } from 'src/hooks/whitelabel';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { SiteResponse } from 'src/types/whitelabel';
import theDefaultConfig from '../../../../../../config/quick.wallet.default.app.json';
import { PreviewAppButton } from '../../PreviewAppButton';
import { WelcomeMessage } from '../../WelcomeMessage';
import SignConfigDialog from '../../dialogs/SignConfigDialog';
import WalletStepper from '../WalletStepper.tsx';
const defaultConfig = theDefaultConfig as unknown as AppConfig;

interface Props {
  site?: SiteResponse | null;
}

export default function WalletStepperContainer({ site }: Props) {
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
              id="create.wallet.app"
              defaultMessage="Create wallet app"
            />
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary">
            <FormattedMessage
              id="do.you.really.want.to.create.a.wallet.app"
              defaultMessage="Do you really want to create a wallet app?"
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
                      id="wallet.quick.builder.title"
                      defaultMessage="Wallet - Quick Builder"
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
                  id="build.your.wallet.quickly"
                  defaultMessage="Build your Wallet quickly"
                />
              </Typography>
            )}
            <Stack direction={'row'} spacing={2}>
              <PreviewAppButton appConfig={wizardConfig} site={site?.slug} />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={12}>
          <WalletStepper
            onSave={handleSave}
            onChange={handleChange}
            config={wizardConfig}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
