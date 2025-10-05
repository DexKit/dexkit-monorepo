import { alpha, createTheme, darken, lighten } from '@mui/material/styles';

export default createTheme({
    cssVariables: {
        colorSchemeSelector: 'class',
    },
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
    },
    // Add color manipulation functions for MUI v7
    alpha,
    lighten,
    darken,
} as any);
