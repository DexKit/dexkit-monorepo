import React from "react";
import defaultAppConfig from "../config/app.json";
import { AssetAPI } from "../modules/nft/types";
import { AppConfig } from "../modules/wizard/types/config";

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
