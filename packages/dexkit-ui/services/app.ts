import { useMemo } from "react";
import defaultAppConfig from "../constants/app.json";
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
    let tempTheme = getTheme({
      name: defaultAppConfig.theme,
    })?.theme;
    let fontFamily;
    if (appConfig?.font) {
      fontFamily = `'${appConfig.font.family}', ${appConfig.font.category}`;
    }

    if (appConfig) {
      tempTheme = getTheme({
        name: appConfig.theme,
      })?.theme;
    }

    if (appConfig && appConfig.theme === "custom") {
      let customTheme = {
        dark: {},
        light: {},
      };

      if (appConfig?.customThemeLight) {
        customTheme.light = JSON.parse(appConfig.customThemeLight);
      }
      if (appConfig?.customThemeDark) {
        customTheme.dark = JSON.parse(appConfig.customThemeDark);
      }
      //@deprecated remove customTheme later
      if (appConfig?.customTheme) {
        const parsedCustomTheme = JSON.parse(appConfig.customTheme);
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

    delete temp["vars"];

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
    const config = appConfig;

    if (config) {
      if (config.seo && appPage && config.seo[appPage]) {
        const pageSeo = config.seo[appPage];
        const seoConfig: any = {
          defaultTitle:
            pageSeo?.title || config.seo?.home?.title || config.name,
          titleTemplate: `${config.name} | %s`,
          description: pageSeo?.description || config.seo?.home?.description,
          canonical: config.domain,
          openGraph: {
            type: "website",
            description:
              pageSeo?.description || config.seo?.home?.description || "",
            locale: config.locale || "en_US",
            url: config.domain,
            site_name: config.name,
            images: pageSeo?.images || config.seo?.home?.images,
          },
        };

        if (config.social) {
          for (let social of config.social) {
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
          defaultTitle: config.seo?.home?.title || config.name,
          titleTemplate: `${config.name} | %s`,
          description: config.seo?.home?.description,
          canonical: config.domain,
          openGraph: {
            type: "website",
            description: config.seo?.home?.description || "",
            locale: config.locale || "en_US",
            url: config.domain,
            site_name: config.name,
            images: config.seo?.home?.images,
          },
        };

        if (config.social) {
          for (let social of config.social) {
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
