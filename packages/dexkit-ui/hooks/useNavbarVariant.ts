import { useMemo } from "react";
import { AppConfig } from "../modules/wizard/types/config";

export function useNavbarVariant(appConfig?: AppConfig) {
  const navbarInfo = useMemo(() => {
    const isNavbar = appConfig?.menuSettings?.layout?.type === "navbar";
    const navbarVariant = appConfig?.menuSettings?.layout?.variant;
    const isDefault = isNavbar && (navbarVariant === "default" || !navbarVariant);
    const isGlass = isNavbar && navbarVariant === "glass";
    const isCustom = isNavbar && navbarVariant === "custom";
    const isBottom = isNavbar && navbarVariant === "bottom";

    const glassSettings = appConfig?.menuSettings?.layout?.glassSettings;
    const customSettings = appConfig?.menuSettings?.layout?.customSettings;

    return {
      isNavbar,
      navbarVariant,
      isDefault,
      isGlass,
      isCustom,
      isBottom,
      glassSettings,
      customSettings,
    };
  }, [appConfig?.menuSettings?.layout]);

  return navbarInfo;
} 