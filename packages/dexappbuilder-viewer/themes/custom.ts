import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

export default extendTheme({
    typography: {
        fontFamily: "'Montserrat', sans-serif",
    },
    colorSchemes: {
        dark: {
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
        },
        light: {
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
        }
    }

});
