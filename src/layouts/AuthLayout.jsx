import React from 'react';
import { Outlet } from 'react-router-dom';
import { Plane } from 'lucide-react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../contexts/ThemeContext';

export const AuthLayout = () => {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundColor: theme.palette.background.default,
        boxSizing: 'border-box',
      }}
    >
      {/* Left Pane: Brand Banner (Hidden on mobile/tablet) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: { md: '42%', lg: '46%', xl: '50%' },
          flexShrink: 0,
          position: 'relative',
          minHeight: '100vh',
          minHeight: '100dvh',
          backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: { md: 5, lg: 6 },
          color: '#FFFFFF',
          boxSizing: 'border-box',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.78)', // Overlay Royal Navy
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.02em', color: 'white', lineHeight: 1 }}>
                WOW MY FLIGHT
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.light', fontWeight: 800, letterSpacing: 0.8 }}>
                TRAVEL AGENCY CRM
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ zIndex: 2, my: 'auto', py: 6, textAlign: 'left' }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: 'white', mb: 2, lineHeight: 1.25, fontSize: { md: '1.8rem', lg: '2.3rem' } }}>
            Your Global Partner for Seamless Flight Bookings.
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)', maxWidth: 500, fontSize: { md: '0.875rem', lg: '0.95rem' }, lineHeight: 1.6 }}>
            Specializing in International Flight Reservations, GDS Pricing & Margin Optimization, PNR Tracking, Corporate Travel Management, and Automated E-Ticket Issuance.
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ zIndex: 2, color: 'rgba(255,255,255,0.6)', textAlign: 'left', fontWeight: 600 }}>
          © {new Date().getFullYear()} WOW MY FLIGHT. Travel Agency CRM Portal.
        </Typography>
      </Box>

      {/* Right Pane: Login Card & Form */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          width: { xs: '100%', md: '58%', lg: '54%', xl: '50%' },
          minHeight: '100vh',
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 4, sm: 5, md: 6 },
          position: 'relative',
          boxSizing: 'border-box',
          background:
            theme.palette.mode === 'light'
              ? 'radial-gradient(circle at 0% 0%, #FFFFFF 0%, #EEF2F6 100%)'
              : 'radial-gradient(circle at 0% 0%, #0B1426 0%, #050A14 100%)',
        }}
      >
        {/* Light/Dark Mode Toggle */}
        <Box
          sx={{
            width: '100%',
            maxWidth: 520,
            display: 'flex',
            justifyContent: 'flex-end',
            mb: 1.5,
            flexShrink: 0,
          }}
        >
          <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'text.primary',
                backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid',
                borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 20 }} /> : <LightModeIcon sx={{ fontSize: 20, color: '#F59E0B' }} />}
            </IconButton>
          </Tooltip>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 520,
            my: 'auto',
            flexShrink: 0,
            borderRadius: { xs: 3, sm: 4 },
            border: '1px solid',
            borderColor: theme.palette.mode === 'light' ? 'rgba(226, 232, 240, 0.9)' : 'rgba(255, 255, 255, 0.05)',
            background:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.95)'
                : 'rgba(11, 20, 38, 0.75)',
            backdropFilter: 'blur(20px)',
            boxShadow:
              theme.palette.mode === 'light'
                ? '0px 20px 40px -15px rgba(15, 23, 42, 0.08)'
                : '0px 25px 50px -12px rgba(0, 0, 0, 0.5)',
            p: { xs: 2.5, sm: 3.5, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthLayout;
