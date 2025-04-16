import { AppWizardConfigContext as AppUIWizardConfigContext } from '@dexkit/ui/context/AppConfigContext';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { ReactNode, useState } from 'react';
import defaultAppConfig from '../../config/app.json';
import { AppWizardConfigContext } from '../contexts';

interface Props {
  children: ReactNode;
}

export function ConfigWizardProvider(props: Props) {
  const [wizardConfig, setWizardConfig] = useState(
    defaultAppConfig as AppConfig,
  );

  const { children } = props;

  return (
    <AppWizardConfigContext.Provider value={{ wizardConfig, setWizardConfig }}>
      <AppUIWizardConfigContext.Provider
        value={{ wizardConfig, setWizardConfig }}
      >
        {children}
      </AppUIWizardConfigContext.Provider>
    </AppWizardConfigContext.Provider>
  );
}
