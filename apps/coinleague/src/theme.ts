import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Sora', sans-serif",
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
  },
  palette: {
    mode: 'dark',
    background: {
      default: '#0D1017',
      paper: '#151B22',
    },
    primary: {
      main: '#F0883E',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
