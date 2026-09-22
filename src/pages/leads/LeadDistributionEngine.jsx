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
import DialogContentText from '@mui/material/DialogContentText';
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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';

// Icons
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import GroupsIcon from '@mui/icons-material/Groups';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// DATASETS
// ==========================================

const AGENT_WORKLOAD = [
  { id: 1, name: 'Sarah Jenkins', team: 'Alpha Sales', activeLeads: 18, pendingFollowups: 4, pendingQuotes: 3, todayBookings: 2, maxCapacity: 30, status: 'BUSY', color: '#D97706' },
  { id: 2, name: 'Alex Miller', team: 'Corporate Sales', activeLeads: 12, pendingFollowups: 2, pendingQuotes: 1, todayBookings: 3, maxCapacity: 30, status: 'AVAILABLE', color: '#059669' },
  { id: 3, name: 'Michael Chang', team: 'Escalation Team', activeLeads: 29, pendingFollowups: 8, pendingQuotes: 5, todayBookings: 1, maxCapacity: 30, status: 'AT CAPACITY', color: '#DC2626' },
  { id: 4, name: 'Maria Santos', team: 'Europe Desk', activeLeads: 8, pendingFollowups: 1, pendingQuotes: 2, todayBookings: 4, maxCapacity: 30, status: 'AVAILABLE', color: '#059669' },
  { id: 5, name: 'Carlos Ticketing', team: 'GDS Issuance', activeLeads: 15, pendingFollowups: 3, pendingQuotes: 0, todayBookings: 5, maxCapacity: 30, status: 'AVAILABLE', color: '#059669' }
];

const ROUTING_RULES = [
  { id: 1, name: 'USA Destination Rule', priority: 1, type: 'Skill-Based', condition: 'Destination == USA / Canada', action: 'Assign to USA Sales Team', enabled: true },
  { id: 2, name: 'Multi-City Expert Rule', priority: 2, type: 'Skill-Based', condition: 'Trip Type == Multi-City', action: 'Assign to Flight Expert Desk', enabled: true },
  { id: 3, name: 'VIP Lead Priority Rule', priority: 3, type: 'VIP Priority', condition: 'Score > 90 OR Priority == VIP', action: 'Assign to Senior Agent / Expert TL', enabled: true },
  { id: 4, name: 'Workload Balancing', priority: 4, type: 'Capacity-Based', condition: 'Agent Active Leads >= 30', action: 'Reroute to Next Available Agent', enabled: true },
  { id: 5, name: 'Default Round Robin', priority: 5, type: 'Round Robin', condition: 'Fallback Default', action: 'Sequential Agent Rotation (A ➔ B ➔ C)', enabled: true }
];

const ASSIGNMENT_HISTORY = [
  { id: 'LOG-991', leadId: 'LD-99120', prevAgent: 'Unassigned', newAgent: 'Sarah Jenkins', method: 'Skill-Based (USA Rule)', assignedBy: 'System Auto-Router', time: '2026-08-20 10:16', reason: 'Matched USA Destination Skill' },
  { id: 'LOG-992', leadId: 'LD-99121', prevAgent: 'Unassigned', newAgent: 'Alex Miller', method: 'Round Robin', assignedBy: 'System Auto-Router', time: '2026-08-20 11:30', reason: 'Next Agent in Sequential Rotation' },
  { id: 'LOG-993', leadId: 'LD-99118', prevAgent: 'Michael Chang', newAgent: 'Maria Santos', method: 'Capacity Rebalance', assignedBy: 'Michael Chang (TL)', time: '2026-08-20 12:05', reason: 'Michael reached Max Capacity (30)' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function LeadDistributionEngine() {
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);
  const [agents, setAgents] = useState(AGENT_WORKLOAD);
  const [rules, setRules] = useState(ROUTING_RULES);
  const [history, setHistory] = useState(ASSIGNMENT_HISTORY);

  // Modals
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState('LD-99120');
  const [targetAgent, setTargetAgent] = useState('Alex Miller');
  const [reassignReason, setReassignReason] = useState('Manual Load Balancing by TL');

  const handleToggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    showAlert(`Routing Rule #${id} status updated`, 'info');
  };

  const handleManualReassign = () => {
    const newLog = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      leadId: selectedLeadId,
      prevAgent: 'Sarah Jenkins',
      newAgent: targetAgent,
      method: 'Manual Reassignment',
      assignedBy: 'Team Leader',
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      reason: reassignReason
    };
    setHistory([newLog, ...history]);
    setReassignModalOpen(false);
    showAlert(`✓ Lead ${selectedLeadId} reassigned to ${targetAgent} successfully!`, 'success');
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            🔀
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Lead Distribution & Workload Routing Engine
              </Typography>
              <Chip label="AUTOMATED ROUTING ACTIVE" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#059669', color: '#FFF' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Priority Evaluation: Skill-Based ➔ VIP Rules ➔ Capacity-Based ➔ Round Robin ➔ Performance
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button variant="outlined" color="primary" startIcon={<SwapHorizIcon />} onClick={() => setReassignModalOpen(true)} sx={{ fontWeight: 800 }}>
            Manual / Bulk Reassign
          </Button>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setRuleModalOpen(true)} sx={{ fontWeight: 800 }}>
            + Create Routing Rule
          </Button>
          <DualClock client={{ timezone: 'America/New_York', label: 'Router EST' }} />
        </Box>
      </Paper>

      {/* 7 DISTRIBUTION KPI CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Incoming Leads', val: '142', color: '#3F51B5' },
          { label: 'Auto Assigned', val: '130', color: '#059669' },
          { label: 'Unassigned', val: '12', color: '#DC2626' },
          { label: 'Round Robin', val: '65', color: '#0284C7' },
          { label: 'Skill-Based', val: '42', color: '#7C3AED' },
          { label: 'Capacity-Based', val: '18', color: '#C59B27' },
          { label: 'Performance-Based', val: '5', color: '#D97706' }
        ].map((kpi, i) => (
          <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: kpi.color } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', display: 'block' }}>{kpi.label}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.2 }}>{kpi.val}</Typography>
          </Paper>
        ))}
      </Box>

      {/* TABS CONTROL */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ px: 2, '& .MuiTab-root': { fontWeight: 800, fontSize: '0.78rem' } }}>
          <Tab label="🟢 Agent Workload & Capacity Monitor" />
          <Tab label="⚙️ Priority Routing Rules (5-Level Engine)" />
          <Tab label="📜 Assignment History & Audit Trail" />
        </Tabs>
      </Paper>

      {/* TAB 1: AGENT WORKLOAD & CAPACITY MONITOR */}
      {currentTab === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {agents.map((agent) => {
            const pct = Math.round((agent.activeLeads / agent.maxCapacity) * 100);
            return (
              <Paper key={agent.id} elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary' }}>
                    {agent.name}
                  </Typography>
                  <Chip label={agent.status} size="small" sx={{ fontWeight: 900, bgcolor: agent.color, color: '#FFF', fontSize: '0.65rem' }} />
                </Box>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1.5 }}>
                  Team: <b>{agent.team}</b>
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>Lead Capacity Utilization:</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: agent.color }}>{agent.activeLeads} / {agent.maxCapacity} ({pct}%)</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={pct} sx={{ height: 8, borderRadius: 4, bgcolor: '#F1F5F9', '& .MuiLinearProgress-bar': { bgcolor: agent.color } }} />
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, textAlign: 'center' }}>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Follow-ups</Typography><Typography variant="body2" sx={{ fontWeight: 900 }}>{agent.pendingFollowups}</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Quotes</Typography><Typography variant="body2" sx={{ fontWeight: 900 }}>{agent.pendingQuotes}</Typography></Box>
                  <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Bookings Today</Typography><Typography variant="body2" sx={{ fontWeight: 900, color: '#059669' }}>{agent.todayBookings}</Typography></Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* TAB 2: PRIORITY ROUTING RULES */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Order Priority</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Rule Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Routing Strategy</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Evaluated Condition</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Automated Action</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Engine Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell><Chip label={`Priority #${r.priority}`} size="small" color="primary" sx={{ fontWeight: 900 }} /></TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{r.name}</TableCell>
                    <TableCell><Chip label={r.type} size="small" variant="outlined" sx={{ fontWeight: 800 }} /></TableCell>
                    <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace', color: 'primary.main' }}>{r.condition}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#059669' }}>{r.action}</TableCell>
                    <TableCell align="right">
                      <FormControlLabel control={<Switch checked={r.enabled} onChange={() => handleToggleRule(r.id)} color="success" />} label={r.enabled ? 'Active' : 'Disabled'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* TAB 3: ASSIGNMENT HISTORY & AUDIT TRAIL */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Log ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Lead ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Prev ➔ New Agent</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Assignment Method</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Assigned By</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Reason / Trigger</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.id} hover>
                    <TableCell sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{h.id}</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'primary.main' }}>{h.leadId}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{h.prevAgent} ➔ <span style={{ color: '#059669' }}>{h.newAgent}</span></TableCell>
                    <TableCell><Chip label={h.method} size="small" color="secondary" sx={{ fontWeight: 800 }} /></TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{h.assignedBy}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{h.reason}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{h.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* MANUAL / BULK REASSIGNMENT DIALOG */}
      <Dialog
        open={reassignModalOpen}
        onClose={() => setReassignModalOpen(false)}
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
          Swap / Manual Lead Reassignment
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
            <TextField label="Target Lead ID" size="small" value={selectedLeadId} onChange={(e) => setSelectedLeadId(e.target.value)} fullWidth />
            <TextField select label="Reassign To Agent" size="small" value={targetAgent} onChange={(e) => setTargetAgent(e.target.value)} fullWidth>
              {agents.map((a) => <MenuItem key={a.name} value={a.name}>{a.name} ({a.team} - {a.status})</MenuItem>)}
            </TextField>
            <TextField label="Reassignment Reason *" multiline rows={2} value={reassignReason} onChange={(e) => setReassignReason(e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ py: 2, px: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: 'background.paper' }}>
          <Button onClick={() => setReassignModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleManualReassign} sx={{ fontWeight: 800 }}>Execute Reassignment</Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
