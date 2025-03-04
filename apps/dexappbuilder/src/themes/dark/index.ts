import { createTheme, Theme } from '@mui/material';

export default createTheme({
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

  palette: {
    background: {
      default: '#000',
    },
    mode: 'dark',
    divider: '#DCDCDC',
    text: {
      primary: '#fff',
      secondary: '#737372',
      disabled: '#9B9B9B',
    },
    primary: {
      light: '#8390FA',
      main: '#17CB95',
      dark: '#081EC4',
    },
    secondary: {
      main: '#FAC748',
    },
    error: {
      main: '#FF1053',
    },
    success: {
      main: '#36AB47',
    },
  },
}) as Theme;
