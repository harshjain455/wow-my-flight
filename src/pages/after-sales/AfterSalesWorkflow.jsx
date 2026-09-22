import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';

// Icons
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AppModal from '../../components/AppModal';
import AppTable from '../../components/AppTable';
import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

export const AFTER_SALES_CATEGORIES = [
  { id: 'ALL', label: 'All Operations', icon: <SupportAgentIcon fontSize="small" /> },
  { id: 'Changes', label: 'Changes', icon: <SwapHorizIcon fontSize="small" /> },
  { id: 'Cancellation', label: 'Cancellation', icon: <CancelIcon fontSize="small" /> },
  { id: 'Refund', label: 'Refund', icon: <CurrencyExchangeIcon fontSize="small" /> },
  { id: 'Reissue', label: 'Reissue', icon: <ConfirmationNumberIcon fontSize="small" /> },
  { id: 'Disruption', label: 'Disruption', icon: <ReportProblemIcon fontSize="small" /> },
];

export const SUB_TYPES_BY_CATEGORY = {
  Changes: ['Date Change', 'Route Change', 'Name Correction', 'Passenger Correction'],
  Cancellation: ['Customer Cancellation', 'Airline Cancellation', 'Supplier Cancellation'],
  Refund: ['Full Refund', 'Partial Refund', 'Supplier Refund', 'Manual Refund'],
  Reissue: ['Voluntary', 'Involuntary'],
  Disruption: ['Schedule Change', 'Flight Cancellation', 'Misconnection', 'Airline Disruption'],
};

export const CASE_STATUSES = ['Open', 'In Progress', 'Pending Airline', 'Approved', 'Completed', 'Rejected', 'Escalated'];

export const TEAM_OWNERS = [
  'Maria Santos (Ops)',
  'Omar Farouq (Ticketing)',
  'Sarah Jenkins (Support)',
  'Karan Singh (Flight Expert)',
  'Unassigned (Queue)'
];

export const DEMO_AFTER_SALES_CASES = [
  {
    id: 'AS-901',
    pnr: 'SAB89A',
    bookingId: 'BK-1001',
    customerName: 'M. Chen',
    category: 'Changes',
    subType: 'Date Change',
    route: 'JFK → LHR',
    airline: 'British Airways (BA 117)',
    owner: 'Maria Santos (Ops)',
    status: 'In Progress',
    priority: 'High',
    sla: '35 mins remaining',
    isSlaUrgent: true,
    createdAt: '2026-08-20 10:15 EST',
    feeAmount: '$150.00 (Airline Penalty)',
    history: [
      { id: 'h1', timestamp: '2026-08-20 10:15 EST', author: 'M. Chen (Client)', action: 'Case Opened', notes: 'Client requested date change from 15 Oct to 22 Oct 2026 due to business meeting reschedule.' },
      { id: 'h2', timestamp: '2026-08-20 10:30 EST', author: 'Maria Santos (Ops)', action: 'Sabre GDS Quoted', notes: 'Fare difference is $120 + $30 BA change fee. Sent quote to client for confirmation.' },
    ]
  },
  {
    id: 'AS-902',
    pnr: '1A982B',
    bookingId: 'BK-1002',
    customerName: 'A. Lee',
    category: 'Refund',
    subType: 'Full Refund',
    route: 'DEL → SIN',
    airline: 'Singapore Airlines (SQ 407)',
    owner: 'Omar Farouq (Ticketing)',
    status: 'Pending Airline',
    priority: 'Urgent',
    sla: '1h 10m remaining',
    isSlaUrgent: false,
    createdAt: '2026-08-19 14:00 IST',
    feeAmount: '$1,430.00 (Pending Refund)',
    history: [
      { id: 'h1', timestamp: '2026-08-19 14:00 IST', author: 'A. Lee (Client)', action: 'Refund Claim Submitted', notes: 'Medical emergency cancellation request attached doctor note.' },
      { id: 'h2', timestamp: '2026-08-19 16:45 IST', author: 'Omar Farouq (Ticketing)', action: 'Waiver Submitted to SQ', notes: 'Medical waiver request submitted to SQ BSPLink refund portal. Waiver ref #MED-9921.' },
    ]
  },
  {
    id: 'AS-903',
    pnr: 'QRS90G',
    bookingId: 'BK-1003',
    customerName: 'K. Singh',
    category: 'Disruption',
    subType: 'Schedule Change',
    route: 'DXB → LHR',
    airline: 'Emirates (EK 003)',
    owner: 'Sarah Jenkins (Support)',
    status: 'Open',
    priority: 'Critical',
    sla: '18 mins remaining',
    isSlaUrgent: true,
    createdAt: '2026-08-20 12:40 GST',
    feeAmount: '$0.00 (Airline Involuntary)',
    history: [
      { id: 'h1', timestamp: '2026-08-20 12:40 GST', author: 'Sabre GDS Queue 8', action: 'UN/TK Schedule Change Detected', notes: 'EK 003 departure moved 4 hours earlier (from 14:00 to 10:00). Transit connection disrupted.' },
    ]
  },
  {
    id: 'AS-904',
    pnr: 'AA771X',
    bookingId: 'BK-1004',
    customerName: 'R. Sharma',
    category: 'Reissue',
    subType: 'Voluntary',
    route: 'BOM → JFK',
    airline: 'American Airlines (AA 293)',
    owner: 'Maria Santos (Ops)',
    status: 'Approved',
    priority: 'Medium',
    sla: '4h 00m remaining',
    isSlaUrgent: false,
    createdAt: '2026-08-18 09:30 IST',
    feeAmount: '$210.00 (Reissue Fee)',
    history: [
      { id: 'h1', timestamp: '2026-08-18 09:30 IST', author: 'R. Sharma', action: 'Cabin Class Upgrade Request', notes: 'Upgraded from Economy to Premium Economy.' },
      { id: 'h2', timestamp: '2026-08-18 11:20 IST', author: 'Maria Santos (Ops)', action: 'Reissue Approved', notes: 'Ticket reissued on AA stock 001-998234120.' },
    ]
  },
  {
    id: 'AS-905',
    pnr: 'LH441P',
    bookingId: 'BK-1005',
    customerName: 'H. Miller',
    category: 'Cancellation',
    subType: 'Customer Cancellation',
    route: 'FRA → ORD',
    airline: 'Lufthansa (LH 430)',
    owner: 'Omar Farouq (Ticketing)',
    status: 'Completed',
    priority: 'Low',
    sla: 'Completed on 17 Aug',
    isSlaUrgent: false,
    createdAt: '2026-08-16 11:00 CET',
    feeAmount: '$300.00 (Cancellation Penalty)',
    history: [
      { id: 'h1', timestamp: '2026-08-16 11:00 CET', author: 'H. Miller', action: 'Cancellation Requested', notes: 'Cancelled flight 48 hours prior to departure.' },
      { id: 'h2', timestamp: '2026-08-17 10:15 CET', author: 'Omar Farouq', action: 'Booking Voided & Credit Issued', notes: 'PNR cancelled, travel credit voucher issued to customer email.' },
    ]
  },
  {
    id: 'AS-906',
    pnr: 'QR005M',
    bookingId: 'BK-1006',
    customerName: 'S. Al-Mansoor',
    category: 'Disruption',
    subType: 'Misconnection',
    route: 'DOH → LHR → JFK',
    airline: 'Qatar Airways (QR 005)',
    owner: 'Sarah Jenkins (Support)',
    status: 'Escalated',
    priority: 'Critical',
    sla: 'EXPIRED (SLA Alert)',
    isSlaUrgent: true,
    createdAt: '2026-08-20 06:15 GST',
    feeAmount: '$0.00 (Duty of Care Claim)',
    history: [
      { id: 'h1', timestamp: '2026-08-20 06:15 GST', author: 'Airport Desk DOH', action: 'Inbound Flight Delayed 90m', notes: 'Pax missed connection QR 005 at Heathrow. Hotel voucher & rebooking required.' },
    ]
  },
  {
    id: 'AS-907',
    pnr: 'AF882Z',
    bookingId: 'BK-1007',
    customerName: 'J. Dupont',
    category: 'Changes',
    subType: 'Name Correction',
    route: 'CDG → DXB',
    airline: 'Air France (AF 662)',
    owner: 'Maria Santos (Ops)',
    status: 'In Progress',
    priority: 'Medium',
    sla: '2h 45m remaining',
    isSlaUrgent: false,
    createdAt: '2026-08-20 11:10 CET',
    feeAmount: '$50.00 (Name Correction Fee)',
    history: [
      { id: 'h1', timestamp: '2026-08-20 11:10 CET', author: 'J. Dupont', action: 'Name Correction Requested', notes: 'Passport shows Jean-Luc Dupont (ticket had Jean Dupont).' },
    ]
  }
];

export default function AfterSalesWorkflow() {
  const alert = useAlert();
  const showAlert = alert?.showAlert || (() => {});

  const [cases, setCases] = useState(DEMO_AFTER_SALES_CASES);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedCase, setSelectedCase] = useState(null); // Detail modal
  const [createModalOpen, setCreateModalOpen] = useState(false); // New Case modal

  // New Case Form State
  const [newCaseData, setNewCaseData] = useState({
    pnr: '',
    bookingId: '',
    customerName: '',
    category: 'Changes',
    subType: 'Date Change',
    route: '',
    airline: '',
    owner: 'Maria Santos (Ops)',
    priority: 'High',
    sla: '2h 00m remaining',
    feeAmount: '$0.00',
    notes: ''
  });

  // New History Entry State
  const [newHistoryNote, setNewHistoryNote] = useState('');
  const [newHistoryAuthor, setNewHistoryAuthor] = useState('Current Agent');

  // Filter cases logic
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchCat = activeCategory === 'ALL' ? true : item.category === activeCategory;
      const matchSub = !selectedSubType ? true : item.subType === selectedSubType;
      const matchStat = !selectedStatus ? true : item.status === selectedStatus;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        (item.id || '').toLowerCase().includes(q) ||
        (item.pnr || '').toLowerCase().includes(q) ||
        (item.bookingId || '').toLowerCase().includes(q) ||
        (item.customerName || '').toLowerCase().includes(q) ||
        (item.subType || '').toLowerCase().includes(q) ||
        (item.owner || '').toLowerCase().includes(q);

      return matchCat && matchSub && matchStat && matchSearch;
    });
  }, [cases, activeCategory, selectedSubType, selectedStatus, searchQuery]);

  // Handle owner change
  const handleOwnerChange = (caseId, newOwner) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedHistory = [
          ...c.history,
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            author: 'System',
            action: 'Owner Reassigned',
            notes: `Case owner updated to ${newOwner}`
          }
        ];
        return { ...c, owner: newOwner, history: updatedHistory };
      }
      return c;
    }));
    showAlert(`Case ${caseId} assigned to ${newOwner}`, 'success');
  };

  // Handle status change
  const handleStatusChange = (caseId, newStatus) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        const updatedHistory = [
          ...c.history,
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            author: 'Current Agent',
            action: `Status Changed to ${newStatus}`,
            notes: `Case status transitioned to "${newStatus}"`
          }
        ];
        return { ...c, status: newStatus, history: updatedHistory };
      }
      return c;
    }));

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(prev => ({
        ...prev,
        status: newStatus,
        history: [
          ...prev.history,
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            author: 'Current Agent',
            action: `Status Changed to ${newStatus}`,
            notes: `Case status transitioned to "${newStatus}"`
          }
        ]
      }));
    }

    showAlert(`Case ${caseId} status updated to "${newStatus}"`, 'success');
  };

  // Add History Note to Selected Case
  const handleAddHistoryNote = () => {
    if (!newHistoryNote.trim()) {
      showAlert('Please enter note text before adding to history timeline.', 'warning');
      return;
    }

    const newEntry = {
      id: `h-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      author: newHistoryAuthor || 'Current Agent',
      action: 'Agent Note Added',
      notes: newHistoryNote
    };

    setCases(prev => prev.map(c => {
      if (c.id === selectedCase.id) {
        return { ...c, history: [...c.history, newEntry] };
      }
      return c;
    }));

    setSelectedCase(prev => ({
      ...prev,
      history: [...prev.history, newEntry]
    }));

    setNewHistoryNote('');
    showAlert('Note added to case complete history timeline.', 'success');
  };

  // Submit Create New Case
  const handleCreateCaseSubmit = () => {
    if (!newCaseData.pnr || !newCaseData.customerName) {
      showAlert('PNR and Customer Name are required to open an After-Sales case.', 'warning');
      return;
    }

    const generatedId = `AS-${900 + cases.length + 1}`;
    const createdCase = {
      id: generatedId,
      pnr: newCaseData.pnr,
      bookingId: newCaseData.bookingId || `BK-${1000 + cases.length + 1}`,
      customerName: newCaseData.customerName,
      category: newCaseData.category,
      subType: newCaseData.subType,
      route: newCaseData.route || 'JFK → LHR',
      airline: newCaseData.airline || 'Partner Airline',
      owner: newCaseData.owner,
      status: 'Open',
      priority: newCaseData.priority,
      sla: newCaseData.sla,
      isSlaUrgent: newCaseData.priority === 'High' || newCaseData.priority === 'Critical',
      createdAt: new Date().toLocaleString(),
      feeAmount: newCaseData.feeAmount,
      history: [
        {
          id: `h1`,
          timestamp: new Date().toLocaleString(),
          author: 'Ops Agent',
          action: 'Case Created',
          notes: newCaseData.notes || `Initial ${newCaseData.category} (${newCaseData.subType}) case logged.`
        }
      ]
    };

    setCases(prev => [createdCase, ...prev]);
    setCreateModalOpen(false);
    showAlert(`🎉 New After-Sales Case ${generatedId} (${newCaseData.subType}) successfully created!`, 'success');
  };

  // Table Columns Definition
  const columns = [
    {
      id: 'id',
      label: 'Case ID',
      render: (row) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary.main' }}>
          {row.id}
        </Typography>
      ),
    },
    {
      id: 'pnr',
      label: 'PNR & Booking',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: '#0F172A' }}>
            PNR: {row.pnr}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            {row.bookingId}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'customer',
      label: 'Customer & Route',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {row.customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
            <FlightTakeoffIcon sx={{ fontSize: 12 }} /> {row.route}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'type',
      label: 'Category & Sub-Type',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
          <Chip size="small" label={row.category} color="primary" variant="outlined" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 800, width: 'fit-content' }} />
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155' }}>
            ● {row.subType}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'owner',
      label: 'Owner',
      render: (row) => (
        <FormControl size="small" variant="standard" onClick={(e) => e.stopPropagation()}>
          <Select
            value={row.owner}
            onChange={(e) => handleOwnerChange(row.id, e.target.value)}
            disableUnderline
            sx={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#334155',
              bgcolor: '#F8FAFC',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              px: 1,
              py: 0.2,
              height: 26,
            }}
          >
            {TEAM_OWNERS.map((owner) => (
              <MenuItem key={owner} value={owner} sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {owner}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <FormControl size="small" variant="standard" onClick={(e) => e.stopPropagation()}>
          <Select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            disableUnderline
            sx={{
              fontSize: '0.72rem',
              fontWeight: 800,
              bgcolor:
                row.status === 'Completed' ? '#DCFCE7' :
                row.status === 'Approved' ? '#E0F2FE' :
                row.status === 'Escalated' ? '#FEE2E2' : '#FEF3C7',
              color:
                row.status === 'Completed' ? '#15803D' :
                row.status === 'Approved' ? '#0369A1' :
                row.status === 'Escalated' ? '#B91C1C' : '#B45309',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              px: 1,
              py: 0.2,
              height: 26,
            }}
          >
            {CASE_STATUSES.map((st) => (
              <MenuItem key={st} value={st} sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                {st}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      id: 'sla',
      label: 'SLA Target',
      render: (row) => (
        <Chip
          size="small"
          label={row.sla}
          color={row.isSlaUrgent ? 'error' : 'default'}
          sx={{
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 800,
            bgcolor: row.isSlaUrgent ? '#FEE2E2' : '#F1F5F9',
            color: row.isSlaUrgent ? '#B91C1C' : '#475569',
          }}
        />
      ),
    },
    {
      id: 'actions',
      label: 'Action',
      render: (row) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<HistoryIcon sx={{ fontSize: 13 }} />}
          sx={{ fontSize: '0.68rem', fontWeight: 800, py: 0.3 }}
          onClick={() => setSelectedCase(row)}
        >
          View Case & History
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ pb: 4 }}>
      {/* Top Bar Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: 'primary.50',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <SupportAgentIcon sx={{ fontSize: 30 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                AFTER-SALES OPERATIONAL WORKFLOW
              </Typography>
              <Chip size="small" label="Operations & Post-Booking Hub" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Dedicated workflow for Changes, Cancellations, Refunds, Reissues & Flight Disruptions with SLA Tracking & Complete History Logs.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ fontWeight: 800, px: 2.5, borderRadius: 2, textTransform: 'none' }}
          >
            Create New After-Sales Case
          </Button>
        </Box>
      </Paper>

      {/* KPI Cards Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#EFF6FF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>ACTIVE AFTER-SALES CASES</Typography>
            <SupportAgentIcon sx={{ color: '#2563EB' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1D4ED8' }}>{cases.length}</Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>Across 5 Operational Workflows</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FEF2F2' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>URGENT SLA ALERTS</Typography>
            <AccessTimeIcon sx={{ color: '#DC2626' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#B91C1C' }}>
            {cases.filter(c => c.isSlaUrgent).length}
          </Typography>
          <Typography variant="caption" color="error.main" sx={{ fontWeight: 800 }}>Action needed within SLA</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#F0FDF4' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>REFUNDS & REISSUES</Typography>
            <CurrencyExchangeIcon sx={{ color: '#16A34A' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#15803D' }}>
            {cases.filter(c => c.category === 'Refund' || c.category === 'Reissue').length}
          </Typography>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>Active financial updates</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFBEB' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>AIRLINE DISRUPTIONS</Typography>
            <ReportProblemIcon sx={{ color: '#D97706' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#B45309' }}>
            {cases.filter(c => c.category === 'Disruption').length}
          </Typography>
          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 800 }}>Schedule & Misconnections</Typography>
        </Paper>
      </Box>

      {/* Main Content Area */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        {/* Category Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs
            value={activeCategory}
            onChange={(e, val) => {
              setActiveCategory(val);
              setSelectedSubType('');
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 40,
              '& .MuiTab-root': {
                minHeight: 40,
                py: 0.5,
                px: 2,
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'none',
              },
            }}
          >
            {AFTER_SALES_CATEGORIES.map((cat) => (
              <Tab
                key={cat.id}
                icon={cat.icon}
                iconPosition="start"
                label={`${cat.label} (${cat.id === 'ALL' ? cases.length : cases.filter(c => c.category === cat.id).length})`}
                value={cat.id}
              />
            ))}
          </Tabs>
        </Box>

        {/* Filter Controls Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Search Case ID, PNR, Customer, Owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 280, '& .MuiInputBase-root': { fontSize: '0.8rem', height: 36 } }}
          />

          {/* Sub-type Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: 200, '& .MuiInputBase-root': { height: 36, fontSize: '0.8rem' } }}>
            <InputLabel>Sub-Type Filter</InputLabel>
            <Select
              value={selectedSubType}
              label="Sub-Type Filter"
              onChange={(e) => setSelectedSubType(e.target.value)}
            >
              <MenuItem value="">
                <em>All Sub-Types</em>
              </MenuItem>
              {activeCategory !== 'ALL' && SUB_TYPES_BY_CATEGORY[activeCategory] ? (
                SUB_TYPES_BY_CATEGORY[activeCategory].map((sub) => (
                  <MenuItem key={sub} value={sub} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    {sub}
                  </MenuItem>
                ))
              ) : (
                Object.values(SUB_TYPES_BY_CATEGORY).flat().map((sub) => (
                  <MenuItem key={sub} value={sub} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                    {sub}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Status Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: 160, '& .MuiInputBase-root': { height: 36, fontSize: '0.8rem' } }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={selectedStatus}
              label="Status Filter"
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              {CASE_STATUSES.map((st) => (
                <MenuItem key={st} value={st} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {st}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(selectedSubType || selectedStatus || searchQuery) && (
            <Button
              size="small"
              onClick={() => {
                setSelectedSubType('');
                setSelectedStatus('');
                setSearchQuery('');
              }}
              sx={{ fontWeight: 800, textTransform: 'none', fontSize: '0.75rem' }}
            >
              Reset Filters
            </Button>
          )}
        </Box>

        {/* Table View */}
        {filteredCases.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
              No After-Sales cases match the selected filter criteria.
            </Typography>
          </Box>
        ) : (
          <AppTable
            columns={columns}
            data={filteredCases}
            count={filteredCases.length}
            page={0}
            rowsPerPage={25}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
            hidePagination
          />
        )}
      </Paper>

      {/* ─── CASE DETAILS & COMPLETE HISTORY MODAL ─── */}
      <AppModal
        open={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        title={selectedCase ? `After-Sales Case #${selectedCase.id} — ${selectedCase.subType}` : ''}
        maxWidth="md"
        actions={
          <Button variant="outlined" onClick={() => setSelectedCase(null)}>
            Close Case Detail
          </Button>
        }
      >
        {selectedCase && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Summary Bar */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2} sx={{ fontSize: '0.85rem' }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>PNR & Booking ID:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
                    {selectedCase.pnr} ({selectedCase.bookingId})
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Passenger:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {selectedCase.customerName}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Airline & Sector:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {selectedCase.airline}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Fee / Penalty / Amount:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: 'success.main' }}>
                    {selectedCase.feeAmount}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Assigned Owner:</Typography>
                  <Select
                    size="small"
                    fullWidth
                    value={selectedCase.owner}
                    onChange={(e) => handleOwnerChange(selectedCase.id, e.target.value)}
                    sx={{ mt: 0.5, bg: '#FFF', height: 32, fontSize: '0.8rem', fontWeight: 800 }}
                  >
                    {TEAM_OWNERS.map((o) => (
                      <MenuItem key={o} value={o} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{o}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Current Status:</Typography>
                  <Select
                    size="small"
                    fullWidth
                    value={selectedCase.status}
                    onChange={(e) => handleStatusChange(selectedCase.id, e.target.value)}
                    sx={{ mt: 0.5, bg: '#FFF', height: 32, fontSize: '0.8rem', fontWeight: 800 }}
                  >
                    {CASE_STATUSES.map((st) => (
                      <MenuItem key={st} value={st} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{st}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>SLA Urgency:</Typography>
                  <Chip
                    size="small"
                    label={selectedCase.sla}
                    color={selectedCase.isSlaUrgent ? 'error' : 'default'}
                    sx={{ mt: 0.8, fontWeight: 900 }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Complete History Timeline Section */}
            <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <HistoryIcon color="primary" />
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  📜 COMPLETE CASE HISTORY & AUDIT LOG ({selectedCase.history?.length || 0} Events)
                </Typography>
              </Box>

              {/* History Event Cards */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {selectedCase.history?.map((evt, idx) => (
                  <Paper key={evt.id || idx} elevation={0} sx={{ p: 1.8, bgcolor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip size="small" label={evt.action} color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          {evt.author}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {evt.timestamp}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: '#334155', mt: 0.5, whiteSpace: 'pre-wrap' }}>
                      {evt.notes}
                    </Typography>
                  </Paper>
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Add New History Entry Form */}
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>
                ✍️ Add New Activity / Note to History Log:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Author / Agent Name"
                    value={newHistoryAuthor}
                    onChange={(e) => setNewHistoryAuthor(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Note / Waiver Code / History Entry..."
                    value={newHistoryNote}
                    onChange={(e) => setNewHistoryNote(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleAddHistoryNote}
                    sx={{ fontWeight: 800, borderRadius: 1.5, textTransform: 'none' }}
                  >
                    Post History Entry
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </AppModal>

      {/* ─── CREATE NEW AFTER-SALES CASE MODAL ─── */}
      <AppModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Log New After-Sales Operational Case"
        maxWidth="sm"
        actions={
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleCreateCaseSubmit} sx={{ fontWeight: 800 }}>
              Create After-Sales Case
            </Button>
          </Box>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={newCaseData.category}
                  label="Category"
                  onChange={(e) => {
                    const cat = e.target.value;
                    const defaultSub = SUB_TYPES_BY_CATEGORY[cat]?.[0] || '';
                    setNewCaseData(prev => ({ ...prev, category: cat, subType: defaultSub }));
                  }}
                >
                  {Object.keys(SUB_TYPES_BY_CATEGORY).map((cat) => (
                    <MenuItem key={cat} value={cat} sx={{ fontWeight: 700 }}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Sub-Type</InputLabel>
                <Select
                  value={newCaseData.subType}
                  label="Sub-Type"
                  onChange={(e) => setNewCaseData(prev => ({ ...prev, subType: e.target.value }))}
                >
                  {(SUB_TYPES_BY_CATEGORY[newCaseData.category] || []).map((sub) => (
                    <MenuItem key={sub} value={sub} sx={{ fontWeight: 700 }}>{sub}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="PNR Code"
                placeholder="e.g. SAB89A"
                value={newCaseData.pnr}
                onChange={(e) => setNewCaseData(prev => ({ ...prev, pnr: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Booking ID"
                placeholder="e.g. BK-1008"
                value={newCaseData.bookingId}
                onChange={(e) => setNewCaseData(prev => ({ ...prev, bookingId: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Customer Name"
                placeholder="e.g. Rajesh Kumar"
                value={newCaseData.customerName}
                onChange={(e) => setNewCaseData(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Route & Airline"
                placeholder="e.g. DEL → LHR (Air India)"
                value={newCaseData.route}
                onChange={(e) => setNewCaseData(prev => ({ ...prev, route: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Case Owner</InputLabel>
                <Select
                  value={newCaseData.owner}
                  label="Case Owner"
                  onChange={(e) => setNewCaseData(prev => ({ ...prev, owner: e.target.value }))}
                >
                  {TEAM_OWNERS.map((o) => (
                    <MenuItem key={o} value={o} sx={{ fontWeight: 700 }}>{o}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                size="small"
                fullWidth
                label="Fee / Penalty / Refund Amount"
                placeholder="e.g. $150.00"
                value={newCaseData.feeAmount}
                onChange={(e) => setNewCaseData(prev => ({ ...prev, feeAmount: e.target.value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                multiline
                rows={3}
                label="Initial Case History Notes"
                placeholder="Enter details of customer request, GDS notes, or waiver reference..."
                value={newCaseData.notes}
                onChange={(e) => setNewCaseData(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </Box>
      </AppModal>
    </Box>
  );
}
