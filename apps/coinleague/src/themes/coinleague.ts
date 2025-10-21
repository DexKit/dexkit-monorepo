import { extendTheme } from '@mui/material/styles';

export default extendTheme({
  colorSchemeSelector: 'class',
  typography: {
    fontFamily: "'Sora', sans-serif",
  },
  components: {
    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h3: {
          fontWeight: 600,
        },
        h2: {
          fontWeight: 600,
        },
        h1: {
          fontWeight: 600,
        },
      },
    },
  },
  colorSchemes: {
    dark: {
      palette: {
        mode: 'dark',
        divider: '#0D1017',
        background: {
          default: '#0D1017',
          paper: '#151B22',
        },
        text: {
          primary: '#fff',
          secondary: '#737372',
          disabled: '#9B9B9B',
        },
        primary: {

          main: '#F0883E',

        },
        secondary: {

          main: '#19857b',

        },
        error: {
          main: '#FF1053',
          light: '#FFADC5',
          dark: '#B80037',
        },
        info: {
          light: '#B4C1F8',
          main: '#4361EE',
          dark: '#102CA8',
        },
        success: {
          main: '#36AB47',
        }
      },
    },
    light: {
      palette: {
        background: {
          default: '#FFFFFF',
          paper: '#FAFAFA',
        },
        divider: '#DCDCDC',
        text: {
          primary: '#0E1116',
          secondary: '#737372',
          disabled: '#9B9B9B',
        },
        primary: {

          main: '#F0883E',

        },
        secondary: {

          main: '#19857b',

        },
        error: {
          main: '#FF1053',
          light: '#FFADC5',
          dark: '#B80037',
        },
        info: {
          light: '#B4C1F8',
          main: '#4361EE',
          dark: '#102CA8',
        },
        success: {
          main: '#36AB47',
        },
      },
    }
  }
})
