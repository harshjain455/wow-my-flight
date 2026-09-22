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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import CancelIcon from '@mui/icons-material/Cancel';
import BlockIcon from '@mui/icons-material/Block';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// MANDATORY DATASETS & TRANSITION RULES
// ==========================================

const PIPELINE_STAGES = [
  'NEW', 'ASSIGNED', 'CONTACTED', 'QUALIFIED', 'QUOTE CREATED',
  'QUOTE SENT', 'NEGOTIATION', 'PAYMENT PENDING', 'BOOKED', 'TICKETED', 'TRAVEL COMPLETED'
];

const VALID_TRANSITIONS = {
  'NEW': ['ASSIGNED'],
  'ASSIGNED': ['CONTACTED'],
  'CONTACTED': ['QUALIFIED', 'NO RESPONSE'],
  'QUALIFIED': ['QUOTE CREATED'],
  'QUOTE CREATED': ['QUOTE SENT'],
  'QUOTE SENT': ['NEGOTIATION', 'LOST'],
  'NEGOTIATION': ['PAYMENT PENDING', 'LOST'],
  'PAYMENT PENDING': ['BOOKED', 'CANCELLED'],
  'BOOKED': ['TICKETED'],
  'TICKETED': ['TRAVEL COMPLETED'],
  'TRAVEL COMPLETED': []
};

const OUTCOME_REASONS = {
  'LOST': ['Price too high', 'Customer booked elsewhere', 'Customer postponed travel', 'Visa issue', 'Other'],
  'SPAM': ['Invalid inquiry', 'Fake lead', 'Promotional spam'],
  'DUPLICATE': ['Existing customer', 'Existing lead merged'],
  'NO RESPONSE': ['No answer after 3 attempts', 'Customer unreachable / wrong number'],
  'CANCELLED': ['Customer cancelled request', 'Payment failed / timed out']
};

const SAMPLE_LEAD = {
  id: 'LD-99120',
  customer: 'Ambassador Harold Vance',
  route: 'DEL ➔ LHR ➔ JFK',
  tripType: 'Multi-City',
  agent: 'Sarah Jenkins',
  teamLeader: 'Michael Chang',
  currentStatusIndex: 9, // TICKETED
  currentStatus: 'TICKETED',
  expectedValue: 28500,
  createdDate: '2026-08-18 10:15',
  slaStatus: '🟢 On Time (0 Delays)',
  history: [
    { from: 'NEW', to: 'ASSIGNED', user: 'System Auto-Router', role: 'System', time: 'Aug 18 10:16', duration: '1 min', sla: 'Met (1m)', reason: 'Matched USA Skill Rule' },
    { from: 'ASSIGNED', to: 'CONTACTED', user: 'Sarah Jenkins', role: 'Sales Agent', time: 'Aug 18 10:18', duration: '2 mins', sla: 'Met (2m < 5m target)', reason: 'Outbound Call Connected' },
    { from: 'CONTACTED', to: 'QUALIFIED', user: 'Sarah Jenkins', role: 'Sales Agent', time: 'Aug 18 10:25', duration: '7 mins', sla: 'Met', reason: 'Captured First Class reqs' },
    { from: 'QUALIFIED', to: 'QUOTE CREATED', user: 'Sarah Jenkins', role: 'Sales Agent', time: 'Aug 18 11:30', duration: '1 hour', sla: 'Met', reason: 'Generated Q-8812' },
    { from: 'QUOTE CREATED', to: 'QUOTE SENT', user: 'Sarah Jenkins', role: 'Sales Agent', time: 'Aug 18 11:35', duration: '5 mins', sla: 'Met', reason: 'Dispatched via WhatsApp' },
    { from: 'QUOTE SENT', to: 'NEGOTIATION', user: 'Sarah Jenkins', role: 'Sales Agent', time: 'Aug 19 14:00', duration: '1 day', sla: 'Met', reason: 'Discussed seat upgrades' },
    { from: 'NEGOTIATION', to: 'PAYMENT PENDING', user: 'Sarah Jenkins', role: 'Sales Agent', time: 'Aug 19 14:15', duration: '15 mins', sla: 'Met', reason: 'Amex Payment link sent' },
    { from: 'PAYMENT PENDING', to: 'BOOKED', user: 'Elena Finance', role: 'Finance', time: 'Aug 19 14:20', duration: '5 mins', sla: 'Met (5m < 10m target)', reason: 'Receipt of $28,500' },
    { from: 'BOOKED', to: 'TICKETED', user: 'Carlos Ticketing', role: 'Ticketing', time: 'Aug 20 11:30', duration: '21 hours', sla: 'Met', reason: 'E-Ticket 13381235436196' }
  ]
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function LeadLifecycleSystem() {
  const { showAlert } = useAlert();
  const [lead, setLead] = useState(SAMPLE_LEAD);
  const [tlOverride, setTlOverride] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  // Transition Dialog State
  const [modalOpen, setModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState('TRAVEL COMPLETED');
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');

  const isOutcomeStatus = ['LOST', 'SPAM', 'DUPLICATE', 'NO RESPONSE', 'CANCELLED'].includes(targetStatus);

  const handleOpenTransitionModal = (nextStg) => {
    setTargetStatus(nextStg);
    setSelectedReason('');
    setNotes('');
    setModalOpen(true);
  };

  const handleConfirmTransition = () => {
    if (isOutcomeStatus && !selectedReason) {
      showAlert('⚠️ Please select a mandatory reason for this outcome status!', 'warning');
      return;
    }

    const newLog = {
      from: lead.currentStatus,
      to: targetStatus,
      user: 'Sarah Jenkins',
      role: 'Sales Agent',
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      duration: 'Just now',
      sla: 'Met',
      reason: selectedReason || notes || 'Normal Sales Pipeline Advancement'
    };

    const nextIndex = PIPELINE_STAGES.indexOf(targetStatus);
    setLead({
      ...lead,
      currentStatus: targetStatus,
      currentStatusIndex: nextIndex !== -1 ? nextIndex : lead.currentStatusIndex,
      history: [...lead.history, newLog]
    });

    setModalOpen(false);
    showAlert(`✓ Lead ${lead.id} status updated to [${targetStatus}]!`, 'success');
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            🔄
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Lead Lifecycle Management & Audit System
              </Typography>
              <Chip label="ACTIVE PIPELINE ENFORCED" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#059669', color: '#FFF' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Lead ID: <b>{lead.id}</b> • Customer: <b>{lead.customer}</b> • Value: <b style={{ color: '#059669' }}>${lead.expectedValue.toLocaleString()}</b>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel control={<Switch checked={tlOverride} onChange={(e) => setTlOverride(e.target.checked)} color="warning" />} label="TL / Admin Override" />
          <DualClock client={{ timezone: 'America/New_York', label: 'Lifecycle EST' }} />
        </Box>
      </Paper>

      {/* 13 LIFECYCLE STAGE KPI CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }, gap: 1.2, mb: 3 }}>
        {[
          { label: 'New', val: '142', color: '#3F51B5' },
          { label: 'Assigned', val: '210', color: '#0284C7' },
          { label: 'Contacted', val: '185', color: '#059669' },
          { label: 'Qualified', val: '120', color: '#7C3AED' },
          { label: 'Quote Created', val: '95', color: '#C59B27' },
          { label: 'Quote Sent', val: '88', color: '#2563EB' },
          { label: 'Negotiation', val: '45', color: '#D97706' },
          { label: 'Payment Pending', val: '32', color: '#059669' },
          { label: 'Booked', val: '28', color: '#16A34A' },
          { label: 'Ticketed', val: '184', color: '#059669' },
          { label: 'Travel Completed', val: '450', color: '#16A34A' },
          { label: 'Lost', val: '45', color: '#6B7280' },
          { label: 'No Response', val: '18', color: '#9CA3AF' }
        ].map((kpi, i) => (
          <Paper key={i} elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: kpi.color } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem', display: 'block' }}>{kpi.label}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.1 }}>{kpi.val}</Typography>
          </Paper>
        ))}
      </Box>

      {/* MANDATORY 11-STAGE VISUAL PROGRESS TRACKER */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#3F51B5', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          🔄 11-Stage Mandatory Sales Pipeline Stepper ({lead.currentStatus})
        </Typography>

        <Stepper activeStep={lead.currentStatusIndex} alternativeLabel sx={{ pt: 1, pb: 1 }}>
          {PIPELINE_STAGES.map((stgLabel, i) => {
            const isCurrent = i === lead.currentStatusIndex;
            const isCompleted = i < lead.currentStatusIndex;
            return (
              <Step key={stgLabel} completed={isCompleted} active={isCurrent}>
                <StepLabel
                  StepIconProps={{
                    style: { color: isCompleted ? '#059669' : isCurrent ? '#3F51B5' : '#CBD5E1' }
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: isCurrent ? 900 : 700, color: isCurrent ? '#3F51B5' : 'text.secondary', fontSize: '0.68rem' }}>
                    {stgLabel}
                  </Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <Divider sx={{ my: 2 }} />

        {/* VALID NEXT TRANSITION ACTIONS */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
              Allowed Next Transitions:
            </Typography>
            {(VALID_TRANSITIONS[lead.currentStatus] || ['TRAVEL COMPLETED']).map((nxt) => (
              <Button
                key={nxt}
                size="small"
                variant="contained"
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleOpenTransitionModal(nxt)}
                sx={{ fontWeight: 800, fontSize: '0.72rem' }}
              >
                Advance to {nxt}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {['LOST', 'SPAM', 'DUPLICATE', 'NO RESPONSE', 'CANCELLED'].map((out) => (
              <Button
                key={out}
                size="small"
                variant="outlined"
                color="error"
                onClick={() => handleOpenTransitionModal(out)}
                sx={{ fontWeight: 800, fontSize: '0.68rem' }}
              >
                Mark {out}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* TABS CONTROL */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ px: 2, '& .MuiTab-root': { fontWeight: 800, fontSize: '0.78rem' } }}>
          <Tab label="📜 Chronological Stage Activity Timeline" />
          <Tab label="📊 Stage Duration & SLA Delay Audit" />
        </Tabs>
      </Paper>

      {/* TAB 1: CHRONOLOGICAL ACTIVITY TIMELINE */}
      {currentTab === 0 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', mb: 2 }}>
            📜 Complete Activity History (Who, When, What)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Stage Transition</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>User & Role</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Stage Duration</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>SLA Status</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Action Reason / Notes</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lead.history.map((h, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 900 }}>
                      <Chip label={h.from} size="small" variant="outlined" sx={{ fontWeight: 800, mr: 1 }} />
                      ➔
                      <Chip label={h.to} size="small" color="primary" sx={{ fontWeight: 900, ml: 1 }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{h.user} ({h.role})</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{h.duration}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#059669' }}>{h.sla}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{h.reason}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{h.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* TAB 2: DURATION & SLA AUDIT */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669', mb: 2 }}>
            ⏱️ Stage Duration & SLA Delay Audit Ledger
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#F0FDF4' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Total Lead Age:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669' }}>2 Days 1 Hour</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#EFF6FF' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Total Stage Transitions:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563EB' }}>{lead.history.length} Steps</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#FEFCE8' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>SLA Compliance Rate:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#D97706' }}>100% On Time</Typography>
            </Paper>
          </Box>
        </Paper>
      )}

      {/* STATUS TRANSITION & MANDATORY REASON DIALOG */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            mx: { xs: 1.5, sm: 3 },
            my: { xs: 1, sm: 2 },
            maxHeight: { xs: 'calc(100dvh - 32px)', sm: '85vh' },
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main', py: 2, px: { xs: 2, sm: 3 }, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          Confirm Status Change: {lead.currentStatus} ➔ {targetStatus}
        </DialogTitle>
        <DialogContent
          className="modal-scroll"
          sx={{
            py: 2.5,
            px: { xs: 2, sm: 3 },
            maxHeight: { xs: '55vh', sm: '60vh', md: '65vh' },
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            flexGrow: 1,
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              Updating Lead <b>{lead.id}</b> ({lead.customer}). This action will generate an immutable audit log record.
            </Typography>

            {isOutcomeStatus && (
              <TextField
                select
                label={`Mandatory Reason for [${targetStatus}] *`}
                size="small"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                fullWidth
              >
                {(OUTCOME_REASONS[targetStatus] || ['Other']).map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="Operational Notes / Activity Summary"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details regarding customer interaction..."
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ py: 2, px: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: 'background.paper' }}>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmTransition} sx={{ fontWeight: 800 }}>
            Confirm & Log Transition
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
