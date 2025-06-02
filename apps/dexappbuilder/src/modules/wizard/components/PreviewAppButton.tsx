import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import dynamic from 'next/dynamic';
import { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useThemeMode } from 'src/hooks/app';

import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import { generateCSSVarsTheme } from '../utils';
const PreviewPageDialog = dynamic(() => import('./dialogs/PreviewPageDialog'));

interface Props {
  appConfig?: AppConfig;
  site?: string;
}

export function PreviewAppButton({ appConfig, site }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const { mode } = useThemeMode();
  const handleClosePreview = () => {
    setShowPreview(false);
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };
  const customThemeDark = useMemo(() => {
    if (appConfig?.customThemeDark) {
      return JSON.parse(appConfig?.customThemeDark);
    }
    return {};
  }, [appConfig?.customThemeDark]);

  const customThemeLight = useMemo(() => {
    if (appConfig?.customThemeLight) {
      return JSON.parse(appConfig?.customThemeLight);
    }
    return {};
  }, [appConfig?.customThemeLight]);

  const selectedTheme = useMemo(() => {
    return generateCSSVarsTheme({
      cssVarPrefix: 'theme-preview',
      selectedFont: appConfig?.font,
      customTheme: {
        colorSchemes: {
          dark: {
            ...customThemeDark,
          },
          light: {
            ...customThemeLight,
          },
        },
      },
      selectedThemeId: appConfig?.theme || '',
      mode,
    });
  }, [appConfig?.theme, appConfig?.font, customThemeLight, customThemeDark]);

  return (
    <>
      <CssVarsProvider theme={selectedTheme}>
        <PreviewPageDialog
          dialogProps={{
            open: showPreview,
            maxWidth: 'xl',
            fullWidth: true,
            onClose: handleClosePreview,
          }}
          appConfig={appConfig}
          disabled={true}
          sections={appConfig?.pages['home']?.sections}
          name="Home"
          withLayout={true}
          page="home"
          site={site}
        />
      </CssVarsProvider>
      <Button
        onClick={handleShowPreview}
        startIcon={<VisibilityIcon />}
        size="small"
        variant="outlined"
        className={'preview-app-button'}
      >
        <FormattedMessage id="preview.app" defaultMessage="Preview App" />
      </Button>
    </>
  );
}
