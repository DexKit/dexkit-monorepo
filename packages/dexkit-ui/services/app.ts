import { useMemo } from "react";
import defaultAppConfig from "../config/app.minimal.json";
import { AppConfig } from "../modules/wizard/types/config";

import { experimental_extendTheme as extendTheme } from "@mui/material/styles";
import { ThemeMode } from "../constants/enum";

export function setupTheme({
  appConfig,
  getTheme,
}: {
  appConfig: AppConfig;
  getTheme: ({ name }: { name: string }) => any;
}) {
  return useMemo(() => {
    const safeAppConfig = appConfig || defaultAppConfig;

    let tempTheme = getTheme({
      name: defaultAppConfig.theme,
    })?.theme;

    let fontFamily;
    if (safeAppConfig?.font) {
      fontFamily = `'${safeAppConfig.font.family}', ${safeAppConfig.font.category}`;
    }

    tempTheme = getTheme({
      name: safeAppConfig.theme || defaultAppConfig.theme,
    })?.theme;

    if (safeAppConfig && safeAppConfig.theme === "custom") {
      let customTheme = {
        dark: {},
        light: {},
      };

      if (safeAppConfig?.customThemeLight) {
        customTheme.light = JSON.parse(safeAppConfig.customThemeLight);
      }
      if (safeAppConfig?.customThemeDark) {
        customTheme.dark = JSON.parse(safeAppConfig.customThemeDark);
      }
      //@deprecated remove customTheme later
      if (safeAppConfig?.customTheme) {
        const parsedCustomTheme = JSON.parse(safeAppConfig.customTheme);
        if (parsedCustomTheme?.palette?.mode === ThemeMode.light) {
          customTheme.light = parsedCustomTheme;
        } else {
          customTheme.dark = parsedCustomTheme;
        }
      }

      if (customTheme) {
        return fontFamily
          ? extendTheme({
            typography: {
              fontFamily,
            },
            colorSchemes: {
              ...customTheme,
            },
          })
          : extendTheme({
            colorSchemes: {
              ...customTheme,
            },
          });
      }
    }

    let temp: any = tempTheme;

    if (temp) {
      delete temp["vars"];
    } else {
      temp = getTheme({
        name: "default-theme",
      })?.theme;

      if (temp) {
        delete temp["vars"];
      }
    }

    return fontFamily
      ? extendTheme({
        ...temp,
        typography: {
          fontFamily,
        },
      })
      : extendTheme({ ...temp });
  }, [appConfig]);
}

export function setupSEO({
  appConfig,
  appPage = "home",
}: {
  appConfig: AppConfig;
  appPage?: string;
}) {
  return useMemo(() => {
    const safeAppConfig = appConfig || defaultAppConfig;

    if (safeAppConfig) {
      if (safeAppConfig.seo && appPage && safeAppConfig.seo[appPage]) {
        const pageSeo = safeAppConfig.seo[appPage];
        const seoConfig: any = {
          defaultTitle:
            pageSeo?.title || safeAppConfig.seo?.home?.title || safeAppConfig.name,
          titleTemplate: `${safeAppConfig.name} | %s`,
          description: pageSeo?.description || safeAppConfig.seo?.home?.description,
          canonical: safeAppConfig.domain,
          openGraph: {
            type: "website",
            description:
              pageSeo?.description || safeAppConfig.seo?.home?.description || "",
            locale: safeAppConfig.locale || "en_US",
            url: safeAppConfig.domain,
            site_name: safeAppConfig.name,
            images: pageSeo?.images || safeAppConfig.seo?.home?.images,
          },
        };

        if (safeAppConfig.social) {
          for (let social of safeAppConfig.social) {
            if (social.type === "twitter") {
              seoConfig.twitter = {
                handle: `@${social.handle}`,
                site: `@${social.handle}`,
                cardType: "summary_large_image",
              };
            }
          }
        }
        return seoConfig;
      } else {
        const seoConfig: any = {
          defaultTitle: safeAppConfig.seo?.home?.title || safeAppConfig.name,
          titleTemplate: `${safeAppConfig.name} | %s`,
          description: safeAppConfig.seo?.home?.description,
          canonical: safeAppConfig.domain,
          openGraph: {
            type: "website",
            description: safeAppConfig.seo?.home?.description || "",
            locale: safeAppConfig.locale || "en_US",
            url: safeAppConfig.domain,
            site_name: safeAppConfig.name,
            images: safeAppConfig.seo?.home?.images,
          },
        };

        if (safeAppConfig.social) {
          for (let social of safeAppConfig.social) {
            if (social.type === "twitter") {
              seoConfig.twitter = {
                handle: `@${social.handle}`,
                site: `@${social.handle}`,
                cardType: "summary_large_image",
              };
            }
          }
        }

        return seoConfig;
      }
    }
  }, [appConfig, appPage]);
}
