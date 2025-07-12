import { useTheme } from "@mui/material";
import { useMemo } from "react";
import { AppConfig } from "../modules/wizard/types/config";

export function useSidebarVariant(appConfig?: AppConfig) {
  const theme = useTheme();

  const sidebarInfo = useMemo(() => {
    const isSidebar = appConfig?.menuSettings?.layout?.type === "sidebar";
    const sidebarVariant = appConfig?.menuSettings?.layout?.variant;
    const isMini = isSidebar && sidebarVariant === "mini";
    const isDense = isSidebar && sidebarVariant === "dense";
    const isProminent = isSidebar && sidebarVariant === "prominent";
    const miniSidebarSettings = appConfig?.menuSettings?.layout?.miniSidebarSettings;
    const startExpanded = miniSidebarSettings?.startExpanded ?? false;

    return {
      isSidebar,
      sidebarVariant,
      isMini,
      isDense,
      isProminent,
      miniSidebarSettings,
      startExpanded,
    };
  }, [appConfig?.menuSettings?.layout]);

  const getSidebarWidth = useMemo(() => {
    if (!sidebarInfo.isSidebar) return 0;
    if (sidebarInfo.isDense) return 180;
    if (sidebarInfo.isProminent) return 320;
    return theme.breakpoints.values.sm / 2;
  }, [sidebarInfo, theme.breakpoints.values.sm]);

  return {
    ...sidebarInfo,
    getSidebarWidth,
  };
} 