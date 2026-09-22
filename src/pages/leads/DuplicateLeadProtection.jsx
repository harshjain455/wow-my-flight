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
import DialogContentText from '@mui/material/DialogContentText';
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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';

// Icons
import SecurityIcon from '@mui/icons-material/Security';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MergeTypeIcon from '@mui/icons-material/MergeType';
import LinkIcon from '@mui/icons-material/Link';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// DATASETS & DUPLICATE PAIRS
// ==========================================

const DUPLICATE_PAIRS = [
  {
    id: 'DUP-881',
    confidenceScore: 100,
    confidenceBadge: 'High Match (100%)',
    badgeColor: '#059669',
    matchReason: 'Exact Match: Same Email (harold.vance@embassy.gov)',
    existingLead: {
      id: 'LD-99120',
      name: 'Ambassador Harold Vance',
      email: 'harold.vance@embassy.gov',
      phone: '+1 555-234-8901',
      route: 'DEL ➔ LHR ➔ JFK',
      agent: 'Sarah Jenkins',
      status: 'Quote Sent',
      source: 'Google Ads',
      expectedValue: 28500,
      lastContact: '2026-08-20 10:15'
    },
    incomingLead: {
      id: 'LD-99144 (New Inquiry)',
      name: 'Harold Vance',
      email: 'harold.vance@embassy.gov',
      phone: '+1 555-234-8901',
      route: 'DEL ➔ LHR',
      agent: 'Unassigned',
      status: 'New Inquiry',
      source: 'WhatsApp Inbound',
      expectedValue: 28500,
      lastContact: '2026-08-20 14:30'
    },
    detectedDate: '2026-08-20 14:30'
  },
  {
    id: 'DUP-882',
    confidenceScore: 90,
    confidenceBadge: 'High Match (90%)',
    badgeColor: '#059669',
    matchReason: 'Combined Match: Same Name + Mobile (+1 415-889-1200)',
    existingLead: {
      id: 'LD-99121',
      name: 'Sophia Chen',
      email: 'sophia.chen@techcorp.io',
      phone: '+1 415-889-1200',
      route: 'SFO ➔ HND',
      agent: 'Alex Miller',
      status: 'Contacted',
      source: 'Website',
      expectedValue: 8400,
      lastContact: '2026-08-20 11:30'
    },
    incomingLead: {
      id: 'LD-99145 (New Inquiry)',
      name: 'Sophia Chen',
      email: 'schen.personal@gmail.com',
      phone: '+1 415-889-1200',
      route: 'SFO ➔ TYO',
      agent: 'Unassigned',
      status: 'New Inquiry',
      source: 'Facebook Ad',
      expectedValue: 8400,
      lastContact: '2026-08-20 14:45'
    },
    detectedDate: '2026-08-20 14:45'
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function DuplicateLeadProtection() {
  const { showAlert } = useAlert();
  const [pairs, setPairs] = useState(DUPLICATE_PAIRS);
  const [selectedPair, setSelectedPair] = useState(DUPLICATE_PAIRS[0]);
  const [mergeModalOpen, setMergeModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);

  // Field selection state for merge
  const [mergeFields, setMergeFields] = useState({
    name: 'primary',
    email: 'primary',
    phone: 'primary',
    route: 'primary',
    agent: 'primary'
  });

  const handleMergeSubmit = () => {
    setPairs(pairs.filter(p => p.id !== selectedPair.id));
    setMergeModalOpen(false);
    showAlert(`✓ Successfully merged duplicate records into Primary ${selectedPair.existingLead.id}! No history lost.`, 'success');
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            🛡️
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Duplicate Lead Protection & Smart Customer Linking Engine
              </Typography>
              <Chip label="98.6% PREVENTION RATE" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#059669', color: '#FFF' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Real-time exact/combined matching, confidence scoring, side-by-side merge, and repeat inquiry linking
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="outlined" color="warning" startIcon={<WarningAmberIcon />} onClick={() => setWarningModalOpen(true)} sx={{ fontWeight: 800 }}>
            Simulate Duplicate Warning
          </Button>
          <DualClock client={{ timezone: 'America/New_York', label: 'Protection EST' }} />
        </Box>
      </Paper>

      {/* 5 DUPLICATE ANALYTICS KPI CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Duplicate Leads Detected', val: '142', color: '#3F51B5' },
          { label: 'Merged Leads', val: '128', color: '#059669' },
          { label: 'Customers Re-engaged', val: '89', color: '#7C3AED' },
          { label: 'Manual Review Pending', val: '14', color: '#D97706' },
          { label: 'Duplicate Prevention %', val: '98.6%', color: '#059669' }
        ].map((kpi, i) => (
          <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: kpi.color } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', display: 'block' }}>{kpi.label}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.2 }}>{kpi.val}</Typography>
          </Paper>
        ))}
      </Box>

      {/* DUPLICATE REVIEW QUEUE TABLE */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#3F51B5' }}>
            📋 Pending Duplicate Review Queue & Confidence Match Matrix
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#FFFFFF' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Pair ID</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Match Confidence</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Existing Customer / Lead</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Incoming Channel Inquiry</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Match Rule Reason</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pairs.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{p.id}</TableCell>
                  <TableCell>
                    <Chip label={p.confidenceBadge} size="small" sx={{ fontWeight: 900, bgcolor: p.badgeColor, color: '#FFF' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>
                    {p.existingLead.name} ({p.existingLead.id}) • Rep: {p.existingLead.agent}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {p.incomingLead.name} ({p.incomingLead.source})
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>
                    {p.matchReason}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<MergeTypeIcon />}
                      onClick={() => { setSelectedPair(p); setMergeModalOpen(true); }}
                      sx={{ fontWeight: 800, fontSize: '0.72rem' }}
                    >
                      Compare & Merge
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* REAL-TIME DUPLICATE WARNING POPUP SIMULATOR */}
      <Dialog
        open={warningModalOpen}
        onClose={() => setWarningModalOpen(false)}
        maxWidth="md"
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
        <DialogTitle sx={{ fontWeight: 900, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 1, py: 2, px: { xs: 2, sm: 3 }, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <WarningAmberIcon /> Potential Existing Customer / Lead Detected!
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
          <Alert severity="warning" sx={{ mb: 2, fontWeight: 700 }}>
            Exact Match Found: Email <b>harold.vance@embassy.gov</b> & Phone <b>+1 555-234-8901</b> already exists in Customer 360!
          </Alert>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#FEFCE8', borderColor: '#FDE047' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#D97706', mb: 1 }}>Existing Lead Profile Details:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>Customer Name: Ambassador Harold Vance</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
              Existing Lead ID: <b>LD-99120</b> • Assigned Agent: <b>Sarah Jenkins</b> • Status: <b>Quote Sent</b>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
              Travel Route: <b>DEL ➔ LHR ➔ JFK</b> • Expected Value: <b>$28,500</b> • Last Contact: <b>2026-08-20 10:15</b>
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ py: 2, px: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: 'background.paper', justifyContent: 'space-between' }}>
          <Button variant="outlined" color="primary" onClick={() => { setWarningModalOpen(false); showAlert('Navigating to existing Lead LD-99120 Customer 360 profile', 'info'); }}>
            View Existing Lead
          </Button>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" color="success" onClick={() => { setWarningModalOpen(false); setMergeModalOpen(true); }}>
              Merge into Existing Lead
            </Button>
            <Button variant="outlined" color="error" onClick={() => setWarningModalOpen(false)}>
              Cancel
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* SIDE-BY-SIDE MERGE COMPARISON SCREEN */}
      <Dialog
        open={mergeModalOpen}
        onClose={() => setMergeModalOpen(false)}
        maxWidth="lg"
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
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: { xs: 2, sm: 3 }, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <span>Side-by-Side Duplicate Merge Comparison Screen ({selectedPair?.id})</span>
          <Chip label="ZERO DATA LOSS GUARANTEED" size="small" color="success" sx={{ fontWeight: 900 }} />
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
          <Alert severity="info" sx={{ mb: 2.5, fontWeight: 700 }}>
            Select which field values to preserve in the final Primary Customer Record. All communication histories, quotes, bookings, payments, and audit timelines will be automatically combined into the unified Customer 360 profile.
          </Alert>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            {/* Primary Existing Record */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#EFF6FF', borderColor: '#BFDBFE' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#2563EB', mb: 1 }}>
                📌 Primary Existing Record ({selectedPair?.existingLead.id})
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Name: {selectedPair?.existingLead.name}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Email: {selectedPair?.existingLead.email}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Phone: {selectedPair?.existingLead.phone}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Route: {selectedPair?.existingLead.route}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Agent: {selectedPair?.existingLead.agent}</Typography>
            </Paper>

            {/* Incoming Duplicate Record */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#F0FDF4', borderColor: '#86EFAC' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#059669', mb: 1 }}>
                📥 Incoming Duplicate Record ({selectedPair?.incomingLead.id})
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Name: {selectedPair?.incomingLead.name}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Email: {selectedPair?.incomingLead.email}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Phone: {selectedPair?.incomingLead.phone}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Route: {selectedPair?.incomingLead.route}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Source: {selectedPair?.incomingLead.source}</Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ py: 2, px: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: 'background.paper' }}>
          <Button onClick={() => setMergeModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleMergeSubmit} sx={{ fontWeight: 800 }}>
            Execute Safe Record Merge & Preserve All History
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
