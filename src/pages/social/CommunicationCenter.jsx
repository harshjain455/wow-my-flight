import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmsIcon from '@mui/icons-material/Sms';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import ForumIcon from '@mui/icons-material/Forum';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PauseIcon from '@mui/icons-material/Pause';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import SearchIcon from '@mui/icons-material/Search';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// DATASETS
// ==========================================

const TIMELINE_EVENTS = [
  { id: 1, type: 'Call', icon: '📞', title: 'Outbound Call Connected', channel: 'Call', customer: 'Ambassador Harold Vance (+1 555-234-8901)', agent: 'Sarah Jenkins', time: 'Today 10:02 AM', status: 'Completed (2m 14s)', details: 'Discussed BA-142 First Class seat selection 1A/1B.' },
  { id: 2, type: 'Email', icon: '✉️', title: 'Commercial Quote Q-8812 Dispatched', channel: 'Email', customer: 'Ambassador Harold Vance (harold.vance@embassy.gov)', agent: 'Sarah Jenkins', time: 'Today 10:07 AM', status: 'Delivered', details: 'PDF Quote Q-8812 attached ($28,500 total).' },
  { id: 3, type: 'SMS', icon: '💬', title: 'Payment Reminder SMS Sent', channel: 'SMS', customer: 'Ambassador Harold Vance (+1 555-234-8901)', agent: 'System', time: 'Today 10:08 AM', status: 'Delivered', details: 'SMS: Dear Harold, your flight quote Q-8812 is reserved until 6 PM.' },
  { id: 4, type: 'WhatsApp', icon: '🟢', title: 'WhatsApp Customer Reply Received', channel: 'WhatsApp', customer: 'Ambassador Harold Vance (+1 555-234-8901)', agent: 'Sarah Jenkins', time: 'Today 10:15 AM', status: 'Received', details: 'Customer: "Received the quote. Please confirm if MOML Halal meal is included."' },
  { id: 5, type: 'Note', icon: '📝', title: 'Internal TL Note Added', channel: 'Notes', customer: 'Ambassador Harold Vance (LD-99120)', agent: 'Michael Chang (TL)', time: 'Today 11:00 AM', status: 'Internal Only', details: 'Authorized $200 VIP courtesy discount. High conversion potential.' },
  { id: 6, type: 'Callback', icon: '⏰', title: 'Pre-flight Courtesy Call Scheduled', channel: 'Callbacks', customer: 'Ambassador Harold Vance (+1 555-234-8901)', agent: 'Sarah Jenkins', time: 'Sep 14 09:00 AM', status: 'Scheduled', details: 'Verify passport validity and luggage check-in requirements.' }
];

const SCHEDULED_CALLBACKS = [
  { id: 1, customer: 'Ambassador Harold Vance', phone: '+1 555-234-8901', agent: 'Sarah Jenkins', date: '2026-09-14 09:00', priority: 'High VIP', reason: 'Pre-flight courtesy check' },
  { id: 2, customer: 'Sophia Chen', phone: '+1 415-889-1200', agent: 'Alex Miller', date: '2026-08-21 14:00', priority: 'Medium', reason: 'Tokyo visa verification follow-up' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CommunicationCenter() {
  const { showAlert } = useAlert();
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // WebRTC Call State
  const [activeCall, setActiveCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  // Modals
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState('Call');
  const [messageText, setMessageText] = useState('');

  const handleStartCall = () => {
    setActiveCall(true);
    showAlert('📞 WebRTC Call Connected to Ambassador Harold Vance (+1 555-234-8901)', 'success');
  };

  const handleEndCall = () => {
    setActiveCall(false);
    showAlert('✓ Call Ended. 02m 14s talk time auto-logged to timeline!', 'info');
  };

  const handleActionSubmit = () => {
    setActionModalOpen(false);
    showAlert(`✓ ${actionType} action executed & logged to Customer Timeline!`, 'success');
  };

  const filteredEvents = TIMELINE_EVENTS.filter((e) => {
    const matchesFilter = filter === 'ALL' || e.channel === filter;
    const matchesSearch = e.customer.toLowerCase().includes(searchQuery.toLowerCase()) || e.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            📞
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Central Communication Center & Unified Hub
              </Typography>
              <Chip label="WEBRTC DIALER READY" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#059669', color: '#FFF' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Single communication hub capturing Calls, Emails, SMS, WhatsApp, Callbacks, and Notes in one feed
            </Typography>
          </Box>
        </Box>

        <DualClock client={{ timezone: 'America/New_York', label: 'Telecom EST' }} />
      </Paper>

      {/* WEBRTC CLICK-TO-CALL DIALER BANNER (WHEN CALL IS ACTIVE) */}
      {activeCall && (
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, bgcolor: '#0F172A', color: '#FFFFFF', border: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#EF4444', animation: 'pulse 1.5s infinite' }}>
              <PhoneInTalkIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#38BDF8' }}>
                Active WebRTC Call: Ambassador Harold Vance (+1 555-234-8901)
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>
                Live Duration: <b style={{ color: '#22C55E' }}>02:14</b> • Quality: <b>HD Voice 128kbps</b> • Recording: 🔴 ACTIVE
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button size="small" variant="outlined" color={isMuted ? 'error' : 'inherit'} onClick={() => setIsMuted(!isMuted)} startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}>
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button size="small" variant="outlined" color={isOnHold ? 'warning' : 'inherit'} onClick={() => setIsOnHold(!isOnHold)} startIcon={<PauseIcon />}>
              {isOnHold ? 'Resume' : 'Hold'}
            </Button>
            <Button size="small" variant="contained" color="error" onClick={handleEndCall} startIcon={<CallEndIcon />} sx={{ fontWeight: 900 }}>
              End Call
            </Button>
          </Box>
        </Paper>
      )}

      {/* 8 COMMUNICATION ANALYTICS KPI CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', lg: 'repeat(8, 1fr)' }, gap: 1.2, mb: 3 }}>
        {[
          { label: 'Calls Made', val: '1,840', color: '#3F51B5' },
          { label: 'Calls Answered', val: '1,520', color: '#059669' },
          { label: 'Missed Calls', val: '42', color: '#DC2626' },
          { label: 'Avg Talk Time', val: '4m 15s', color: '#0284C7' },
          { label: 'Emails Sent', val: '2,450', color: '#2563EB' },
          { label: 'SMS Sent', val: '1,280', color: '#7C3AED' },
          { label: 'WhatsApp Msgs', val: '4,120', color: '#059669' },
          { label: 'Response Rate', val: '92.4%', color: '#C59B27' }
        ].map((kpi, i) => (
          <Paper key={i} elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: kpi.color } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem', display: 'block' }}>{kpi.label}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.1 }}>{kpi.val}</Typography>
          </Paper>
        ))}
      </Box>

      {/* QUICK ACTION BAR */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, textTransform: 'uppercase', mr: 1 }}>
          ⚡ Quick Channel Action Bar:
        </Typography>
        <Button size="small" variant="contained" color="primary" startIcon={<PhoneInTalkIcon />} onClick={handleStartCall} sx={{ fontWeight: 800 }}>
          Click-to-Call
        </Button>
        <Button size="small" variant="contained" color="info" startIcon={<EmailIcon />} onClick={() => { setActionType('Email'); setActionModalOpen(true); }} sx={{ fontWeight: 800 }}>
          Send Email
        </Button>
        <Button size="small" variant="contained" color="secondary" startIcon={<SmsIcon />} onClick={() => { setActionType('SMS'); setActionModalOpen(true); }} sx={{ fontWeight: 800 }}>
          Send SMS
        </Button>
        <Button size="small" variant="contained" color="success" startIcon={<WhatsAppIcon />} onClick={() => { setActionType('WhatsApp'); setActionModalOpen(true); }} sx={{ fontWeight: 800 }}>
          Send WhatsApp
        </Button>
        <Button size="small" variant="outlined" color="warning" startIcon={<CalendarMonthIcon />} onClick={() => { setActionType('Callback'); setActionModalOpen(true); }} sx={{ fontWeight: 800 }}>
          Schedule Callback
        </Button>
        <Button size="small" variant="outlined" color="inherit" startIcon={<NoteAltIcon />} onClick={() => { setActionType('Note'); setActionModalOpen(true); }} sx={{ fontWeight: 800 }}>
          Add Internal Note
        </Button>
      </Paper>

      {/* CONTROLS BAR: SEARCH & CHANNEL FILTERS */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Search conversation timeline..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          sx={{ width: { xs: '100%', sm: 300 } }}
        />

        <Tabs value={filter} onChange={(e, val) => setFilter(val)} variant="scrollable" scrollButtons="auto" sx={{ '& .MuiTab-root': { fontWeight: 800, fontSize: '0.75rem' } }}>
          <Tab label="All Channels (6)" value="ALL" />
          <Tab label="📞 Calls" value="Call" />
          <Tab label="✉️ Emails" value="Email" />
          <Tab label="💬 SMS" value="SMS" />
          <Tab label="🟢 WhatsApp" value="WhatsApp" />
          <Tab label="⏰ Callbacks" value="Callbacks" />
          <Tab label="📝 Notes" value="Notes" />
        </Tabs>
      </Paper>

      {/* UNIFIED CHRONOLOGICAL TIMELINE FEED */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredEvents.map((ev) => (
          <Paper key={ev.id} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#F1F5F9', color: '#1E293B', fontWeight: 900, width: 36, height: 36, fontSize: '1rem' }}>
                  {ev.icon}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    {ev.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Target: <b>{ev.customer}</b> • Rep: <b>{ev.agent}</b>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Chip label={ev.status} size="small" color="primary" sx={{ fontWeight: 900, height: 22, fontSize: '0.65rem', mb: 0.3 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, fontFamily: 'monospace' }}>
                  {ev.time}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1.2 }} />

            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2, border: '1px solid #E2E8F0' }}>
              "{ev.details}"
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* QUICK ACTION EXECUTION MODAL */}
      <Dialog open={actionModalOpen} onClose={() => setActionModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: '#3F51B5' }}>
          Execute Channel Action: {actionType}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Recipient / Customer" size="small" defaultValue="Ambassador Harold Vance (+1 555-234-8901)" fullWidth />
            <TextField label={`Message / ${actionType} Details *`} multiline rows={4} value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder={`Type ${actionType} content here...`} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setActionModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleActionSubmit} sx={{ fontWeight: 800 }}>
            Dispatch & Log to Timeline
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
