import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createAppTheme from '../theme/theme';

const ThemeModeContext = createContext({
  toggleTheme: () => { },
  mode: 'light',
});

export const useThemeMode = () => useContext(ThemeModeContext);

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('app-theme-mode');
      return saved === 'dark' ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('app-theme-mode', newMode);
      } catch (e) {
        console.error('Failed to save theme mode:', e);
      }
      return newMode;
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (mode === 'dark') {
      root.classList.add('dark-mode');
      root.setAttribute('data-theme', 'dark');
      body.classList.add('dark-mode');
      body.style.backgroundColor = '#070D19';
      body.style.color = '#F9FAFB';
    } else {
      root.classList.remove('dark-mode');
      root.setAttribute('data-theme', 'light');
      body.classList.remove('dark-mode');
      body.style.backgroundColor = '#F4F6F9';
      body.style.color = '#1E293B';
    }
  }, [mode]);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
