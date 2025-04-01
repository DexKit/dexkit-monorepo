import { useAtom } from "jotai";
import { useMemo } from "react";
import { localeUserAtom } from "../state";
import { useAppConfig } from "./useAppConfig";

export function useLocale() {
  const [locUser, setLocUser] = useAtom(localeUserAtom);
  const appConfig = useAppConfig();
  const locale = useMemo(() => {
    if (locUser) {
      return locUser;
    }
    if (appConfig.locale) {
      return appConfig.locale;
    }
    return "en-US" as string;
  }, [appConfig.locale, locUser]);
  return { locale, onChangeLocale: setLocUser };
}
