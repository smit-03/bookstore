import { createTheme } from "@mui/material";
export const theme = createTheme({
    palette: {
        primary: {
            main: '#fb3c3c',
        }, secondary: {
            main: '#17800e',
            light: '#ffe260'
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 1024,
            lg: 1200,
            xl: 1920,
        },
    },
});