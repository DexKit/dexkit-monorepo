import { ThemeMode } from '@dexkit/ui/constants/enum';
import {
  Box,
  Grid,
  Stack,
  SupportedColorScheme,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { CustomThemeInterface } from '../../state';
import { ThemeFormType } from '../../types';
import { mapObject } from '../../utils';
import EditThemeForm from '../EditThemeForm';

interface Props {
  selectedId?: string;
  mode?: ThemeMode;
  legacyTheme?: string;
  onSetCustomThemeDark: (theme: CustomThemeInterface) => void;
  onSetCustomThemeLight: (theme: CustomThemeInterface) => void;
  customThemeDark?: CustomThemeInterface;
  customThemeLight?: CustomThemeInterface;
  onSelect: (id: string) => void;
  onPreview: () => void;
}

export default function ThemeSection({
  selectedId,
  mode,
  onSelect,
  legacyTheme,
  onPreview,
  customThemeDark,
  customThemeLight,
  onSetCustomThemeDark,
  onSetCustomThemeLight,
}: Props) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = useCallback(
    (values: ThemeFormType) => {
      if (selectedId !== undefined && selectedId !== values.themeId) {
        onSelect(values.themeId);
      }

      if (selectedId !== undefined) {
        let data: CustomThemeInterface = {
          palette: {},
          shape: {},
        };

        mapObject(data.palette, values, {
          'background.default': 'background',
          'background.paper': 'paper',
          'secondary.main': 'secondary',
          'text.primary': 'text',
          'primary.main': 'primary',
          'success.main': 'success',
          'error.main': 'error',
          'info.main': 'info',
          'warning.main': 'warning',
        });

        mapObject(data.shape, values, {
          borderRadius: 'borderRadius',
        });

        if (mode === ThemeMode.dark) {
          onSetCustomThemeDark({
            palette: {
              ...customThemeDark?.palette,
              ...data.palette,
            },
            shape: {
              ...customThemeDark?.shape,
              ...data.shape,
            },
          });
        } else {
          onSetCustomThemeLight({
            palette: {
              ...customThemeLight?.palette,
              ...data.palette,
            },
            shape: {
              ...customThemeLight?.shape,
              ...data.shape,
            },
          });
        }
      }
    },
    [mode, onSelect, selectedId],
  );

  const getInitialValues = useMemo(() => {
    const defaultTheme =
      mode === ThemeMode.light ? customThemeLight : customThemeDark;
    return {
      background:
        defaultTheme?.palette?.background?.default ||
        theme.palette.background.default,
      error: defaultTheme?.palette?.error?.main || theme.palette.error.main,
      info: defaultTheme?.palette?.info?.main || theme.palette.info.main,
      primary:
        defaultTheme?.palette?.primary?.main || theme.palette.primary.main,
      secondary:
        defaultTheme?.palette?.secondary?.main || theme.palette.secondary.main,
      success:
        defaultTheme?.palette?.success?.main || theme.palette.success.main,
      text: defaultTheme?.palette?.text?.primary || theme.palette.text.primary,
      warning:
        defaultTheme?.palette?.warning?.main || theme.palette.warning.main,
      paper:
        defaultTheme?.palette?.background?.paper ||
        theme.palette.background.paper,
      borderRadius:
        defaultTheme?.shape?.borderRadius || theme.shape.borderRadius,
    };
  }, [mode, customThemeLight, customThemeDark, theme]);

  return (
    <>
      <Grid container spacing={2}>
        {isMobile && (
          <Grid item xs={12}>
            <Box>
              <Stack
                direction="row"
                alignItems="center"
                alignContent="center"
                justifyContent="space-between"
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  <FormattedMessage
                    id="marketplace.theme"
                    defaultMessage="Marketplace Theme"
                  />
                </Typography>
              </Stack>
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          {selectedId && getInitialValues && (
            <EditThemeForm
              customThemeDark={customThemeDark}
              customThemeLight={customThemeLight}
              mode={mode as SupportedColorScheme}
              onChange={handleChange}
              saveOnChange
              initialValues={{
                themeId: selectedId,
                ...getInitialValues,
              }}
              onSubmit={async () => {}}
            />
          )}
        </Grid>

        {/* {renderThemes()}
        <Grid item xs={12}>
          {selectedId === 'custom' && (
            <WizardThemeCustom mode={mode} legacyTheme={legacyTheme} />
          )}
        </Grid> */}
      </Grid>
    </>
  );
}
