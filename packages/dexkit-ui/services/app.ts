import { useMemo } from "react";
import defaultAppConfig from "../config/app.minimal.json";
import { AppConfig } from "../modules/wizard/types/config";

import { createTheme } from "@mui/material/styles";
import { alpha, lighten, darken } from "@mui/material/styles";
import { ThemeMode } from "../constants/enum";

// Helper function to safely extract palette from dynamic theme structure
function extractThemePalette(themeData: any): any {
  if (!themeData) return {};
  
  // Try new MUI v7 structure first
  if (themeData.colorSchemes) {
    if (themeData.colorSchemes.light?.palette) {
      return { palette: themeData.colorSchemes.light.palette };
    }
    if (themeData.colorSchemes.dark?.palette) {
      return { palette: themeData.colorSchemes.dark.palette };
    }
  }
  
  // Try legacy structure
  if (themeData.light?.palette) {
    return { palette: themeData.light.palette };
  }
  if (themeData.dark?.palette) {
    return { palette: themeData.dark.palette };
  }
  
  return {};
}

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
    if ((safeAppConfig as any)?.font) {
      fontFamily = `'${(safeAppConfig as any).font.family}', ${(safeAppConfig as any).font.category}`;
    }

    tempTheme = getTheme({
      name: safeAppConfig.theme || defaultAppConfig.theme,
    })?.theme;

    if (safeAppConfig && safeAppConfig.theme === "custom") {
      let customTheme: any = {
        dark: {},
        light: {},
      };

      if ((safeAppConfig as any)?.customThemeLight) {
        customTheme.light = JSON.parse((safeAppConfig as any).customThemeLight);
      }
      if ((safeAppConfig as any)?.customThemeDark) {
        customTheme.dark = JSON.parse((safeAppConfig as any).customThemeDark);
      }
      //@deprecated remove customTheme later
      if ((safeAppConfig as any)?.customTheme) {
        const parsedCustomTheme = JSON.parse((safeAppConfig as any).customTheme);
        if (parsedCustomTheme?.palette?.mode === ThemeMode.light) {
          customTheme.light = parsedCustomTheme;
        } else {
          customTheme.dark = parsedCustomTheme;
        }
      }

      if (customTheme) {
        const paletteProps = extractThemePalette(customTheme);
        const themeConfig = {
          cssVariables: {
            colorSchemeSelector: 'class',
          },
          ...customTheme,
          ...paletteProps,
          ...(fontFamily && {
            typography: {
              fontFamily,
            }
          }),
          // Add color manipulation functions for MUI v7
          alpha,
          lighten,
          darken,
        };
        
        return createTheme(themeConfig);
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

    // Extract palette from temp theme using helper function
    const paletteProps = extractThemePalette(temp);
    
    const finalThemeConfig = {
      cssVariables: {
        colorSchemeSelector: 'class',
      },
      ...temp,
      ...paletteProps,
      ...(fontFamily && {
        typography: {
          fontFamily,
        }
      }),
      // Add color manipulation functions for MUI v7
      alpha,
      lighten,
      darken,
    };
    
    return createTheme(finalThemeConfig);
  }, [appConfig, getTheme]);
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