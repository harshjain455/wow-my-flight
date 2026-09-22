import { createTheme } from '@mui/material/styles';

const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? '#3F51B5' : '#818CF8', // Indigo - bright purple-indigo in dark mode
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#C59B27', // Rich Gold
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#D2A33C', // Warm Gold Accent
      contrastText: '#FFFFFF',
    },
    success: {
      main: mode === 'light' ? '#22C55E' : '#34D399',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#F59E0B',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444',
      contrastText: '#FFFFFF',
    },
    background: {
      default: mode === 'light' ? '#F4F6F9' : '#070D19', // Soft Ice Blue in light, Deep Navy in dark
      paper: mode === 'light' ? '#FFFFFF' : '#0F172A',  // Pure White in light, Slate 900 in dark
      neutral: mode === 'light' ? '#E9EDF5' : '#1E293B',
    },
    text: {
      primary: mode === 'light' ? '#1E293B' : '#F8FAFC', // Slate 800 in light, Off-white in dark
      secondary: mode === 'light' ? '#64748B' : '#94A3B8', // Slate 500 in light, Slate 400 in dark
    },
    divider: mode === 'light' ? 'rgba(63, 81, 181, 0.2)' : 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: '1.35rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: '1.2rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: '1.05rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: '0.85rem',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontSize: '0.75rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.9rem',
      fontWeight: 600,
    },
    subtitle2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.8rem',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.825rem',
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: '0.775rem',
      lineHeight: 1.57,
    },
    button: {
      fontFamily: '"Outfit", sans-serif',
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.775rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px 0px rgba(15, 23, 42, 0.05)',
    '0px 1px 3px 0px rgba(15, 23, 42, 0.1), 0px 1px 2px -1px rgba(15, 23, 42, 0.1)',
    '0px 4px 6px -1px rgba(15, 23, 42, 0.1), 0px 2px 4px -2px rgba(15, 23, 42, 0.1)',
    '0px 10px 15px -3px rgba(15, 23, 42, 0.1), 0px 4px 6px -4px rgba(15, 23, 42, 0.1)',
    '0px 20px 25px -5px rgba(15, 23, 42, 0.1), 0px 8px 10px -6px rgba(15, 23, 42, 0.1)',
    '0px 25px 50px -12px rgba(15, 23, 42, 0.25)',
    ...Array(18).fill('none'), // fill rest of shadows array to satisfy MUI
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '5px 10px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: mode === 'light' 
            ? 'linear-gradient(135deg, #3F51B5 0%, #303F9F 100%)' 
            : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          '&:hover': {
            background: mode === 'light' 
              ? 'linear-gradient(135deg, #303F9F 0%, #1A237E 100%)' 
              : 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #C59B27 0%, #A57F1E 100%)',
          color: '#FFFFFF',
          '&:hover': {
            background: 'linear-gradient(135deg, #A57F1E 0%, #8A6916 100%)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
          border: mode === 'light' ? '1px solid #E2E8F0' : '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: mode === 'light' ? '0px 1px 3px 0px rgba(15, 23, 42, 0.05)' : '0px 4px 20px rgba(0, 0, 0, 0.4)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: mode === 'light' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.03)',
          color: mode === 'light' ? '#1E293B' : '#F8FAFC',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'light' ? '#CBD5E1' : 'rgba(255, 255, 255, 0.15)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: mode === 'light' ? '#C59B27' : '#C59B27',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.3)',
          backgroundColor: mode === 'light' ? '#FFFFFF' : '#0F172A',
          color: mode === 'light' ? '#1E293B' : '#F8FAFC',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: mode === 'light' ? 'rgba(63, 81, 181, 0.15)' : 'rgba(255, 255, 255, 0.08)',
          padding: '8px 12px',
          color: mode === 'light' ? '#1E293B' : '#F8FAFC',
        },
        head: {
          fontWeight: 700,
          backgroundColor: mode === 'light' ? '#E9EDF5' : '#1E293B',
          color: mode === 'light' ? '#1E293B' : '#F8FAFC',
          borderBottom: mode === 'light' ? '2px solid rgba(63, 81, 181, 0.4)' : '2px solid rgba(255, 255, 255, 0.15)',
          padding: '10px 12px',
        },
      },
    },
  },
});

export default createAppTheme;
