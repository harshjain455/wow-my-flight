import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
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
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ForumIcon from '@mui/icons-material/Forum';
import SearchIcon from '@mui/icons-material/Search';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RefreshIcon from '@mui/icons-material/Refresh';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// MOCK DATASETS
// ==========================================

const INITIAL_NOTIF_KPIS = [
  { id: 'total', title: 'Total Notifications', value: '1,480 Total', change: '+84 today', isUp: true, color: '#3F51B5', border: '#3F51B5', icon: <NotificationsIcon /> },
  { id: 'unread', title: 'Unread Alerts', value: '12 Unread', change: 'Requires review', isUp: false, color: '#2563EB', border: '#2563EB', icon: <NotificationsActiveIcon /> },
  { id: 'critical', title: 'Critical Alerts', value: '4 Critical', change: '🔴 SLA & Payment', isUp: false, color: '#DC2626', border: '#DC2626', icon: <ReportProblemIcon /> },
  { id: 'high', title: 'High Priority', value: '18 High', change: '🟠 Schedule & QA', isUp: false, color: '#D97706', border: '#D97706', icon: <WarningAmberIcon /> },
  { id: 'inapp', title: 'In-App Dispatches', value: '1,480 Sent', change: '100% active', isUp: true, color: '#0284C7', border: '#0284C7', icon: <InfoIcon /> },
  { id: 'email', title: 'Email Dispatches', value: '1,120 Delivered', change: '99.8% rate', isUp: true, color: '#059669', border: '#059669', icon: <EmailIcon /> },
  { id: 'sms', title: 'SMS Dispatches', value: '380 Delivered', change: '99.1% rate', isUp: true, color: '#D97706', border: '#D97706', icon: <SmsIcon /> },
  { id: 'wa', title: 'WhatsApp Dispatches', value: '1,410 Delivered', change: '100% rate', isUp: true, color: '#059669', border: '#059669', icon: <WhatsAppIcon /> }
];

const INITIAL_NOTIFICATION_FEED = [
  {
    id: 'NOTIF-101',
    category: 'Payment',
    title: 'Payment Failed',
    description: 'Customer payment failed for Quote Q-8812. Immediate follow-up required.',
    refId: 'BK-10892',
    customer: 'Ambassador Harold Vance',
    time: '14:25:10',
    priority: 'Critical',
    priorityColor: '#DC2626',
    read: false,
    channels: ['In-App', 'Email', 'WhatsApp'],
    icon: <MonetizationOnIcon sx={{ color: '#DC2626' }} />
  },
  {
    id: 'NOTIF-102',
    category: 'SLA',
    title: 'SLA Breached',
    description: 'New Lead SLA 5m response breached. Case escalated to Expert TL.',
    refId: 'LD-98440',
    customer: 'Marcus Sterling',
    time: '14:18:44',
    priority: 'Critical',
    priorityColor: '#DC2626',
    read: false,
    channels: ['In-App', 'Email', 'SMS'],
    icon: <ReportProblemIcon sx={{ color: '#DC2626' }} />
  },
  {
    id: 'NOTIF-103',
    category: 'Refunds',
    title: 'Refund Request Raised',
    description: 'Customer requested $350 refund for ground transfer failure.',
    refId: 'BK-10920',
    customer: 'Marcus Sterling',
    time: '14:02:15',
    priority: 'High',
    priorityColor: '#D97706',
    read: false,
    channels: ['In-App', 'Email'],
    icon: <WarningAmberIcon sx={{ color: '#D97706' }} />
  },
  {
    id: 'NOTIF-104',
    category: 'Flights',
    title: 'Flight Schedule Changed',
    description: 'British Airways schedule shift on LHR → DXB segment.',
    refId: 'BK-10892',
    customer: 'Ambassador Harold Vance',
    time: '13:45:00',
    priority: 'High',
    priorityColor: '#D97706',
    read: true,
    channels: ['In-App', 'Email', 'WhatsApp'],
    icon: <AirplaneTicketIcon sx={{ color: '#D97706' }} />
  },
  {
    id: 'NOTIF-105',
    category: 'Leads',
    title: 'New High-Value Lead Assigned',
    description: 'Assigned $28k Multi-City First Class lead to Sarah Jenkins.',
    refId: 'LD-99120',
    customer: 'Dr. Harrison Wells',
    time: '13:30:12',
    priority: 'Medium',
    priorityColor: '#2563EB',
    read: true,
    channels: ['In-App', 'WhatsApp'],
    icon: <PeopleAltIcon sx={{ color: '#2563EB' }} />
  },
  {
    id: 'NOTIF-106',
    category: 'Bookings',
    title: 'Ticket Issued Successfully',
    description: 'E-Ticket 13381235436196 issued in Sabre GDS for DEL → LHR.',
    refId: 'BK-10231',
    customer: 'Arthur Pendelton',
    time: '12:50:30',
    priority: 'Normal',
    priorityColor: '#059669',
    read: true,
    channels: ['In-App', 'Email', 'WhatsApp'],
    icon: <CheckCircleIcon sx={{ color: '#059669' }} />
  }
];

const MULTI_CHANNEL_DELIVERY_DATA = [
  { id: 'DEL-01', channel: 'WhatsApp API', recipient: '+1 (555) 234-8901', payload: 'E-ticket PDF dispatched for PNR SAB78K', status: 'Delivered', time: '14:25:15' },
  { id: 'DEL-02', channel: 'Email Gateway', recipient: 'harold.vance@embassy.gov', payload: 'Payment Receipt & Booking Confirmation BK-10892', status: 'Delivered', time: '14:25:12' },
  { id: 'DEL-03', channel: 'SMS Gateway', recipient: '+1 (555) 882-1920', payload: 'SLA Breach Alert sent to Agent David Ross', status: 'Sent', time: '14:18:45' },
  { id: 'DEL-04', channel: 'WhatsApp API', recipient: '+1 (555) 991-0022', payload: 'Pre-flight check-in reminder for flight BA-117', status: 'Failed', time: '13:10:00' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CentralNotificationCenter() {
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);

  // States
  const [feed, setFeed] = useState(INITIAL_NOTIFICATION_FEED);
  const [deliveryLogs, setDeliveryLogs] = useState(MULTI_CHANNEL_DELIVERY_DATA);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [readFilter, setReadFilter] = useState('ALL');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMarkRead = (id) => {
    setFeed(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    showAlert(`Notification ${id} marked as read`, 'info');
  };

  const handleMarkAllRead = () => {
    setFeed(prev => prev.map(n => ({ ...n, read: true })));
    showAlert(`✓ All notifications marked as read!`, 'success');
  };

  const handleRetryDelivery = (id) => {
    setDeliveryLogs(prev => prev.map(d => d.id === id ? { ...d, status: 'Delivered', payload: 'Retried manually: WhatsApp message delivered successfully' } : d));
    showAlert(`✓ Notification dispatch ${id} retried successfully!`, 'success');
  };

  const filteredFeed = useMemo(() => {
    return feed.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.description.toLowerCase().includes(searchQuery.toLowerCase()) || n.customer.toLowerCase().includes(searchQuery.toLowerCase()) || n.refId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || n.category === categoryFilter;
      const matchesPriority = priorityFilter === 'ALL' || n.priority === priorityFilter;
      const matchesRead = readFilter === 'ALL' || (readFilter === 'UNREAD' && !n.read) || (readFilter === 'READ' && n.read);
      return matchesSearch && matchesCategory && matchesPriority && matchesRead;
    });
  }, [feed, searchQuery, categoryFilter, priorityFilter, readFilter]);

  const unreadCount = feed.filter(n => !n.read).length;

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            🔔
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Central Notification & Event Timeline Center
              </Typography>
              <Chip label={`UNREAD: ${unreadCount}`} size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: unreadCount > 0 ? '#DC2626' : '#059669', color: '#FFF', height: 24 }} />
              <Chip label="ROLE-BASED REAL-TIME FEED" size="small" variant="outlined" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem', height: 24 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Centralized Event Stream for Leads, Bookings, Payments, SLA Breaches, QA Failures, and Customer Service
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          {unreadCount > 0 && (
            <Button variant="contained" color="primary" startIcon={<DoneAllIcon />} onClick={handleMarkAllRead} sx={{ fontWeight: 800 }}>
              Mark All Read
            </Button>
          )}
          <DualClock client={{ timezone: 'America/New_York', label: 'Feed Time (EST)' }} />
        </Box>
      </Paper>

      {/* 8 REAL-TIME NOTIFICATION KPI CARDS */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)', lg: 'repeat(8, 1fr)' }, gap: 1.5 }}>
          {INITIAL_NOTIF_KPIS.map((kpi) => (
            <Paper
              key={kpi.id}
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: '#FFFFFF',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.6rem' }}>
                  {kpi.title}
                </Typography>
                <Box sx={{ p: 0.5, borderRadius: 1.2, bgcolor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: kpi.border, fontSize: '0.6rem' }}>
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
          <Tab label={`1. Live Notification Feed (${filteredFeed.length})`} icon={<NotificationsActiveIcon fontSize="small" />} iconPosition="start" />
          <Tab label="2. Multi-Channel Delivery Tracker" icon={<FilterAltIcon fontSize="small" />} iconPosition="start" />
          <Tab label="3. Role-Based Permission Stream" icon={<VerifiedUserIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`4. Notification Audit History (${deliveryLogs.length})`} icon={<HistoryIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* ========================================================= */}
      {/* TAB 1: LIVE NOTIFICATION FEED */}
      {/* ========================================================= */}
      {currentTab === 0 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5' }}>
                Central Real-Time Notification Stream
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filter by priority level, event category, or unread status across all CRM operations
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search notification title, customer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{ width: 240 }}
              />

              <FormControl size="small" sx={{ width: 130 }}>
                <InputLabel>Category</InputLabel>
                <Select value={categoryFilter} label="Category" onChange={e => setCategoryFilter(e.target.value)}>
                  <MenuItem value="ALL">All Categories</MenuItem>
                  <MenuItem value="Leads">Leads</MenuItem>
                  <MenuItem value="Bookings">Bookings</MenuItem>
                  <MenuItem value="Payment">Payments</MenuItem>
                  <MenuItem value="SLA">SLA</MenuItem>
                  <MenuItem value="Refunds">Refunds</MenuItem>
                  <MenuItem value="Flights">Flights</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ width: 130 }}>
                <InputLabel>Priority</InputLabel>
                <Select value={priorityFilter} label="Priority" onChange={e => setPriorityFilter(e.target.value)}>
                  <MenuItem value="ALL">All Priorities</MenuItem>
                  <MenuItem value="Critical">🔴 Critical</MenuItem>
                  <MenuItem value="High">🟠 High</MenuItem>
                  <MenuItem value="Medium">🔵 Medium</MenuItem>
                  <MenuItem value="Normal">🟢 Normal</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ width: 110 }}>
                <InputLabel>Status</InputLabel>
                <Select value={readFilter} label="Status" onChange={e => setReadFilter(e.target.value)}>
                  <MenuItem value="ALL">All</MenuItem>
                  <MenuItem value="UNREAD">Unread</MenuItem>
                  <MenuItem value="READ">Read</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredFeed.map((item) => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  bgcolor: !item.read ? '#F0F7FF' : '#FFFFFF',
                  borderColor: !item.read ? '#93C5FD' : '#E2E8F0',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    backgroundColor: item.priorityColor
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: `${item.priorityColor}15`, color: item.priorityColor, width: 44, height: 44 }}>
                    {item.icon}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.3 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: !item.read ? 900 : 700, color: 'text.primary' }}>
                        {item.title}
                      </Typography>
                      <Chip label={item.category} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
                      <Chip label={item.priority} size="small" sx={{ fontWeight: 900, bgcolor: item.priorityColor, color: '#FFF', fontSize: '0.65rem', height: 20 }} />
                      {!item.read && (
                        <Chip label="NEW UNREAD" size="small" color="error" sx={{ fontWeight: 900, fontSize: '0.6rem', height: 18 }} />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {item.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 0.5, display: 'block' }}>
                      Customer: <b>{item.customer}</b> ({item.refId}) • Time: <b>{item.time}</b>
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
                    {item.channels.map(ch => (
                      <Chip key={ch} label={ch} size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.6rem', height: 20 }} />
                    ))}
                  </Box>

                  {!item.read && (
                    <Button size="small" variant="contained" color="primary" onClick={() => handleMarkRead(item.id)} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
                      Mark Read
                    </Button>
                  )}
                  {item.read && (
                    <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800 }}>
                      ✓ Read
                    </Typography>
                  )}
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MULTI-CHANNEL DELIVERY TRACKER */}
      {/* ========================================================= */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: 1 }}>
                <WhatsAppIcon color="success" />
                Multi-Channel Delivery Gateway Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track delivery status across In-App, Email Gateway, SMS, and WhatsApp Marketing API
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 850 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Dispatch ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Channel Engine</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Recipient / Phone / Email</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Payload Message</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Delivery Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deliveryLogs.map((d) => (
                  <TableRow key={d.id} hover sx={{ bgcolor: d.status === 'Failed' ? '#FEF2F2' : 'inherit' }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{d.id}</Typography>
                      <Typography variant="caption" color="text.secondary">{d.time}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={d.channel} size="small" color={d.channel.includes('WhatsApp') ? 'success' : d.channel.includes('Email') ? 'primary' : 'warning'} sx={{ fontWeight: 900 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{d.recipient}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{d.payload}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={d.status} size="small" color={d.status === 'Delivered' ? 'success' : d.status === 'Sent' ? 'info' : 'error'} sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="center">
                      {d.status === 'Failed' && (
                        <Button size="small" variant="contained" color="error" onClick={() => handleRetryDelivery(d.id)} startIcon={<RefreshIcon />} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
                          Retry Dispatch
                        </Button>
                      )}
                      {d.status === 'Delivered' && (
                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800 }}>
                          ✓ Confirmed Delivered
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

      {/* ========================================================= */}
      {/* TAB 3: ROLE-BASED PERMISSION STREAM */}
      {/* ========================================================= */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', mb: 2 }}>
            Role-Based Notification Visibility Matrix
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#EFF6FF' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2563EB', mb: 1 }}>Sales Agent View</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• New Assigned Leads</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Customer WhatsApp Replies</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Missed Calls</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Payment Link Confirmations</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#FFFBEB' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#D97706', mb: 1 }}>Team Leader View</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• 5m Lead SLA Breaches</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Agent QA Verification Failures</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Discount Override Requests</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Unassigned Lead Alerts</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#F5F3FF' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#7C3AED', mb: 1 }}>Expert Team Leader View</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• High-Value VIP Disruptions</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Complex Reissue Waiver Alerts</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Escalated Customer Complaints</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#ECFDF5' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#059669', mb: 1 }}>Super Admin View</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Full System-Wide Notifications</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• API & GDS Gateway Health Alerts</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>• Financial Refund Authorizations</Typography>
            </Paper>
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 4: NOTIFICATION AUDIT HISTORY */}
      {/* ========================================================= */}
      {currentTab === 3 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', mb: 2 }}>
            Notification History & Execution Audit Log
          </Typography>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Dispatch ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Event Title</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Recipient</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Priority</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feed.map((f) => (
                  <TableRow key={f.id} hover>
                    <TableCell sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{f.id}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{f.title}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{f.customer} ({f.refId})</TableCell>
                    <TableCell align="center">
                      <Chip label={f.priority} size="small" sx={{ fontWeight: 900, bgcolor: f.priorityColor, color: '#FFF' }} />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>{f.time}</TableCell>
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
