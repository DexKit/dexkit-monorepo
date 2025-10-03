import { CssVarsTheme, Theme } from '@mui/material/styles';

import boredApeTheme from '@dexkit/dexappbuilder-viewer/themes/boredape';
import cryptoPunkTheme from '@dexkit/dexappbuilder-viewer/themes/cryptopunk';
import customTheme from '@dexkit/dexappbuilder-viewer/themes/custom';
import defaultTheme from '@dexkit/dexappbuilder-viewer/themes/index';
import kittygotchiTheme from '@dexkit/dexappbuilder-viewer/themes/kittygotchi';

type ThemeEntry = {
  theme: Omit<Theme, 'palette'> & CssVarsTheme;
  name: string
};

export const themes: { [key: string]: ThemeEntry } = {
  'default-theme': { theme: defaultTheme as any, name: 'Default' },
  kittygotchi: { theme: kittygotchiTheme as any, name: 'Kittygotchi' },
  cryptopunk: { theme: cryptoPunkTheme as any, name: 'CryptoPunk' },
  boredape: { theme: boredApeTheme as any, name: 'BoredApe' },
  custom: { theme: customTheme as any, name: 'Custom' },
};

export function getTheme({ name }: { name: string }) {
  return themes[name]
}
