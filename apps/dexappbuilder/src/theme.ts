import { CssVarsTheme, Theme } from '@mui/material/styles';


import boredApeTheme from './themes/boredape';
import cryptoPunkTheme from './themes/cryptopunk';
import customTheme from './themes/custom';
import defaultTheme from './themes/index';
import kittygotchiTheme from './themes/kittygotchi';


type ThemeEntry = {
  theme: Omit<Theme, 'palette'> & CssVarsTheme;
  name: string
};


export const themes: { [key: string]: ThemeEntry } = {
  'default-theme': { theme: defaultTheme as any, name: 'Default' },
  'kittygotchi': { theme: kittygotchiTheme as any, name: 'Kittygotchi' },
  'cryptopunk': { theme: cryptoPunkTheme as any, name: 'CryptoPunk' },
  'boredape': { theme: boredApeTheme as any, name: 'BoredApe' },
  'custom': { theme: customTheme as any, name: 'Custom' },
};

export function getTheme({ name }: { name: string }) {
  if (!name || !themes[name]) {
    return themes['default-theme'];
  }

  return themes[name];
}
