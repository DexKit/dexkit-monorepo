import React from 'react';


import type { AssetAPI } from '@dexkit/ui/modules/nft/types';
import type { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import defaultAppConfig from '../../config/app.json';

export const AppConfigContext = React.createContext<{
  appConfig: AppConfig;
  appNFT?: AssetAPI;
  siteId?: number;
}>({
  appConfig: defaultAppConfig as AppConfig,
});

interface IAppWizardConfigContext {
  wizardConfig: AppConfig;
  setWizardConfig?: any;
}

export const AppWizardConfigContext =
  React.createContext<IAppWizardConfigContext>({
    wizardConfig: defaultAppConfig as AppConfig,
  });







