import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { dbService } from '../../services/dbService';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

// Icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupsIcon from '@mui/icons-material/Groups';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import DiamondIcon from '@mui/icons-material/Diamond';
import FlightIcon from '@mui/icons-material/Flight';

const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { showAlert } = useAlert();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { data: consultants = [] } = useQuery({
    queryKey: ['consultants'],
    queryFn: dbService.getConsultants,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const enteredEmail = data.email.toLowerCase().trim();
    const enteredPassword = data.password;

    if (enteredEmail === 'admin@aaa.com' || enteredEmail === 'admin@wowmyflight.com') {
      login({
        id: 'super-admin',
        name: 'Wael Madi (CEO)',
        email: 'wael.m@wowmyflight.com',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      });
      showAlert('Logged in as Super Administrator', 'success');
      navigate('/dashboard');
      return;
    }

    const matchedConsultant = consultants.find(
      (c) => c.email && c.email.toLowerCase().trim() === enteredEmail
    );

    if (matchedConsultant) {
      const expectedPassword = matchedConsultant.password || 'password123';
      if (enteredPassword === expectedPassword) {
        login({
          id: matchedConsultant.id,
          name: matchedConsultant.name,
          email: matchedConsultant.email,
          role: matchedConsultant.role || 'consultant',
          avatar: matchedConsultant.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
          customPermissions: matchedConsultant.customPermissions,
        });
        showAlert(`Logged in successfully as Consultant: ${matchedConsultant.name}`, 'success');
        navigate('/dashboard');
        return;
      }
    }

    showAlert('Invalid login credentials. Please check email/password.', 'error');
  };

  const handleQuickLogin = (role) => {
    let mockUser = {
      id: 'admin-1',
      name: 'General Manager',
      email: 'manager@wowmyflight.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    };

    if (role === 'consultant') {
      mockUser = {
        id: 'c1',
        name: 'Sofia Rodriguez (Sales)',
        email: 'sofia.r@wowmyflight.com',
        role: 'consultant',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      };
    } else if (role === 'team_leader') {
      mockUser = {
        id: 'tl-1',
        name: 'David Sales Lead (TL)',
        email: 'david.lead@wowmyflight.com',
        role: 'team_leader',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
    } else if (role === 'expert_team_leader' || role === 'expert_tl') {
      mockUser = {
        id: 'etl-1',
        name: 'Michael Senior Expert TL',
        email: 'michael.etl@wowmyflight.com',
        role: 'expert_team_leader',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      };
    } else if (role === 'flight_expert') {
      mockUser = {
        id: 'fe-1',
        name: 'Carlos GDS Expert',
        email: 'carlos.gds@wowmyflight.com',
        role: 'flight_expert',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      };
    } else if (role === 'ticketing_agent') {
      mockUser = {
        id: 'tk-1',
        name: 'Ticketing Agent',
        email: 'ticketing@wowmyflight.com',
        role: 'ticketing_agent',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      };
    } else if (role === 'finance') {
      mockUser = {
        id: 'finance-staff',
        name: 'Elena Finance',
        email: 'finance@wowmyflight.com',
        role: 'finance',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
      };
    } else if (role === 'accountant') {
      mockUser = {
        id: 'acc-1',
        name: 'Robert Accountant',
        email: 'robert.acc@wowmyflight.com',
        role: 'finance',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      };
    } else if (role === 'operations' || role === 'after_sales') {
      mockUser = {
        id: 'operations-staff',
        name: 'Carlos Ops & After-Sales',
        email: 'ops@wowmyflight.com',
        role: 'operations',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
      };
    } else if (role === 'super_admin') {
      mockUser = {
        id: 'super-admin',
        name: 'Wael Madi (CEO)',
        email: 'wael.m@wowmyflight.com',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      };
    } else if (role === 'api_manager') {
      mockUser = {
        id: 'api-mgr',
        name: 'Alex API & System Mgr',
        email: 'alex.api@wowmyflight.com',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      };
    } else if (role === 'qa') {
      mockUser = {
        id: 'qa-1',
        name: 'Sarah QA Auditor',
        email: 'sarah.qa@wowmyflight.com',
        role: 'team_leader',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
      };
    } else if (role === 'marketing') {
      mockUser = {
        id: 'marketing-staff',
        name: 'Marketing Manager',
        email: 'marketing@wowmyflight.com',
        role: 'marketing',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150',
      };
    }

    login(mockUser);
    showAlert(`Logged in as Demo ${role.toUpperCase().replace('_', ' ')}`, 'success');

    if (role === 'super_admin') navigate('/super_admin/dashboard');
    else if (role === 'api_manager') navigate('/integrations');
    else if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'team_leader' || role === 'qa') navigate('/team_leader/dashboard');
    else if (role === 'expert_team_leader' || role === 'expert_tl') navigate('/expert_team_leader/dashboard');
    else if (role === 'flight_expert') navigate('/flight_expert/dashboard');
    else if (role === 'ticketing_agent') navigate('/ticketing_agent/dashboard');
    else if (role === 'finance' || role === 'accountant') navigate('/finance/dashboard');
    else if (role === 'operations' || role === 'after_sales') navigate('/operations/dashboard');
    else if (role === 'marketing') navigate('/marketing-manager/dashboard');
    else navigate('/agent/dashboard');
  };

  const roleCategories = [
    {
      title: '👑 Management & Admin',
      roles: [
        { role: 'super_admin', label: 'Super Admin', icon: <AdminPanelSettingsIcon sx={{ fontSize: 15 }} /> },
        { role: 'admin', label: 'Admin (GM)', icon: <SupervisorAccountIcon sx={{ fontSize: 15 }} /> },
        { role: 'api_manager', label: 'API / System Mgr', icon: <SettingsSuggestIcon sx={{ fontSize: 15 }} /> },
      ]
    },
    {
      title: '✈️ Sales Department',
      roles: [
        { role: 'consultant', label: 'Sales Exec', icon: <SupportAgentIcon sx={{ fontSize: 15 }} /> },
        { role: 'team_leader', label: 'Team Leader', icon: <GroupsIcon sx={{ fontSize: 15 }} /> },
        { role: 'expert_team_leader', label: 'Expert TL (Escalations)', icon: <DiamondIcon sx={{ fontSize: 15 }} /> },
        { role: 'flight_expert', label: 'Flight Expert (GDS)', icon: <FlightTakeoffIcon sx={{ fontSize: 15 }} /> },
      ]
    },
    {
      title: '🎫 Operations, Finance & Marketing',
      roles: [
        { role: 'ticketing_agent', label: 'Ticketing Expert', icon: <ConfirmationNumberIcon sx={{ fontSize: 15 }} /> },
        { role: 'after_sales', label: 'After-Sales / Ops', icon: <SettingsSuggestIcon sx={{ fontSize: 15 }} /> },
        { role: 'finance', label: 'Finance & Accounts', icon: <AccountBalanceWalletIcon sx={{ fontSize: 15 }} /> },
        { role: 'marketing', label: 'Marketing Manager', icon: <CampaignIcon sx={{ fontSize: 15 }} /> },
      ]
    }
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5, color: 'text.primary' }}>
            WOW MY FLIGHT
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.8 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter your credentials to access the Travel CRM portal.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            {...register('email')}
            label="Email Address"
            variant="outlined"
            fullWidth
            size="medium"
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            {...register('password')}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            size="medium"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -0.5 }}>
            <Link component={RouterLink} to="/forgot-password" variant="body2" color="secondary" underline="hover">
              Forgot password?
            </Link>
          </Box>

          <Button type="submit" variant="contained" color="secondary" size="large" fullWidth disabled={isSubmitting} sx={{ py: 1.2, fontWeight: 800 }}>
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </Button>
        </Box>
      </form>

      <Divider sx={{ my: 2.5 }}>
        <Chip label="DEMO QUICK LOGIN (ROLE-BASED PORTALS)" size="small" sx={{ fontSize: '0.64rem', fontWeight: 800 }} />
      </Divider>

      {/* 3 Role Categories for Easy Testing */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {roleCategories.map((cat) => (
          <Box key={cat.title}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: 'text.secondary',
                display: 'block',
                mb: 0.8,
                textTransform: 'uppercase',
                fontSize: '0.66rem',
                letterSpacing: 0.4,
              }}
            >
              {cat.title}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(3, 1fr)',
                },
                gap: 0.8,
              }}
            >
              {cat.roles.map((r) => (
                <Button
                  key={r.role}
                  variant="outlined"
                  size="small"
                  startIcon={r.icon}
                  fullWidth
                  onClick={() => handleQuickLogin(r.role)}
                  sx={{
                    minHeight: 34,
                    minWidth: 0,
                    py: 0.5,
                    px: 1,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    justifyContent: 'flex-start',
                    borderRadius: 2,
                    borderColor: 'divider',
                    color: 'text.primary',
                    textAlign: 'left',
                    lineHeight: 1.2,
                    boxSizing: 'border-box',
                    '& .MuiButton-startIcon': {
                      mr: 0.6,
                      ml: 0,
                      flexShrink: 0,
                    },
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                  >
                    {r.label}
                  </Box>
                </Button>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          Protected System • Authorized Personnel Only
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
