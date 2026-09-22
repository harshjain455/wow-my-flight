import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DualClock from '../../components/DualClock';
import IssuanceQueue from '../../components/IssuanceQueue';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import WarningIcon from '@mui/icons-material/Warning';
import WifiIcon from '@mui/icons-material/Wifi';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer
} from 'recharts';

const ISSUANCE_TREND_DATA = [
  { day: 'Mon', 'Issued': 8 },
  { day: 'Tue', 'Issued': 14 },
  { day: 'Wed', 'Issued': 11 },
  { day: 'Thu', 'Issued': 9 },
  { day: 'Fri', 'Issued': 16 },
  { day: 'Sat', 'Issued': 6 },
  { day: 'Sun', 'Issued': 4 },
];

export default function TicketingAgentDashboard() {
  const navigate = useNavigate();

  const handleSelectIssue = (item) => {
    navigate('/ticketing', { state: { selectedBooking: item } });
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          px: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Ticketing Operations Control
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Global GDS queues, airline API connections, e-ticket issuance metrics & performance stats.
          </Typography>
        </Box>
        <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
      </Paper>

      {/* KPI Cards Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'success.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>TICKETS ISSUED TODAY</Typography>
            <ConfirmationNumberIcon sx={{ color: 'success.main' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>12</Typography>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>↑ +33% vs yesterday</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'primary.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>MONTHLY ISSUANCES</Typography>
            <AirplaneTicketIcon sx={{ color: 'primary.main' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>142</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Target: 200 tickets</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'warning.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>PENDING IN QUEUE</Typography>
            <QueryBuilderIcon sx={{ color: 'warning.main' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>7</Typography>
          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 800 }}>Needs immediate action</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'error.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>ACTIVE TRACKER ALERTS</Typography>
            <WarningIcon sx={{ color: 'error.main' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>2</Typography>
          <Typography variant="caption" color="error.main" sx={{ fontWeight: 800 }}>Schedule changes flagged</Typography>
        </Paper>
      </Box>

      {/* Urgent TTL Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: '1px solid #FECACA',
          borderRadius: 2.5,
          bgcolor: '#FEF2F2',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <WarningIcon sx={{ color: '#DC2626', fontSize: 28 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#991B1B' }}>
              🚨 URGENT AIRLINE TTL WARNING: PNR #ABC12D (M. Chen · JFK → LHR)
            </Typography>
            <Typography variant="caption" sx={{ color: '#B91C1C', fontWeight: 600 }}>
              Ticketing Time Limit expires in <b>38 minutes</b>. Auto-cancellation by American Airlines if unissued.
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => navigate('/ticketing')}
          sx={{ fontWeight: 800, borderRadius: 2, textTransform: 'none' }}
        >
          Issue Ticket Now (001-XXXX)
        </Button>
      </Paper>

      {/* Main Content Layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Full Ticketing Department Queue Component */}
        <Box>
          <IssuanceQueue onSelectIssue={handleSelectIssue} />
        </Box>

        {/* Bottom Section: GDS Status, Trends, & Shortcuts */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* GDS Connectivity */}
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                🌐 GDS CONNECTIONS & AIRLINE API STATUS
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
                {[
                  { name: 'Sabre GDS Host', speed: '42ms', status: 'Active', color: '#22C55E' },
                  { name: 'Amadeus 1A Gateway', speed: '58ms', status: 'Active', color: '#22C55E' },
                  { name: 'Travelport GDS Link', speed: '110ms', status: 'Degraded', color: '#F59E0B' },
                ].map((c) => (
                  <Box key={c.name} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <WifiIcon sx={{ color: c.color }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{c.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Latency: {c.speed}</Typography>
                      <Chip size="small" label={c.status} color={c.status === 'Active' ? 'success' : 'warning'} sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800, mt: 0.5 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            {/* Quick Actions / Shortcuts */}
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                ⚡ QUICK SHORTCUTS
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <Button
                  variant="contained"
                  fullWidth
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/ticketing')}
                  sx={{ py: 1.2, borderRadius: 2, fontWeight: 800, background: 'linear-gradient(135deg, #3F51B5 0%, #303F9F 100%)' }}
                >
                  Open Ticket Issuance Controls
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/flight-alerts')}
                  sx={{ py: 1.2, borderRadius: 2, fontWeight: 800 }}
                >
                  View Live Flight Alerts & PNR Tracker
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/bookings')}
                  sx={{ py: 1.2, borderRadius: 2, fontWeight: 800 }}
                >
                  Manage Bookings List
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
