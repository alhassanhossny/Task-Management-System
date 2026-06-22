import { createTheme, ThemeOptions } from '@mui/material/styles';

export const getTheme = (lang: string): ThemeOptions => {
  const isRtl = lang === 'ar';

  return createTheme({
    direction: isRtl ? 'rtl' : 'ltr',
    palette: {
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
      },
      success: {
        main: '#2e7d32',
        light: '#4caf50',
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: isRtl
        ? '"Cairo", "Roboto", "Arial", sans-serif'
        : '"Roboto", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });
};
