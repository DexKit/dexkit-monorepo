import React from 'react';

import MainLayout from '@dexkit/ui/components/layouts/main';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import { ConfigWizardProvider } from '@dexkit/ui/providers/configWizardProvider';
import { NoSsr } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AppMarketplaceProvider } from '../AppMarketplaceProvider';

interface Props {
  children?: any;
  noSsr?: boolean;
  disablePadding?: boolean;
  disableAutoLogin?: boolean;
  disableLayout?: boolean;
  appConfig?: AppConfig;
  isPreview?: boolean;
}
/**
 * Use Auth Main Layout when you need authentication feature
 * @returns
 */
const PreviewAuthLayout: any = ({
  children,
  noSsr,
  disablePadding,
  disableAutoLogin,
  disableLayout,
  appConfig,
  isPreview = true,
}: Props) => {
  const theme = useTheme();

  if (!disableLayout) {
    if (appConfig) {
      return (
        <ConfigWizardProvider>
          <AuthProvider disableAutoLogin={disableAutoLogin}>
            <AppMarketplaceProvider appConfig={appConfig} appPage="home">
              <MainLayout
                disablePadding={disablePadding}
                noSsr={noSsr}
                isPreview={isPreview}
                appConfigProps={appConfig}
              >
                {children}
              </MainLayout>
            </AppMarketplaceProvider>
          </AuthProvider>
        </ConfigWizardProvider>
      );
    }

    return (
      <ConfigWizardProvider>
        <AuthProvider disableAutoLogin={disableAutoLogin}>
          <MainLayout disablePadding={disablePadding} noSsr={noSsr} isPreview={isPreview}>
            {children}
          </MainLayout>
        </AuthProvider>
      </ConfigWizardProvider>
    );
  }

  return (
    <ConfigWizardProvider>
      <AuthProvider disableAutoLogin={disableAutoLogin}>
        <NoSsr>{children}</NoSsr>
      </AuthProvider>
    </ConfigWizardProvider>
  );
};

export default PreviewAuthLayout;
