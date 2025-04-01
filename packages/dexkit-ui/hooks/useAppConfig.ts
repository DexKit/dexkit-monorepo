import { useContext } from "react";
import { AppConfigContext } from "../context/AppConfigContext";

// App config context needs to be initialized on widgets
export function useAppConfig() {
  return useContext(AppConfigContext).appConfig;
}
