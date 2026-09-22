/**
 * src/components/SmsComposer.jsx
 * Quick SMS sender panel — used inside the DialerPanel tabs.
 * Features: recipient number, message, character count, send status.
 */

import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Select, MenuItem,
  FormControl, InputLabel, CircularProgress, Chip, Alert,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { sendSMS, toE164 } from '../services/telnyxService';
import { useTelnyx } from '../contexts/TelnyxContext';
import { useAuth } from '../contexts/AuthContext';

const SMS_MAX_CHARS = 160;

export default function SmsComposer({ defaultTo = '' }) {
  const { phoneNumbers, selectedFromNumber } = useTelnyx();
  const { currentUser } = useAuth();

  const [to, setTo] = useState(defaultTo);
  const [from, setFrom] = useState(selectedFromNumber);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const charCount = text.length;
  const segments = Math.ceil(charCount / SMS_MAX_CHARS) || 1;
  const overLimit = charCount > SMS_MAX_CHARS * 3;

  const handleSend = async () => {
    if (!to.trim() || !text.trim() || overLimit) return;

    setStatus('sending');
    setErrorMsg('');

    try {
      const toE164Number = toE164(to.trim());
      await sendSMS({
        to: toE164Number,
        from: from || selectedFromNumber,
        text: text.trim(),
        agentId: currentUser?.id,
      });
      setStatus('sent');
      setText('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      console.error('[SmsComposer] Send failed:', err.message);
      setErrorMsg(err.response?.data?.error || 'Failed to send SMS. Check number format.');
      setStatus('error');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* From Number Selector */}
      <FormControl size="small" fullWidth>
        <InputLabel sx={{ fontSize: '0.8rem' }}>From Number</InputLabel>
        <Select
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          label="From Number"
          sx={{ borderRadius: 2, fontSize: '0.82rem' }}
        >
          {phoneNumbers.map((n) => (
            <MenuItem key={n.number} value={n.number} sx={{ fontSize: '0.82rem' }}>
              {n.number} {n.type === 'toll_free' ? '(Toll-Free)' : `(${n.type})`}
            </MenuItem>
          ))}
          {phoneNumbers.length === 0 && (
            <MenuItem value={selectedFromNumber} sx={{ fontSize: '0.82rem' }}>
              {selectedFromNumber || 'No numbers loaded'}
            </MenuItem>
          )}
        </Select>
      </FormControl>

      {/* To Number */}
      <TextField
        label="To (US Number)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="+1 (555) 000-0000"
        size="small"
        fullWidth
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.82rem' } }}
      />

      {/* Message Body */}
      <Box sx={{ position: 'relative' }}>
        <TextField
          label="Message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          multiline
          rows={3}
          fullWidth
          size="small"
          placeholder="Type your message here..."
          error={overLimit}
          helperText={overLimit ? 'Message too long' : undefined}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.82rem' } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.3, gap: 0.5 }}>
          <Chip
            label={`${charCount}/${SMS_MAX_CHARS}`}
            size="small"
            color={overLimit ? 'error' : charCount > SMS_MAX_CHARS ? 'warning' : 'default'}
            sx={{ fontSize: '0.62rem', height: 18 }}
          />
          {segments > 1 && (
            <Chip
              label={`${segments} SMS segments`}
              size="small"
              color="warning"
              sx={{ fontSize: '0.62rem', height: 18 }}
            />
          )}
        </Box>
      </Box>

      {/* Error */}
      {status === 'error' && (
        <Alert severity="error" sx={{ py: 0.3, borderRadius: 2, fontSize: '0.78rem' }}>
          {errorMsg}
        </Alert>
      )}

      {/* Send Button */}
      <Button
        fullWidth
        variant="contained"
        color={status === 'sent' ? 'success' : 'primary'}
        disabled={!to.trim() || !text.trim() || overLimit || status === 'sending'}
        onClick={handleSend}
        startIcon={
          status === 'sending' ? <CircularProgress size={14} color="inherit" /> :
          status === 'sent' ? <CheckCircleIcon /> :
          <SendIcon />
        }
        sx={{ borderRadius: 2, fontWeight: 800, fontSize: '0.82rem', py: 1 }}
      >
        {status === 'sending' ? 'Sending...' :
         status === 'sent' ? 'SMS Sent ✓' :
         'Send SMS'}
      </Button>
    </Box>
  );
}
