import { ChainId } from '@dexkit/core/constants';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  CssVarsTheme,
  Theme,
  useColorScheme,
} from '@mui/material/styles';
import { useIntl } from 'react-intl';

import { ThemeMode } from '@dexkit/ui/constants/enum';
import React, { useEffect } from 'react';

import AssetFromApi from '@dexkit/ui/modules/nft/components/AssetFromApi';
import { KITTYGOTCHI_CONTRACT } from '../constants';
import SwapWidget from './pageEditor/components/SwapWidget';

interface Props {
  selectedTheme: Omit<Theme, 'palette'> & CssVarsTheme;
  showSwap?: boolean;
  selectedThemeMode?: ThemeMode;
}

function ColorSchemePicker({
  selectedThemeMode,
}: {
  selectedThemeMode?: ThemeMode;
}) {
  const { mode, setMode } = useColorScheme();
  useEffect(() => {
    if (selectedThemeMode) {
      setMode(selectedThemeMode);
    }
  }, [selectedThemeMode]);
  return <></>;
}

const useEnhancedEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export default function ThemePreview({
  selectedTheme,
  showSwap,
  selectedThemeMode,
}: Props) {
  const { formatMessage } = useIntl();
  const [node, setNode] = React.useState<null | HTMLElement>(null);
  useEnhancedEffect(() => {
    setNode(
      document.getElementById('theme-preview-container') as null | HTMLElement,
    );
  }, []);

  return (
    <div id="theme-preview-container">
      <CssVarsProvider
        theme={selectedTheme}
        colorSchemeNode={node || null}
        disableNestedContext={true}
        colorSchemeSelector="#theme-preview-container"
        colorSchemeStorageKey="theme-preview-color-scheme"
        modeStorageKey="theme-preview-mode"
      >
        <ColorSchemePicker selectedThemeMode={selectedThemeMode} />
        <Stack
          spacing={2}
          sx={{ p: 2, backgroundColor: 'background.default' }}
          component={Paper}
        >
          <Box>
            {showSwap ? (
              <SwapWidget />
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <AssetFromApi
                    chainId={ChainId.Polygon}
                    contractAddress={KITTYGOTCHI_CONTRACT}
                    tokenId="42"
                    disabled={true}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AssetFromApi
                    chainId={ChainId.Polygon}
                    contractAddress={KITTYGOTCHI_CONTRACT}
                    tokenId="50"
                    disabled={true}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button>Button</Button>
            <Button variant="contained" color="primary">
              Button
            </Button>
            <Button variant="contained" color="secondary">
              Button
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button variant="outlined" color="primary">
              Button
            </Button>
            <Button variant="outlined" color="secondary">
              Button
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField
              placeholder={formatMessage({
                id: 'text.field',
                defaultMessage: 'Text field',
              })}
              fullWidth
            />
          </Stack>
          <Stack>
            <Typography variant="h5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
            <Typography variant="body2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
            <Typography color="error">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>

            <Typography color="success.main">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>

            <Typography color="info.main">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>

            <Typography color="warning.main">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>

            <Typography color="secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Typography>
          </Stack>
        </Stack>
      </CssVarsProvider>
    </div>
  );
}
