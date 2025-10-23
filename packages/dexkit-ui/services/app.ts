import defaultAppConfig from "../config/app.minimal.json";
import { AppConfig } from "../modules/wizard/types/config";

import { alpha, createTheme, darken, lighten } from "@mui/material/styles";
import { ThemeMode } from "../constants/enum";

function extractThemePalette(themeData: any): any {
  if (!themeData) return {};

  if (themeData.colorSchemes) {
    if (themeData.colorSchemes.light?.palette) {
      return { palette: themeData.colorSchemes.light.palette };
    }
    if (themeData.colorSchemes.dark?.palette) {
      return { palette: themeData.colorSchemes.dark.palette };
    }
  }

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
    let customThemeLight: any = {};
    let customThemeDark: any = {};

    if ((safeAppConfig as any)?.customThemeLight) {
      customThemeLight = JSON.parse((safeAppConfig as any).customThemeLight);
    }
    if ((safeAppConfig as any)?.customThemeDark) {
      customThemeDark = JSON.parse((safeAppConfig as any).customThemeDark);
    }

    if ((safeAppConfig as any)?.customTheme) {
      const parsedCustomTheme = JSON.parse((safeAppConfig as any).customTheme);
      if (parsedCustomTheme?.palette?.mode === ThemeMode.light) {
        customThemeLight = parsedCustomTheme;
      } else {
        customThemeDark = parsedCustomTheme;
      }
    }

    if (Object.keys(customThemeLight).length === 0 && Object.keys(customThemeDark).length > 0) {
      customThemeLight = {
        palette: {
          mode: 'light',
          primary: customThemeDark.palette?.primary || { main: '#1976d2' },
          secondary: customThemeDark.palette?.secondary || { main: '#dc004e' },
          background: {
            default: '#ffffff',
            paper: '#f5f5f5'
          },
          text: {
            primary: '#000000',
            secondary: '#666666'
          }
        }
      };
    }

    if (Object.keys(customThemeDark).length === 0 && Object.keys(customThemeLight).length > 0) {
      customThemeDark = {
        palette: {
          mode: 'dark',
          primary: customThemeLight.palette?.primary || { main: '#90caf9' },
          secondary: customThemeLight.palette?.secondary || { main: '#f48fb1' },
          background: {
            default: '#121212',
            paper: '#1e1e1e'
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0b0b0'
          }
        }
      };
    }

    const themeConfig = {
      cssVariables: {
        colorSchemeSelector: 'class',
      },
      colorSchemes: {
        light: customThemeLight,
        dark: customThemeDark,
      },
      ...(fontFamily && {
        typography: {
          fontFamily,
        }
      }),
      alpha,
      lighten,
      darken,
    };

    return createTheme(themeConfig);
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
    alpha,
    lighten,
    darken,
  };

  return createTheme(finalThemeConfig);
}

export function setupSEO({
  appConfig,
  appPage = "home",
}: {
  appConfig: AppConfig;
  appPage?: string;
}) {
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
}