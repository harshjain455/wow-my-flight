import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import SendIcon from '@mui/icons-material/Send';
import CommentIcon from '@mui/icons-material/Comment';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import LaunchIcon from '@mui/icons-material/Launch';
import AppModal from './AppModal';
import ScheduleChange from './ScheduleChange';
import { useAlert } from '../contexts/AlertContext';

export const DEMO_PNR_FEED = [
  {
    pnr: 'XYZ34E',
    customer: 'J. Smith',
    route: 'JFK → LHR',
    date: '15 Oct 2026',
    status: 'Schedule Change Alert — Reschedule Needed',
    category: 'RED',
    tone: 'error',
    ago: '2h ago',
    original: 'AA 100 | 15OCT | 18:30 → 07:30+1',
    updated: 'AA 100 | 16OCT | 09:00 → 22:00',
    needsAction: true
  },
  {
    pnr: 'LMN78F',
    customer: 'A. Lee',
    route: 'DEL → SIN',
    date: '20 Nov 2026',
    status: 'Ticketed & Dispatched — PDF Itinerary Sent',
    category: 'GREEN',
    tone: 'success',
    ago: '10h ago',
    original: 'SQ 407 | 20NOV | 10:00 → 18:00',
    updated: null,
    needsAction: false
  },
  {
    pnr: 'QRS90G',
    customer: 'S. Williams',
    route: 'DXB → CDG',
    date: '05 Dec 2026',
    status: 'Flight Delay — Delayed 2 Hours',
    category: 'ORANGE',
    tone: 'warning',
    ago: '1h ago',
    original: 'EK 073 | 05DEC | 08:00 → 13:30',
    updated: 'EK 073 | 05DEC | 10:00 → 15:30',
    needsAction: true
  }
];

const CATEGORY_STYLES = {
  RED:    { chipColor: 'error',   bg: '#FEF2F2', border: '#FECACA', text: '#991B1B', badge: '🔴' },
  ORANGE: { chipColor: 'warning', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E', badge: '🟡' },
  GREEN:  { chipColor: 'success', bg: '#F0FDF4', border: '#BBF7D0', text: '#166534', badge: '🟢' },
  GREY:   { chipColor: 'default', bg: '#F8FAFC', border: '#E2E8F0', text: '#475569', badge: '⚪' }
};

export default function PNRTracker({ feed = DEMO_PNR_FEED, onFeedUpdate }) {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [discussItem, setDiscussItem] = useState(null);
  const [internalNote, setInternalNote] = useState('');
  const [schedEvent, setSchedEvent] = useState(null);

  const handleDispatchItinerary = (row) => {
    showAlert(`📤 Official itinerary dispatched successfully for PNR ${row.pnr} (${row.customer})`, 'success');
  };

  const handleSaveDiscussNote = () => {
    if (!internalNote.trim()) {
      showAlert('Please enter an internal note before saving', 'warning');
      return;
    }
    showAlert(`💬 Internal note attached to PNR ${discussItem.pnr}: "${internalNote}"`, 'info');
    setDiscussItem(null);
    setInternalNote('');
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrackChangesIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
            FLIGHT PNR AUTO-TRACKER
          </Typography>
        </Box>

        {/* Live Indicator & View All Link */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                boxShadow: '0 0 0 3px rgba(34,197,94,0.3)'
              }}
            />
            <Typography variant="caption" color="success.main" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
              LIVE
            </Typography>
          </Box>
          <Button
            size="small"
            variant="text"
            color="primary"
            endIcon={<LaunchIcon sx={{ fontSize: 13 }} />}
            onClick={() => navigate('/flight-alerts')}
            sx={{ fontSize: '0.68rem', fontWeight: 700, p: 0 }}
          >
            Full View
          </Button>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Active GDS monitoring feed — real-time schedule changes, flight delays and ticket dispatch status.
      </Typography>

      {/* Tracker Items List */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: 1.5, 
        overflowX: 'auto', 
        pb: 1.5,
        pt: 0.5,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: 3 }
      }}>
        {feed.map((row) => {
          const cfg = CATEGORY_STYLES[row.category] || CATEGORY_STYLES['GREY'];
          return (
            <Paper
              key={row.pnr}
              variant="outlined"
              sx={{
                p: 1.8,
                borderRadius: 2,
                bgcolor: cfg.bg,
                borderColor: cfg.border,
                transition: 'all 0.2s ease',
                minWidth: 265,
                flexShrink: 0,
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }
              }}
            >
              {/* Header: PNR & Customer */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.8rem' }}>{cfg.badge}</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                    PNR {row.pnr}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    · {row.customer}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem', fontWeight: 600 }}>
                  {row.ago}
                </Typography>
              </Box>

              {/* Route & Date */}
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8 }}>
                ✈️ {row.route} &nbsp;|&nbsp; Date: <b>{row.date}</b>
              </Typography>

              {/* Status Badge */}
              <Box sx={{ mb: 1.2 }}>
                <Chip
                  size="small"
                  label={row.status}
                  color={cfg.chipColor}
                  sx={{ fontWeight: 800, fontSize: '0.68rem', height: 22 }}
                />
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, pt: 0.8, borderTop: '1px dashed', borderColor: cfg.border, alignItems: 'center' }}>
                {/* 1. Discuss Tracker Event */}
                <Tooltip title="Discuss Event">
                  <IconButton
                    size="small"
                    sx={{ 
                      bgcolor: 'background.paper', 
                      border: '1px solid', 
                      borderColor: 'divider',
                      color: 'text.secondary',
                      '&:hover': { bgcolor: 'primary.50', color: 'primary.main' }
                    }}
                    onClick={() => setDiscussItem(row)}
                  >
                    <CommentIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>

                {/* 2. Dispatch Official Itinerary */}
                <Tooltip title="Dispatch Itinerary">
                  <IconButton
                    size="small"
                    sx={{ 
                      bgcolor: '#22C55E', 
                      color: '#fff',
                      border: '1px solid #16A34A',
                      '&:hover': { bgcolor: '#16A34A' }
                    }}
                    onClick={() => handleDispatchItinerary(row)}
                  >
                    <SendIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>

                {/* 3. Process Schedule Change */}
                {row.needsAction && (
                  <Tooltip title="Process Schedule Change">
                    <IconButton
                      size="small"
                      sx={{ 
                        bgcolor: row.category === 'RED' ? '#EF4444' : '#F59E0B', 
                        color: '#fff',
                        border: row.category === 'RED' ? '1px solid #DC2626' : '1px solid #D97706',
                        '&:hover': { bgcolor: row.category === 'RED' ? '#DC2626' : '#D97706' }
                      }}
                      onClick={() => setSchedEvent(row)}
                    >
                      <EditNotificationsIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>

      {/* Discuss Tracker Event Modal */}
      <AppModal
        open={!!discussItem}
        onClose={() => setDiscussItem(null)}
        title={discussItem ? `Discuss Tracker Event — PNR ${discussItem.pnr}` : ''}
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" onClick={() => setDiscussItem(null)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveDiscussNote}>
              Save Internal Note
            </Button>
          </Box>
        }
      >
        {discussItem && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                PNR {discussItem.pnr} ({discussItem.customer})
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Route: {discussItem.route} &nbsp;|&nbsp; Status: <b>{discussItem.status}</b>
              </Typography>
            </Paper>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Internal Note / Discussion Log *"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="e.g. Discussed with airline desk; customer informed about 2-hour delay."
            />
          </Box>
        )}
      </AppModal>

      {/* Schedule Change Modal */}
      <ScheduleChange
        event={schedEvent}
        onClose={() => setSchedEvent(null)}
        onSave={(action) => {
          showAlert(`✓ ${action} — Customer informed and schedule change processed!`, 'success');
          setSchedEvent(null);
        }}
      />
    </Paper>
  );
}
