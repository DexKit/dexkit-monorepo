import { CssVarsTheme, Theme } from '@mui/material/styles';


import boredApeTheme from './boredape';
import cryptoPunkTheme from './cryptopunk';
import customTheme from './custom';
import defaultTheme from './index';
import kittygotchiTheme from './kittygotchi';


type ThemeEntry = {
  theme: Omit<Theme, 'palette'> & CssVarsTheme;
  name: string
};


export const themes: { [key: string]: ThemeEntry } = {
  'default-theme': { theme: defaultTheme, name: 'Default' },
  kittygotchi: { theme: kittygotchiTheme, name: 'Kittygotchi' },
  cryptopunk: { theme: cryptoPunkTheme, name: 'CryptoPunk' },
  boredape: { theme: boredApeTheme, name: 'BoredApe' },
  custom: { theme: customTheme, name: 'Custom' },
};

export function getTheme({ name }: { name: string }) {
  return themes[name]

}
