import { createTheme } from '@mui/material';

export default createTheme({
    typography: {
        fontFamily: "'Montserrat', sans-serif",
    },
    palette: {
        mode: 'dark',
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
});
