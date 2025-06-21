
import useMediaQuery from "@mui/material/useMediaQuery";
import { useAtom } from "jotai";
import { useMemo } from "react";
import { useAppConfig } from "..";
import { ThemeMode } from "../../constants/enum";
import { userThemeModeAtom } from "../../state";
const DARK_SCHEME_QUERY = "(prefers-color-scheme: dark)";

export function useThemeMode() {
  const systemPrefersDark = useMediaQuery(DARK_SCHEME_QUERY);
  const [userMode, setThemeMode] = useAtom(userThemeModeAtom);
  const appConfig = useAppConfig();

  const mode = useMemo(() => {
    if (userMode) {
      return userMode;
    }
    if (appConfig?.defaultThemeMode) {
      return appConfig.defaultThemeMode;
    }
    return systemPrefersDark ? ThemeMode.dark : ThemeMode.light;
  }, [userMode, appConfig, systemPrefersDark]);

  return { mode: mode, setThemeMode, userMode };
}