import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

// Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import SmsIcon from '@mui/icons-material/Sms';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TimerIcon from '@mui/icons-material/Timer';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PercentIcon from '@mui/icons-material/Percent';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ApiIcon from '@mui/icons-material/Api';

// Recharts components
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';
import { dbService } from '../../services/dbService';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import ChartCard from '../../components/ChartCard';
import AppCard from '../../components/AppCard';
import AppTable from '../../components/AppTable';

const COLORS = ['#2563EB', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6'];

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fromFocused, setFromFocused] = useState(false);
  const [toFocused, setToFocused] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const mockToday = '2026-06-18';

  const applyPreset = (preset) => {
    if (preset === 'today') {
      setStartDate(mockToday);
      setEndDate(mockToday);
    } else if (preset === '7d') {
      setStartDate('2026-06-12');
      setEndDate(mockToday);
    } else if (preset === '30d') {
      setStartDate('2026-05-20');
      setEndDate(mockToday);
    } else if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    }
  };

  // 1. TOP ROW — 7 KPI STAT CARDS (Plan 1 spec)
  const topKpiStats = [
    { title: 'Gross Sales Volume', value: '$1,250,000', icon: <AccountBalanceWalletIcon />, color: '#3F51B5', trend: '22%', trendDirection: 'up', subtitle: 'Sum of all booking selling prices' },
    { title: 'Total Net Revenue', value: '$185,000', icon: <TrendingUpIcon />, color: '#14B8A6', trend: '15%', trendDirection: 'up', subtitle: 'Sales - Net Fares' },
    { title: 'Lead-to-Sale Conversion', value: '22.0%', icon: <PercentIcon />, color: '#2563EB', trend: '3.5%', trendDirection: 'up', subtitle: 'Leads converted / total leads' },
    { title: 'Net Profit Margin', value: '14.8%', icon: <PaymentsIcon />, color: '#10B981', trend: '3.2%', trendDirection: 'up', subtitle: 'Revenue / Gross Sales' },
    { title: 'Average Order Value (AOV)', value: '$2,100', icon: <FlightTakeoffIcon />, color: '#8B5CF6', trend: '8%', trendDirection: 'up', subtitle: 'Total Sales / Bookings count' },
    { title: 'Lead Waste %', value: '5.0%', icon: <DeleteSweepIcon />, color: '#EF4444', trend: '-1.2%', trendDirection: 'down', subtitle: 'Wasted leads / total leads' },
    { title: 'Avg Lead Reaction Time', value: '3 min', icon: <TimerIcon />, color: '#F59E0B', trend: '-45s', trendDirection: 'down', subtitle: 'Avg time agent picks up lead' },
  ];

  // 2. MIDDLE ROW — CHARTS DATA
  // Revenue Growth Trend (Jan-Jun)
  const revenueTrendData = [
    { name: 'Jan', revenue: 120000, target: 100000 },
    { name: 'Feb', revenue: 155000, target: 120000 },
    { name: 'Mar', revenue: 198000, target: 160000 },
    { name: 'Apr', revenue: 220000, target: 190000 },
    { name: 'May', revenue: 310000, target: 240000 },
    { name: 'Jun', revenue: 350000, target: 280000 },
  ];

  // Lead Waste by Month (Bar chart)
  const leadWasteData = [
    { name: 'Jan', wasteRate: 12, wastedLeads: 48 },
    { name: 'Feb', wasteRate: 9, wastedLeads: 36 },
    { name: 'Mar', wasteRate: 7, wastedLeads: 28 },
    { name: 'Apr', wasteRate: 6, wastedLeads: 24 },
    { name: 'May', wasteRate: 5, wastedLeads: 20 },
    { name: 'Jun', wasteRate: 4, wastedLeads: 16 },
  ];

  // Lead Source Distribution
  const leadSourceData = [
    { name: 'Google Ads', value: 450, revenue: '$480,000' },
    { name: 'WhatsApp Organic', value: 380, revenue: '$390,000' },
    { name: 'Instagram Ads', value: 290, revenue: '$210,000' },
    { name: 'Referrals & VIP', value: 180, revenue: '$120,000' },
    { name: 'Direct Inquiries', value: 120, revenue: '$50,000' },
  ];

  // Payment Gateways
  const gatewayData = [
    { name: 'Stripe Credit Card', revenue: 650000 },
    { name: 'Telnyx WebRTC / Phone', revenue: 280000 },
    { name: 'Bank Transfer / Wire', revenue: 220000 },
    { name: 'Apple / Google Pay', revenue: 100000 },
  ];

  // Top Agents Leaderboard
  const topAgentsData = [
    { name: 'Maria S.', role: 'Sales Executive', bookings: 33, revenue: '$138,650', rate: '28%', turnaround: '22 min', status: 'On Call' },
    { name: 'John D.', role: 'Sales Executive', bookings: 26, revenue: '$138,200', rate: '24%', turnaround: '13 min', status: 'Idle' },
    { name: 'Ken T.', role: 'Sales Executive', bookings: 21, revenue: '$134,150', rate: '22%', turnaround: '23 min', status: 'Away' },
    { name: 'Sara K.', role: 'Sales Executive', bookings: 18, revenue: '$123,200', rate: '20%', turnaround: '23 min', status: 'On Call' },
    { name: 'Han R.', role: 'Sales Executive', bookings: 14, revenue: '$114,100', rate: '18%', turnaround: '33 min', status: 'Break' },
  ];

  // Client Financial View Table
  const financialColumns = [
    { id: 'client', label: 'Client Name' },
    { id: 'service', label: 'Flight Route / Class' },
    { id: 'consultant', label: 'Sales Agent' },
    { id: 'totalFee', label: 'Total Booking' },
    { id: 'paid', label: 'Paid Amount' },
    { id: 'balance', label: 'Balance' },
    { id: 'paymentStatus', label: 'Payment Status' },
  ];

  const financialRows = [
    { id: 1, client: 'Karan Singh', service: 'DEL → LHR (Business)', consultant: 'Maria S.', totalFee: '$10,350', paid: '$10,350', balance: '$0', paymentStatus: 'Fully Paid' },
    { id: 2, client: 'Ankit Sharma', service: 'JFK → DXB (Economy)', consultant: 'John D.', totalFee: '$3,200', paid: '$1,600', balance: '$1,600', paymentStatus: 'Partially Paid' },
    { id: 3, client: 'Michael Chen', service: 'JFK → LHR (Business)', consultant: 'Ken T.', totalFee: '$5,175', paid: '$5,175', balance: '$0', paymentStatus: 'Fully Paid' },
    { id: 4, client: 'J. Smith', service: 'DXB → CDG (First)', consultant: 'Sara K.', totalFee: '$8,500', paid: '$8,500', balance: '$0', paymentStatus: 'Fully Paid' },
    { id: 5, client: 'A. Lee', service: 'DEL → SIN (Economy)', consultant: 'Maria S.', totalFee: '$2,100', paid: '$2,100', balance: '$0', paymentStatus: 'Fully Paid' },
  ];

  // AI Flight Booking Simulation State
  const [activeSimTab, setActiveSimTab] = useState(0);
  const [chatbotName, setChatbotName] = useState('Johnathan Smith');
  const [chatbotLog, setChatbotLog] = useState([]);

  const handleSimulateChat = () => {
    if (!chatbotName.trim()) {
      showAlert('Please enter a passenger name', 'error');
      return;
    }
    const logs = [
      { sender: 'client', text: `Hi! I need urgent Business Class tickets for NYC to London. My name is ${chatbotName}`, time: '10:00 AM' },
      { sender: 'bot', text: `Hello ${chatbotName}! Welcome to WOW MY FLIGHT ✈️. I can check direct flights for JFK → LHR. For how many passengers?`, time: '10:01 AM' },
      { sender: 'client', text: `2 Adults, departing 15 Oct, returning 22 Oct.`, time: '10:02 AM' },
      { sender: 'bot', text: `Found 2 premium options: 1) British Airways BA-117 direct for $9,800 total, 2) Air India AI-101 for $10,350. Quote QT-001 created & sent to our GDS Desk!`, time: '10:03 AM' },
      { sender: 'bot', text: `Assigned to Senior Flight Specialist Maria S. Instant payment link is ready: https://pay.wowmyflight.com/lnk/A3F9X2`, time: '10:03 AM' }
    ];
    setChatbotLog(logs);
    showAlert(`Simulated AI WhatsApp Flight Quote generated for ${chatbotName}!`, 'success');
  };

  const handleExportData = () => {
    try {
      let csv = "data:text/csv;charset=utf-8,";
      csv += "Client Name,Route,Sales Agent,Total Booking,Paid Amount,Payment Status\n";
      financialRows.forEach(r => {
        csv += `"${r.client}","${r.service}","${r.consultant}","${r.totalFee}","${r.paid}","${r.paymentStatus}"\n`;
      });
      const uri = encodeURI(csv);
      const link = document.createElement("a");
      link.setAttribute("href", uri);
      link.setAttribute("download", `wow_my_flight_financial_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAlert("Financial data exported successfully as CSV!", "success");
    } catch (e) {
      showAlert("Failed to export data", "error");
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="CEO / Super Admin Dashboard"
        subtitle={`Welcome back, ${currentUser?.name || 'Owner & CEO'}. Real-time overview of WOW MY FLIGHT sales, revenue & operations.`}
        action={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: isMobile ? '100%' : 'auto' }}>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 0.5, bgcolor: 'background.paper' }}>
                {[
                  { label: 'Today', key: 'today' },
                  { label: '7D', key: '7d' },
                  { label: '30D', key: '30d' },
                  { label: 'All', key: 'all' },
                ].map(preset => {
                  const isActive =
                    preset.key === 'today' ? startDate === mockToday && endDate === mockToday :
                    preset.key === '7d' ? startDate === '2026-06-12' && endDate === mockToday :
                    preset.key === '30d' ? startDate === '2026-05-20' && endDate === mockToday :
                    preset.key === 'all' ? !startDate && !endDate : false;
                  return (
                    <Button
                      key={preset.key}
                      size="small"
                      variant={isActive ? 'contained' : 'text'}
                      color={isActive ? 'primary' : 'inherit'}
                      onClick={() => applyPreset(preset.key)}
                      sx={{ minWidth: 0, px: isMobile ? 1 : 1.5, py: 0.5, fontSize: '0.72rem', fontWeight: 700, borderRadius: 1.5 }}
                    >
                      {preset.label}
                    </Button>
                  );
                })}
              </Box>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => navigate('/leads')}
              >
                {isMobile ? 'New Lead' : 'Add New Lead'}
              </Button>
            </Box>
          </Box>
        }
      />

      {/* ─── 1. TOP ROW: 7 KPI STAT CARDS ─── */}
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Core Travel KPIs & Performance Overview
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(7, 1fr)' }, gap: 1.5, mb: 3 }}>
        {topKpiStats.map((stat, idx) => (
          <Paper
            key={idx}
            elevation={0}
            sx={{
              p: 1.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2.5,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': { transform: 'translateY(-2px)', boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.06)' }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: `${stat.color}15`, color: stat.color, display: 'flex' }}>
                {React.cloneElement(stat.icon, { sx: { fontSize: 18 } })}
              </Box>
              <Chip
                size="small"
                label={stat.trend}
                color={stat.trendDirection === 'up' ? 'success' : 'default'}
                sx={{ fontSize: '0.65rem', height: 20, fontWeight: 700 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.72rem', lineHeight: 1.2, mb: 0.5 }}>
              {stat.title}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1 }}>
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* ─── 2. MIDDLE ROW: CHARTS + CONVERSION GAUGE + COMMUNICATION ANALYTICS ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '8fr 4fr' }, gap: 2, mb: 3 }}>
        
        {/* Left: Charts Grid */}
        <Box sx={{ display: 'grid', gap: 2 }}>
          {/* Revenue Growth Trend */}
          <ChartCard title="Revenue Growth Trend (Jan - Jun)" subheader="Monthly Target vs. Actual Generated Gross Sales ($)">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} stroke="#94A3B8" />
                <YAxis fontSize={12} stroke="#94A3B8" tickFormatter={(v) => `$${v / 1000}k`} />
                <ChartTooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Actual Revenue ($)" stroke="#2563EB" strokeWidth={2.5} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="target" name="Target ($)" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* 2-Col Bottom Charts: Lead Waste & Lead Sources */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {/* Lead Waste Bar Chart */}
            <ChartCard title="Lead Waste Rate by Month (%)" subheader="Wasted inquiries reduced from 12% to 4%">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={leadWasteData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} />
                  <YAxis fontSize={11} tickFormatter={(v) => `${v}%`} />
                  <ChartTooltip formatter={(v) => [`${v}%`, 'Waste Rate']} />
                  <Bar dataKey="wasteRate" name="Waste %" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Lead Source Acquisition */}
            <ChartCard title="Lead Sources & Revenue" subheader="Marketing channel distribution">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={leadSourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" label={({ name }) => name.split(' ')[0]} fontSize={10}>
                    {leadSourceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={(v, n, item) => [`${v} leads (${item.payload.revenue})`, item.payload.name]} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Box>
        </Box>

        {/* Right: Conversion Rate Gauge + Communication Analytics */}
        <Box sx={{ display: 'grid', gap: 2 }}>
          
          {/* Conversion Rate Gauge Card */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, textAlign: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>LEAD-TO-SALE CONVERSION GAUGE</Typography>
            <Typography variant="caption" color="text.secondary">Industry Benchmark: 15% - 20%</Typography>
            
            <Box sx={{ position: 'relative', display: 'inline-flex', my: 2 }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={140}
                thickness={4.5}
                sx={{ color: '#E2E8F0' }}
              />
              <CircularProgress
                variant="determinate"
                value={22}
                size={140}
                thickness={4.5}
                sx={{ color: '#10B981', position: 'absolute', left: 0 }}
              />
              <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#10B981' }}>22%</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>High Performer</Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Inquiries</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>1,420</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Converted</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'success.main' }}>312</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Target</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>20%</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Right Panel: Communication Analytics Section (Plan 1 spec) */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.5 }}>COMMUNICATION ANALYTICS</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Omnichannel communication traffic volume
            </Typography>

            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {[
                { label: 'Total Calls', value: '13,235', freq: 'Every day', icon: <PhoneInTalkIcon sx={{ fontSize: 18 }} />, color: '#10B981', bg: '#F0FDF4' },
                { label: 'SMS Sent', value: '2,368', freq: 'Weekly', icon: <SmsIcon sx={{ fontSize: 18 }} />, color: '#3B82F6', bg: '#EFF6FF' },
                { label: 'Emails Dispatched', value: '99,922', freq: 'Monthly', icon: <EmailIcon sx={{ fontSize: 18 }} />, color: '#F59E0B', bg: '#FFFBEB' },
                { label: 'WhatsApp Messages', value: '1,885,235', freq: 'Monthly', icon: <WhatsAppIcon sx={{ fontSize: 18 }} />, color: '#22C55E', bg: '#F0FDF4' },
              ].map(item => (
                <Box
                  key={item.label}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: item.bg,
                    border: `1px solid ${item.color}30`
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: item.color, display: 'flex' }}>{item.icon}</Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>{item.label}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>{item.freq}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* ─── 3. REVENUE LEAKAGE & MONEY FLOW INTELLIGENCE ─── */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FAFAFA' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1 }}>
              🚨 REVENUE LEAKAGE RADAR & PROFIT CONTROL
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Real-time identification of where money is being made or lost across the sales floor
            </Typography>
          </Box>
          <Chip label="Live P&L Shield Active" color="success" size="small" sx={{ fontWeight: 800 }} />
        </Box>

        {/* 4 Revenue Leakage / Gain Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 2.5 }}>
          {/* Card 1: Dropped Leads */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#FEF2F2', borderColor: '#FECACA' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#991B1B' }}>DROPPED LEADS (SLA &gt; 15M)</Typography>
              <Chip label="14 Leads" size="small" color="error" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#DC2626' }}>-$14,200</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Estimated revenue at risk due to delayed first callbacks.
            </Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              fullWidth
              onClick={() => showAlert('14 stalled leads automatically reallocated to Top 3 Conversion Agents.', 'success')}
              sx={{ fontWeight: 800, fontSize: '0.68rem', py: 0.4 }}
            >
              Auto-Reassign to Top Agents
            </Button>
          </Paper>

          {/* Card 2: Uncollected Second Installments */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#FFFBEB', borderColor: '#FDE68A' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#92400E' }}>PENDING 2ND INSTALLMENTS</Typography>
              <Chip label="6 Bookings" size="small" color="warning" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#D97706' }}>+$8,600</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Partial payment balances due within 48 hours.
            </Typography>
            <Button
              size="small"
              variant="contained"
              color="warning"
              fullWidth
              onClick={() => showAlert('Automated WhatsApp payment links dispatched to 6 customers.', 'success')}
              sx={{ fontWeight: 800, fontSize: '0.68rem', py: 0.4 }}
            >
              Trigger WhatsApp Reminders
            </Button>
          </Paper>

          {/* Card 3: Ticketing Delay Penalty Avoidance */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#F0F9FF', borderColor: '#BAE6FD' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#0369A1' }}>GDS TTL PENALTY SAVINGS</Typography>
              <Chip label="Protected" size="small" color="info" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#0284C7' }}>+$3,150</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Saved this week via instant TTL countdown queue alerts.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              color="info"
              fullWidth
              onClick={() => navigate('/ticketing')}
              sx={{ fontWeight: 800, fontSize: '0.68rem', py: 0.4 }}
            >
              View Ticketing Queue
            </Button>
          </Paper>

          {/* Card 4: Preferred Airline High Margin Share */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#F0FDF4', borderColor: '#BBF7D0' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#166534' }}>HIGH-COMMISSION AIRLINES</Typography>
              <Chip label="68% Share" size="small" color="success" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#16A34A' }}>+$28,400</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
              Extra commission earned from Emirates, BA & Qatar deals.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              color="success"
              fullWidth
              onClick={() => showAlert('Airline incentive distribution report generated.', 'info')}
              sx={{ fontWeight: 800, fontSize: '0.68rem', py: 0.4 }}
            >
              View Airline Incentive Matrix
            </Button>
          </Paper>
        </Box>

        {/* Complete 5-Stage Sales Conversion Funnel */}
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', display: 'block', mb: 1.5 }}>
          OTA 5-STAGE CUSTOMER JOURNEY FUNNEL
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 1.5, textAlign: 'center' }}>
          {[
            { step: '1. Inbound Leads', count: '1,420', conv: '100%', color: '#3F51B5', bg: '#EEF2FF' },
            { step: '2. Contacted & Dialed', count: '1,180', conv: '83.1%', color: '#0284C7', bg: '#F0F9FF' },
            { step: '3. GDS Quotes Sent', count: '720', conv: '61.0%', color: '#7C3AED', bg: '#F5F3FF' },
            { step: '4. Payment Received', count: '312', conv: '43.3%', color: '#059669', bg: '#ECFDF5' },
            { step: '5. Ticketed & Flown', count: '298', conv: '95.5%', color: '#16A34A', bg: '#F0FDF4' },
          ].map((f, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: f.bg, borderColor: `${f.color}30` }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: f.color, display: 'block' }}>
                {f.step}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, my: 0.5, color: '#0F172A' }}>
                {f.count}
              </Typography>
              <Chip label={`Stage Conv: ${f.conv}`} size="small" sx={{ fontWeight: 800, fontSize: '0.62rem', height: 18, bgcolor: 'background.paper' }} />
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* ─── 4. TOP PERFORMING AGENTS LEADERBOARD ─── */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>TOP PERFORMING SALES AGENTS</Typography>

            <Typography variant="caption" color="text.secondary">Real-time agent turnaround time and booking volume</Typography>
          </Box>
          <Button size="small" variant="outlined" onClick={() => navigate('/agents')}>
            View All Agents
          </Button>
        </Box>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                {['# Rank', 'Agent Name', 'Status', 'Closed Bookings', 'Gross Revenue ($)', 'Conversion Rate', 'Avg Turnaround'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#64748B', fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topAgentsData.map((a, i) => (
                <tr key={a.name} style={{ borderBottom: '1px solid #F8FAFC' }}>
                  <td style={{ padding: '10px', fontWeight: 800, color: '#3B82F6' }}>#{i + 1}</td>
                  <td style={{ padding: '10px', fontWeight: 700 }}>{a.name}</td>
                  <td style={{ padding: '10px' }}>
                    <Chip size="small" label={a.status} color={a.status === 'On Call' ? 'success' : a.status === 'Idle' ? 'warning' : 'default'} sx={{ fontSize: '0.68rem', height: 20 }} />
                  </td>
                  <td style={{ padding: '10px', fontWeight: 700 }}>{a.bookings}</td>
                  <td style={{ padding: '10px', fontWeight: 800, color: '#10B981' }}>{a.revenue}</td>
                  <td style={{ padding: '10px' }}>{a.rate}</td>
                  <td style={{ padding: '10px', color: '#64748B' }}>{a.turnaround}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>

      {/* ─── 4. GLOBAL CLIENT FINANCIAL VIEW ─── */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5 }}>GLOBAL CLIENT FINANCIAL VIEW</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Recent bookings, ticketed itineraries & collection status
        </Typography>
        <AppTable columns={financialColumns} data={financialRows} maxHeight={280} />
      </Paper>

      {/* ─── 5. AI WORKFLOW SIMULATION HUB (TRAVEL SPECIFIC) ─── */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5 }}>AI AUTOMATION & FLIGHT INGESTION SIMULATOR</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          Interactive simulation of AI passenger quote qualification & GDS routing
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, mb: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          {['AI WhatsApp Flight Bot', 'AI Lead Auto-Routing', 'AI GDS PNR Parser'].map((tabName, idx) => (
            <Button
              key={idx}
              size="small"
              onClick={() => setActiveSimTab(idx)}
              variant={activeSimTab === idx ? 'contained' : 'text'}
              sx={{ fontSize: '0.72rem', py: 0.5, px: 1.5, borderRadius: 1.5 }}
            >
              {tabName}
            </Button>
          ))}
        </Box>

        {activeSimTab === 0 && (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Simulate an inbound WhatsApp inquiry for international flight tickets:
              </Typography>
              <TextField
                size="small"
                label="Passenger Full Name"
                value={chatbotName}
                onChange={e => setChatbotName(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSimulateChat}
                sx={{ background: 'linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)' }}
              >
                Simulate WhatsApp Flight Qualification
              </Button>
            </Box>

            {chatbotLog.length > 0 && (
              <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider', maxHeight: 200, overflowY: 'auto' }}>
                {chatbotLog.map((log, i) => (
                  <Box key={i} sx={{ mb: 1, p: 1, bgcolor: log.sender === 'client' ? '#EFF6FF' : 'white', borderRadius: 1.5, border: '1px solid', borderColor: '#E2E8F0' }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>
                      {log.sender === 'client' ? 'Passenger' : 'AI Assistant'} ({log.time})
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.78rem' }}>{log.text}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {activeSimTab === 1 && (
          <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>AI Lead Auto-Routing Active</Typography>
            <Typography variant="caption" color="text.secondary">
              Incoming high-priority leads from Google Ads and WhatsApp are automatically assigned via Round-Robin to active sales executives with the lowest caseload.
            </Typography>
          </Box>
        )}

        {activeSimTab === 2 && (
          <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>GDS PNR Parser Engine</Typography>
            <Typography variant="caption" color="text.secondary">
              Sabre and Amadeus flight segments are parsed instantly into clean customer-facing quote summaries with automated profit margin calculations.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* ─── 6. BOTTOM: QUICK ACTION BUTTONS (Plan 1 spec) ─── */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Super Admin Quick Actions
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<SecurityIcon />}
            onClick={() => navigate('/active-cases')}
            sx={{ py: 1.2, fontWeight: 700, borderRadius: 2 }}
          >
            Manage Users (RBAC)
          </Button>
          <Button
            variant="outlined"
            startIcon={<ApiIcon />}
            onClick={() => showAlert('API Integrations Hub: Sabre GDS, Telnyx WebRTC, Stripe & WhatsApp API connected.', 'info')}
            sx={{ py: 1.2, fontWeight: 700, borderRadius: 2 }}
          >
            API Integrations
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => navigate('/super_admin/customization')}
            sx={{ py: 1.2, fontWeight: 700, borderRadius: 2 }}
          >
            System Settings
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportData}
            sx={{ py: 1.2, fontWeight: 700, borderRadius: 2 }}
          >
            Data Export (CSV)
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SuperAdminDashboard;
