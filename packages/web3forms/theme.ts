import { alpha, createTheme, darken, lighten } from '@mui/material/styles';

export default createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: '#FFFFFF',
          paper: '#FAFAFA',
        },
        text: {
          primary: '#0E1116',
          secondary: '#737372',
        },
        primary: {
          main: '#17CB95',
        },
        secondary: {
          main: '#FAC748',
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: '#000',
        },
        mode: 'dark',
        text: {
          primary: '#fff',
          secondary: '#737372',
        },
        primary: {
          main: '#17CB95',
        },
        secondary: {
          main: '#FAC748',
        },
      },
    },
  },
  // Add color manipulation functions for MUI v7
  alpha,
  lighten,
  darken,
})