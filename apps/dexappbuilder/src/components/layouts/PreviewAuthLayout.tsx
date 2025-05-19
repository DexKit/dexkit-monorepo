import React from 'react';

import MainLayout from '@dexkit/ui/components/layouts/main';
import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import { ConfigWizardProvider } from '@dexkit/ui/providers/configWizardProvider';
import { NoSsr } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
  disableAutoLogin?: boolean;
  disableLayout?: boolean;
}
/**
 * Use Auth Main Layout when you need authentication feature
 * @returns
 */
const PreviewAuthLayout: React.FC<Props> = ({
  children,
  noSsr,
  disablePadding,
  disableAutoLogin,
  disableLayout,
}) => {
  const theme = useTheme();

  if (!disableLayout) {
    return (
      <ConfigWizardProvider>
        <AuthProvider disableAutoLogin={disableAutoLogin}>
          <MainLayout disablePadding={disablePadding} noSsr={noSsr}>
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
