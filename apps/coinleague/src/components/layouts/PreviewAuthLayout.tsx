import React from 'react';

import MainLayout from '@dexkit/ui/components/layouts/main';
import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import { NoSsr } from '@mui/material';
import { ConfigWizardProvider } from '../../providers/configWizardProvider';

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
