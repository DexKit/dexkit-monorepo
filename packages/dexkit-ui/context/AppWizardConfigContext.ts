import type { AppConfig } from "@dexkit/ui/modules/wizard/types/config";
import React from "react";
import defaultAppConfig from "../constants/app.json";

interface IAppWizardConfigContext {
  wizardConfig: AppConfig;
  setWizardConfig?: any;
}

export const AppWizardConfigContext =
  React.createContext<IAppWizardConfigContext>({
    wizardConfig: defaultAppConfig as AppConfig,
  });
