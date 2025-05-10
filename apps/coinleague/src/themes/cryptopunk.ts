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
        dark: {
            palette: {
                mode: 'dark',
                background: {
                    default: '#000',
                },
                divider: '#DCDCDC',
                text: {
                    primary: '#fff',
                    secondary: '#737372',
                    disabled: '#9B9B9B',
                },
                primary: {
                    light: '#ff60e6',
                    main: '#ff04b4',
                    dark: '#c70084',
                },
                secondary: {
                    light: '#FCDB88',
                    main: '#FAC748',
                    dark: '#C79005'
                },
                error: {
                    main: '#FF1053',
                    light: '#FFADC5',
                    dark: '#B80037'

                },
                info: {
                    light: '#B4C1F8',
                    main: '#4361EE',
                    dark: '#102CA8'

                },
                success: {
                    main: '#36AB47',
                },
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
                    light: '#ff60e6',
                    main: '#ff04b4',
                    dark: '#c70084',
                },
                secondary: {
                    light: '#FCDB88',
                    main: '#FAC748',
                    dark: '#C79005'
                },
                error: {
                    main: '#FF1053',
                    light: '#FFADC5',
                    dark: '#B80037'

                },
                info: {
                    light: '#B4C1F8',
                    main: '#4361EE',
                    dark: '#102CA8'

                },
                success: {
                    main: '#36AB47',
                },
            },
        }
    }

});
