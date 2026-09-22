import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { alpha, useTheme } from '@mui/material/styles';

// Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SpeedIcon from '@mui/icons-material/Speed';

// Recharts
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// MOCK DATASETS
// ==========================================

const INITIAL_EXEC_KPIS = [
  { id: 'leads', title: 'Total Leads', value: '12,450 Leads', change: '+14% MoM', color: '#6366F1', icon: <PeopleAltIcon /> },
  { id: 'bookings', title: 'Total Bookings', value: '1,840 Bookings', change: '+18% MoM', color: '#2563EB', icon: <AirplaneTicketIcon /> },
  { id: 'revenue', title: 'Total Revenue', value: '$1,420,000', change: '+$142k this month', color: '#10B981', icon: <MonetizationOnIcon /> },
  { id: 'profit', title: 'Gross Profit', value: '$184,500', change: '13.0% margin', color: '#D97706', icon: <VerifiedIcon /> },
  { id: 'conv', title: 'Conversion Rate', value: '14.8%', change: '+1.4% target', color: '#8B5CF6', icon: <TrendingUpIcon /> },
  { id: 'avgValue', title: 'Avg Booking Value', value: '$771', change: 'Per ticket avg', color: '#0284C7', icon: <SpeedIcon /> },
  { id: 'pending', title: 'Pending Payments', value: '$42,800', change: 'In clearing queue', color: '#F59E0B', icon: <AccountBalanceIcon /> },
  { id: 'refund', title: 'Refund Amount', value: '$8,200', change: '12 approved cases', color: '#EF4444', icon: <AssessmentIcon /> },
  { id: 'cancel', title: 'Cancellation Rate', value: '1.2%', change: 'Industry low', color: '#10B981', icon: <FlightTakeoffIcon /> }
];

const REVENUE_TREND_DATA = [
  { month: 'Jan', revenue: 98000, profit: 12800 },
  { month: 'Feb', revenue: 110000, profit: 14500 },
  { month: 'Mar', revenue: 125000, profit: 16200 },
  { month: 'Apr', revenue: 118000, profit: 15400 },
  { month: 'May', revenue: 142000, profit: 18500 },
  { month: 'Jun', revenue: 165000, profit: 21800 }
];

const AGENT_LEADERBOARD = [
  { rank: 1, name: 'Sarah Jenkins', calls: 450, talkTime: '18h 30m', leads: 280, quotes: 84, bookings: 42, conv: '15.0%', revenue: '$145,000', profit: '$18,200' },
  { rank: 2, name: 'Alex Miller', calls: 410, talkTime: '16h 45m', leads: 240, quotes: 72, bookings: 36, conv: '15.0%', revenue: '$128,000', profit: '$16,100' },
  { rank: 3, name: 'David Ross', calls: 380, talkTime: '14h 10m', leads: 210, quotes: 60, bookings: 28, conv: '13.3%', revenue: '$98,000', profit: '$12,400' },
  { rank: 4, name: 'Sofia Rodriguez', calls: 430, talkTime: '17h 20m', leads: 260, quotes: 78, bookings: 38, conv: '14.6%', revenue: '$132,000', profit: '$16,800' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ManagementReportingDashboard() {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);
  const [dateRange, setDateRange] = useState('MONTHLY');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleExport = (format) => {
    showAlert(`✓ Report exported in ${format.toUpperCase()} format successfully!`, 'success');
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh', width: '100%' }}>
      
      {/* ─── 1. TOP EXECUTIVE HEADER ─── */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3 },
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          display: 'flex',
          justify: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, width: '100%' }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              width: 52,
              height: 52,
              fontWeight: 900,
              fontSize: '1.2rem',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
            }}
          >
            📊
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'Outfit, sans-serif', fontSize: { xs: '1.15rem', sm: '1.4rem' } }}>
                Executive Management Reporting & Analytics Command Center
              </Typography>
              <Chip label="MANAGEMENT / ADMIN" size="small" color="primary" sx={{ fontWeight: 900, fontSize: '0.65rem', height: 22 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
              Enterprise Overview of Sales, Agent Leaderboards, Flight Operations, Financial P&L, and Multi-Level Drill-Down Analytics
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <FormControl size="small" sx={{ width: 130 }}>
            <InputLabel>Date Range</InputLabel>
            <Select value={dateRange} label="Date Range" onChange={e => setDateRange(e.target.value)}>
              <MenuItem value="TODAY">Today</MenuItem>
              <MenuItem value="WEEKLY">Weekly</MenuItem>
              <MenuItem value="MONTHLY">Monthly</MenuItem>
              <MenuItem value="QUARTERLY">Quarterly</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" color="primary" startIcon={<FileDownloadIcon />} onClick={() => handleExport('pdf')} sx={{ fontWeight: 800 }}>
            PDF
          </Button>
          <Button variant="contained" color="success" startIcon={<FileDownloadIcon />} onClick={() => handleExport('excel')} sx={{ fontWeight: 800 }}>
            Excel
          </Button>
          <DualClock client={{ timezone: 'America/New_York', label: 'Exec EST' }} />
        </Box>
      </Paper>

      {/* ─── 2. RESPONSIVE KPI CARDS GRID ─── */}
      <Box sx={{ mb: 3.5 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
              xl: 'repeat(5, 1fr)'
            },
            gap: 2
          }}
        >
          {INITIAL_EXEC_KPIS.map((kpi) => (
            <Paper
              key={kpi.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  borderColor: kpi.color,
                  boxShadow: theme.palette.mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.5)' : '0 6px 20px rgba(0,0,0,0.06)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: kpi.color
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                  {kpi.title}
                </Typography>
                <Box sx={{ p: 0.8, borderRadius: 2, bgcolor: alpha(kpi.color, 0.12), color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: kpi.color, fontSize: '0.72rem' }}>
                  {kpi.change}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* ─── 3. TABS ─── */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: 'background.paper' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 800,
              fontSize: '0.82rem',
              py: 2,
              minHeight: 52,
              textTransform: 'none'
            }
          }}
        >
          <Tab label="1. Revenue & Profit Analytics" icon={<TrendingUpIcon fontSize="small" />} iconPosition="start" />
          <Tab label="2. Sales Agent Performance Leaderboard" icon={<AssessmentIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* TAB 1 */}
      {currentTab === 0 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, fontFamily: 'Outfit, sans-serif' }}>
            Monthly Revenue & Gross Profit Trend
          </Typography>
          <Box sx={{ height: 320, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" fill={alpha('#6366F1', 0.2)} name="Revenue ($)" />
                <Area type="monotone" dataKey="profit" stroke="#10B981" fill={alpha('#10B981', 0.2)} name="Gross Profit ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}

      {/* TAB 2 */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, fontFamily: 'Outfit, sans-serif' }}>
            Sales Representative Leaderboard
          </Typography>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Rank & Agent Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Total Calls</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Talk Time</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Leads</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Bookings</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Gross Revenue</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Gross Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {AGENT_LEADERBOARD.map((row) => (
                  <TableRow key={row.rank} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip label={`#${row.rank}`} size="small" color={row.rank === 1 ? 'warning' : 'primary'} sx={{ fontWeight: 900 }} />
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 700 }}>{row.calls}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 700 }}>{row.talkTime}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 700 }}>{row.leads}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>{row.bookings}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 900 }}>{row.revenue}</Typography></TableCell>
                    <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main' }}>{row.profit}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

    </Box>
  );
}
