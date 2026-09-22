import React from 'react';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { ThemeModeProvider } from './contexts/ThemeContext';
import { AlertProvider } from './contexts/AlertContext';
import { TelnyxProvider } from './contexts/TelnyxContext';
import AppRoutes from './routes/AppRoutes';

if (typeof window !== 'undefined') {
  // Clear cached mock data to force UI to use truncated 5-item lists
  const mockKeys = ['crm-leads', 'crm-clients', 'crm-consultations', 'crm-payments', 'crm-flights', 'crm-quotes', 'crm-bookings'];
  mockKeys.forEach(k => window.localStorage.removeItem(k));

  window.onerror = function(message, source, lineno, colno, error) {
    alert("React Runtime Error: " + message + "\nSource: " + source + "\nLine: " + lineno + ":" + colno);
    return false;
  };
}

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
