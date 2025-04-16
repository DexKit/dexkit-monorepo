import { createTheme } from '@mui/material';

export default createTheme({
    typography: {
        fontFamily: "'Montserrat', sans-serif",
    },
    palette: {
        mode: 'light',
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
