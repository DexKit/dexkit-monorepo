import React from 'react';

import type { AssetAPI } from '@dexkit/ui/modules/nft/types';
import type { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import defaultAppConfig from '../../config/app.json';

import { AppWizardConfigContext } from '@dexkit/ui/context/AppWizardConfigContext';
export { AppWizardConfigContext };

export const AppConfigContext = React.createContext<{
  appConfig: AppConfig;
  appNFT?: AssetAPI;
  siteId?: number;
}>({
  appConfig: defaultAppConfig as AppConfig,
});
