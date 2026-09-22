import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useAlert } from '../contexts/AlertContext';

export default function ScheduleChange({ event, onClose, onSave }) {
  const { showAlert } = useAlert();

  const [internalNote, setInternalNote] = useState('');
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '2026-10-18',
    preferredTime: '10:00',
    notes: 'Customer requested morning flight preference.'
  });

  useEffect(() => {
    if (event) {
      setInternalNote('');
      setShowRescheduleForm(false);
    }
  }, [event]);

  if (!event) return null;

  const originalText = event.original || 'AA 100 | 15OCT | 18:30 → 07:30+1';
  const newText = event.updated || 'AA 100 | 16OCT | 09:00 → 22:00';

  const handleAcceptChange = () => {
    showAlert(`✓ Change Accepted for PNR ${event.pnr}. Customer notified via Email & WhatsApp.`, 'success');
    if (onSave) {
      onSave('Accept Change — Change Accepted', internalNote);
    }
  };

  const handleRequestRefund = () => {
    showAlert(`💰 Refund request logged for PNR ${event.pnr}. Refund process initiated.`, 'info');
    if (onSave) {
      onSave('Request Refund — Refund Requested', internalNote);
    }
  };

  const handleContactAirline = () => {
    showAlert(`📞 Contact Airline Directly action confirmed for PNR ${event.pnr}.`, 'info');
    if (onSave) {
      onSave('Contact Airline Directly', internalNote);
    }
  };

  const handleSubmitReschedule = () => {
    if (!rescheduleData.newDate) {
      showAlert('Please select a new date for rescheduling', 'warning');
      return;
    }
    showAlert(
      `📅 Reschedule request submitted successfully for PNR ${event.pnr}! New date: ${rescheduleData.newDate}.`,
      'success'
    );
    if (onSave) {
      onSave(`Request Reschedule — ${rescheduleData.newDate}`, internalNote);
    }
  };

  const handleSaveNote = () => {
    if (!internalNote.trim()) {
      showAlert('Please enter an internal note before saving', 'warning');
      return;
    }
    showAlert(`💬 Internal note saved for PNR ${event.pnr}!`, 'success');
    if (onSave) {
      onSave('Internal Note Saved', internalNote);
    }
  };

  return (
    <Dialog open={Boolean(event)} onClose={onClose} maxWidth="sm" fullWidth>
      {/* Dialog Header */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditNotificationsIcon color="error" />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              PNR {event.pnr} — Schedule Change Alert
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Customer: <b>{event.customer}</b> &nbsp;|&nbsp; Route: <b>{event.route}</b>
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* ─── 1. ORIGINAL vs NEW SCHEDULE COMPARISON ─── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
          {/* Original Schedule Box */}
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 2 }}>
            <Chip size="small" label="ORIGINAL SCHEDULE" color="default" sx={{ fontWeight: 800, fontSize: '0.62rem', mb: 0.8 }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'text.secondary' }}>
              {originalText}
            </Typography>
          </Paper>

          {/* New Schedule Box */}
          <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 2 }}>
            <Chip size="small" label="NEW AIRLINE SCHEDULE" color="error" sx={{ fontWeight: 800, fontSize: '0.62rem', mb: 0.8 }} />
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: '#991B1B' }}>
              {newText}
            </Typography>
          </Paper>
        </Box>

        {/* Alert Instructions */}
        <Alert severity="warning" icon={<EditNotificationsIcon />} sx={{ borderRadius: 2, fontSize: '0.8rem' }}>
          <b>Action Required:</b> The airline changed flight times. Please choose a frontend demo action below to inform the client or process a change.
        </Alert>

        {/* ─── 2. ACTION REQUIRED BUTTONS GRID ─── */}
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: -1 }}>
          Available Action Options:
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleAcceptChange}
            sx={{ fontWeight: 700, fontSize: '0.75rem', justifyContent: 'flex-start', py: 0.8 }}
          >
            Accept Change — Notify Customer
          </Button>

          <Button
            variant="contained"
            color="warning"
            startIcon={<CalendarMonthIcon />}
            onClick={() => setShowRescheduleForm(!showRescheduleForm)}
            sx={{ fontWeight: 700, fontSize: '0.75rem', justifyContent: 'flex-start', py: 0.8 }}
          >
            Request Reschedule
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<CurrencyExchangeIcon />}
            onClick={handleRequestRefund}
            sx={{ fontWeight: 700, fontSize: '0.75rem', justifyContent: 'flex-start', py: 0.8 }}
          >
            Request Refund
          </Button>

          <Button
            variant="outlined"
            color="info"
            startIcon={<PhoneInTalkIcon />}
            onClick={handleContactAirline}
            sx={{ fontWeight: 700, fontSize: '0.75rem', justifyContent: 'flex-start', py: 0.8 }}
          >
            Contact Airline Directly
          </Button>
        </Box>

        {/* ─── 3. RESCHEDULE UI FORM (Collapsible) ─── */}
        {showRescheduleForm && (
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 2, mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#92400E', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarMonthIcon fontSize="small" /> REQUEST FLIGHT RESCHEDULE
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 1.5 }}>
              <TextField
                size="small"
                label="Current Flight"
                value={event.route || 'JFK → LHR'}
                InputProps={{ readOnly: true }}
              />
              <TextField
                size="small"
                label="Current Date"
                value={event.date || '15 Oct 2026'}
                InputProps={{ readOnly: true }}
              />
              <TextField
                size="small"
                label="New Date *"
                type="date"
                value={rescheduleData.newDate}
                onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                size="small"
                label="Preferred Time *"
                type="time"
                value={rescheduleData.preferredTime}
                onChange={(e) => setRescheduleData({ ...rescheduleData, preferredTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <TextField
              fullWidth
              size="small"
              multiline
              rows={2}
              label="Note"
              placeholder="Add details for reschedule request..."
              value={rescheduleData.notes}
              onChange={(e) => setRescheduleData({ ...rescheduleData, notes: e.target.value })}
              sx={{ mb: 1.5 }}
            />

            <Button
              variant="contained"
              color="warning"
              fullWidth
              startIcon={<SendIcon />}
              onClick={handleSubmitReschedule}
              sx={{ fontWeight: 800 }}
            >
              Submit Reschedule Request
            </Button>
          </Paper>
        )}

        <Divider />

        {/* ─── 4. INTERNAL NOTE SECTION ─── */}
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 0.8, display: 'block' }}>
            Internal Note & Discussion Log:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Internal Note"
            placeholder="Type any notes about agent/airline communications for PNR tracking log..."
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
          />
        </Box>
      </DialogContent>

      {/* Dialog Footer Actions */}
      <DialogActions sx={{ px: 3, py: 1.8 }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveNote}
          startIcon={<SendIcon />}
          sx={{ fontWeight: 800 }}
        >
          Save & Notify
        </Button>
      </DialogActions>
    </Dialog>
  );
}
