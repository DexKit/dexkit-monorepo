import React from 'react';

import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import { ConfigWizardProvider } from '../../providers/configWizardProvider';
import MainLayout from './main';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
  disableAutoLogin?: boolean;
}
/**
 * Use Auth Main Layout when you need authentication feature
 * @returns
 */
const AuthMainLayout: React.FC<Props> = ({
  children,
  noSsr,
  disablePadding,
  disableAutoLogin,
}) => {
  return (
    <ConfigWizardProvider>
      <AuthProvider disableAutoLogin={disableAutoLogin}>
        <MainLayout noSsr={noSsr} disablePadding={disablePadding}>
          {children}
        </MainLayout>
      </AuthProvider>
    </ConfigWizardProvider>
  );
};

export default AuthMainLayout;
