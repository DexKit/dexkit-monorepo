import { useIsMobile } from '@dexkit/core';
import {
  AppConfig,
  PageSectionsLayout,
} from '@dexkit/ui/modules/wizard/types/config';
import { AppPageSection } from '@dexkit/ui/modules/wizard/types/section';
import CloseIcon from '@mui/icons-material/Close';
import { CssBaseline, Dialog, DialogProps, IconButton, ThemeProvider, Typography, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useThemeMode } from 'src/hooks/app/useThemeMode';
import { getTheme } from 'src/theme';

const PreviewPagePlatform = dynamic(() => import('../PreviewPagePlatform'));

interface Props {
  dialogProps: DialogProps;
  sections?: AppPageSection[];
  name?: string;
  disabled?: boolean;
  withLayout?: boolean;
  appConfig?: AppConfig;
  page?: string;
  site?: string;
  index?: number;
  layout?: PageSectionsLayout;
}

export default function PreviewPageDialog({
  dialogProps,
  sections,
  name,
  disabled,
  withLayout,
  appConfig,
  page,
  site,
  index,
  layout,
}: Props) {
  const { onClose } = dialogProps;
  const isMobile = useIsMobile();
  const theme = useTheme();
  const { mode } = useThemeMode();

  const previewTheme = useMemo(() => {
    const themeName = appConfig?.theme || 'default-theme';
    const baseTheme = getTheme({ name: themeName });

    if (baseTheme && baseTheme.theme) {
      const colorScheme = mode === 'dark' ? 'dark' : 'light';
      const themeWithCorrectMode = {
        ...baseTheme.theme,
        colorSchemes: {
          ...baseTheme.theme.colorSchemes,
          [colorScheme]: {
            ...baseTheme.theme.colorSchemes[colorScheme],
            palette: {
              ...baseTheme.theme.colorSchemes[colorScheme].palette,
              mode: mode
            }
          }
        }
      };
      return themeWithCorrectMode;
    }

    return theme;
  }, [mode, appConfig, theme]);

  const handleClose = () => {
    if (onClose) {
      onClose({}, 'backdropClick');
    }
  };

  return (
    <Dialog
      {...dialogProps}
      sx={{ p: 0, m: 0 }}
      fullScreen={isMobile}
      maxWidth={isMobile ? false : 'xl'}
      PaperProps={{
        sx: {
          maxWidth: isMobile ? '100vw' : undefined,
          maxHeight: isMobile ? '100vh' : undefined,
          width: isMobile ? '100vw' : undefined,
          height: isMobile ? '100vh' : undefined,
          margin: isMobile ? 0 : undefined,
          borderRadius: isMobile ? 0 : undefined,
          overflow: 'auto',
          bgcolor: 'background.default',
          ...(isMobile && {
            display: 'flex',
            flexDirection: 'column',
          }),
        }
      }}
    >
      <ThemeProvider theme={previewTheme}>
        <CssBaseline />
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
            color: theme.palette.grey[500],
            zIndex: theme.zIndex.modal + 1,
            ...(isMobile && {
              right: theme.spacing(0.5),
              top: theme.spacing(0.5),
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }),
          }}
        >
          <CloseIcon />
        </IconButton>

        <PreviewPagePlatform
          sections={sections}
          disabled={disabled}
          withLayout={withLayout}
          appConfig={appConfig}
          enableOverflow={true}
          page={page}
          site={site}
          index={index}
          layout={layout}
          title={
            <Typography variant="body1">
              <FormattedMessage
                id="page.preview.title"
                defaultMessage="{title} page preview"
                values={{ title: name }}
              />
            </Typography>
          }
        />
      </ThemeProvider>
    </Dialog>
  );
}
