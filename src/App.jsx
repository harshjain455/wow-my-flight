import React from 'react';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { ThemeModeProvider } from './contexts/ThemeContext';
import { AlertProvider } from './contexts/AlertContext';
import { TelnyxProvider } from './contexts/TelnyxContext';
import AppRoutes from './routes/AppRoutes';


// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Turn off for predictable mock database usage
      retry: false,
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <PermissionProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeModeProvider>
            <AlertProvider>
              <TelnyxProvider>
                <HashRouter>
                  <AppRoutes />
                </HashRouter>
              </TelnyxProvider>
            </AlertProvider>
          </ThemeModeProvider>
        </QueryClientProvider>
      </PermissionProvider>
    </AuthProvider>
  );
}

export default App;
