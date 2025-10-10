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
  'default-theme': { theme: defaultTheme as any, name: 'Default' },
  kittygotchi: { theme: kittygotchiTheme as any, name: 'Kittygotchi' },
  cryptopunk: { theme: cryptoPunkTheme as any, name: 'CryptoPunk' },
  boredape: { theme: boredApeTheme as any, name: 'BoredApe' },
  custom: { theme: customTheme as any, name: 'Custom' },
};

export function getTheme({ name }: { name: string }) {
  return themes[name]

}
