import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import GroupsIcon from '@mui/icons-material/Groups';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import BusinessIcon from '@mui/icons-material/Business';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import GavelIcon from '@mui/icons-material/Gavel';
import BarChartIcon from '@mui/icons-material/BarChart';

// Recharts
import {
  ResponsiveContainer,
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

const INITIAL_EXPERT_KPIS = [
  { id: 'escalated', title: 'Total Escalated Cases', value: '19', change: '+3 today', isUp: true, icon: <WarningAmberIcon sx={{ color: '#DC2626' }} />, color: '#FEF2F2', border: '#DC2626' },
  { id: 'highValue', title: 'High-Value Bookings', value: '14', change: '$184k in queue', isUp: true, icon: <DiamondIcon sx={{ color: '#C59B27' }} />, color: '#FFFBEB', border: '#C59B27' },
  { id: 'vips', title: 'VIP Customers', value: '38', change: '8 traveling this week', isUp: true, icon: <StarIcon sx={{ color: '#2563EB' }} />, color: '#EFF6FF', border: '#2563EB' },
  { id: 'reissues', title: 'Complex Reissues', value: '7', change: 'Awaiting GDS waiver', isUp: true, icon: <CurrencyExchangeIcon sx={{ color: '#7C3AED' }} />, color: '#F5F3FF', border: '#7C3AED' },
  { id: 'group', title: 'Group Bookings (10+ Pax)', value: '5', change: '2 in final deposit', isUp: true, icon: <GroupsIcon sx={{ color: '#059669' }} />, color: '#ECFDF5', border: '#059669' },
  { id: 'multicity', title: 'Multi-City Bookings', value: '12', change: 'Round-the-world / 4+ stops', isUp: true, icon: <ConnectingAirportsIcon sx={{ color: '#0284C7' }} />, color: '#F0F9FF', border: '#0284C7' },
  { id: 'corporate', title: 'Corporate Accounts', value: '9', change: 'SLA active < 15m', isUp: true, icon: <BusinessIcon sx={{ color: '#3F51B5' }} />, color: '#E8EAF6', border: '#3F51B5' },
  { id: 'complaints', title: 'Pending Complaints', value: '4', change: '-2 resolved today', isUp: false, icon: <ReportProblemIcon sx={{ color: '#DC2626' }} />, color: '#FEF2F2', border: '#DC2626' },
  { id: 'exceptions', title: 'Sales Exceptions', value: '6', change: 'Discount overrides', isUp: true, icon: <PriceCheckIcon sx={{ color: '#D97706' }} />, color: '#FEF3C7', border: '#D97706' },
  { id: 'resolved', title: 'Resolved Today', value: '23', change: '99.1% executive SLA', isUp: true, icon: <CheckCircleIcon sx={{ color: '#059669' }} />, color: '#ECFDF5', border: '#059669' }
];

const INITIAL_ESCALATION_QUEUE = [
  { id: 'ESC-901', bookingId: 'BK-10892', customer: 'Ambassador Harold Vance', type: 'VIP First Class', reason: 'British Airways Schedule Change - Missed Concorde Room Connection', priority: 'Critical', agent: 'Sarah Jenkins', tl: 'Michael Chang', date: '2026-08-20 11:30', status: 'In Review' },
  { id: 'ESC-902', bookingId: 'BK-10895', customer: 'Global Tech Corp (24 Pax)', type: 'Corporate Group', reason: 'Airline Tariff Increase of $180/pax post-deposit waiver request', priority: 'Critical', agent: 'Alex Miller', tl: 'Sofia Rodriguez', date: '2026-08-20 10:15', status: 'Pending Expert' },
  { id: 'ESC-903', bookingId: 'BK-10901', customer: 'Dr. Alistair Finch', type: 'Multi-City RTW', reason: 'Married Segment Disruption across Qatar Airways & Cathay Pacific', priority: 'High', agent: 'David Ross', tl: 'Michael Chang', date: '2026-08-19 16:40', status: 'In Review' },
  { id: 'ESC-904', bookingId: 'BK-10912', customer: 'Elena Rostova', type: 'Voluntary Reissue', reason: 'Medical emergency date shift requesting penalty fee waiver', priority: 'High', agent: 'Rita Verma', tl: 'Sofia Rodriguez', date: '2026-08-19 14:10', status: 'Pending Expert' },
  { id: 'ESC-905', bookingId: 'BK-10920', customer: 'Marcus Sterling', type: 'Executive Complaint', reason: 'Chauffeur airport transfer no-show in Dubai (Emirates First)', priority: 'Medium', agent: 'James Cooper', tl: 'David Ross', date: '2026-08-18 19:20', status: 'Resolved' }
];

const INITIAL_COMPLEX_BOOKINGS = [
  { id: 'CB-501', bookingId: 'BK-10892', customer: 'Ambassador Harold Vance', itinerary: 'JFK → LHR → DXB → SIN → SYD → LAX → JFK', paxCount: 2, cabin: 'First & Business', totalFare: 28500, supplier: 'Amadeus 1A (BA/EK/QF)', ticketStatus: 'ISSUED', paymentStatus: 'PAID ($28,500)', type: 'Multi-City RTW' },
  { id: 'CB-502', bookingId: 'BK-10895', customer: 'TechSummit 2026 Group', itinerary: 'SFO → FRA → MUC (Group Block)', paxCount: 24, cabin: 'Economy Plus', totalFare: 43200, supplier: 'Sabre 1S (Lufthansa Group)', ticketStatus: 'PARTIAL (18/24)', paymentStatus: 'DEPOSIT PAID ($20,000)', type: 'Group 24 Pax' },
  { id: 'CB-503', bookingId: 'BK-10933', customer: 'Apex Energy Partners', itinerary: 'IAH → DOH → LOS → LHR → IAH', paxCount: 4, cabin: 'Business Class', totalFare: 36400, supplier: 'Travelport 1G (Qatar/Virgin)', ticketStatus: 'ISSUED', paymentStatus: 'CORPORATE INVOICE', type: 'Corporate Travel' }
];

const INITIAL_VIP_CUSTOMERS = [
  { id: 'VIP-01', name: 'Ambassador Harold Vance', level: 'Tier 1 Black Diamond', lifetimeRevenue: '$148,500', tripsCount: 14, assignedAgent: 'Sarah Jenkins', specialRequests: 'Row 1A always, Chauffeur meet-and-greet at airbridge, Halal meal', priorityStatus: 'Immediate 24/7 Executive SLA' },
  { id: 'VIP-02', name: 'Lady Eleanor Montague', level: 'Platinum Elite', lifetimeRevenue: '$94,200', tripsCount: 9, assignedAgent: 'Alex Miller', specialRequests: 'Direct aisle access, Quiet zone, Champagne pre-order on boarding', priorityStatus: 'Top Priority' },
  { id: 'VIP-03', name: 'Vikram & Sunita Singhania', level: 'Platinum Elite', lifetimeRevenue: '$86,000', tripsCount: 8, assignedAgent: 'Sofia Rodriguez', specialRequests: 'Wheelchair assistance for Mrs. Singhania, Jain Meal (VJML)', priorityStatus: 'Top Priority' },
  { id: 'VIP-04', name: 'Charles Montgomery Burns', level: 'Gold Concierge', lifetimeRevenue: '$62,400', tripsCount: 6, assignedAgent: 'Michael Chang', specialRequests: 'Helicopter transfer Monaco to Nice airport, Excess baggage waiver', priorityStatus: 'Priority Desk' }
];

const INITIAL_REISSUES = [
  { id: 'REIS-201', bookingId: 'BK-10892', customer: 'Ambassador Harold Vance', originalFare: 12400, newFare: 13850, fareDifference: 1450, penalty: 0, refundAmount: 0, airlineRules: 'BA INVOL SCHEDULE CHANGE: WAIVER CODE W/BA-99120 APPLIED', status: 'Awaiting Expert Approval', airline: 'British Airways' },
  { id: 'REIS-202', bookingId: 'BK-10912', customer: 'Elena Rostova', originalFare: 3200, newFare: 3600, fareDifference: 400, penalty: 250, refundAmount: 0, airlineRules: 'Emirates Med Waiver pending hospital certificate verification', status: 'Pending Review', airline: 'Emirates' },
  { id: 'REIS-203', bookingId: 'BK-10940', customer: 'Arthur Pendelton', originalFare: 5600, newFare: 4800, fareDifference: -800, penalty: 150, refundAmount: 650, airlineRules: 'Air France Voluntary Downgrade from First to Business (EMD Credit)', status: 'Approved', airline: 'Air France' }
];

const INITIAL_COMPLAINTS = [
  { id: 'CMP-101', customer: 'Marcus Sterling', bookingId: 'BK-10920', category: 'Concierge Ground Transfer Failure', severity: 'Critical', assignedExpert: 'Expert Team Leader Desk', deadline: '2h remaining', slaStatus: 'URGENT', notes: 'Passenger had to hire private limousine for $350. Recommending $350 refund + $200 travel voucher.' },
  { id: 'CMP-102', customer: 'Fatima Al-Subaie', bookingId: 'BK-10944', category: 'Baggage Inclusion Dispute', severity: 'High', assignedExpert: 'Expert Team Leader Desk', deadline: '5h remaining', slaStatus: 'ON TRACK', notes: 'Customer charged $150 at Heathrow check-in because basic economy code was issued without luggage.' }
];

const INITIAL_SALES_EXCEPTIONS = [
  { id: 'EXC-301', bookingId: 'BK-10892', customerPrice: 28500, supplierPrice: 25800, requestedDiscount: 1200, requestedMarkup: '$1,500 (5.8%)', agent: 'Sarah Jenkins', reason: 'High-Value VIP Retention. Client matching corporate Amex rate.' },
  { id: 'EXC-302', bookingId: 'BK-10895', customerPrice: 43200, supplierPrice: 40000, requestedDiscount: 1800, requestedMarkup: '$1,400 (3.5%)', agent: 'Alex Miller', reason: '24-passenger group booking. Client paying 100% upfront via wire.' },
  { id: 'EXC-303', bookingId: 'BK-10955', customerPrice: 9400, supplierPrice: 8900, requestedDiscount: 400, requestedMarkup: '$100 (1.1%)', agent: 'David Ross', reason: 'Repeat luxury flyer. Waiving margin to secure upcoming annual corporate contract.' }
];

const ESCALATION_CATEGORY_DATA = [
  { name: 'GDS Schedule Changes', count: 8, color: '#DC2626' },
  { name: 'VIP Concierge Requests', count: 5, color: '#2563EB' },
  { name: 'Fare Rules & Reissues', count: 4, color: '#7C3AED' },
  { name: 'Sales Margin Overrides', count: 3, color: '#D97706' },
  { name: 'Ground & Service Complaints', count: 2, color: '#059669' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ExpertTeamLeaderDashboard() {
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);

  // States
  const [escalations, setEscalations] = useState(INITIAL_ESCALATION_QUEUE);
  const [reissues, setReissues] = useState(INITIAL_REISSUES);
  const [complaints, setComplaints] = useState(INITIAL_COMPLAINTS);
  const [exceptions, setExceptions] = useState(INITIAL_SALES_EXCEPTIONS);
  const [vipCustomers, setVipCustomers] = useState(INITIAL_VIP_CUSTOMERS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [takeOwnershipModal, setTakeOwnershipModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [caseNotes, setCaseNotes] = useState('');

  const [assignExpertModal, setAssignExpertModal] = useState(false);
  const [targetExpert, setTargetExpert] = useState('Sarah Jenkins (Senior Specialist)');

  const [resolveModal, setResolveModal] = useState(false);
  const [resolutionSummary, setResolutionSummary] = useState('');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Actions
  const handleTakeOwnership = (item) => {
    setSelectedCase(item);
    setCaseNotes(`Executive ownership taken by Expert Team Leader at ${new Date().toLocaleTimeString()}`);
    setTakeOwnershipModal(true);
  };

  const confirmTakeOwnership = () => {
    if (!selectedCase) return;
    setEscalations(prev => prev.map(e => e.id === selectedCase.id ? { ...e, tl: 'Expert TL (Self)', status: 'In Executive Review' } : e));
    setTakeOwnershipModal(false);
    showAlert(`Executive ownership claimed for Case ${selectedCase.id} (${selectedCase.customer})`, 'success');
  };

  const handleOpenAssignExpert = (item) => {
    setSelectedCase(item);
    setAssignExpertModal(true);
  };

  const confirmAssignExpert = () => {
    if (!selectedCase) return;
    setEscalations(prev => prev.map(e => e.id === selectedCase.id ? { ...e, agent: targetExpert.split(' ')[0] + ' ' + targetExpert.split(' ')[1] } : e));
    setAssignExpertModal(false);
    showAlert(`Case ${selectedCase.id} delegated to ${targetExpert}`, 'info');
  };

  const handleOpenResolve = (item) => {
    setSelectedCase(item);
    setResolutionSummary('Specialist intervention completed. Airline waiver authorized and customer confirmation dispatched.');
    setResolveModal(true);
  };

  const confirmResolveCase = () => {
    if (!selectedCase) return;
    setEscalations(prev => prev.map(e => e.id === selectedCase.id ? { ...e, status: 'Resolved' } : e));
    setResolveModal(false);
    showAlert(`✓ Escalation Case ${selectedCase.id} successfully resolved and archived!`, 'success');
  };

  // Reissue Actions
  const handleApproveReissue = (id, bookingId) => {
    setReissues(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    showAlert(`✓ Complex Reissue ${id} for ${bookingId} approved! Dispatched to ticketing queue.`, 'success');
  };

  const handleRejectReissue = (id, bookingId) => {
    setReissues(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    showAlert(`✕ Reissue ${id} for ${bookingId} rejected. Penalty waiver disallowed.`, 'error');
  };

  // Sales Exception Actions
  const handleApproveException = (id, bookingId) => {
    setExceptions(prev => prev.filter(e => e.id !== id));
    showAlert(`✓ Sales Exception ${id} for ${bookingId} approved by Expert TL.`, 'success');
  };

  const handleRejectException = (id, bookingId) => {
    setExceptions(prev => prev.filter(e => e.id !== id));
    showAlert(`✕ Sales Exception ${id} for ${bookingId} rejected. Standard margins preserved.`, 'error');
  };

  const filteredEscalations = useMemo(() => {
    return escalations.filter(e => {
      const matchesSearch = e.customer.toLowerCase().includes(searchQuery.toLowerCase()) || e.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) || e.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'ALL' || e.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [escalations, searchQuery, priorityFilter]);

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.5 }, px: { xs: 2, sm: 3 }, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, flexWrap: 'wrap', minWidth: 0, width: '100%' }}>
          <Avatar sx={{ bgcolor: '#C59B27', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, fontWeight: 900, fontSize: { xs: '0.9rem', sm: '1.1rem' }, boxShadow: '0 4px 12px rgba(197, 155, 39, 0.3)' }}>
            ETL
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif', fontSize: { xs: '1.05rem', sm: '1.35rem' }, lineHeight: 1.2 }}>
                Expert Team Leader Command Centre
              </Typography>
              <Chip label="ROLE: EXPERT TEAM LEADER" size="small" sx={{ fontWeight: 900, fontSize: '0.65rem', bgcolor: '#C59B27', color: '#FFF', height: 22 }} />
              <Chip label="EXECUTIVE ESCALATIONS & VIP DESK" size="small" variant="outlined" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              Senior Authority for High-Value Bookings, Complex Reissues, VIP Portfolios, and Airline Exceptions
            </Typography>
          </Box>
        </Box>
        <DualClock client={{ timezone: 'America/New_York', label: 'Client Time (EST)' }} />
      </Paper>

      {/* 10 KPI STAT CARDS */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }, gap: 1.5 }}>
          {INITIAL_EXPERT_KPIS.map((kpi) => (
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
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.06)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: kpi.border
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  {kpi.title}
                </Typography>
                <Box sx={{ p: 0.6, borderRadius: 1.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: kpi.border, fontSize: '0.65rem' }}>
                  {kpi.change}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* DASHBOARD MODULE TABS */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 800,
              fontSize: '0.78rem',
              py: 1.8,
              minHeight: 48,
              textTransform: 'none'
            }
          }}
        >
          <Tab label={`1. Escalation Queue (${filteredEscalations.filter(e => e.status !== 'Resolved').length})`} icon={<WarningAmberIcon fontSize="small" />} iconPosition="start" />
          <Tab label="2. Complex Bookings & Multi-City" icon={<ConnectingAirportsIcon fontSize="small" />} iconPosition="start" />
          <Tab label="3. VIP Customer Concierge" icon={<DiamondIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`4. Fare & Reissue Desk (${reissues.filter(r => r.status.includes('Pending') || r.status.includes('Awaiting')).length})`} icon={<CurrencyExchangeIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`5. Complaint Center (${complaints.length})`} icon={<ReportProblemIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`6. Sales Exceptions (${exceptions.length})`} icon={<PriceCheckIcon fontSize="small" />} iconPosition="start" />
          <Tab label="7. Executive Analytics" icon={<BarChartIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* ========================================================= */}
      {/* TAB 1: MASTER ESCALATION QUEUE */}
      {/* ========================================================= */}
      {currentTab === 0 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon color="error" />
                Senior Executive Escalation Queue
              </Typography>
              <Typography variant="body2" color="text.secondary">
                High-priority booking disruptions, schedule breaches, VIP disputes, and tariff changes
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search booking, customer, or issue..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{ width: 260 }}
              />

              <FormControl size="small" sx={{ width: 140 }}>
                <InputLabel>Priority</InputLabel>
                <Select value={priorityFilter} label="Priority" onChange={e => setPriorityFilter(e.target.value)}>
                  <MenuItem value="ALL">All Priorities</MenuItem>
                  <MenuItem value="Critical">Critical (Red)</MenuItem>
                  <MenuItem value="High">High (Orange)</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 950 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Case ID & PNR</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>VIP / Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Booking Type</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Escalation Reason</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Assigned Team</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Executive Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEscalations.map((item) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      bgcolor: item.status === 'Resolved' ? '#F0FDF4' : item.priority === 'Critical' ? '#FFF5F5' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{item.id}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>{item.bookingId}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{item.customer}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.date}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={item.type}
                        sx={{
                          fontWeight: 800,
                          fontSize: '0.65rem',
                          bgcolor: item.type.includes('VIP') ? '#EFF6FF' : '#F1F5F9',
                          color: item.type.includes('VIP') ? '#2563EB' : 'text.primary'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: item.priority === 'Critical' ? '#DC2626' : 'text.primary' }}>
                        {item.reason}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={item.priority}
                        color={item.priority === 'Critical' ? 'error' : item.priority === 'High' ? 'warning' : 'default'}
                        sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Rep: {item.agent}</Typography>
                      <Typography variant="caption" color="text.secondary">TL: {item.tl}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={item.status}
                        color={item.status === 'Resolved' ? 'success' : item.status.includes('Executive') ? 'primary' : 'warning'}
                        variant={item.status === 'Resolved' ? 'filled' : 'outlined'}
                        sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.8, justifyContent: 'center' }}>
                        {item.status !== 'Resolved' && (
                          <>
                            <Button size="small" variant="contained" color="primary" onClick={() => handleTakeOwnership(item)} sx={{ fontSize: '0.68rem', fontWeight: 800, py: 0.4 }}>
                              Take Ownership
                            </Button>
                            <Button size="small" variant="outlined" color="success" onClick={() => handleOpenResolve(item)} sx={{ fontSize: '0.68rem', fontWeight: 800, py: 0.4 }}>
                              Resolve
                            </Button>
                            <Button size="small" variant="outlined" color="inherit" onClick={() => handleOpenAssignExpert(item)} sx={{ fontSize: '0.68rem', fontWeight: 700, py: 0.4 }}>
                              Delegate
                            </Button>
                          </>
                        )}
                        {item.status === 'Resolved' && (
                          <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800 }}>
                            ✓ Case Closed
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 2: COMPLEX BOOKINGS & MULTI-CITY MANAGEMENT */}
      {/* ========================================================= */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#0284C7' }}>
                Complex Itinerary & Group Travel Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Audit multi-city married segment routing, group passenger blocks (10+ pax), and corporate flight agreements
              </Typography>
            </Box>
            <Chip label="High-Risk Travel Desk" color="primary" sx={{ fontWeight: 800 }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {INITIAL_COMPLEX_BOOKINGS.map((booking) => (
              <Paper key={booking.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#F8FAFC' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                      {booking.customer} ({booking.bookingId})
                    </Typography>
                    <Chip label={booking.type} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />
                    <Chip label={`Pax: ${booking.paxCount}`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669' }}>
                    ${booking.totalFare.toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #E2E8F0', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.5 }}>
                    ✈️ COMPLEX MULTI-SEGMENT ROUTING:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
                    {booking.itinerary}
                  </Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, fontSize: 13, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>GDS & Supplier Engine:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{booking.supplier}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Ticketing Status:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2563EB' }}>{booking.ticketStatus}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Payment State:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669' }}>{booking.paymentStatus}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button size="small" variant="outlined" color="primary" onClick={() => showAlert(`Full GDS PNR breakdown loaded for ${booking.bookingId}`, 'info')} sx={{ fontWeight: 800 }}>
                    Inspect GDS PNR
                  </Button>
                  <Button size="small" variant="contained" color="secondary" onClick={() => showAlert(`Tariff rule audited for ${booking.customer}`, 'success')} sx={{ fontWeight: 800 }}>
                    Approve Fare Rules
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 3: VIP CUSTOMER CONCIERGE MANAGEMENT */}
      {/* ========================================================= */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563EB', display: 'flex', alignItems: 'center', gap: 1 }}>
                <DiamondIcon color="primary" />
                VIP & High Net-Worth Customer Portfolio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dedicated concierge oversight, seating preferences, and priority support routing
              </Typography>
            </Box>
            <Chip label="Tier 1 Black & Platinum Clients" color="secondary" sx={{ fontWeight: 800 }} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2.5 }}>
            {vipCustomers.map((vip) => (
              <Paper key={vip.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary' }}>
                      {vip.name}
                    </Typography>
                    <Chip label={vip.level} size="small" color="secondary" sx={{ fontWeight: 900, fontSize: '0.65rem', mt: 0.3 }} />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Lifetime Spend:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669' }}>{vip.lifetimeRevenue}</Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #DBEAFE', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.3 }}>
                    ⭐ CONCIERGE PREFERENCES & AIRLINE REQUESTS:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    "{vip.specialRequests}"
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    Dedicated Agent: <b>{vip.assignedAgent}</b> ({vip.tripsCount} Completed Flights)
                  </Typography>
                  <Chip label={vip.priorityStatus} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="contained" color="primary" onClick={() => showAlert(`Priority call routed to ${vip.name}`, 'info')} startIcon={<PhoneInTalkIcon />} sx={{ fontWeight: 800, flex: 1 }}>
                    Direct Call
                  </Button>
                  <Button size="small" variant="outlined" color="primary" onClick={() => showAlert(`Dedicated agent reassignment open for ${vip.name}`, 'info')} sx={{ fontWeight: 700 }}>
                    Reassign Agent
                  </Button>
                  <Button size="small" variant="outlined" color="secondary" onClick={() => showAlert(`Concierge priority upgraded to 24/7 Red Carpet SLA`, 'success')} sx={{ fontWeight: 700 }}>
                    Upgrade SLA
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 4: FARE & DIFFICULT REISSUE DESK */}
      {/* ========================================================= */}
      {currentTab === 3 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 1 }}>
                <CurrencyExchangeIcon color="secondary" />
                Difficult Fare & Reissue Authorization Desk
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Approve airline penalty waivers, schedule change recalculations, and EMD ticket credit exchanges
              </Typography>
            </Box>
            <Chip label={`${reissues.filter(r => r.status.includes('Pending') || r.status.includes('Awaiting')).length} Authorizations Pending`} color="warning" sx={{ fontWeight: 800 }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reissues.map((r) => (
              <Paper key={r.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: r.status === 'Approved' ? '#F0FDF4' : r.status === 'Rejected' ? '#FEF2F2' : '#FFFDF9', borderColor: r.status === 'Approved' ? '#86EFAC' : r.status === 'Rejected' ? '#FCA5A5' : '#F59E0B' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                      {r.id} • {r.customer} ({r.bookingId})
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Airline: <b>{r.airline}</b>
                    </Typography>
                  </Box>
                  <Chip label={r.status} size="small" color={r.status === 'Approved' ? 'success' : r.status === 'Rejected' ? 'error' : 'warning'} sx={{ fontWeight: 800 }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5, fontSize: 13, mb: 1.5 }}>
                  <Box sx={{ p: 1.2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Original Fare:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>${r.originalFare}</Typography>
                  </Box>
                  <Box sx={{ p: 1.2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>New Fare Quoted:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>${r.newFare}</Typography>
                  </Box>
                  <Box sx={{ p: 1.2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Fare Difference:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: r.fareDifference > 0 ? '#DC2626' : '#059669' }}>
                      {r.fareDifference > 0 ? `+$${r.fareDifference}` : `-$${Math.abs(r.fareDifference)}`}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1.2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Penalty Applied:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>${r.penalty}</Typography>
                  </Box>
                </Box>

                <Paper variant="outlined" sx={{ p: 1.2, mb: 2, bgcolor: '#F8FAFC', borderRadius: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.2 }}>Airline GDS Waiver Code / Rules:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#3F51B5', fontFamily: 'monospace' }}>{r.airlineRules}</Typography>
                </Paper>

                {r.status.includes('Pending') || r.status.includes('Awaiting') ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" color="success" size="small" onClick={() => handleApproveReissue(r.id, r.bookingId)} sx={{ fontWeight: 800 }}>
                      Approve Reissue
                    </Button>
                    <Button variant="outlined" color="error" size="small" onClick={() => handleRejectReissue(r.id, r.bookingId)} sx={{ fontWeight: 800 }}>
                      Reject Reissue
                    </Button>
                    <Button variant="outlined" color="primary" size="small" onClick={() => showAlert(`Requested airline waiver proof from agent`, 'info')} sx={{ fontWeight: 700 }}>
                      Request More Info
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800 }}>
                    Action Logged in GDS Sabre History
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 5: COMPLAINT RESOLUTION CENTER */}
      {/* ========================================================= */}
      {currentTab === 4 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReportProblemIcon color="error" />
                Customer Complaint & Dispute Resolution Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Executive SLA dispute resolution, compensation waivers, and airline service recovery
              </Typography>
            </Box>
            <Chip label={`${complaints.length} Open Inquiries`} color="error" sx={{ fontWeight: 800 }} />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {complaints.map((c) => (
              <Paper key={c.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#FEF2F2', borderColor: '#FCA5A5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#991B1B' }}>
                      {c.id} • {c.customer} ({c.bookingId})
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                      Category: <b>{c.category}</b>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip label={`Severity: ${c.severity}`} size="small" color="error" sx={{ fontWeight: 900, fontSize: '0.68rem' }} />
                    <Chip label={`SLA: ${c.deadline}`} size="small" color="warning" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />
                  </Box>
                </Box>

                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#FFFFFF', borderRadius: 2, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.2 }}>Executive Case Audit Notes:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.notes}</Typography>
                </Paper>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button size="small" variant="contained" color="success" onClick={() => showAlert(`Compensation and apology voucher approved for ${c.customer}`, 'success')} sx={{ fontWeight: 800 }}>
                    Approve Compensation & Resolve
                  </Button>
                  <Button size="small" variant="outlined" color="primary" onClick={() => showAlert(`Complaint escalated to Airline Key Account Director`, 'info')} sx={{ fontWeight: 700 }}>
                    Escalate to Airline Account Exec
                  </Button>
                  <Button size="small" variant="outlined" color="secondary" onClick={() => showAlert(`Customer callback initiated with Executive TL`, 'info')} startIcon={<PhoneInTalkIcon />} sx={{ fontWeight: 700 }}>
                    Executive Call Customer
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 6: SALES EXCEPTION & MARKUP OVERRIDES */}
      {/* ========================================================= */}
      {currentTab === 5 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#D97706', display: 'flex', alignItems: 'center', gap: 1 }}>
                <PriceCheckIcon color="warning" />
                Sales Exception & Zero-Markup Override Approvals
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Special commercial authorizations exceeding standard sales agent margin thresholds
              </Typography>
            </Box>
            <Chip label={`${exceptions.length} Requests Waiting`} color="warning" sx={{ fontWeight: 800 }} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
            {exceptions.map((exc) => (
              <Paper key={exc.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#FFFDF9', borderColor: '#F59E0B' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                    {exc.id} • {exc.bookingId}
                  </Typography>
                  <Chip label={`-$${exc.requestedDiscount}`} size="small" color="error" sx={{ fontWeight: 900 }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr', rowGap: 0.8, fontSize: 13, my: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Sales Agent:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{exc.agent}</Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Customer Price:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>${exc.customerPrice.toLocaleString()}</Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Supplier Cost:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>${exc.supplierPrice.toLocaleString()}</Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Requested Margin:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: '#D97706' }}>{exc.requestedMarkup}</Typography>
                </Box>

                <Paper variant="outlined" sx={{ p: 1.2, mb: 2, bgcolor: '#F8FAFC', borderRadius: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.2 }}>Agent Business Case:</Typography>
                  <Typography variant="caption" sx={{ fontStyle: 'italic', fontWeight: 600 }}>"{exc.reason}"</Typography>
                </Paper>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                  <Button variant="contained" color="success" size="small" onClick={() => handleApproveException(exc.id, exc.bookingId)} sx={{ fontWeight: 800 }}>
                    Approve Override
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleRejectException(exc.id, exc.bookingId)} sx={{ fontWeight: 800 }}>
                    Reject Request
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 7: EXECUTIVE ANALYTICS */}
      {/* ========================================================= */}
      {currentTab === 6 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                📊 ESCALATIONS BY ROOT CAUSE CATEGORY
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ESCALATION_CATEGORY_DATA} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                      {ESCALATION_CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                💎 VIP CLIENT LIFETIME VALUE DISTRIBUTION ($)
              </Typography>
              <Box sx={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={vipCustomers.map(v => ({ name: v.name.split(' ')[0], value: parseInt(v.lifetimeRevenue.replace(/[^0-9]/g, '')) }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" name="Lifetime Spend ($)" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* 1. TAKE OWNERSHIP MODAL */}
      <Dialog open={takeOwnershipModal} onClose={() => setTakeOwnershipModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main' }}>
          🛡️ Claim Executive Case Ownership
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selectedCase && (
            <Box sx={{ p: 1.5, bgcolor: '#FEF2F2', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#DC2626' }}>
                {selectedCase.id} • {selectedCase.customer} ({selectedCase.bookingId})
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Reason: <b>{selectedCase.reason}</b>
              </Typography>
            </Box>
          )}

          <TextField
            label="Executive Handling Notes & Strategy"
            size="small"
            multiline
            rows={3}
            value={caseNotes}
            onChange={e => setCaseNotes(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTakeOwnershipModal(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmTakeOwnership} variant="contained" color="primary" sx={{ fontWeight: 800 }}>
            Confirm Executive Takeover
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. ASSIGN TO EXPERT MODAL */}
      <Dialog open={assignExpertModal} onClose={() => setAssignExpertModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main' }}>
          👤 Delegate to Senior Flight Specialist
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Target Senior Specialist</InputLabel>
            <Select value={targetExpert} label="Target Senior Specialist" onChange={e => setTargetExpert(e.target.value)}>
              <MenuItem value="Sarah Jenkins (Senior Specialist)">Sarah Jenkins (Senior Specialist - VIP)</MenuItem>
              <MenuItem value="Alex Miller (Corporate Specialist)">Alex Miller (Corporate Specialist - Groups)</MenuItem>
              <MenuItem value="Michael Chang (Luxury Expert)">Michael Chang (Luxury Expert - RTW)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAssignExpertModal(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmAssignExpert} variant="contained" color="primary" sx={{ fontWeight: 800 }}>
            Delegate Case
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. RESOLVE CASE MODAL */}
      <Dialog open={resolveModal} onClose={() => setResolveModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon /> Resolve & Close Escalation Case
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selectedCase && (
            <Box sx={{ p: 1.5, bgcolor: '#F0FDF4', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#059669' }}>
                {selectedCase.id} • {selectedCase.customer}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Issue: <b>{selectedCase.reason}</b>
              </Typography>
            </Box>
          )}

          <TextField
            label="Final Resolution Summary & Airline Waiver Reference"
            size="small"
            multiline
            rows={3}
            value={resolutionSummary}
            onChange={e => setResolutionSummary(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setResolveModal(false)} color="inherit">Cancel</Button>
          <Button onClick={confirmResolveCase} variant="contained" color="success" sx={{ fontWeight: 800 }}>
            Confirm Resolution & Close Case
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
