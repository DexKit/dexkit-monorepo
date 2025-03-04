import { ThemeMode } from '@dexkit/ui/constants/enum';
import { AppConfig } from '@dexkit/ui/modules/wizard/types/config';
import Cancel from '@mui/icons-material/Cancel';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
    Autocomplete,
    Box,
    Button,
    Divider,
    FormControl,
    Grid,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Fonts from 'src/constants/fonts.json';
import { PreviewType, StepperButtonProps } from '../../types';
import { generateCSSVarsTheme } from '../../utils';
import ThemePreview from '../ThemePreview';
import ThemeSection from '../sections/ThemeSection';
import { StepperButtons } from '../steppers/StepperButtons';

const ExchangeSection = dynamic(
  () =>
    import('@dexkit/dexappbuilder-viewer/components/sections/ExchangeSection'),
);

import { ChainId } from '@dexkit/core';
import { ExchangePageSection } from '@dexkit/ui/modules/wizard/types/section';
import { useWeb3React } from '@dexkit/wallet-connectors/hooks/useWeb3React';
import appConfig from '../../../../../config/app.json';
import ThemePreviewMenu from '../ThemePreviewMenu';
interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
  onChange: (config: AppConfig) => void;
  onHasChanges?: (hasChanges: boolean) => void;
  isOnStepper?: boolean;
  stepperButtonProps?: StepperButtonProps;
  showSwap?: boolean;
}

function fixBugOnTheme(themeConfig: string) {
  const theme = JSON.parse(themeConfig);
  // TODO: Remove this line after some time, this was bug introduced from saving the atom instead of the result
  if (theme?.init) {
    return theme?.init;
  } else {
    return theme;
  }
}

export default function ThemeWizardContainer({
  config,
  onSave,
  onChange,
  isOnStepper,
  onHasChanges,
  stepperButtonProps,
  showSwap,
}: Props) {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(config.theme);

  const [selectedThemeMode, setSelectedThemeMode] = useState<ThemeMode>(
    config.defaultThemeMode || ThemeMode.light,
  );

  const [defaultThemeMode, setDefaultThemeMode] = useState<
    ThemeMode | undefined
  >(config?.defaultThemeMode);
  const [selectedFont, setSelectedFont] = useState<
    { family: string; category?: string } | undefined
  >(config?.font);

  const [customThemeDark, setCustomThemeDark] = useState(
    config.theme === 'custom' && config.customThemeDark
      ? JSON.parse(config.customThemeDark)
      : undefined,
  );
  const [customThemeLight, setCustomThemeLight] = useState(
    config.theme === 'custom' && config.customThemeLight
      ? fixBugOnTheme(config.customThemeLight)
      : undefined,
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleShowPreview = () => {
    setIsPreviewOpen(true);
  };

  const handleSelectTheme = useCallback(
    (id: string) => {
      setSelectedThemeId(id);
    },
    [selectedThemeId],
  );

  const selectedTheme = useMemo(() => {
    return generateCSSVarsTheme({
      selectedFont,
      cssVarPrefix: 'theme_preview',
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

      selectedThemeId,
      mode: selectedThemeMode,
    });
  }, [
    selectedThemeId,
    selectedThemeMode,
    customThemeDark,
    customThemeLight,
    selectedFont,
  ]);

  const handleCancelEdit = () => {
    setSelectedThemeId(config.theme);
  };

  const handleSave = () => {
    const newConfig = {
      ...config,
      theme: selectedThemeId,
      themeMode: defaultThemeMode,
    };

    // We will not use anymore this configuration so we will just delete it from the config
    if (newConfig.theme === 'custom') {
      delete newConfig.customTheme;
    }

    if (newConfig.theme === 'custom' && customThemeDark) {
      newConfig.customThemeDark = JSON.stringify(customThemeDark);
    }

    if (newConfig.theme === 'custom' && customThemeLight) {
      newConfig.customThemeLight = JSON.stringify(customThemeLight);
    }

    if (selectedFont) {
      newConfig.font = selectedFont;
    }

    if (defaultThemeMode) {
      newConfig.defaultThemeMode = defaultThemeMode;
    }
    onSave(newConfig);
  };

  useEffect(() => {
    const newConfig = { ...config, theme: selectedThemeId };
    // We will not use anymore this configuration so we will just delete it from the config
    if (newConfig.theme === 'custom') {
      delete newConfig.customTheme;
    }

    if (newConfig.theme === 'custom' && customThemeDark) {
      newConfig.customThemeDark = JSON.stringify(customThemeDark);
    }

    if (newConfig.theme === 'custom' && customThemeLight) {
      newConfig.customThemeLight = JSON.stringify(customThemeLight);
    }

    if (selectedFont) {
      newConfig.font = selectedFont;
    }
    if (defaultThemeMode) {
      newConfig.defaultThemeMode = defaultThemeMode;
    }
    onChange(newConfig);
  }, [selectedThemeId, selectedFont, customThemeDark, customThemeLight]);

  const themeChanged = useMemo(() => {
    if (config.theme !== selectedThemeId) {
      return true;
    }
    if (config?.font !== selectedFont) {
      return true;
    }

    if (config?.defaultThemeMode !== defaultThemeMode) {
      return true;
    }
    if (config.theme === 'custom') {
      if (
        config.customThemeDark &&
        config.customThemeDark !== JSON.stringify(customThemeDark)
      ) {
        return true;
      }
      if (
        config.customThemeLight &&
        JSON.stringify(customThemeLight) !== config.customThemeLight
      ) {
        return true;
      }
    }

    return false;
  }, [
    defaultThemeMode,
    selectedFont,
    selectedThemeId,
    customThemeDark,
    customThemeLight,
    config.theme,
    config?.defaultThemeMode,
  ]);

  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(themeChanged);
    }
  }, [onHasChanges, themeChanged]);

  const handleSelectedFont = (event: any, value: string | null) => {
    if (value) {
      const font = Fonts.items.find((f) => f.family === value);
      if (font) {
        setSelectedFont({ family: font.family, category: font.category });
      }
    } else {
      setSelectedFont(undefined);
    }
  };

  const [previewType, setPreviewType] = useState<PreviewType>(PreviewType.NFTs);

  const previewButtonText = useMemo(() => {
    if (previewType === PreviewType.NFTs) {
      return <FormattedMessage id="nfts" defaultMessage="NFTs" />;
    } else if (previewType === PreviewType.Swap) {
      return <FormattedMessage id="swap" defaultMessage="Swap" />;
    }
    return <FormattedMessage id="exchange" defaultMessage="Exchange" />;
  }, [previewType]);

  const [showPreviewMenu, setShowPreviewMenu] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenMenu = (e: MouseEvent<HTMLButtonElement>) => {
    setShowPreviewMenu(true);
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setShowPreviewMenu(false);
  };

  const { chainId } = useWeb3React();

  const renderThemePreview = () => {
    if (selectedTheme) {
      if (previewType === PreviewType.NFTs) {
        return (
          <ThemePreview
            selectedTheme={selectedTheme}
            showSwap={showSwap}
            selectedThemeMode={selectedThemeMode}
          />
        );
      } else if (previewType === PreviewType.Swap) {
        return (
          <ThemePreview
            selectedTheme={selectedTheme}
            showSwap
            selectedThemeMode={selectedThemeMode}
          />
        );
      } else if (previewType === PreviewType.Exchange) {
        const sections = Object.keys(appConfig.pages)
          .map((key) => (appConfig as any).pages[key])
          .map((page) =>
            page.sections.findIndex((s: any) => s.type === 'exchange'),
          )
          .filter((c) => c !== -1);

        if (sections.length > 0 && chainId) {
          let section = sections[0] as ExchangePageSection;
          return (
            <Box>
              <ExchangeSection
                section={{
                  ...section,
                  settings: {
                    ...section.settings,
                    defaultNetwork: chainId as ChainId,
                    container: false,
                  },
                }}
              />
            </Box>
          );
        }
      }
    }
  };

  return (
    <>
      <ThemePreviewMenu
        anchorEl={anchorEl}
        onChange={setPreviewType}
        onClose={handleCloseMenu}
        open={showPreviewMenu}
      />
      <Head>
        {selectedFont && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${selectedFont.family}&display=swap`}
            rel="stylesheet"
          />
        )}
      </Head>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box>
            <Stack>
              <Typography variant="h6">
                <FormattedMessage id="theme" defaultMessage="Theme" />
              </Typography>
              <Typography variant={'body2'}>
                <FormattedMessage
                  id="choose.your.theme"
                  defaultMessage="Choose your theme"
                />
              </Typography>
            </Stack>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} sx={{ height: '100%' }}>
          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={6}>
              <Box>
                <Stack spacing={2}>
                  <Typography variant="body2">
                    <FormattedMessage
                      id="choose.app.theme.color.for.each.mode "
                      defaultMessage={'Choose app theme color for each mode'}
                    />
                  </Typography>

                  <FormControl fullWidth>
                    <Select
                      labelId="theme-mode-label"
                      id="theme-mode"
                      sx={{ maxWidth: '150px' }}
                      fullWidth
                      value={selectedThemeMode}
                      onChange={(ev) => {
                        setSelectedThemeMode(ev.target.value as ThemeMode);
                      }}
                    >
                      <MenuItem value={ThemeMode.light}>
                        <FormattedMessage
                          id={'light'}
                          defaultMessage={'Light'}
                        />
                      </MenuItem>
                      <MenuItem value={ThemeMode.dark}>
                        <FormattedMessage id={'dark'} defaultMessage={'Dark'} />
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Box>
                    <ThemeSection
                      mode={selectedThemeMode}
                      selectedId={selectedThemeId}
                      customThemeDark={customThemeDark}
                      customThemeLight={customThemeLight}
                      onSetCustomThemeDark={setCustomThemeDark}
                      onSetCustomThemeLight={setCustomThemeLight}
                      onSelect={handleSelectTheme}
                      onPreview={handleShowPreview}
                      legacyTheme={config?.customTheme}
                    />
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <FormattedMessage
                        id="default.theme.mode"
                        defaultMessage="Default Theme mode"
                      />
                    </Typography>
                    <Stack
                      direction="row"
                      alignContent="center"
                      alignItems="center"
                    >
                      <Typography variant="body1">
                        {' '}
                        <FormattedMessage id="light" defaultMessage={'Light'} />
                      </Typography>
                      <Switch
                        defaultChecked={defaultThemeMode === ThemeMode.dark}
                        onChange={() => {
                          if (defaultThemeMode === 'dark') {
                            setDefaultThemeMode(ThemeMode.light);
                          } else {
                            setDefaultThemeMode(ThemeMode.dark);
                          }
                        }}
                      />
                      <Typography variant="body1">
                        {' '}
                        <FormattedMessage id="dark" defaultMessage={'Dark'} />
                      </Typography>
                    </Stack>
                  </Box>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <FormattedMessage
                        id="Choose app font"
                        defaultMessage={'Choose app font'}
                      />
                    </Typography>

                    <Autocomplete
                      disablePortal
                      id="font-selection"
                      value={selectedFont?.family}
                      onChange={handleSelectedFont}
                      options={Fonts.items.map((f) => f.family)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ maxWidth: '350px' }}
                          label={
                            <FormattedMessage
                              id={'font'}
                              defaultMessage={'Font'}
                            />
                          }
                        />
                      )}
                    />
                  </Stack>
                </Stack>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ height: '100%' }}>
              <Box position="relative" sx={{ height: '100%' }}>
                <Box mb={2}>
                  <Button
                    onClick={handleOpenMenu}
                    variant="contained"
                    endIcon={<ExpandMore />}
                  >
                    {previewButtonText}
                  </Button>
                </Box>
                <Box position="sticky">{renderThemePreview()}</Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          {isOnStepper ? (
            <StepperButtons
              {...stepperButtonProps}
              handleNext={() => {
                handleSave();
                if (stepperButtonProps?.handleNext) {
                  stepperButtonProps.handleNext();
                }
              }}
              disableContinue={false}
            />
          ) : (
            <Stack spacing={1} direction="row" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={!themeChanged}
              >
                <FormattedMessage id="save" defaultMessage="Save" />
              </Button>
              <Button startIcon={<Cancel />} onClick={handleCancelEdit}>
                <FormattedMessage id="cancel" defaultMessage="Cancel" />
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
}
