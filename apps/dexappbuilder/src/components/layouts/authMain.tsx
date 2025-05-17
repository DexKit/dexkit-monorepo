import React from 'react';

import { AuthProvider } from '@dexkit/ui/providers/authProvider';
import { NftProfileValidator } from '../../modules/user/componentes/NftProfileValidator';
import { ConfigWizardProvider } from '../../providers/configWizardProvider';
import MainLayout from './main';

interface Props {
  children?: React.ReactNode | React.ReactNode[];
  noSsr?: boolean;
  disablePadding?: boolean;
  disableAutoLogin?: boolean;
}
const AuthMainLayout: React.FC<Props> = ({
  children,
  noSsr,
  disablePadding,
  disableAutoLogin,
}) => {
  return (
    <ConfigWizardProvider>
      <AuthProvider disableAutoLogin={disableAutoLogin}>
        <NftProfileValidator checkIntervalSeconds={300} />
        <MainLayout noSsr={noSsr} disablePadding={disablePadding}>
          {children}
        </MainLayout>
      </AuthProvider>
    </ConfigWizardProvider>
  );
};

export default AuthMainLayout;
