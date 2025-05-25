import { AppCollection } from '@dexkit/ui/modules/wizard/types/config';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';


export const collectionAtom = atom<AppCollection | undefined>(undefined);

export const isFirstVisitOnEditWizardAtom = atomWithStorage<boolean>(
  'isFirstVisitOnEditWizard',
  true
);

export interface CustomThemeColorSchemesInterface {
  typography?: any;
  colorSchemes: {
    [key: string]: {
      palette?: {
        background?: {
          default: string;
        };
        text?: {
          primary: string;
        };
        primary?: {
          main: string;
        };
        secondary?: {
          main: string;
        };
      };
    };
  };
}

export interface CustomThemeInterface {
  palette?: {
    background?: {
      default: string;
      paper?: string;
    };
    text?: {
      primary: string;
    };
    primary?: {
      main: string;
    };
    secondary?: {
      main: string;
    };
    success?: {
      main: string;
    };
    info?: {
      main: string;
    };
    error?: {
      main: string;
    };
    warning?: {
      main: string;
    };
  };
  shape?: {
    borderRadius?: number;
  };
}

/*export const customThemeAtom = atom<
  CustomThemeColorSchemesInterface | undefined
>({
  typography: {},
  colorSchemes: {
    dark: {
      palette: {
        background: {
          default: '#000',
        },
        text: {
          primary: '#fff',
        },
        primary: {
          main: '#bfc500',
        },
        secondary: {
          main: '#f44336',
        },
      },
    },
    light: {
      palette: {
        background: {
          default: '#fff',
        },
        text: {
          primary: '#000',
        },
        primary: {
          main: '#bfc500',
        },
        secondary: {
          main: '#f44336',
        },
      },
    },
  },
});

export const customThemeLightAtom = atom<CustomThemeInterface | undefined>({
  palette: {
    background: {
      default: '#fff',
    },
    text: {
      primary: '#000',
    },
    primary: {
      main: '#bfc500',
    },
    secondary: {
      main: '#f44336',
    },
  },
});

export const customThemeDarkAtom = atom<CustomThemeInterface | undefined>({
  palette: {
    background: {
      default: '#000',
    },
    text: {
      primary: '#fff',
    },
    primary: {
      main: '#bfc500',
    },
    secondary: {
      main: '#f44336',
    },
  },
});*/
