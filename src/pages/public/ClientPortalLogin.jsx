import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import FlightIcon from '@mui/icons-material/Flight';
import { useThemeMode } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';

export const ClientPortalLogin = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { mode, toggleTheme } = useThemeMode();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      showAlert('Please enter both username and password.', 'error');
      return;
    }
    
    // MOCK LOGIN: Accept any username as the client ID for demo purposes
    // In a real application, this would authenticate against the backend.
    const clientId = username.trim();

    showAlert('Login successful! Welcome to the Client Portal.', 'success');
    navigate(`/portal/documents/${clientId}`);
  };

  const handleQuickLogin = (clientId) => {
    setUsername(clientId);
    setPassword('password123');
    showAlert('Login successful! Welcome to the Client Portal.', 'success');
    navigate(`/portal/documents/${clientId}`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 3, position: 'relative' }}>
      <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 10,
            color: 'text.primary',
            backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.1)',
            border: '1px solid',
            borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.15)',
          }}
        >
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon sx={{ color: '#F59E0B' }} />}
        </IconButton>
      </Tooltip>
      <Paper sx={{ p: 5, borderRadius: 3, maxWidth: 400, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5, color: mode === 'light' ? '#0F172A' : '#FFFFFF' }}>
              WOW MY FLIGHT
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>Client Travel Portal</Typography>
          <Typography variant="body2" color="text.secondary">Sign in to view your booking, e-ticket, itinerary & manage flight documents.</Typography>
        </Box>

        <form onSubmit={handleLogin}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Username (Client ID)"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. client_123"
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit" variant="contained" color="secondary" size="large" fullWidth>
              Log In
            </Button>
          </Box>
        </form>

        <Divider sx={{ my: 3 }}>
          <Chip label="DEMO QUICK LOGIN" size="small" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
        </Divider>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
          <Button variant="outlined" size="small" fullWidth onClick={() => handleQuickLogin('CL2001')}>
            Client: K. Singh (JFK→LHR)
          </Button>
          <Button variant="outlined" size="small" fullWidth onClick={() => handleQuickLogin('CL2002')}>
            Client: A. Lee (DEL→SIN)
          </Button>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            If you have issues logging in, please contact your assigned Travel Expert.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ClientPortalLogin;
