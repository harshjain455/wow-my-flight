import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import {
  ResponsiveContainer,
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
  AreaChart,
  Area
} from 'recharts';

// Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';
import { useAlert } from '../../contexts/AlertContext';

// ─── MOCK REPORT DATA ───
const MONTHLY_REVENUE_DATA = [
  { month: 'Jan', gross: 820000, net: 122000, profit: 98000 },
  { month: 'Feb', gross: 910000, net: 135000, profit: 108000 },
  { month: 'Mar', gross: 1050000, net: 156000, profit: 125000 },
  { month: 'Apr', gross: 980000, net: 145000, profit: 118000 },
  { month: 'May', gross: 1180000, net: 174000, profit: 142000 },
  { month: 'Jun', gross: 1250000, net: 185000, profit: 152000 },
  { month: 'Jul', gross: 1320000, net: 195000, profit: 160000 },
];

const CABIN_CLASS_PIE = [
  { name: 'Economy', value: 54, color: '#3B82F6' },
  { name: 'Business', value: 24, color: '#8B5CF6' },
  { name: 'Premium Economy', value: 18, color: '#10B981' },
  { name: 'First Class', value: 4, color: '#F59E0B' },
];

const TOP_ROUTES_DATA = [
  { route: 'DEL → LHR', bookings: 245, revenue: '$285k', avgPrice: '$1,163' },
  { route: 'JFK → DXB', bookings: 198, revenue: '$242k', avgPrice: '$1,222' },
  { route: 'BOM → SIN', bookings: 164, revenue: '$148k', avgPrice: '$902' },
  { route: 'LHR → JFK', bookings: 142, revenue: '$198k', avgPrice: '$1,394' },
  { route: 'DXB → SYD', bookings: 128, revenue: '$182k', avgPrice: '$1,421' },
  { route: 'DEL → JFK', bookings: 115, revenue: '$172k', avgPrice: '$1,495' },
  { route: 'SFO → LHR', bookings: 98, revenue: '$156k', avgPrice: '$1,591' },
  { route: 'LAX → TYO', bookings: 88, revenue: '$132k', avgPrice: '$1,500' },
  { route: 'FRA → SIN', bookings: 76, revenue: '$114k', avgPrice: '$1,500' },
  { route: 'ORD → DEL', bookings: 65, revenue: '$98k', avgPrice: '$1,507' },
];

const LEAD_SOURCE_DATA = [
  { source: 'Google Ads', leads: 480, converted: 125, rate: '26%' },
  { source: 'WhatsApp Direct', leads: 320, converted: 88, rate: '27.5%' },
  { source: 'Facebook / IG Ads', leads: 240, converted: 38, rate: '15.8%' },
  { source: 'Organic Search', leads: 128, converted: 18, rate: '14.1%' },
  { source: 'Referral / VIP', leads: 80, converted: 36, rate: '45.0%' },
];

const AGENTS_PERFORMANCE_DATA = [
  { rank: 1, name: 'Maria S.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', calls: 1420, closed: 68, revenue: 342000, reactionTime: '1.8 min', wastePct: '3.2%' },
  { rank: 2, name: 'Alex M.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', calls: 1280, closed: 54, revenue: 285400, reactionTime: '2.1 min', wastePct: '4.1%' },
  { rank: 3, name: 'Sofia R.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', calls: 1150, closed: 48, revenue: 224100, reactionTime: '2.8 min', wastePct: '4.8%' },
  { rank: 4, name: 'David H.', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', calls: 980, closed: 39, revenue: 182500, reactionTime: '3.4 min', wastePct: '5.6%' },
  { rank: 5, name: 'Karan P.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', calls: 850, closed: 32, revenue: 145000, reactionTime: '4.1 min', wastePct: '6.5%' },
];

const TOP_AIRLINES_DATA = [
  { name: 'British Airways (BA)', share: '32%', bookings: 398, revenue: '$445k' },
  { name: 'Emirates (EK)', share: '26%', bookings: 324, revenue: '$382k' },
  { name: 'Air India (AI)', share: '18%', bookings: 225, revenue: '$210k' },
  { name: 'Qatar Airways (QR)', share: '14%', bookings: 175, revenue: '$188k' },
  { name: 'American Airlines (AA)', share: '10%', bookings: 126, revenue: '$145k' },
];

const PAYMENT_METHODS_PIE = [
  { name: 'Credit / Debit Card', value: 72, color: '#4F46E5' },
  { name: 'Bank Wire / SWIFT', value: 21, color: '#059669' },
  { name: 'Apple & Google Pay', value: 7, color: '#EA580C' },
];

export const AllAgentsPerformance = () => {
  const { showAlert } = useAlert();
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('Month');

  const agentColumns = [
    {
      id: 'rank',
      label: 'Rank',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {row.rank === 1 ? <EmojiEventsIcon sx={{ color: '#EAB308', fontSize: 18 }} /> : <Typography variant="body2" sx={{ fontWeight: 800 }}>#{row.rank}</Typography>}
        </Box>
      )
    },
    {
      id: 'agent',
      label: 'Agent',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar src={row.avatar} sx={{ width: 34, height: 34 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.name}</Typography>
            <Typography variant="caption" color="text.secondary">Senior Travel Consultant</Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'calls',
      label: 'Calls Made',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          📞 {row.calls.toLocaleString()}
        </Typography>
      )
    },
    {
      id: 'closed',
      label: 'Leads Closed',
      render: (row) => (
        <Chip size="small" label={`${row.closed} Bookings`} color="success" sx={{ fontWeight: 800, fontSize: '0.7rem' }} />
      )
    },
    {
      id: 'revenue',
      label: 'Gross Revenue',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main' }}>
          ${row.revenue.toLocaleString()}
        </Typography>
      )
    },
    {
      id: 'reactionTime',
      label: 'Avg Reaction Time',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 800, color: '#16A34A' }}>
          ⚡ {row.reactionTime}
        </Typography>
      )
    },
    {
      id: 'waste',
      label: 'Lead Waste %',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#EA580C' }}>
          {row.wastePct}
        </Typography>
      )
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Executive Performance & Travel Intelligence Reports"
        subtitle="Complete travel CRM analytics: Gross sales, lead funnels, agent leaderboards, airline volume & financial metrics."
        action={
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                <MenuItem value="Month">This Month</MenuItem>
                <MenuItem value="Quarter">Last Quarter</MenuItem>
                <MenuItem value="YTD">Year to Date (YTD)</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => showAlert('Full Executive Analytics Report exported as CSV/PDF', 'success')}
              sx={{ fontWeight: 700 }}
            >
              Export Report
            </Button>
          </Box>
        }
      />

      {/* Top 4 KPI Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Total Gross Sales', value: '$1.25M', change: '+18.4%', icon: <MonetizationOnIcon />, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Net Revenue', value: '$185,000', change: '+14.2%', icon: <TrendingUpIcon />, color: '#059669', bg: '#ECFDF5' },
          { label: 'Lead-To-Sale Conversion', value: '22.0%', change: '+3.1%', icon: <PeopleAltIcon />, color: '#7C3AED', bg: '#F5F3FF' },
          { label: 'Avg Order Value (AOV)', value: '$2,100', change: '+$140', icon: <FlightTakeoffIcon />, color: '#D97706', bg: '#FFFBEB' },
        ].map((s, i) => (
          <Paper key={i} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: s.bg }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</Typography>
              <Box sx={{ color: s.color }}>{s.icon}</Box>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: s.color }}>{s.value}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#16A34A', display: 'block', mt: 0.5 }}>
              {s.change} vs prior period
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Tabs Bar */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2 }}
        >
          <Tab label="📊 Sales Reports" sx={{ fontWeight: 700 }} />
          <Tab label="🎯 Lead Reports" sx={{ fontWeight: 700 }} />
          <Tab label="🏆 Agent Performance" sx={{ fontWeight: 700 }} />
          <Tab label="✈️ Flight & Airlines" sx={{ fontWeight: 700 }} />
          <Tab label="💳 Payment & Risk" sx={{ fontWeight: 700 }} />
        </Tabs>
      </Paper>

      {/* ─── TAB 0: SALES REPORTS ─── */}
      {tabValue === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Monthly Revenue Trend Area Chart */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  📈 MONTHLY REVENUE & PROFIT GROWTH TREND
                </Typography>
                <Typography variant="caption" color="text.secondary">Gross Sales vs Net Profit Margin ($)</Typography>
              </Box>
              <Chip size="small" label="14.8% Net Margin" color="success" sx={{ fontWeight: 800 }} />
            </Box>

            <Box sx={{ height: 280, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#64748B" />
                  <YAxis stroke="#64748B" tickFormatter={v => `$${(v/1000)}k`} />
                  <ChartTooltip formatter={v => `$${Number(v).toLocaleString()}`} />
                  <Legend />
                  <Area type="monotone" dataKey="gross" name="Gross Sales ($)" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorGross)" />
                  <Area type="monotone" dataKey="profit" name="Net Profit ($)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Paper>

          {/* 2-Column: Top 10 Routes & Cabin Class Breakdown */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' }, gap: 2.5 }}>
            {/* Top 10 Routes Table */}
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5 }}>
                ✈️ TOP 10 FLIGHT ROUTES BY VOLUME
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {TOP_ROUTES_DATA.map((r, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0', fontSize: 13 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', width: 20 }}>#{i+1}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>{r.route}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Chip size="small" label={`${r.bookings} Bookings`} variant="outlined" sx={{ fontSize: '0.65rem' }} />
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#10B981', minWidth: 60, textAlign: 'right' }}>{r.revenue}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>

            {/* Cabin Class Distribution */}
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
                💺 BOOKINGS BY CABIN CLASS
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>Distribution of tickets sold across cabin categories</Typography>

              <Box sx={{ height: 220, width: '100%', mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={CABIN_CLASS_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                      {CABIN_CLASS_PIE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={v => `${v}% of Bookings`} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {CABIN_CLASS_PIE.map((c, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.color }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.name}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>{c.value}%</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {/* ─── TAB 1: LEAD REPORTS ─── */}
      {tabValue === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Lead Summary Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
            {[
              { label: 'Total Inbound Leads', value: '1,248', color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Confirmed Bookings (Won)', value: '275', color: '#10B981', bg: '#ECFDF5' },
              { label: 'Wasted Leads (5.0%)', value: '62', color: '#DC2626', bg: '#FEF2F2' },
              { label: 'Lead-to-Sale Conversion', value: '22.0%', color: '#7C3AED', bg: '#F5F3FF' },
            ].map((s, i) => (
              <Paper key={i} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: s.bg }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: s.color, mt: 0.5 }}>{s.value}</Typography>
              </Paper>
            ))}
          </Box>

          {/* Lead Source Breakdown Table */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
              🎯 LEAD ACQUISITION SOURCE BREAKDOWN & CONVERSIONS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {LEAD_SOURCE_DATA.map((src, idx) => (
                <Box key={idx} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{src.source}</Typography>
                    <Chip size="small" label={`${src.rate} Conversion`} color="success" sx={{ fontWeight: 800 }} />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(src.rate) * 2}
                    sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#10B981' } }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.8, fontSize: 12, color: 'text.secondary' }}>
                    <span>Total Inbound: <b>{src.leads} leads</b></span>
                    <span>Converted to Flight Booking: <b>{src.converted}</b></span>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {/* ─── TAB 2: AGENT PERFORMANCE LEADERBOARD ─── */}
      {tabValue === 2 && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                🏆 SALES AGENT PERFORMANCE & REACTION TIME LEADERBOARD
              </Typography>
              <Typography variant="caption" color="text.secondary">Ranked by closed volume, reaction speed, and lead waste reduction</Typography>
            </Box>
            <Chip size="small" label="Top 5 Consultants" color="primary" sx={{ fontWeight: 800 }} />
          </Box>
          <AppTable
            columns={agentColumns}
            data={AGENTS_PERFORMANCE_DATA}
          />
        </Paper>
      )}

      {/* ─── TAB 3: FLIGHT & AIRLINES REPORTS ─── */}
      {tabValue === 3 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          {/* Top Airlines */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1.5 }}>
              🛫 TOP AIRLINE PARTNERS BY REVENUE
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {TOP_AIRLINES_DATA.map((air, i) => (
                <Box key={i} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{air.name}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main' }}>{air.revenue}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'text.secondary' }}>
                    <span>Bookings: <b>{air.bookings} tickets</b></span>
                    <span>Market Share: <b>{air.share}</b></span>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Flight Profitability Stats */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              💰 FLIGHT MARGIN & PROFITABILITY INTELLIGENCE
            </Typography>

            {[
              { label: 'Average Net Profit Per Booking', value: '$310.00', desc: 'Average gross margin generated on international flight segments' },
              { label: 'Top Destination City', value: 'London (LHR)', desc: 'Leading booking volume hub with 420+ passengers this month' },
              { label: 'Sabre GDS Segment Fill Rate', value: '94.2%', desc: 'Real-time confirmed PNR conversion rate on Sabre GDS' },
              { label: 'Ancillary / Baggage Upsell Revenue', value: '$42,500', desc: 'Seat selection, extra baggage & fast-track pass additions' },
            ].map((item, idx) => (
              <Box key={idx} sx={{ p: 1.5, bgcolor: '#F0FDF4', borderRadius: 2, border: '1px solid #BBF7D0' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'success.main' }}>{item.value}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E293B', display: 'block' }}>{item.label}</Typography>
                <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
              </Box>
            ))}
          </Paper>
        </Box>
      )}

      {/* ─── TAB 4: PAYMENT & RISK REPORTS ─── */}
      {tabValue === 4 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
          {/* Payment Method Pie */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 1 }}>
              💳 PAYMENT GATEWAY & METHOD BREAKDOWN
            </Typography>
            <Box sx={{ height: 220, width: '100%', mb: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PAYMENT_METHODS_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {PAYMENT_METHODS_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip formatter={v => `${v}% of Total Volume`} />
                </PieChart>
              </ResponsiveContainer>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {PAYMENT_METHODS_PIE.map((m, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: m.color }} />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{m.name}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 900 }}>{m.value}%</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Risk, Refund & Chargeback Metrics */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              🛡️ FRAUD RADAR & CHARGEBACK RATIOS
            </Typography>

            <Box sx={{ p: 2, bgcolor: '#ECFDF5', borderRadius: 2, border: '1px solid #A7F3D0' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>CHARGEBACK RATIO (VISA/MC THRESHOLD: &lt;0.9%)</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#059669', my: 0.5 }}>0.12%</Typography>
              <Typography variant="caption" color="text.secondary">Excellent standing across Stripe Global & Telnyx merchant accounts</Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#FFFBEB', borderRadius: 2, border: '1px solid #FDE68A' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>AVERAGE REFUND RATIO</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#D97706', my: 0.5 }}>2.4%</Typography>
              <Typography variant="caption" color="text.secondary">Primarily due to passenger schedule changes and airline cancellations</Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#EFF6FF', borderRadius: 2, border: '1px solid #BFDBFE' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>AVERAGE ORDER VALUE (AOV)</Typography>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#2563EB', my: 0.5 }}>$2,100.00</Typography>
              <Typography variant="caption" color="text.secondary">Premium long-haul flight booking average ticket basket</Typography>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default AllAgentsPerformance;
