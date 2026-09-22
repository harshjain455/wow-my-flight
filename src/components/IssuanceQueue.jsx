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
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import TableViewIcon from '@mui/icons-material/TableView';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import EditIcon from '@mui/icons-material/Edit';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';

import AppModal from './AppModal';
import AppTable from './AppTable';
import { TICKETING_STATUSES } from '../constants/mockData';
import { useAlert } from '../contexts/AlertContext';

export const TICKETING_STATUS_CONFIG = {
  'Pending Ticketing': { bg: '#FEF3C7', color: '#D97706', borderColor: '#FCD34D' },
  'Pending Payment': { bg: '#FFEDD5', color: '#EA580C', borderColor: '#FDBA74' },
  'Payment Confirmed': { bg: '#E0F2FE', color: '#0284C7', borderColor: '#7DD3FC' },
  'Ready to Issue': { bg: '#EEF2FF', color: '#4F46E5', borderColor: '#A5B4FC' },
  'Ticketing in Progress': { bg: '#F3E8FF', color: '#9333EA', borderColor: '#D8B4FE' },
  'Ticketed': { bg: '#DCFCE7', color: '#15803D', borderColor: '#86EFAC' },
  'Failed': { bg: '#FEE2E2', color: '#B91C1C', borderColor: '#FCA5A5' },
  'Manual Review': { bg: '#FEF9C3', color: '#A16207', borderColor: '#FDE047' },
};

export const DEMO_ISSUANCE_QUEUE = [
  {
    id: 'TK-451',
    bookingId: 'BK-1001',
    pnr: 'ABC12D',
    supplier: 'Sabre GDS (BA 012)',
    ticketNumber: '0172345678901',
    passenger: 'M. Chen',
    name: 'M. Chen',
    route: 'JFK → LHR',
    fare: '$1,050.00',
    taxes: '$200.00',
    commission: '$125.00 (10%)',
    amount: '$1,250.00',
    paymentStatus: 'Payment Confirmed',
    ticketStatus: 'Ready to Issue',
    timeLimit: '38 mins remaining (TTL Urgent)',
    ttl: '38 mins remaining',
    isTtlUrgent: true,
    issuingAgent: 'Omar Farouq',
    issueDateTime: '15 Oct 2026 14:20 EST',
    date: '15 Oct 2026',
    cabinClass: 'Business',
    passengers: 2,
  },
  {
    id: 'TK-452',
    bookingId: 'BK-1002',
    pnr: 'LMN78F',
    supplier: 'Amadeus 1A (SQ 618)',
    ticketNumber: '0179988776655',
    passenger: 'A. Lee',
    name: 'A. Lee',
    route: 'DEL → SIN',
    fare: '$450.00',
    taxes: '$80.00',
    commission: '$45.00 (8%)',
    amount: '$530.00',
    paymentStatus: 'Payment Confirmed',
    ticketStatus: 'Ticketing in Progress',
    timeLimit: '2h 15m remaining',
    ttl: '2h 15m remaining',
    isTtlUrgent: false,
    issuingAgent: 'Omar Farouq',
    issueDateTime: '20 Nov 2026 11:05 IST',
    date: '20 Nov 2026',
    cabinClass: 'Economy',
    passengers: 1,
  },
  {
    id: 'TK-453',
    bookingId: 'BK-1003',
    pnr: 'QRS90G',
    supplier: 'Emirates Direct API',
    ticketNumber: '1765432109876',
    passenger: 'K. Singh',
    name: 'K. Singh',
    route: 'DXB → LHR',
    fare: '$1,550.00',
    taxes: '$300.00',
    commission: '$185.00 (10%)',
    amount: '$1,850.00',
    paymentStatus: 'Payment Confirmed',
    ticketStatus: 'Ticketed',
    timeLimit: 'Ticketed on 05 Dec 2026',
    ttl: 'Ticketed',
    isTtlUrgent: false,
    issuingAgent: 'Sarah Jenkins',
    issueDateTime: '05 Dec 2026 09:15 GST',
    date: '05 Dec 2026',
    cabinClass: 'First Class',
    passengers: 3,
  },
  {
    id: 'TK-454',
    bookingId: 'BK-1004',
    pnr: 'SAB89X',
    supplier: 'Travelport GDS (AA 001)',
    ticketNumber: 'Unissued',
    passenger: 'R. Sharma',
    name: 'R. Sharma',
    route: 'BOM → JFK',
    fare: '$920.00',
    taxes: '$160.00',
    commission: '$75.00 (7%)',
    amount: '$1,080.00',
    paymentStatus: 'Pending Payment',
    ticketStatus: 'Pending Payment',
    timeLimit: '12h 40m remaining',
    ttl: '12h 40m remaining',
    isTtlUrgent: false,
    issuingAgent: 'Unassigned',
    issueDateTime: '—',
    date: '18 Dec 2026',
    cabinClass: 'Economy',
    passengers: 1,
  },
  {
    id: 'TK-455',
    bookingId: 'BK-1005',
    pnr: '1A990P',
    supplier: 'Consolidator AirDesk',
    ticketNumber: 'Unissued',
    passenger: 'J. Dupont',
    name: 'J. Dupont',
    route: 'CDG → DXB',
    fare: '$2,100.00',
    taxes: '$340.00',
    commission: '$210.00 (10%)',
    amount: '$2,440.00',
    paymentStatus: 'Payment Confirmed',
    ticketStatus: 'Pending Ticketing',
    timeLimit: '4h 10m remaining',
    ttl: '4h 10m remaining',
    isTtlUrgent: false,
    issuingAgent: 'Unassigned',
    issueDateTime: '—',
    date: '22 Dec 2026',
    cabinClass: 'Business',
    passengers: 2,
  },
  {
    id: 'TK-456',
    bookingId: 'BK-1006',
    pnr: 'FAIL99',
    supplier: 'Sabre GDS (LH 040)',
    ticketNumber: 'Failed (ERR-503)',
    passenger: 'H. Miller',
    name: 'H. Miller',
    route: 'FRA → ORD',
    fare: '$780.00',
    taxes: '$140.00',
    commission: '$60.00 (6%)',
    amount: '$920.00',
    paymentStatus: 'Payment Confirmed',
    ticketStatus: 'Failed',
    timeLimit: 'Expired / Re-issue required',
    ttl: 'EXPIRED',
    isTtlUrgent: true,
    issuingAgent: 'Omar Farouq',
    issueDateTime: '—',
    date: '24 Dec 2026',
    cabinClass: 'Economy',
    passengers: 1,
  },
  {
    id: 'TK-457',
    bookingId: 'BK-1007',
    pnr: 'REV44Z',
    supplier: 'Amadeus 1A (QR 005)',
    ticketNumber: 'Under Audit',
    passenger: 'S. Al-Mansoor',
    name: 'S. Al-Mansoor',
    route: 'DOH → LHR',
    fare: '$4,200.00',
    taxes: '$650.00',
    commission: '$420.00 (10%)',
    amount: '$4,850.00',
    paymentStatus: 'Payment Confirmed',
    ticketStatus: 'Manual Review',
    timeLimit: '1h 05m remaining',
    ttl: '1h 05m remaining',
    isTtlUrgent: true,
    issuingAgent: 'Sarah Jenkins',
    issueDateTime: '—',
    date: '28 Dec 2026',
    cabinClass: 'First Class',
    passengers: 4,
  },
];

export default function IssuanceQueue({
  items = DEMO_ISSUANCE_QUEUE,
  selectedId,
  onSelectIssue,
  onUpdateStatus
}) {
  const alert = useAlert();
  const showAlert = alert?.showAlert || (() => {});

  const [queueItems, setQueueItems] = useState(items);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  const [reviewItem, setReviewItem] = useState(null);

  // Sync state if external items change
  React.useEffect(() => {
    if (items) {
      setQueueItems(items);
    }
  }, [items]);

  const handleStatusChange = (bookingId, newStatus) => {
    setQueueItems((prev) =>
      prev.map((item) =>
        item.id === bookingId || item.bookingId === bookingId
          ? {
              ...item,
              ticketStatus: newStatus,
              issueDateTime:
                newStatus === 'Ticketed'
                  ? new Date().toLocaleString()
                  : item.issueDateTime,
            }
          : item
      )
    );

    if (onUpdateStatus) {
      onUpdateStatus(bookingId, newStatus);
    }

    showAlert(`Ticket status updated to "${newStatus}" for booking ${bookingId}`, 'success');
  };

  // Filter items based on selected status tab & search term
  const filteredItems = useMemo(() => {
    return queueItems.filter((item) => {
      const matchTab =
        activeTab === 'ALL' ? true : item.ticketStatus === activeTab;

      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        (item.pnr || '').toLowerCase().includes(q) ||
        (item.supplier || '').toLowerCase().includes(q) ||
        (item.bookingId || item.id || '').toLowerCase().includes(q) ||
        (item.ticketNumber || '').toLowerCase().includes(q) ||
        (item.passenger || item.name || '').toLowerCase().includes(q) ||
        (item.issuingAgent || '').toLowerCase().includes(q);

      return matchTab && matchSearch;
    });
  }, [queueItems, activeTab, searchQuery]);

  // Counts for each tab
  const getTabCount = (status) => {
    if (status === 'ALL') return queueItems.length;
    return queueItems.filter((i) => i.ticketStatus === status).length;
  };

  const renderStatusChip = (status, itemId) => {
    const config = TICKETING_STATUS_CONFIG[status] || {
      bg: '#F1F5F9',
      color: '#475569',
      borderColor: '#CBD5E1',
    };

    return (
      <FormControl size="small" variant="standard" onClick={(e) => e.stopPropagation()}>
        <Select
          value={status || 'Pending Ticketing'}
          onChange={(e) => handleStatusChange(itemId, e.target.value)}
          disableUnderline
          sx={{
            bgcolor: config.bg,
            color: config.color,
            border: `1px solid ${config.borderColor}`,
            borderRadius: 1.5,
            px: 1,
            py: 0.2,
            fontSize: '0.72rem',
            fontWeight: 800,
            height: 24,
            '.MuiSelect-select': {
              paddingRight: '18px !important',
              py: '2px !important',
            },
            '.MuiSelect-icon': {
              color: config.color,
              fontSize: '1rem',
            },
          }}
        >
          {TICKETING_STATUSES.map((st) => (
            <MenuItem key={st} value={st} sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
              {st}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  // Table Columns Definition
  const columns = [
    {
      id: 'pnr',
      label: 'PNR',
      render: (row) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary.main' }}>
          {row.pnr || '—'}
        </Typography>
      ),
    },
    {
      id: 'supplier',
      label: 'Supplier',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', display: 'block' }}>
          {row.supplier || 'Sabre GDS'}
        </Typography>
      ),
    },
    {
      id: 'bookingId',
      label: 'Booking ID',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
          {row.bookingId || row.id}
        </Typography>
      ),
    },
    {
      id: 'ticketNumber',
      label: 'Ticket Number',
      render: (row) => (
        <Typography
          variant="caption"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 800,
            color: row.ticketNumber?.includes('017') || row.ticketNumber?.includes('176') ? 'success.main' : 'text.secondary',
          }}
        >
          {row.ticketNumber || 'Unissued'}
        </Typography>
      ),
    },
    {
      id: 'passenger',
      label: 'Passenger',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>
            {row.passenger || row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ✈️ {row.route}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'fare',
      label: 'Fare',
      render: (row) => <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.fare || row.amount}</Typography>,
    },
    {
      id: 'taxes',
      label: 'Taxes',
      render: (row) => <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{row.taxes || '$150.00'}</Typography>,
    },
    {
      id: 'commission',
      label: 'Commission',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main' }}>
          {row.commission || '$100.00'}
        </Typography>
      ),
    },
    {
      id: 'paymentStatus',
      label: 'Payment Status',
      render: (row) => (
        <Chip
          size="small"
          label={row.paymentStatus || 'Payment Confirmed'}
          color={row.paymentStatus?.includes('Confirmed') || row.paymentStatus?.includes('PAID') ? 'success' : 'warning'}
          sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
        />
      ),
    },
    {
      id: 'ticketStatus',
      label: 'Ticket Status',
      render: (row) => renderStatusChip(row.ticketStatus, row.id),
    },
    {
      id: 'timeLimit',
      label: 'Time Limit (TTL)',
      render: (row) => (
        <Chip
          size="small"
          label={row.timeLimit || row.ttl || 'Standard'}
          color={row.isTtlUrgent || row.timeLimit?.includes('Urgent') || row.timeLimit?.includes('EXPIRED') ? 'error' : 'default'}
          sx={{
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 800,
            bgcolor: row.isTtlUrgent ? '#FEE2E2' : '#F1F5F9',
            color: row.isTtlUrgent ? '#B91C1C' : '#475569',
          }}
        />
      ),
    },
    {
      id: 'issuingAgent',
      label: 'Issuing Agent',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569' }}>
          {row.issuingAgent || 'Omar Farouq'}
        </Typography>
      ),
    },
    {
      id: 'issueDateTime',
      label: 'Issue Date/Time',
      render: (row) => (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {row.issueDateTime || '—'}
        </Typography>
      ),
    },
    {
      id: 'actions',
      label: 'Action',
      render: (row) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onSelectIssue && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<ConfirmationNumberIcon sx={{ fontSize: 13 }} />}
              sx={{ fontSize: '0.65rem', fontWeight: 800, py: 0.2, px: 0.8 }}
              onClick={() => onSelectIssue(row)}
            >
              Issue
            </Button>
          )}
          <IconButton size="small" onClick={() => setReviewItem(row)} title="View Details">
            <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* ─── HEADER BAR ─── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConfirmationNumberIcon color="primary" sx={{ fontSize: 24 }} />
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.3 }}>
              TICKETING DEPARTMENT QUEUE
            </Typography>
            <Chip
              label={`${queueItems.length} Bookings Total`}
              color="primary"
              size="small"
              icon={<NotificationsActiveIcon sx={{ fontSize: '0.85rem !important' }} />}
              sx={{ fontWeight: 800, fontSize: '0.7rem' }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.2, display: 'block' }}>
            Dedicated queue for Ticketing Operations — Filter by status, manage TTLs, update issue dates, and process e-tickets.
          </Typography>
        </Box>

        {/* View mode toggle & search */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TextField
            size="small"
            placeholder="Search PNR, Supplier, Passenger, Agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: 280, '& .MuiInputBase-root': { fontSize: '0.8rem', height: 34 } }}
          />

          <Box sx={{ display: 'flex', border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
            <Tooltip title="Table View (All 13 Fields)">
              <IconButton
                size="small"
                onClick={() => setViewMode('table')}
                sx={{
                  bgcolor: viewMode === 'table' ? 'primary.main' : 'transparent',
                  color: viewMode === 'table' ? '#FFF' : 'text.secondary',
                  borderRadius: 0,
                  '&:hover': { bgcolor: viewMode === 'table' ? 'primary.dark' : 'action.hover' },
                }}
              >
                <TableViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Card View Slider">
              <IconButton
                size="small"
                onClick={() => setViewMode('cards')}
                sx={{
                  bgcolor: viewMode === 'cards' ? 'primary.main' : 'transparent',
                  color: viewMode === 'cards' ? '#FFF' : 'text.secondary',
                  borderRadius: 0,
                  '&:hover': { bgcolor: viewMode === 'cards' ? 'primary.dark' : 'action.hover' },
                }}
              >
                <ViewCarouselIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* ─── STATUS FILTER TABS ─── */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 38,
            '& .MuiTab-root': {
              minHeight: 38,
              py: 0.5,
              px: 1.5,
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'none',
            },
          }}
        >
          <Tab label={`All Queue (${getTabCount('ALL')})`} value="ALL" />
          {TICKETING_STATUSES.map((st) => (
            <Tab
              key={st}
              label={`${st} (${getTabCount(st)})`}
              value={st}
              sx={{
                color: TICKETING_STATUS_CONFIG[st]?.color || 'inherit',
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Box sx={{ py: 5, textAlign: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 800 }}>
            No bookings found matching "{activeTab === 'ALL' ? searchQuery : activeTab}"
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select another status tab or clear search query to view bookings.
          </Typography>
        </Box>
      )}

      {/* ─── TABLE VIEW ─── */}
      {viewMode === 'table' && filteredItems.length > 0 && (
        <AppTable
          columns={columns}
          data={filteredItems}
          count={filteredItems.length}
          page={0}
          rowsPerPage={25}
          onPageChange={() => {}}
          onRowsPerPageChange={() => {}}
          hidePagination
        />
      )}

      {/* ─── CARD VIEW ─── */}
      {viewMode === 'cards' && filteredItems.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 2,
            overflowX: 'auto',
            pb: 2,
            pt: 0.5,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.15)', borderRadius: 3 },
          }}
        >
          {filteredItems.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 2,
                  borderColor: isSelected ? 'primary.main' : 'divider',
                  bgcolor: isSelected ? '#EFF6FF' : 'background.paper',
                  boxShadow: isSelected ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
                  transition: 'all 0.2s ease',
                  minWidth: 320,
                  maxWidth: 340,
                  flexShrink: 0,
                  borderRadius: 2.5,
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  },
                }}
              >
                {/* Ref & Status */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>
                    {item.bookingId || item.id} — {item.passenger || item.name}
                  </Typography>
                  {renderStatusChip(item.ticketStatus, item.id)}
                </Box>

                {/* Grid of 13 Required Fields */}
                <Paper elevation={0} sx={{ p: 1.2, bg: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 1.5, mb: 1.5 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, fontSize: '0.72rem' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                        PNR Code:
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary.main' }}>
                        {item.pnr || '—'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                        Supplier:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#334155' }}>
                        {item.supplier || 'Sabre GDS'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                        Ticket Number:
                      </Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800, color: item.ticketNumber?.includes('017') ? 'success.main' : 'text.secondary' }}>
                        {item.ticketNumber || 'Unissued'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                        Fare / Taxes:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>
                        {item.fare || item.amount} / {item.taxes || '$150'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                        Commission:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 900, color: 'success.main' }}>
                        {item.commission || '$100.00'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                        Payment Status:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main' }}>
                        {item.paymentStatus || 'Payment Confirmed'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                        Time Limit (TTL):
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: item.isTtlUrgent ? 'error.main' : 'text.secondary' }}>
                        ⏱️ {item.timeLimit || item.ttl || 'Standard'}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>
                        Issuing Agent:
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>
                        {item.issuingAgent || 'Omar Farouq'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Issue Date & Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                    Issued: <b>{item.issueDateTime || 'Pending'}</b>
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      startIcon={<VisibilityIcon sx={{ fontSize: 13 }} />}
                      sx={{ fontSize: '0.68rem', fontWeight: 700, py: 0.3 }}
                      onClick={() => setReviewItem(item)}
                    >
                      Review
                    </Button>
                    {onSelectIssue && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<ConfirmationNumberIcon sx={{ fontSize: 13 }} />}
                        sx={{ fontSize: '0.68rem', fontWeight: 800, py: 0.3 }}
                        onClick={() => onSelectIssue(item)}
                      >
                        Issue Ticket
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* ─── FULL BOOKING REVIEW MODAL (ALL 13 FIELDS DISPLAYED) ─── */}
      <AppModal
        open={!!reviewItem}
        onClose={() => setReviewItem(null)}
        title={reviewItem ? `Ticketing Queue Detail: ${reviewItem.bookingId || reviewItem.id}` : ''}
        maxWidth="md"
        actions={
          <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => setReviewItem(null)}>
              Close
            </Button>
            {reviewItem && onSelectIssue && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<ConfirmationNumberIcon />}
                onClick={() => {
                  onSelectIssue(reviewItem);
                  setReviewItem(null);
                }}
              >
                Proceed to E-Ticket Issuance
              </Button>
            )}
          </Box>
        }
      >
        {reviewItem && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: 'primary.main' }}>
                📋 COMPLETE BOOKING TICKETING RECORD (13/13 MANDATORY FIELDS)
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, fontSize: '0.85rem' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>1. PNR Code:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
                    {reviewItem.pnr || 'N/A'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>2. Supplier / Airline GDS:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#1E293B' }}>
                    {reviewItem.supplier || 'Sabre GDS'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>3. Booking ID:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>
                    {reviewItem.bookingId || reviewItem.id}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>4. Ticket Number:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'success.main' }}>
                    {reviewItem.ticketNumber || 'Unissued'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>5. Passenger Name:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    {reviewItem.passenger || reviewItem.name} ({reviewItem.cabinClass || 'Economy'})
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>6. Base Fare:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    {reviewItem.fare || '$1,050.00'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>7. Taxes & Fees:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                    {reviewItem.taxes || '$200.00'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>8. Commission:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900, color: 'success.main' }}>
                    {reviewItem.commission || '$125.00 (10%)'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>9. Payment Status:</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip size="small" label={reviewItem.paymentStatus || 'Payment Confirmed'} color="success" sx={{ fontWeight: 800 }} />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>10. Ticket Status:</Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {renderStatusChip(reviewItem.ticketStatus, reviewItem.id)}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>11. Time Limit (GDS TTL):</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: reviewItem.isTtlUrgent ? 'error.main' : 'text.primary' }}>
                    ⏱️ {reviewItem.timeLimit || reviewItem.ttl || 'Standard'}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>12. Issuing Agent:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800 }}>
                    👤 {reviewItem.issuingAgent || 'Omar Farouq'}
                  </Typography>
                </Box>

                <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>13. Issue Date/Time:</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 800, fontFamily: 'monospace', color: 'primary.main' }}>
                    📅 {reviewItem.issueDateTime || 'Not yet issued'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
      </AppModal>
    </Paper>
  );
}
