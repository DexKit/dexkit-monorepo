import { Box, Grid, SupportedColorScheme, useMediaQuery, useTheme } from '@mui/material';
import { useField } from 'formik';
import { useMemo } from 'react';
import { getTheme, themes } from 'src/theme';

import { CustomThemeInterface } from '../../state';
import WizardThemeButton from '../WizardThemeButton';

export interface SelectThemeSectionProps {
  mode: SupportedColorScheme;
  customThemeDark?: CustomThemeInterface;
  customThemeLight?: CustomThemeInterface;
}

export default function SelectThemeSection({
  mode,
  customThemeDark,
  customThemeLight,
}: SelectThemeSectionProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const availThemes = useMemo(() => {
    return Object.keys(themes)
      .map((key) => {
        const tempTheme = getTheme({ name: key });

        if (!tempTheme) {
          return;
        }

        if (key === 'custom') {
          let theme = {
            ...tempTheme,
            colorSchemes: {
              dark: {
                palette: {
                  ...(customThemeDark?.palette as any),
                  ...tempTheme?.theme.colorSchemes.dark,
                },
              },
              light: {
                palette: {
                  ...(customThemeLight?.palette as any),
                  ...tempTheme?.theme.colorSchemes.light,
                },
              },
            },
          };

          return { ...{ theme, name: tempTheme.name }, key };
        }

        return { ...tempTheme, key };
      })
      .filter((e) => e !== undefined);
  }, [customThemeLight, customThemeDark]);

  const [props, meta, helpers] = useField('themeId');

  const handleSelect = (id: string) => {
    helpers.setValue(id);
  };

  return (
    <Box>
      <Grid container spacing={isMobile ? 1 : 2}>
        {availThemes.map(
          (entry: any) =>
            entry && (
              <Grid
                key={entry.key}
                size={{
                  xs: 6,
                  sm: 6
                }}>
                <WizardThemeButton
                  selected={props.value === entry.key}
                  name={entry.name}
                  id={entry.key}
                  onClick={handleSelect}
                  colors={{
                    primary:
                      entry.theme.colorSchemes[mode].palette.primary?.main,
                    background:
                      entry.theme.colorSchemes[mode].palette.background
                        ?.default,
                    secondary:
                      entry.theme.colorSchemes[mode].palette.secondary?.main,
                    text: entry.theme.colorSchemes[mode].palette.text?.primary,
                  }}
                />
              </Grid>
            ),
        )}
      </Grid>
    </Box>
  );
}
