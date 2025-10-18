import React from "react";
import { AppConfig } from "../modules/wizard/types/config";

interface IAdminContext {
  editSiteId?: number;
  editWidgetId?: number;
  editAppConfig?: AppConfig;
}

const ADMIN_INITIAL_VALUES: IAdminContext = {
  editSiteId: undefined,
  editWidgetId: undefined,
  editAppConfig: undefined,
};

export const AdminContext =
  React.createContext<IAdminContext>(ADMIN_INITIAL_VALUES);
