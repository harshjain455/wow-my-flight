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
import Alert from '@mui/material/Alert';

// Icons
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// DATASETS & DISPOSITION AUTOMATION MATRIX
// ==========================================

const DISPOSITION_CONFIG = [
  { name: 'Interested', category: 'Positive', color: '#059669', icon: '👍', action: 'Create follow-up task and keep lead active.' },
  { name: 'Quote Sent', category: 'Positive', color: '#2563EB', icon: '📄', action: 'Update lead status to Quote Sent and save quote activity.' },
  { name: 'Payment Pending', category: 'Positive', color: '#059669', icon: '💳', action: 'Start payment reminder workflow and SLA timer.' },
  { name: 'Booked', category: 'Positive', color: '#16A34A', icon: '✈️', action: 'Convert lead into booking and notify ticketing team.' },
  { name: 'Callback Requested', category: 'Follow-up', color: '#D97706', icon: '⏰', action: 'Schedule callback with reminder and notification.' },
  { name: 'Busy', category: 'Follow-up', color: '#C59B27', icon: '⏳', action: 'Create retry task after configured interval.' },
  { name: 'No Answer', category: 'Follow-up', color: '#9CA3AF', icon: '📵', action: 'Increment contact attempt counter and schedule retry.' },
  { name: 'Not Interested', category: 'Negative', color: '#6B7280', icon: '❌', action: 'Move lead to Lost pipeline and require lost reason.' },
  { name: 'Wrong Number', category: 'Negative', color: '#DC2626', icon: '⚠️', action: 'Flag lead for verification and possible duplicate review.' },
  { name: 'Escalated', category: 'Escalation', color: '#7C3AED', icon: '🚨', action: 'Notify Team Leader and create escalation task.' },
  { name: 'Complaint', category: 'Escalation', color: '#B91C1C', icon: '👿', action: 'Create complaint case and notify customer support.' }
];

const DISPOSITION_LOGS = [
  { id: 'LOG-771', customer: 'Ambassador Harold Vance', phone: '+1 555-234-8901', agent: 'Sarah Jenkins', disposition: 'Quote Sent', notes: 'Discussed BA-142 First Class seat selection. Dispatched PDF Quote Q-8812.', time: 'Today 10:06 AM', actionTaken: 'Updated Status to Quote Sent' },
  { id: 'LOG-772', customer: 'Sophia Chen', phone: '+1 415-889-1200', agent: 'Alex Miller', disposition: 'Callback Requested', notes: 'Requested callback after consulting spouse regarding travel dates.', time: 'Today 11:35 AM', actionTaken: 'Scheduled Callback for Aug 21 14:00' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function MandatoryCallDispositionEngine() {
  const { showAlert } = useAlert();
  const [logs, setLogs] = useState(DISPOSITION_LOGS);
  const [wrapUpOpen, setWrapUpOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  // Wrap-up Form State
  const [disposition, setDisposition] = useState('Interested');
  const [notes, setNotes] = useState('');
  const [callbackDateTime, setCallbackDateTime] = useState('');
  const [bookingValue, setBookingValue] = useState('28500');

  const handleSaveWrapUp = () => {
    if (!notes) {
      showAlert('⚠️ Please enter mandatory call conversation notes!', 'warning');
      return;
    }

    const matchedConfig = DISPOSITION_CONFIG.find(c => c.name === disposition);
    const newLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      customer: 'Ambassador Harold Vance',
      phone: '+1 555-234-8901',
      agent: 'Sarah Jenkins',
      disposition: disposition,
      notes: notes,
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      actionTaken: matchedConfig ? matchedConfig.action : 'Logged to Timeline'
    };

    setLogs([newLog, ...logs]);
    setWrapUpOpen(false);
    showAlert(`✓ Call disposition [${disposition}] saved! Auto-triggered: ${newLog.actionTaken}`, 'success');
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            📝
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Mandatory Call Disposition & Workflow Trigger Engine
              </Typography>
              <Chip label="100% WRAP-UP ENFORCED" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#059669', color: '#FFF' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Mandatory post-call wrap-up screen triggering automated lead lifecycle updates, SLA timers, and TL alerts
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="contained" color="warning" startIcon={<PhoneInTalkIcon />} onClick={() => setWrapUpOpen(true)} sx={{ fontWeight: 800 }}>
            Simulate Call Wrap-Up Popup
          </Button>
          <DualClock client={{ timezone: 'America/New_York', label: 'Disposition EST' }} />
        </Box>
      </Paper>

      {/* 11 DISPOSITION ANALYTICS KPI CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 1.2, mb: 3 }}>
        {[
          { label: 'Interested', val: '320', color: '#059669' },
          { label: 'Quote Sent', val: '280', color: '#2563EB' },
          { label: 'Payment Pending', val: '140', color: '#059669' },
          { label: 'Booked', val: '110', color: '#16A34A' },
          { label: 'Callback Requested', val: '450', color: '#D97706' },
          { label: 'Busy / Retry', val: '210', color: '#C59B27' },
          { label: 'No Answer', val: '380', color: '#9CA3AF' },
          { label: 'Not Interested', val: '150', color: '#6B7280' },
          { label: 'Wrong Number', val: '45', color: '#DC2626' },
          { label: 'Escalated', val: '12', color: '#7C3AED' },
          { label: 'Complaints', val: '8', color: '#B91C1C' }
        ].map((kpi, i) => (
          <Paper key={i} elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: kpi.color } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem', display: 'block' }}>{kpi.label}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.1 }}>{kpi.val}</Typography>
          </Paper>
        ))}
      </Box>

      {/* TABS CONTROL */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ px: 2, '& .MuiTab-root': { fontWeight: 800, fontSize: '0.78rem' } }}>
          <Tab label="⚡ Automated Disposition Action Matrix" />
          <Tab label="📋 Historical Disposition Logs & Audit Trail" />
        </Tabs>
      </Paper>

      {/* TAB 1: AUTOMATED ACTION MATRIX */}
      {currentTab === 0 && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Disposition Option</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Automatic CRM Action Triggered</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DISPOSITION_CONFIG.map((c) => (
                  <TableRow key={c.name} hover>
                    <TableCell sx={{ fontWeight: 900 }}>
                      <Chip label={`${c.icon} ${c.name}`} size="small" sx={{ fontWeight: 900, bgcolor: c.color, color: '#FFF' }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{c.category}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.primary' }}>{c.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* TAB 2: DISPOSITION LOGS */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Log ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Customer & Phone</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Agent</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Disposition</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Conversation Summary</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Automated Trigger Executed</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((l) => (
                  <TableRow key={l.id} hover>
                    <TableCell sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{l.id}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{l.customer} ({l.phone})</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{l.agent}</TableCell>
                    <TableCell><Chip label={l.disposition} size="small" color="primary" sx={{ fontWeight: 900 }} /></TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{l.notes}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#059669' }}>{l.actionTaken}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{l.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* MANDATORY CALL WRAP-UP POPUP SIMULATOR */}
      <Dialog open={wrapUpOpen} onClose={() => setWrapUpOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: '#3F51B5' }}>
          Mandatory Post-Call Wrap-Up & Disposition Screen
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2, fontWeight: 700 }}>
            Call ended with Ambassador Harold Vance (+1 555-234-8901). Please enter mandatory disposition and call notes to complete wrap-up.
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField select label="Call Disposition *" size="small" value={disposition} onChange={(e) => setDisposition(e.target.value)} fullWidth>
              {DISPOSITION_CONFIG.map((c) => (
                <MenuItem key={c.name} value={c.name}>{c.icon} {c.name} ({c.category})</MenuItem>
              ))}
            </TextField>

            <TextField label="Call Conversation Notes *" multiline rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Required: Summarize conversation requirements and outcome..." fullWidth />

            {disposition === 'Callback Requested' && (
              <TextField type="datetime-local" label="Required Callback Date & Time *" size="small" value={callbackDateTime} onChange={(e) => setCallbackDateTime(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            )}

            <TextField label="Estimated Booking Value ($)" size="small" value={bookingValue} onChange={(e) => setBookingValue(e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setWrapUpOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveWrapUp} sx={{ fontWeight: 800 }}>
            Confirm Wrap-Up & Trigger Workflows
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
