import React, { Dispatch, SetStateAction } from 'react';
import { AppConfig } from '../types/config';

import { AssetAPI } from '@dexkit/ui/modules/nft/types';
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

export interface AuthUser {
  address?: string;
}

interface IAuthContext {
  isLoggedIn: boolean;
  user?: AuthUser;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<AuthUser | undefined>>;
}

const AUTH_INITIAL_VALUES = {
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  user: undefined,
  setUser: () => { },
};

export const AuthContext =
  React.createContext<IAuthContext>(AUTH_INITIAL_VALUES);

export const AuthStateContext =
  React.createContext<IAuthContext>(AUTH_INITIAL_VALUES);




