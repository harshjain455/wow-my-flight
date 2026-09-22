/**
 * src/components/CallDispositionModal.jsx
 * 
 * Mandatory popup shown after every call ends.
 * Agent MUST select a disposition and optionally add notes.
 * Cannot be dismissed without submitting.
 */

import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Chip, TextField, CircularProgress,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CALL_DISPOSITIONS, saveCallDisposition, formatCallDuration } from '../services/telnyxService';
import { useTelnyx } from '../contexts/TelnyxContext';
import { useAuth } from '../contexts/AuthContext';

export default function CallDispositionModal() {
  const { dispositionPending, clearDispositionPending } = useTelnyx();
  const { currentUser } = useAuth();
  const [selected, setSelected] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isOpen = !!dispositionPending;

  const handleSubmit = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await saveCallDisposition({
        callId: dispositionPending.callId,
        agentId: currentUser?.id || 'agent-1',
        disposition: selected,
        notes,
      });
      setSaved(true);
      setTimeout(() => {
        clearDispositionPending();
        setSelected('');
        setNotes('');
        setSaved(false);
        setSaving(false);
      }, 1200);
    } catch (err) {
      console.error('[CallDispositionModal] Save failed:', err.message);
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <DialogTitle sx={{ pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TaskAltIcon color="primary" />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Call Disposition Required
            </Typography>
            <Typography variant="caption" color="text.secondary">
              How did the call go? This is mandatory.
            </Typography>
          </Box>
          {dispositionPending?.durationSeconds > 0 && (
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: 14 }} />}
              label={`Duration: ${formatCallDuration(dispositionPending.durationSeconds)}`}
              size="small"
              variant="outlined"
              sx={{ ml: 'auto', fontWeight: 700 }}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {/* Disposition Options */}
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
          SELECT OUTCOME *
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
          {CALL_DISPOSITIONS.map((d) => (
            <Chip
              key={d.value}
              label={d.label}
              color={selected === d.value ? d.color : 'default'}
              variant={selected === d.value ? 'filled' : 'outlined'}
              onClick={() => setSelected(d.value)}
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.8rem',
                transition: 'all 0.15s',
                transform: selected === d.value ? 'scale(1.05)' : 'scale(1)',
                '&:hover': { transform: 'scale(1.03)' },
              }}
            />
          ))}
        </Box>

        {/* Notes */}
        <TextField
          label="Call Notes (optional)"
          multiline
          rows={3}
          fullWidth
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Customer interested in JFK → LHR Business class for Jan 15. Callback on Friday 3 PM EST."
          variant="outlined"
          size="small"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          * This modal cannot be dismissed without selecting an outcome.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          disabled={!selected || saving}
          onClick={handleSubmit}
          startIcon={saved ? <TaskAltIcon /> : saving ? <CircularProgress size={14} /> : null}
          sx={{ borderRadius: 2, fontWeight: 800, px: 3, minWidth: 140 }}
        >
          {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save & Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
