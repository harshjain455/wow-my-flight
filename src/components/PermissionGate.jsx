import React from 'react';
import { usePermissions } from '../contexts/PermissionContext';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LockIcon from '@mui/icons-material/Lock';
import ShieldIcon from '@mui/icons-material/Shield';
import { useNavigate } from 'react-router-dom';

/**
 * PermissionGate wrapper component.
 * Usage:
 * <PermissionGate permission="leads_edit">
 *    <Button>Edit Lead</Button>
 * </PermissionGate>
 * 
 * Or full page guard:
 * <PermissionGate permission="finance_gross_profit" showAccessDenied>
 *    <FinanceDashboard />
 * </PermissionGate>
 */
export const PermissionGate = ({
  permission,
  children,
  fallback = null,
  showAccessDenied = false
}) => {
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();

  const evalResult = hasPermission(permission);

  if (evalResult.allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showAccessDenied) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'error.light',
            borderRadius: 3,
            bgcolor: '#FEF2F2'
          }}
        >
          <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <LockIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#991B1B', mb: 1, fontFamily: 'Outfit, sans-serif' }}>
            Access Denied
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, fontWeight: 600 }}>
            You do not have the required permission <code style={{ backgroundColor: '#FEE2E2', padding: '2px 6px', borderRadius: 4, color: '#991B1B' }}>{permission}</code> to access this feature or record.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
            <Button variant="outlined" color="inherit" onClick={() => navigate(-1)} sx={{ fontWeight: 800 }}>
              Go Back
            </Button>
            <Button variant="contained" color="error" startIcon={<ShieldIcon />} onClick={() => navigate('/dashboard')} sx={{ fontWeight: 800 }}>
              Dashboard
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return null;
};
