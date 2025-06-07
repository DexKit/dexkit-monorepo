import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

export default extendTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
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
    light: {
      palette: {
        background: {
          default: '#FFFFFF',
          paper: '#FAFAFA',
        },
        divider: '#212529',
        text: {
          primary: '#000',
          secondary: '#737372',
          disabled: '#9B9B9B',
        },
        primary: {
          light: '#f5f84d',
          main: '#bfc500',
          dark: '#8b9500',
        },
        secondary: {
          light: '#ff7961',
          main: '#f44336',
          dark: '#ba000d',
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

    },
    dark: {
      palette: {
        mode: 'dark',
        background: {
          default: '#000',
          paper: '#212529',
        },
        divider: '#212529',
        text: {
          primary: '#fff',
          secondary: '#737372',
          disabled: '#9B9B9B',
        },
        primary: {
          light: '#f5f84d',
          main: '#bfc500',
          dark: '#8b9500',
        },
        secondary: {
          light: '#ff7961',
          main: '#f44336',
          dark: '#ba000d',
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
});
