import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

// Icons
import PeopleIcon from '@mui/icons-material/People';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import BadgeIcon from '@mui/icons-material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AppTable from '../../components/AppTable';

// Mock Data for Charts
const WEEKLY_BOOKINGS_DATA = [
  { day: 'Mon', 'This Week': 5, 'Last Week': 4 },
  { day: 'Tue', 'This Week': 8, 'Last Week': 6 },
  { day: 'Wed', 'This Week': 6, 'Last Week': 7 },
  { day: 'Thu', 'This Week': 9, 'Last Week': 5 },
  { day: 'Fri', 'This Week': 12, 'Last Week': 8 },
  { day: 'Sat', 'This Week': 4, 'Last Week': 3 },
  { day: 'Sun', 'This Week': 3, 'Last Week': 2 },
];

const CABIN_CLASS_DATA = [
  { name: 'Economy', value: 60, color: '#3B82F6' },
  { name: 'Business', value: 35, color: '#8B5CF6' },
  { name: 'First Class', value: 5, color: '#F59E0B' },
];

const PIPELINE_DATA = [
  { status: 'Quoted', count: 12, value: '$48,000', color: '#64748B' },
  { status: 'Confirmed', count: 8, value: '$32,000', color: '#F59E0B' },
  { status: 'PNR Created', count: 6, value: '$25,000', color: '#7C3AED' },
  { status: 'Payment Recv', count: 5, value: '$22,000', color: '#10B981' },
  { status: 'Ticketed', count: 4, value: '$18,000', color: '#059669' },
  { status: 'Dispatched', count: 3, value: '$12,000', color: '#06B6D4' },
];

const ACTIVITY_FEED = [
  { time: '10:32', type: 'lead', text: 'Agent Sofia created new lead — K. Singh (DEL→LHR, Business)', icon: '👤', color: '#3B82F6' },
  { time: '10:45', type: 'quote', text: 'Quote QT-001 sent to K. Singh — $10,350', icon: '📤', color: '#F59E0B' },
  { time: '11:02', type: 'payment', text: 'Payment received — BK-001, $10,350, PAID ✅', icon: '💰', color: '#10B981' },
  { time: '11:15', type: 'ticket', text: 'Ticket issued — BK-001, E-Ticket: 0172345678901', icon: '🎫', color: '#8B5CF6' }
];

export const AdminDashboard = () => {
  const navigate = useNavigate();

  const pipelineColumns = [
    { id: 'status', label: 'Booking Status', render: row => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: row.color }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.status}</Typography>
        </Box>
      ) 
    },
    { id: 'count', label: 'Count', render: row => <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.count}</Typography> },
    { id: 'value', label: 'Value ($)', render: row => <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>{row.value}</Typography> }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Admin Control Center"
        subtitle="Manage daily travel agency operations, flight pipelines, booking revenues & active agents."
      />

      {/* ─── TOP ROW: STAT CARDS ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(6, 1fr)' }, gap: 1.5, mb: 3 }}>
        <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'primary.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: { xs: '0.62rem', sm: '0.7rem' } }}>TODAY'S LEADS</Typography>
            <PeopleIcon sx={{ color: 'primary.main', fontSize: 18 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>18</Typography>
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, fontSize: '0.65rem' }}>↑ +12% vs yesterday</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'success.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: { xs: '0.62rem', sm: '0.7rem' } }}>BOOKINGS MONTH</Typography>
            <AirplaneTicketIcon sx={{ color: 'success.main', fontSize: 18 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>42</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem' }}>Target: 50</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'info.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: { xs: '0.62rem', sm: '0.7rem' } }}>REVENUE MONTH</Typography>
            <MonetizationOnIcon sx={{ color: 'info.main', fontSize: 18 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>$88,200</Typography>
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, fontSize: '0.65rem' }}>↑ +8% vs last mo</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'warning.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: { xs: '0.62rem', sm: '0.7rem' } }}>PENDING PAYMENTS</Typography>
            <HourglassEmptyIcon sx={{ color: 'warning.main', fontSize: 18 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>5</Typography>
          <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 800, fontSize: '0.65rem' }}>$14,500 pending</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'error.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: { xs: '0.62rem', sm: '0.7rem' } }}>OPEN QUOTES</Typography>
            <RequestQuoteIcon sx={{ color: 'error.main', fontSize: 18 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>14</Typography>
          <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 900, fontSize: '0.65rem' }}>⚠️ 3 expiring</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.paper' : 'secondary.50' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: { xs: '0.62rem', sm: '0.7rem' } }}>TEAM ACTIVE</Typography>
            <BadgeIcon sx={{ color: 'secondary.main', fontSize: 18 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary' }}>8</Typography>
          <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700, fontSize: '0.65rem' }}>Agents online</Typography>
        </Paper>
      </Box>

      {/* ─── MIDDLE ROW: PIPELINE & CHARTS ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '4fr 5fr 3fr' }, gap: 2.5, mb: 3 }}>
        {/* Left Card: Booking Pipeline */}
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
              ⚡ FLIGHT BOOKING PIPELINE
            </Typography>
            <Box sx={{ overflowX: 'auto', width: '100%' }}>
              <AppTable
                columns={pipelineColumns}
                data={PIPELINE_DATA}
                count={PIPELINE_DATA.length}
                page={0}
                rowsPerPage={6}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                hidePagination
              />
            </Box>
          </Paper>
        </Box>

        {/* Center Card: Weekly Booking Volume Chart */}
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
              📊 WEEKLY BOOKING VOLUME
            </Typography>
            <Box sx={{ height: { xs: 190, sm: 210 }, width: '100%', minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_BOOKINGS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} />
                  <ChartTooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="This Week" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Last Week" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>

        {/* Right Card: Cabin Class Distribution Pie Chart */}
        <Box sx={{ width: '100%', minWidth: 0 }}>
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '0.88rem', sm: '1rem' } }}>
              💺 CABIN CLASS SHARE
            </Typography>
            <Box sx={{ height: 130, width: '100%', minWidth: 0, mb: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CABIN_CLASS_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={3}>
                    {CABIN_CLASS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={v => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
              {CABIN_CLASS_DATA.map((c, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.color }} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{c.name}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{c.value}%</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* ─── BOTTOM ROW: ACTIVITY FEED ─── */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
          🔔 TODAY'S LIVE OPERATIONS ACTIVITY FEED
        </Typography>
        <List sx={{ p: 0 }}>
          {ACTIVITY_FEED.map((act, idx) => (
            <React.Fragment key={idx}>
              <ListItem sx={{ px: 0, py: 1.5 }}>
                <ListItemAvatar sx={{ minWidth: 46 }}>
                  <Avatar sx={{ bgcolor: act.color, width: 34, height: 34, fontSize: 14 }}>
                    {act.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {act.text}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      Timestamp: today at {act.time}
                    </Typography>
                  }
                />
              </ListItem>
              {idx < ACTIVITY_FEED.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
