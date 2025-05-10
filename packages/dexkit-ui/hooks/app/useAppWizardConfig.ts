import { useContext } from "react";
import { AppWizardConfigContext } from "../../context/AppWizardConfigContext";

// App config context needs to be initialized on widgets
export function useAppWizardConfig() {
  const { wizardConfig, setWizardConfig } = useContext(AppWizardConfigContext);
  return { wizardConfig, setWizardConfig };
}
