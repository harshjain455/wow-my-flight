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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

// Icons
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TimerIcon from '@mui/icons-material/Timer';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SmsIcon from '@mui/icons-material/Sms';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import HistoryIcon from '@mui/icons-material/History';
import SpeedIcon from '@mui/icons-material/Speed';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// MOCK DATASETS
// ==========================================

const INITIAL_AUTOMATION_KPIS = [
  { id: 'activeWf', title: 'Active Workflows', value: '24 Flows', change: '+3 created today', color: '#6366F1', icon: <AccountTreeIcon /> },
  { id: 'triggeredToday', title: 'Triggered Today', value: '1,840 Runs', change: '+14% execution', color: '#2563EB', icon: <PlayArrowIcon /> },
  { id: 'pendingAuto', title: 'Pending Automations', value: '42 Runs', change: 'In delay queue', color: '#0284C7', icon: <TimerIcon /> },
  { id: 'failedAuto', title: 'Failed Automations', value: '3 Runs', change: 'Retry required', color: '#EF4444', icon: <ReportProblemIcon /> },
  { id: 'slaBreaches', title: 'SLA Breaches', value: '2 Breaches', change: 'Alerts sent to TL', color: '#F59E0B', icon: <WarningAmberIcon /> },
  { id: 'autoTasks', title: 'Auto Tasks Created', value: '640 Tasks', change: 'Follow-ups assigned', color: '#8B5CF6', icon: <AssignmentTurnedInIcon /> },
  { id: 'smsSent', title: 'SMS Sent', value: '410 SMS', change: 'Delivery 99.1%', color: '#EC4899', icon: <SmsIcon /> },
  { id: 'emailsSent', title: 'Emails Sent', value: '1,280 Emails', change: 'Delivery 99.8%', color: '#10B981', icon: <EmailIcon /> },
  { id: 'waSent', title: 'WhatsApp Sent', value: '1,540 Msgs', change: 'Delivery 100%', color: '#059669', icon: <WhatsAppIcon /> }
];

const PREBUILT_WORKFLOW_EXAMPLES = [
  {
    id: 'WF-EX-1',
    name: 'Workflow 1 – New Lead SLA Escalation Engine',
    trigger: 'New Lead Created in CRM',
    status: true,
    steps: [
      { step: 1, type: 'ACTION', text: 'Assign Lead to Sales Agent via Round-Robin' },
      { step: 2, type: 'ACTION', text: 'Notify Assigned Agent instantly via Push & In-App' },
      { step: 3, type: 'ACTION', text: 'Automatically create 2h Follow-up Task' },
      { step: 4, type: 'TIMER', text: 'Start SLA 2-Hour Response Timer' }
    ],
    escalationRules: [
      { rule: '2 Hours (No Contact)', action: 'Send SMS to Customer ("We received your flight request!")' },
      { rule: '24 Hours (No Contact)', action: 'Send Email Reminder to Customer with Top Deals' },
      { rule: '48 Hours (No Contact)', action: 'Alert Team Leader & Mark SLA Status as BREACHED' }
    ]
  },
  {
    id: 'WF-EX-2',
    name: 'Workflow 2 – Payment Pending Automation',
    trigger: 'Quote Accepted by Customer',
    status: true,
    steps: [
      { step: 1, type: 'ACTION', text: 'Generate Secure Online Payment Link' },
      { step: 2, type: 'ACTION', text: 'Send Payment Link via Email & WhatsApp' },
      { step: 3, type: 'TIMER', text: 'Start Payment Reminder Countdown Timer' }
    ],
    escalationRules: [
      { rule: 'After 30 Minutes', action: 'Send First Payment Reminder via WhatsApp' },
      { rule: 'After 2 Hours', action: 'Send Second Payment Reminder & Alert Assigned Agent' },
      { rule: 'Unpaid > 4 Hours', action: 'Escalate to Team Leader to prevent fare expiration' }
    ]
  },
  {
    id: 'WF-EX-3',
    name: 'Workflow 3 – Instant Booking Confirmation',
    trigger: 'Payment Successful (Gateway Webhook)',
    status: true,
    steps: [
      { step: 1, type: 'ACTION', text: 'Update Booking Status to CONFIRMED' },
      { step: 2, type: 'ACTION', text: 'Send Official Booking Confirmation Email' },
      { step: 3, type: 'ACTION', text: 'Send WhatsApp Confirmation with Booking Summary' },
      { step: 4, type: 'ACTION', text: 'Create Ticket Issuance Task & Alert Assigned Agent' }
    ],
    escalationRules: []
  },
  {
    id: 'WF-EX-4',
    name: 'Workflow 4 – Automated Ticket Issued Dispatch',
    trigger: 'Ticket Issued in Sabre / Amadeus GDS',
    status: true,
    steps: [
      { step: 1, type: 'ACTION', text: 'Email 13-Digit E-Ticket PDF to Customer' },
      { step: 2, type: 'ACTION', text: 'Send WhatsApp Ticket Copy with PNR Reference' },
      { step: 3, type: 'ACTION', text: 'Update Booking Status to TICKET ISSUED' },
      { step: 4, type: 'ACTION', text: 'Notify Customer & Assigned Agent' }
    ],
    escalationRules: []
  },
  {
    id: 'WF-EX-5',
    name: 'Workflow 5 – 24-Hour Pre-Departure Travel Reminder',
    trigger: '24 Hours Before Departure Date',
    status: true,
    steps: [
      { step: 1, type: 'ACTION', text: 'Send Pre-Flight Travel Checklist & Web Check-in Email' },
      { step: 2, type: 'ACTION', text: 'Send WhatsApp Flight Alert (Terminal & Gate Info)' },
      { step: 3, type: 'ACTION', text: 'Notify Assigned Agent for VIP Courtesy Call' },
      { step: 4, type: 'ACTION', text: 'Display Notification in Dashboard Alert Center' }
    ],
    escalationRules: []
  },
  {
    id: 'WF-EX-6',
    name: 'Workflow 6 – Post-Travel Feedback & Review Collector',
    trigger: 'Trip Completed (Return Flight Arrival)',
    status: true,
    steps: [
      { step: 1, type: 'ACTION', text: 'Send "Welcome Home" Thank You Email' },
      { step: 2, type: 'ACTION', text: 'Request Customer Experience Feedback Survey' },
      { step: 3, type: 'ACTION', text: 'Request 5-Star Google Review' },
      { step: 4, type: 'ACTION', text: 'Create Repeat Sales Task for Next Year Booking' }
    ],
    escalationRules: []
  }
];

const INITIAL_SLA_LEADS = [
  { id: 'SLA-101', leadName: 'Dr. Alistair Vance', agent: 'Sarah Jenkins', startTime: '2026-08-20 13:30', deadline: '2026-08-20 15:30', remaining: '45 mins remaining', status: 'On Time', color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
  { id: 'SLA-102', leadName: 'Elena Rostova', agent: 'Alex Miller', startTime: '2026-08-20 12:10', deadline: '2026-08-20 14:10', remaining: '12 mins remaining', status: 'Warning', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)' },
  { id: 'SLA-103', leadName: 'Marcus Sterling', agent: 'David Ross', startTime: '2026-08-19 16:00', deadline: '2026-08-19 18:00', remaining: 'Expired (Breached 18h ago)', status: 'SLA Breached', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)' },
  { id: 'SLA-104', leadName: 'Ambassador Harold Vance', agent: 'Sarah Jenkins', startTime: '2026-08-20 13:50', deadline: '2026-08-20 15:50', remaining: '1h 05m remaining', status: 'On Time', color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' }
];

const INITIAL_NOTIFICATIONS = [
  { id: 'NT-501', channel: 'WhatsApp', recipient: '+1 (555) 234-8901', customer: 'Ambassador Harold Vance', message: 'Your E-Ticket for DEL to LHR (PNR: SAB78K) has been issued successfully!', status: 'Delivered', time: '13:42:10' },
  { id: 'NT-502', channel: 'Email', recipient: 'elena.rostova@gmail.com', customer: 'Elena Rostova', message: 'Flight Confirmation & Payment Receipt for Booking BK-10912', status: 'Delivered', time: '13:35:00' },
  { id: 'NT-503', channel: 'SMS', recipient: '+1 (555) 882-1920', customer: 'Marcus Sterling', message: 'Payment Reminder: Please complete payment for Quote Q-8812 within 30 mins.', status: 'Sent', time: '13:20:15' },
  { id: 'NT-504', channel: 'In-App', recipient: 'Agent Sarah Jenkins', customer: 'Dr. Alistair Vance', message: 'SLA Alert: Lead L-9920 requires agent response within 45 mins', status: 'Delivered', time: '13:30:00' },
  { id: 'NT-505', channel: 'WhatsApp', recipient: '+1 (555) 001-9988', customer: 'Arthur Pendelton', message: 'Pre-flight check-in reminder for flight BA-117 tomorrow', status: 'Failed', time: '12:05:44' }
];

const INITIAL_AUTOMATION_HISTORY = [
  { id: 'HIS-901', workflow: 'Workflow 4 – Automated Ticket Issued Dispatch', trigger: 'Ticket Issued', customer: 'Ambassador Harold Vance', agent: 'Sarah Jenkins', action: 'E-Ticket Email & WhatsApp sent + Status updated', timestamp: '2026-08-20 13:42', status: 'Success' },
  { id: 'HIS-902', workflow: 'Workflow 3 – Instant Booking Confirmation', trigger: 'Payment Successful', customer: 'Dr. Alistair Vance', agent: 'Sarah Jenkins', action: 'Confirmation Email & WhatsApp sent + Ticket Task created', timestamp: '2026-08-20 13:30', status: 'Success' },
  { id: 'HIS-903', workflow: 'Workflow 2 – Payment Pending Automation', trigger: 'Quote Accepted', customer: 'Elena Rostova', agent: 'Alex Miller', action: 'Payment link generated & sent via WhatsApp', timestamp: '2026-08-20 12:10', status: 'Success' },
  { id: 'HIS-904', workflow: 'Workflow 5 – 24-Hour Pre-Departure Travel Reminder', trigger: '24h Before Travel', customer: 'Arthur Pendelton', agent: 'David Ross', action: 'WhatsApp dispatch failed (Invalid Phone Format)', timestamp: '2026-08-20 12:05', status: 'Failed' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function AutomationEngine() {
  const theme = useTheme();
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);

  // States
  const [workflows, setWorkflows] = useState(PREBUILT_WORKFLOW_EXAMPLES);
  const [slaLeads, setSlaLeads] = useState(INITIAL_SLA_LEADS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [historyLogs, setHistoryLogs] = useState(INITIAL_AUTOMATION_HISTORY);

  // Search & Filter
  const [searchHistory, setSearchHistory] = useState('');
  const [statusHistoryFilter, setStatusHistoryFilter] = useState('ALL');

  // Modals
  const [builderModalOpen, setBuilderModalOpen] = useState(false);
  const [newWfName, setNewWfName] = useState('');
  const [newWfTrigger, setNewWfTrigger] = useState('New Lead Created');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleToggleWorkflow = (id) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: !w.status } : w));
    const target = workflows.find(w => w.id === id);
    showAlert(`Workflow "${target.name}" is now ${!target.status ? 'ACTIVE' : 'PAUSED'}`, 'info');
  };

  const handleRetryHistory = (id) => {
    setHistoryLogs(prev => prev.map(h => h.id === id ? { ...h, status: 'Success', action: 'Retried manually by Admin: Message dispatched successfully' } : h));
    showAlert(`✓ Automated execution ${id} retried and completed!`, 'success');
  };

  const handleCreateNewWorkflow = () => {
    if (!newWfName) {
      showAlert('Please enter a workflow name', 'warning');
      return;
    }
    const newFlow = {
      id: `WF-CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      name: newWfName,
      trigger: newWfTrigger,
      status: true,
      steps: [
        { step: 1, type: 'ACTION', text: 'Send Automated Email & WhatsApp Dispatch' },
        { step: 2, type: 'ACTION', text: 'Assign Follow-up Task to Agent' }
      ],
      escalationRules: []
    };
    setWorkflows([newFlow, ...workflows]);
    setBuilderModalOpen(false);
    setNewWfName('');
    showAlert(`✓ Workflow "${newWfName}" created and activated!`, 'success');
  };

  const filteredHistory = useMemo(() => {
    return historyLogs.filter(h => {
      const matchesSearch = h.workflow.toLowerCase().includes(searchHistory.toLowerCase()) || h.customer.toLowerCase().includes(searchHistory.toLowerCase()) || h.agent.toLowerCase().includes(searchHistory.toLowerCase());
      const matchesStatus = statusHistoryFilter === 'ALL' || h.status === statusHistoryFilter;
      return matchesSearch && matchesStatus;
    });
  }, [historyLogs, searchHistory, statusHistoryFilter]);

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
          bgcolor: 'background.paper',
          boxShadow: theme.palette.mode === 'dark' ? '0 4px 20px rgba(0,0,0,0.4)' : '0 2px 10px rgba(0,0,0,0.03)'
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
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
            }}
          >
            AUTO
          </Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'Outfit, sans-serif', fontSize: { xs: '1.15rem', sm: '1.4rem' } }}>
                Workflow & Event Automation Engine
              </Typography>
              <Chip label="ROLE: ADMIN / TL / AGENT" size="small" color="primary" sx={{ fontWeight: 900, fontSize: '0.65rem', height: 22 }} />
              <Chip label="EVENT-DRIVEN CRM" size="small" variant="outlined" color="secondary" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.85rem' } }}>
              Zero-Manual Follow-ups: Automated Triggers for Leads, Payment Reminders, E-Tickets, 24h Travel Alerts, and SLA Escalations
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
          <DualClock client={{ timezone: 'America/New_York', label: 'Engine Time (EST)' }} />
        </Box>
      </Paper>

      {/* ─── 2. RESPONSIVE KPI STAT CARDS GRID ─── */}
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
          {INITIAL_AUTOMATION_KPIS.map((kpi) => (
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
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: theme.palette.mode === 'dark' ? '0 6px 20px rgba(0,0,0,0.5)' : '0 6px 20px rgba(0,0,0,0.06)',
                  borderColor: kpi.color
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
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                  {kpi.title}
                </Typography>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: 2,
                    bgcolor: alpha(kpi.color, 0.12),
                    color: kpi.color,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    '& svg': { fontSize: '1.2rem' }
                  }}
                >
                  {kpi.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif', mb: 0.2 }}>
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

      {/* ─── 3. NAVIGATION TABS ─── */}
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
          <Tab label="1. Workflow Dashboard" icon={<SpeedIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`2. Visual Workflow Builder (${workflows.length} Flows)`} icon={<AccountTreeIcon fontSize="small" />} iconPosition="start" />
          <Tab label="3. Active Automations Ledger" icon={<AutoFixHighIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`4. SLA Monitor (${slaLeads.filter(s => s.status === 'SLA Breached').length} Breaches)`} icon={<TimerIcon fontSize="small" />} iconPosition="start" />
          <Tab label="5. Notification Delivery Center" icon={<NotificationsActiveIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`6. Automation History (${filteredHistory.length})`} icon={<HistoryIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* ========================================================= */}
      {/* TAB 1: WORKFLOW DASHBOARD & LIVE STREAM */}
      {/* ========================================================= */}
      {currentTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'secondary.main', display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit, sans-serif' }}>
                <SpeedIcon color="secondary" />
                Live Event-Driven Execution Stream
              </Typography>
              <Chip label="Engine Active & Listening" color="success" size="small" sx={{ fontWeight: 800 }} />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {INITIAL_AUTOMATION_HISTORY.slice(0, 3).map((item) => (
                <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{item.id}</Typography>
                    <Chip label={item.status} size="small" color={item.status === 'Success' ? 'success' : 'error'} sx={{ fontWeight: 800, height: 20, fontSize: '0.65rem' }} />
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>{item.workflow}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mt: 0.5 }}>
                    Customer: <b>{item.customer}</b> • Rep: <b>{item.agent}</b>
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 1, mt: 1, bgcolor: 'background.paper', borderRadius: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main' }}>Action: {item.action}</Typography>
                  </Paper>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Box>
      )}

      {/* ========================================================= */}
      {/* TAB 2: VISUAL WORKFLOW BUILDER */}
      {/* ========================================================= */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit, sans-serif' }}>
                <AccountTreeIcon color="primary" />
                Visual Drag-and-Drop Workflow Builder
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure event triggers, multi-step actions, SLA timers, and automated customer notifications
              </Typography>
            </Box>

            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setBuilderModalOpen(true)} sx={{ fontWeight: 800, width: { xs: '100%', sm: 'auto' } }}>
              Create New Workflow Sequence
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {workflows.map((wf) => (
              <Paper
                key={wf.id}
                variant="outlined"
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  bgcolor: wf.status ? 'background.paper' : alpha(theme.palette.action.disabledBackground, 0.3),
                  borderColor: wf.status ? 'primary.main' : 'divider',
                  borderWidth: wf.status ? 2 : 1
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    <Chip label={wf.id} color="primary" size="small" sx={{ fontWeight: 900 }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', fontSize: { xs: '1rem', sm: '1.15rem' } }}>
                      {wf.name}
                    </Typography>
                  </Box>

                  <FormControlLabel
                    control={<Switch checked={wf.status} onChange={() => handleToggleWorkflow(wf.id)} color="success" />}
                    label={<Typography variant="caption" sx={{ fontWeight: 900, color: wf.status ? 'success.main' : 'text.secondary' }}>{wf.status ? 'WORKFLOW ACTIVE' : 'PAUSED'}</Typography>}
                  />
                </Box>

                {/* Trigger Chip */}
                <Box sx={{ p: 1.2, px: 2, mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.08), borderRadius: 2, border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.2), display: 'inline-flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', textTransform: 'uppercase' }}>
                    ⚡ EVENT TRIGGER:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    {wf.trigger}
                  </Typography>
                </Box>

                {/* Workflow Sequence Steps Timeline */}
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 1 }}>
                  AUTOMATED ACTION SEQUENCE:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2.5, alignItems: 'center' }}>
                  {wf.steps.map((st, i) => (
                    <React.Fragment key={st.step}>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1.2,
                          px: 2,
                          borderRadius: 2,
                          bgcolor: st.type === 'TIMER' ? alpha('#F59E0B', 0.1) : alpha('#10B981', 0.1),
                          borderColor: st.type === 'TIMER' ? alpha('#F59E0B', 0.3) : alpha('#10B981', 0.3),
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Avatar sx={{ width: 22, height: 22, fontSize: '0.72rem', fontWeight: 900, bgcolor: st.type === 'TIMER' ? '#F59E0B' : '#10B981' }}>
                          {st.step}
                        </Avatar>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: st.type === 'TIMER' ? '#D97706' : '#059669' }}>
                          {st.text}
                        </Typography>
                      </Paper>
                      {i < wf.steps.length - 1 && <ArrowForwardIcon color="action" fontSize="small" />}
                    </React.Fragment>
                  ))}
                </Box>

                {/* Escalation Rules (if applicable) */}
                {wf.escalationRules && wf.escalationRules.length > 0 && (
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha('#EF4444', 0.06), borderColor: alpha('#EF4444', 0.3), borderRadius: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: '#EF4444', display: 'block', mb: 1 }}>
                      🚨 SLA ESCALATION TIMERS & RULES:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                      {wf.escalationRules.map((rule, rIdx) => (
                        <Box key={rIdx} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                          <Chip label={rule.rule} size="small" color="error" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            → {rule.action}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                )}
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 3: ACTIVE AUTOMATIONS LEDGER */}
      {/* ========================================================= */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'success.main', fontFamily: 'Outfit, sans-serif' }}>
                Active Automations Engine Ledger
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monitor background execution threads and toggle operational states
              </Typography>
            </Box>
            <Chip label={`${workflows.filter(w => w.status).length} Active Background Threads`} color="success" size="small" sx={{ fontWeight: 800 }} />
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Workflow ID & Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Trigger Event</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Action Steps</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Toggle Control</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workflows.map((wf) => (
                  <TableRow key={wf.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>{wf.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{wf.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={wf.trigger} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{wf.steps.length} Steps</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={wf.status ? 'RUNNING' : 'PAUSED'} size="small" color={wf.status ? 'success' : 'default'} sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Switch checked={wf.status} onChange={() => handleToggleWorkflow(wf.id)} color="success" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 4: SLA MONITOR */}
      {/* ========================================================= */}
      {currentTab === 3 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'warning.main', display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit, sans-serif' }}>
                <TimerIcon color="warning" />
                Live SLA Response & Escalation Monitor
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time lead response countdown timers with automated escalation alerts
              </Typography>
            </Box>
            <Chip label="2-Hour Response SLA Active" color="warning" size="small" sx={{ fontWeight: 800 }} />
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 750 }}>
              <TableHead sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>SLA Case & Lead Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Assigned Agent</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>SLA Start Time</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Response Deadline</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Remaining Time</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>SLA Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slaLeads.map((s) => (
                  <TableRow key={s.id} hover sx={{ bgcolor: s.bg }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>{s.leadName}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{s.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{s.agent}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{s.startTime}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{s.deadline}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 900, color: s.color }}>{s.remaining}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={s.status} size="small" sx={{ fontWeight: 900, bgcolor: s.color, color: '#FFFFFF' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 5: NOTIFICATION DELIVERY CENTER */}
      {/* ========================================================= */}
      {currentTab === 4 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1, fontFamily: 'Outfit, sans-serif' }}>
                <NotificationsActiveIcon color="primary" />
                Multi-Channel Automated Notification Delivery Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track delivery status across In-App, Email, SMS, and WhatsApp Gateway API
              </Typography>
            </Box>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 750 }}>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Channel</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Recipient / Contact</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Message Payload</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Delivery Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Dispatch Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((n) => (
                  <TableRow key={n.id} hover sx={{ bgcolor: n.status === 'Failed' ? alpha('#EF4444', 0.08) : 'inherit' }}>
                    <TableCell>
                      <Chip label={n.channel} size="small" color={n.channel === 'WhatsApp' ? 'success' : n.channel === 'Email' ? 'primary' : 'warning'} sx={{ fontWeight: 900 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{n.recipient}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{n.customer}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{n.message}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={n.status} size="small" color={n.status === 'Delivered' ? 'success' : n.status === 'Sent' ? 'info' : 'error'} sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{n.time}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 6: AUTOMATION HISTORY */}
      {/* ========================================================= */}
      {currentTab === 5 && (
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'Outfit, sans-serif' }}>
                Automation History & Execution Audit Log
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Full audit trail of automated CRM triggers, agent assignments, and retry execution controls
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
              <TextField
                size="small"
                placeholder="Search history, customer, rep..."
                value={searchHistory}
                onChange={e => setSearchHistory(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{ width: { xs: '100%', sm: 220 } }}
              />

              <FormControl size="small" sx={{ width: { xs: '100%', sm: 130 } }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusHistoryFilter} label="Status" onChange={e => setStatusHistoryFilter(e.target.value)}>
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="Success">Success</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 850 }}>
              <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Audit ID & Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Workflow Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Trigger Event</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Customer / Agent</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Action Executed</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistory.map((h) => (
                  <TableRow key={h.id} hover sx={{ bgcolor: h.status === 'Failed' ? alpha('#EF4444', 0.08) : 'inherit' }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{h.id}</Typography>
                      <Typography variant="caption" color="text.secondary">{h.timestamp}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{h.workflow}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={h.trigger} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{h.customer}</Typography>
                      <Typography variant="caption" color="text.secondary">Agent: {h.agent}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{h.action}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={h.status} size="small" color={h.status === 'Success' ? 'success' : 'error'} sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="center">
                      {h.status === 'Failed' && (
                        <Button size="small" variant="contained" color="error" onClick={() => handleRetryHistory(h.id)} startIcon={<RefreshIcon />} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
                          Retry Execution
                        </Button>
                      )}
                      {h.status === 'Success' && (
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 800 }}>
                          ✓ Completed
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* MODALS */}
      <Dialog open={builderModalOpen} onClose={() => setBuilderModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: 'secondary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountTreeIcon /> Create Automation Workflow Sequence
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Workflow Sequence Name"
            size="small"
            placeholder="e.g. High-Value Flight Deposit Reminder Flow"
            value={newWfName}
            onChange={e => setNewWfName(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth size="small">
            <InputLabel>Event Trigger</InputLabel>
            <Select value={newWfTrigger} label="Event Trigger" onChange={e => setNewWfTrigger(e.target.value)}>
              <MenuItem value="New Lead Created">New Lead Created</MenuItem>
              <MenuItem value="Quote Accepted">Quote Accepted by Customer</MenuItem>
              <MenuItem value="Payment Successful">Payment Successful</MenuItem>
              <MenuItem value="Ticket Issued">Ticket Issued in GDS</MenuItem>
              <MenuItem value="24 Hours Before Departure">24 Hours Before Departure</MenuItem>
              <MenuItem value="Trip Completed">Trip Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBuilderModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleCreateNewWorkflow} variant="contained" color="secondary" sx={{ fontWeight: 800 }}>
            Save & Activate Sequence
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
