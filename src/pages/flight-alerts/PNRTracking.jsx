import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import FlightIcon from '@mui/icons-material/Flight';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import CommentIcon from '@mui/icons-material/Comment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import ScheduleChange from '../../components/ScheduleChange';
import AppModal from '../../components/AppModal';
import { useAlert } from '../../contexts/AlertContext';

export const INITIAL_PNRS = [
  {
    pnr: 'XYZ34E',
    customer: 'J. Smith',
    route: 'JFK → LHR',
    date: '15 Oct',
    status: 'Schedule Change',
    tone: 'error',
    category: 'alerts',
    type: 'changed',
    ago: '2h ago',
    airline: 'American Airlines (AA 100)',
    depTime: '18:30',
    arrTime: '07:30+1',
    cabin: 'Business',
    ticketStatus: 'Ticketed',
    trackingStatus: 'Alert Active',
    original: 'AA 100 | 15OCT | 18:30 → 07:30+1',
    updated: 'AA 100 | 16OCT | 09:00 → 22:00',
    needsAction: true,
    history: [
      { time: '2h ago', text: 'Airline schedule update received from Sabre GDS GDS feed' },
      { time: '1d ago', text: 'PNR created and ticket issued' }
    ]
  },
  {
    pnr: 'LMN78F',
    customer: 'A. Lee',
    route: 'DEL → SIN',
    date: '20 Nov',
    status: 'Dispatched',
    tone: 'success',
    category: 'dispatched',
    type: 'dispatched',
    ago: '10h ago',
    airline: 'Singapore Airlines (SQ 407)',
    depTime: '10:00',
    arrTime: '18:00',
    cabin: 'Economy',
    ticketStatus: 'Dispatched',
    trackingStatus: 'Monitoring On-Time',
    original: 'SQ 407 | 20NOV | 10:00 → 18:00',
    updated: null,
    needsAction: false,
    history: [
      { time: '10h ago', text: 'E-ticket issued & PDF itinerary sent to client' }
    ]
  },
  {
    pnr: 'QRS90G',
    customer: 'S. Williams',
    route: 'DXB → CDG',
    date: '05 Dec',
    status: 'Delayed 2h',
    tone: 'warning',
    category: 'delayed',
    type: 'delayed',
    ago: '1h ago',
    airline: 'Emirates (EK 073)',
    depTime: '10:00',
    arrTime: '15:30',
    cabin: 'Business',
    ticketStatus: 'Ticketed',
    trackingStatus: 'Delay Alert',
    original: 'EK 073 | 05DEC | 08:00 → 13:30',
    updated: 'EK 073 | 05DEC | 10:00 → 15:30',
    needsAction: true,
    history: [
      { time: '1h ago', text: 'Flight delayed 2 hours due to air traffic operational hold' }
    ]
  },
  {
    pnr: 'QRS38F',
    customer: 'J. Smith',
    route: 'LHR → JFK',
    date: '22 Oct',
    status: 'Ticketed',
    tone: 'success',
    category: 'confirmed',
    type: 'confirmed',
    ago: '14h ago',
    airline: 'British Airways (BA 175)',
    depTime: '11:00',
    arrTime: '14:15',
    cabin: 'Economy',
    ticketStatus: 'Ticketed',
    trackingStatus: 'Active Tracking',
    original: 'BA 175 | 22OCT | 11:00 → 14:15',
    updated: null,
    needsAction: false,
    history: [
      { time: '14h ago', text: 'E-Ticket generated in GDS' }
    ]
  },
  {
    pnr: 'ABC12D',
    customer: 'M. Chen',
    route: 'JFK → LHR',
    date: '15 Oct',
    status: 'Tracking Active',
    tone: 'info',
    category: 'confirmed',
    type: 'confirmed',
    ago: 'Live',
    airline: 'American Airlines (AA 100)',
    depTime: '18:30',
    arrTime: '07:30+1',
    cabin: 'Business',
    ticketStatus: 'Pending Issuance',
    trackingStatus: 'Active Tracking',
    original: 'AA 100 | 15OCT | 18:30 → 07:30+1',
    updated: null,
    needsAction: false,
    history: [
      { time: 'Live', text: 'GDS link active, tracking seat assignments and gate updates' }
    ]
  },
  {
    pnr: 'DEF56H',
    customer: 'R. Verma',
    route: 'BOM → DXB',
    date: '28 Oct',
    status: 'Changed',
    tone: 'warning',
    category: 'changed',
    type: 'changed',
    ago: '4h ago',
    airline: 'Emirates (EK 507)',
    depTime: '06:00',
    arrTime: '08:05',
    cabin: 'Business',
    ticketStatus: 'Ticketed',
    trackingStatus: 'Schedule Changed',
    original: 'EK 507 | 28OCT | 06:00 → 08:05',
    updated: 'EK 507 | 29OCT | 06:00 → 08:05',
    needsAction: true,
    history: [
      { time: '4h ago', text: 'Departure date adjusted by airline by 1 day' }
    ]
  }
];

const FILTER_TABS = [
  { key: 'all', label: '📋 All' },
  { key: 'alerts', label: '🔴 Alerts' },
  { key: 'confirmed', label: '✅ Confirmed' },
  { key: 'delayed', label: '🟡 Delayed' },
  { key: 'changed', label: '🟠 Changed' },
  { key: 'dispatched', label: '📤 Dispatched' }
];

const STATUS_COLOR = {
  error:   { chip: 'error',   rowBg: '#FEF2F2', border: '#FECACA', text: '#991B1B', icon: '🔴' },
  warning: { chip: 'warning', rowBg: '#FFFBEB', border: '#FDE68A', text: '#92400E', icon: '🟡' },
  success: { chip: 'success', rowBg: '#F0FDF4', border: '#BBF7D0', text: '#166534', icon: '🟢' },
  info:    { chip: 'info',    rowBg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF', icon: '⚪' }
};

export default function PNRTracking() {
  const { showAlert } = useAlert();

  const [pnrList, setPnrList] = useState(INITIAL_PNRS);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  // Modals
  const [schedEvent, setSchedEvent] = useState(null);
  const [detailRow, setDetailRow] = useState(null);
  const [discussRow, setDiscussRow] = useState(null);
  const [internalNote, setInternalNote] = useState('');
  const [addPNROpen, setAddPNROpen] = useState(false);
  const [newPNR, setNewPNR] = useState({ pnr: '', customer: '', route: '', date: '' });

  // Search & Filter logic (Frontend state only)
  const filtered = pnrList.filter(r => {
    const matchSearch = `${r.pnr} ${r.customer} ${r.route} ${r.airline}`.toLowerCase().includes(search.toLowerCase());
    let matchFilter = true;
    if (filterTab === 'all') matchFilter = true;
    else if (filterTab === 'alerts') matchFilter = r.category === 'alerts' || r.needsAction;
    else if (filterTab === 'confirmed') matchFilter = r.category === 'confirmed' || r.status === 'Ticketed' || r.status === 'Tracking Active';
    else if (filterTab === 'delayed') matchFilter = r.category === 'delayed' || r.status.includes('Delayed');
    else if (filterTab === 'changed') matchFilter = r.category === 'changed' || r.status.includes('Change') || r.status === 'Changed';
    else if (filterTab === 'dispatched') matchFilter = r.category === 'dispatched' || r.status === 'Dispatched';

    return matchSearch && matchFilter;
  });

  const alertCount = pnrList.filter(r => r.needsAction || r.category === 'alerts').length;

  const handleDispatchOfficialItinerary = (row) => {
    showAlert(`📤 Official itinerary dispatched successfully. (PNR: ${row.pnr}, Customer: ${row.customer})`, 'success');
  };

  const handleSaveDiscussNote = () => {
    if (!internalNote.trim()) {
      showAlert('Please enter an internal note', 'warning');
      return;
    }
    showAlert(`💬 Internal note attached to PNR ${discussRow.pnr}: "${internalNote}"`, 'info');
    setPnrList(prev => prev.map(p => p.pnr === discussRow.pnr ? { ...p, history: [{ time: 'Just now', text: `Note: ${internalNote}` }, ...(p.history || [])] } : p));
    setDiscussRow(null);
    setInternalNote('');
  };

  const handleSaveScheduleChange = (action, note) => {
    if (schedEvent) {
      setPnrList(prev => prev.map(p => {
        if (p.pnr === schedEvent.pnr) {
          return {
            ...p,
            status: action.includes('Accept') ? 'Change Accepted' : action.includes('Refund') ? 'Refund Requested' : 'Reschedule Requested',
            tone: action.includes('Accept') ? 'success' : 'info',
            needsAction: false,
            category: 'confirmed'
          };
        }
        return p;
      }));
    }
    setSchedEvent(null);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* ─── 1. HEADER WITH LIVE INDICATOR ─── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, flexWrap: 'wrap', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TrackChangesIcon color="primary" sx={{ fontSize: 32 }} />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1, fontSize: { xs: '1.1rem', sm: '1.5rem' } }}>
                ACTIVE PNR TRACKER
              </Typography>
              {/* LIVE Indicator */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, bgcolor: '#ECFDF5', px: 1, py: 0.3, borderRadius: 2, border: '1px solid #A7F3D0' }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', boxShadow: '0 0 0 2px rgba(34,197,94,0.3)' }} />
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
                  LIVE
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Real-time Sabre GDS monitoring for flight delays, schedule changes & ticket dispatch status
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setAddPNROpen(true)}
          sx={{ fontWeight: 700, width: { xs: '100%', sm: 'auto' } }}
        >
          Add PNR to Tracker
        </Button>
      </Box>

      {/* ─── 2. SEARCH & FILTER TABS BAR ─── */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search by PNR or Customer Name */}
          <TextField
            size="small"
            placeholder="Search by PNR or Customer Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 280, md: 320 } }}
          />

          {/* Filter Tabs */}
          <Box sx={{ display: 'flex', gap: 0.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 0.5, bgcolor: '#F8FAFC', width: { xs: '100%', sm: 'auto' }, overflowX: 'auto', py: 0.5 }}>
            {FILTER_TABS.map(tab => (
              <Button
                key={tab.key}
                size="small"
                variant={filterTab === tab.key ? 'contained' : 'text'}
                color={filterTab === tab.key ? 'primary' : 'inherit'}
                onClick={() => setFilterTab(tab.key)}
                sx={{ minWidth: 'auto', whiteSpace: 'nowrap', px: 1.2, py: 0.4, fontSize: '0.7rem', fontWeight: 700, borderRadius: 1.5 }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* ─── 3. PNR TRACKER TABLE & MOBILE CARDS ─── */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        
        {/* DESKTOP GRID VIEW (lg & up) */}
        <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
          {/* Table Header */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '110px 1.2fr 130px 90px 180px 90px 190px',
            px: 2, py: 1.2, bgcolor: '#F8FAFC',
            borderBottom: '1px solid', borderColor: 'divider'
          }}>
            {['PNR', 'Customer', 'Route', 'Date', 'Status', 'Last Updated', 'Actions'].map(h => (
              <Typography key={h} variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.68rem' }}>
                {h}
              </Typography>
            ))}
          </Box>

          {/* Table Rows */}
          {filtered.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No PNR records match your search filter.
              </Typography>
            </Box>
          ) : (
            filtered.map((row) => {
              const cfg = STATUS_COLOR[row.tone] || STATUS_COLOR['info'];
              return (
                <Box
                  key={row.pnr}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '110px 1.2fr 130px 90px 180px 90px 190px',
                    px: 2, py: 1.5,
                    bgcolor: row.needsAction ? cfg.rowBg : 'transparent',
                    borderBottom: '1px solid', borderColor: 'divider',
                    '&:last-child': { borderBottom: 'none' },
                    '&:hover': { bgcolor: row.needsAction ? cfg.rowBg : '#F8FAFC' },
                    transition: 'background 0.15s',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
                    {cfg.icon} {row.pnr}
                  </Typography>

                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {row.customer}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <FlightIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.route}</Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">{row.date}</Typography>

                  <Box>
                    <Chip
                      size="small"
                      label={row.status}
                      color={cfg.chip}
                      sx={{ fontSize: '0.68rem', fontWeight: 800, height: 22 }}
                    />
                  </Box>

                  <Typography variant="caption" color="text.secondary">{row.ago}</Typography>

                  <Box sx={{ display: 'flex', gap: 0.6, flexWrap: 'wrap', alignItems: 'center' }}>
                    {row.needsAction ? (
                      <Button
                        size="small"
                        variant="contained"
                        color={row.tone === 'error' ? 'error' : 'warning'}
                        startIcon={<EditNotificationsIcon sx={{ fontSize: 13 }} />}
                        sx={{ fontSize: '0.68rem', fontWeight: 800, py: 0.3, px: 1 }}
                        onClick={() => setSchedEvent(row)}
                      >
                        Action
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        startIcon={<VisibilityIcon sx={{ fontSize: 13 }} />}
                        sx={{ fontSize: '0.68rem', fontWeight: 700, py: 0.3, px: 1 }}
                        onClick={() => setDetailRow(row)}
                      >
                        View
                      </Button>
                    )}

                    {(row.status === 'Dispatched' || row.status === 'Ticketed') && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<SendIcon sx={{ fontSize: 12 }} />}
                        sx={{ fontSize: '0.65rem', fontWeight: 700, py: 0.3, px: 0.8 }}
                        onClick={() => handleDispatchOfficialItinerary(row)}
                      >
                        Dispatch
                      </Button>
                    )}

                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setDiscussRow(row)}
                      title="Discuss Tracker Event"
                    >
                      <CommentIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

        {/* MOBILE & TABLET CARD VIEW (xs, sm & md) */}
        <Box sx={{ display: { xs: 'flex', lg: 'none' }, flexDirection: 'column', gap: 1.5, p: 1.5 }}>
          {filtered.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No PNR records match your search filter.
              </Typography>
            </Box>
          ) : (
            filtered.map((row) => {
              const cfg = STATUS_COLOR[row.tone] || STATUS_COLOR['info'];
              return (
                <Paper
                  key={row.pnr}
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: row.needsAction ? cfg.rowBg : '#FFFFFF',
                    borderColor: row.needsAction ? cfg.border : 'divider'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
                      {cfg.icon} {row.pnr}
                    </Typography>
                    <Chip
                      size="small"
                      label={row.status}
                      color={cfg.chip}
                      sx={{ fontSize: '0.65rem', fontWeight: 800, height: 22 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      {row.customer}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FlightIcon sx={{ fontSize: 13, color: 'primary.main' }} />
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>{row.route}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Travel Date: <b>{row.date}</b>
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                      Updated: <b>{row.ago}</b>
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap', alignItems: 'center' }}>
                    {row.needsAction ? (
                      <Button
                        size="small"
                        variant="contained"
                        color={row.tone === 'error' ? 'error' : 'warning'}
                        startIcon={<EditNotificationsIcon sx={{ fontSize: 13 }} />}
                        sx={{ fontSize: '0.7rem', fontWeight: 800, py: 0.4, px: 1.2 }}
                        onClick={() => setSchedEvent(row)}
                      >
                        Action
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="outlined"
                        color="inherit"
                        startIcon={<VisibilityIcon sx={{ fontSize: 13 }} />}
                        sx={{ fontSize: '0.7rem', fontWeight: 700, py: 0.4, px: 1.2 }}
                        onClick={() => setDetailRow(row)}
                      >
                        View Details
                      </Button>
                    )}

                    {(row.status === 'Dispatched' || row.status === 'Ticketed') && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<SendIcon sx={{ fontSize: 12 }} />}
                        sx={{ fontSize: '0.7rem', fontWeight: 700, py: 0.4, px: 1 }}
                        onClick={() => handleDispatchOfficialItinerary(row)}
                      >
                        Dispatch
                      </Button>
                    )}

                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setDiscussRow(row)}
                      title="Discuss Tracker Event"
                    >
                      <CommentIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              );
            })
          )}
        </Box>

      </Paper>

      {/* ─── 4. PNR DETAIL MODAL/DRAWER ─── */}
      <Dialog
        open={!!detailRow}
        onClose={() => setDetailRow(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {detailRow && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                PNR Detail: {detailRow.pnr}
              </Typography>
              <IconButton onClick={() => setDetailRow(null)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>

            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 1, fontSize: '0.85rem' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PNR Code:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>{detailRow.pnr}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Customer Name:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>{detailRow.customer}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Route:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>✈️ {detailRow.route}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Travel Date:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailRow.date}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Airline / Flight:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{detailRow.airline || 'British Airways'}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Departure Time:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailRow.depTime || '18:30'}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Arrival Time:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{detailRow.arrTime || '07:30+1'}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Cabin / Class:</Typography>
                <Chip size="small" label={detailRow.cabin || 'Business'} color="primary" variant="outlined" sx={{ width: 'fit-content', fontWeight: 800, height: 20 }} />

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Ticket Status:</Typography>
                <Chip size="small" label={detailRow.ticketStatus || 'Ticketed'} color="success" sx={{ width: 'fit-content', fontWeight: 800, height: 20 }} />

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Tracking Status:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'info.main' }}>{detailRow.trackingStatus || 'Active'}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Last Updated:</Typography>
                <Typography variant="body2" color="text.secondary">{detailRow.ago}</Typography>
              </Box>
            </Paper>

            {/* Alert History Section */}
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 1 }}>
              📜 ALERT & EVENT HISTORY
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {(detailRow.history || [{ time: '1h ago', text: 'Tracking active in GDS' }]).map((h, idx) => (
                <Box key={idx} sx={{ p: 1.2, bgcolor: '#F1F5F9', borderRadius: 1.5, fontSize: 12 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>{h.time}</Typography>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{h.text}</Typography>
                </Box>
              ))}
            </Box>

            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                startIcon={<SendIcon />}
                onClick={() => {
                  handleDispatchOfficialItinerary(detailRow);
                  setDetailRow(null);
                }}
              >
                Dispatch Official Itinerary
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── 5. DISCUSS TRACKER EVENT MODAL ─── */}
      <AppModal
        open={!!discussRow}
        onClose={() => setDiscussRow(null)}
        title={discussRow ? `Discuss Tracker Event — PNR ${discussRow.pnr}` : ''}
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setDiscussRow(null)}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveDiscussNote}>
              Save Note
            </Button>
          </Box>
        }
      >
        {discussRow && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                PNR {discussRow.pnr} ({discussRow.customer})
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                Route: <b>{discussRow.route}</b> &nbsp;|&nbsp; Event: <b>{discussRow.status}</b>
              </Typography>
            </Paper>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Internal Note / Discussion Log *"
              placeholder="e.g. Discussed with airline desk; customer informed about schedule change."
              value={internalNote}
              onChange={e => setInternalNote(e.target.value)}
            />
          </Box>
        )}
      </AppModal>

      {/* ─── 6. SCHEDULE CHANGE MODAL ─── */}
      <ScheduleChange
        event={schedEvent}
        onClose={() => setSchedEvent(null)}
        onSave={handleSaveScheduleChange}
      />

      {/* ─── 7. ADD PNR MODAL ─── */}
      <Dialog open={addPNROpen} onClose={() => setAddPNROpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Add PNR to Tracker
          <IconButton onClick={() => setAddPNROpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
            <TextField fullWidth label="PNR Code" size="small" value={newPNR.pnr}
              onChange={e => setNewPNR(p => ({ ...p, pnr: e.target.value.toUpperCase() }))} />
            <TextField fullWidth label="Customer Name" size="small" value={newPNR.customer}
              onChange={e => setNewPNR(p => ({ ...p, customer: e.target.value }))} />
            <TextField fullWidth label="Route (e.g. JFK → LHR)" size="small" value={newPNR.route}
              onChange={e => setNewPNR(p => ({ ...p, route: e.target.value }))} />
            <TextField
              fullWidth
              label="Travel Date"
              type="date"
              size="small"
              InputLabelProps={{
                shrink: true,
                sx: { bgcolor: 'background.paper', px: 0.5, borderRadius: 0.5 }
              }}
              value={newPNR.date}
              onChange={e => setNewPNR(p => ({ ...p, date: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={() => setAddPNROpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => {
            if (!newPNR.pnr) { showAlert('Please enter a PNR code', 'warning'); return; }
            const newItem = {
              pnr: newPNR.pnr,
              customer: newPNR.customer || 'Customer',
              route: newPNR.route || 'JFK → LHR',
              date: newPNR.date || '15 Oct',
              status: 'Tracking Active',
              tone: 'info',
              category: 'confirmed',
              type: 'confirmed',
              ago: 'Just now',
              airline: 'British Airways',
              depTime: '12:00',
              arrTime: '20:00',
              cabin: 'Economy',
              ticketStatus: 'Pending',
              trackingStatus: 'Active Tracking',
              needsAction: false,
              history: [{ time: 'Just now', text: 'PNR added to active tracker' }]
            };
            setPnrList([newItem, ...pnrList]);
            showAlert(`PNR ${newPNR.pnr} added to tracker successfully!`, 'success');
            setAddPNROpen(false);
            setNewPNR({ pnr: '', customer: '', route: '', date: '' });
          }}>
            Add to Tracker
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
