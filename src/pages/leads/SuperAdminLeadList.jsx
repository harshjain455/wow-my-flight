import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';

// Icons
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Services & Components
import { dbService } from '../../services/dbService';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import FilterPanel from '../../components/FilterPanel';
import AppTable from '../../components/AppTable';
import AppModal from '../../components/AppModal';
import PaymentLinkModal from '../../components/PaymentLinkModal';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';
import { CABIN_CLASSES, LEAD_LABELS, MOCK_BOOKINGS } from '../../constants/mockData';

const AIRPORT_OPTIONS = [
  'DEL - New Delhi Indira Gandhi',
  'LHR - London Heathrow',
  'JFK - New York JFK',
  'DXB - Dubai International',
  'SIN - Singapore Changi',
  'BOM - Mumbai Chhatrapati Shivaji',
  'CDG - Paris Charles de Gaulle',
  'SYD - Sydney Kingsford Smith',
  'YYZ - Toronto Pearson',
  'FRA - Frankfurt'
];

const LABEL_COLORS = {
  'Hot Lead': { bg: '#FFEDD5', color: '#C2410C', emoji: '🔥' },
  'VIP': { bg: '#DBEAFE', color: '#1D4ED8', emoji: '🇺🇸' },
  'Price Sensitive': { bg: '#FEF3C7', color: '#854D0E', emoji: '💲' },
  'Corporate': { bg: '#F3E8FF', color: '#7E22CE', emoji: '🏢' },
  'Urgent': { bg: '#FEE2E2', color: '#B91C1C', emoji: '🚨' }
};

const LEAD_STATUS_FLOW = [
  'New Lead',
  'Contacted',
  'Qualified',
  'Quote Sent',
  'Negotiating',
  'Won (Booking)',
  'Lost Lead',
  'Wasted'
];

const leadFormSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  country: yup.string().default('USA'),
  city: yup.string().default('New York'),
  timezone: yup.string().default('America/New_York'),
  origin: yup.string().required('Origin airport is required'),
  destination: yup.string().required('Destination airport is required'),
  travelDate: yup.string().required('Travel date is required'),
  returnDate: yup.string().default(''),
  cabinClass: yup.string().required('Cabin class is required'),
  adults: yup.number().min(1).default(1),
  children: yup.number().min(0).default(0),
  infants: yup.number().min(0).default(0),
  flexibility: yup.string().default('Exact Dates'),
  budget: yup.string().default('$1,000 - $2,500'),
  source: yup.string().required('Lead source is required'),
  priority: yup.string().default('High'),
  notes: yup.string().default('')
});

export const SuperAdminLeadList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { isAdmin, isSuperAdmin, isOperations, isTeamLeader, currentUser } = useAuth();

  const hasCreateLeadPermission = () => {
    if (currentUser?.customPermissions?.enabled) {
      return !!currentUser.customPermissions.granular?.createLead;
    }
    return (isAdmin || isSuperAdmin) || isOperations;
  };

  const hasAssignLeadPermission = () => {
    if (currentUser?.customPermissions?.enabled) {
      return !!currentUser.customPermissions.granular?.assignLead;
    }
    return (isAdmin || isSuperAdmin) || isOperations || isTeamLeader;
  };

  const hasDeleteLeadPermission = () => {
    if (currentUser?.customPermissions?.enabled) {
      return !!currentUser.customPermissions.granular?.deleteLead;
    }
    return (isAdmin || isSuperAdmin) || isOperations;
  };

  const hasMakeCallPermission = () => {
    if (currentUser?.customPermissions?.enabled) {
      return !!currentUser.customPermissions.granular?.makeCall;
    }
    return true;
  };

  const hasSendWhatsAppPermission = () => {
    if (currentUser?.customPermissions?.enabled) {
      return !!currentUser.customPermissions.granular?.sendWhatsApp;
    }
    return true;
  };


  const getRolePrefix = () => {

    if (!currentUser) return 'super_admin';
    if (currentUser.role === 'consultant') return 'agent';
    return currentUser.role;
  };

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [teamViewMode, setTeamViewMode] = useState('all');
  const [filters, setFilters] = useState(() => {
    const savedFiltersStr = sessionStorage.getItem('leadList_filters');
    const savedFilters = savedFiltersStr ? JSON.parse(savedFiltersStr) : null;
    const isFromDashboard = location.state?.cardInfo !== undefined;

    return {
      serviceId: isFromDashboard ? '' : (savedFilters?.serviceId || ''),
      status: location.state?.filterStatus !== undefined ? location.state.filterStatus : (isFromDashboard ? '' : (savedFilters?.status || '')),
      assignedConsultantId: location.state?.filterConsultantId !== undefined ? location.state.filterConsultantId : (isFromDashboard ? '' : (savedFilters?.assignedConsultantId || '')),
      todayOnly: location.state?.filterToday !== undefined ? location.state.filterToday : (isFromDashboard ? false : (savedFilters?.todayOnly || false))
    };
  });

  const [startDate, setStartDate] = useState(location.state?.startDate || '');
  const [endDate, setEndDate] = useState(location.state?.endDate || '');
  const mockToday = '2026-06-18';

  const filterByDate = (dateStr, start, end) => {
    if (!start && !end) return true;
    if (!dateStr) return false;
    const formatted = dateStr.substring(0, 10);
    if (start && !end) return formatted === start;
    return formatted >= start && formatted <= end;
  };

  // Pagination & Sorting
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortColumn, setSortColumn] = useState('createdDate');
  const [sortDirection, setSortDirection] = useState('desc');

  // Modals & Panels state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [targetConsultantId, setTargetConsultantId] = useState('');
  const [selectedLabels, setSelectedLabels] = useState(['Hot Lead']);
  const [commentText, setCommentText] = useState('');
  const [localActivities, setLocalActivities] = useState({});

  // Active Interactive Dialogs for Table Action Buttons
  const [callModalLead, setCallModalLead] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callConnected, setCallConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [callDisposition, setCallDisposition] = useState('Interested - Send Quote');

  const [whatsappModalLead, setWhatsappModalLead] = useState(null);
  const [whatsappMessageText, setWhatsappMessageText] = useState('');

  const [emailModalLead, setEmailModalLead] = useState(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [deleteConfirmLead, setDeleteConfirmLead] = useState(null);

  useEffect(() => {
    let timer;
    if (callConnected) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callConnected]);

  const handleOpenCallModal = (lead) => {
    setCallModalLead(lead);
    setCallDuration(0);
    setCallConnected(false);
    setIsMuted(false);
    setIsOnHold(false);
    setTimeout(() => {
      setCallConnected(true);
    }, 1200);
  };

  const handleOpenWhatsAppModal = (lead) => {
    setWhatsappModalLead(lead);
    setWhatsappMessageText(
      `Hi ${lead.firstName}, this is WowMyFlight Travel Desk regarding your flight inquiry for ${lead.origin || 'JFK'} ➔ ${lead.destination || 'LHR'}. We have secured exclusive airline promo fares for your dates (${lead.travelDate || 'Oct 2026'}). Shall I share the flight schedule?`
    );
  };

  const handleOpenEmailModal = (lead) => {
    setEmailModalLead(lead);
    setEmailSubject(`✈️ Flight Proposal: ${lead.origin || 'JFK'} to ${lead.destination || 'LHR'} - WowMyFlight`);
    setEmailBody(
      `Dear ${lead.firstName},\n\nThank you for reaching out to WowMyFlight. Based on your flight search for ${lead.origin || 'JFK'} to ${lead.destination || 'LHR'} (${lead.cabinClass || 'Business'} Class), we have secured special discounted rates for ${lead.adults || 1} passenger(s).\n\nPlease let us know if you would like to proceed with seat assignment or date adjustments.\n\nWarm regards,\nWowMyFlight Executive Concierge`
    );
  };

  // Fetch Leads & Agents
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: dbService.getLeads
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: dbService.getAgents
  });

  // Mutations
  const createLeadMutation = useMutation({
    mutationFn: dbService.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      showAlert('✈️ New Flight Lead created successfully!', 'success');
      setAddModalOpen(false);
      reset();
    }
  });

  const deleteLeadMutation = useMutation({
    mutationFn: dbService.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      showAlert('Lead deleted successfully', 'success');
      if (selectedLead) setDetailDrawerOpen(false);
    }
  });

  const assignAgentMutation = useMutation({
    mutationFn: ({ leadId, agentId }) => dbService.assignAgent(leadId, agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      showAlert('Flight Sales Executive assigned successfully', 'success');
      setAssignModalOpen(false);
      setTargetConsultantId('');
    }
  });

  const updateLeadStatusMutation = useMutation({
    mutationFn: ({ leadId, status }) => dbService.updateLeadStatus(leadId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      showAlert('Lead status updated successfully', 'success');
    }
  });

  const handleStatusChange = (leadId, status) => {
    updateLeadStatusMutation.mutate({ leadId, status });
  };

  // Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(leadFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '+1 ',
      country: 'USA',
      city: 'New York',
      timezone: 'America/New_York',
      origin: 'JFK',
      destination: 'LHR',
      travelDate: '2026-10-15',
      returnDate: '2026-10-22',
      cabinClass: 'Business',
      adults: 2,
      children: 0,
      infants: 0,
      flexibility: 'Exact Dates',
      budget: '$2,500 - $5,000',
      source: 'Google Ads',
      priority: 'High',
      notes: ''
    }
  });

  const handleCreateLead = (data) => {
    createLeadMutation.mutate({
      ...data,
      labels: selectedLabels,
      status: 'New Lead',
      serviceId: data.cabinClass.toLowerCase(),
      createdDate: new Date().toISOString(),
      activities: [
        { time: new Date().toLocaleTimeString(), agent: currentUser?.name || 'Admin', status: 'New Lead Created', comments: `Flight request for ${data.origin} → ${data.destination} (${data.cabinClass})` }
      ]
    });
  };

  const handleOpenAssignModal = (lead) => {
    setSelectedLead(lead);
    setTargetConsultantId(lead.assignedConsultantId || '');
    setAssignModalOpen(true);
  };

  const handleAssignAgentSubmit = () => {
    if (!targetConsultantId || !selectedLead) return;
    assignAgentMutation.mutate({
      leadId: selectedLead.id,
      agentId: targetConsultantId
    });
  };

  const handleDeleteLead = (id) => {
    if (window.confirm('Are you sure you want to delete this flight lead?')) {
      deleteLeadMutation.mutate(id);
    }
  };

  const handleRowSelect = (lead) => {
    setSelectedLead(lead);
    setDetailDrawerOpen(true);
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedLead) return;
    const newEntry = {
      time: new Date().toLocaleTimeString(),
      agent: currentUser?.name || 'Me',
      status: 'Follow-up Note',
      comments: commentText
    };
    setLocalActivities(prev => ({
      ...prev,
      [selectedLead.id]: [newEntry, ...(prev[selectedLead.id] || selectedLead.activities || [])]
    }));
    setCommentText('');
    showAlert('Comment logged in lead timeline', 'success');
  };

  const handleCreateBookingFromLead = (lead) => {
    const bookingId = 'BK-' + Math.floor(10000 + Math.random() * 90000);
    const newBooking = {
      id: bookingId,
      bookingId,
      customerName: `${lead.firstName} ${lead.lastName}`,
      customerEmail: lead.email,
      customerPhone: lead.phone,
      route: `${lead.origin || 'JFK'} - ${lead.destination || 'LHR'}`,
      origin: lead.origin || 'JFK',
      destination: lead.destination || 'LHR',
      travelDate: lead.travelDate || '15 Oct 2026',
      returnDate: lead.returnDate || '',
      passengers: lead.adults || 2,
      cabinClass: lead.cabinClass || 'Business',
      tripType: lead.returnDate ? 'Round Trip' : 'One Way',
      pnr: 'NEWPNR',
      sellingPrice: 5175,
      profit: 675,
      paymentStatus: 'PENDING',
      bookingStatus: 'CONFIRMED',
      ticketStatus: 'NOT_ISSUED',
      assignedAgent: lead.assignedConsultantId || currentUser?.id,
      createdAt: new Date().toISOString().split('T')[0]
    };
    MOCK_BOOKINGS.push(newBooking);
    showAlert(`Booking ${bookingId} created for ${lead.firstName} ${lead.lastName}!`, 'success');
    navigate(`/${getRolePrefix()}/bookings`);
  };

  // Filter & Search Logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        if (!filterByDate(lead.createdDate, startDate, endDate)) return false;
        const fullName = `${lead.firstName} ${lead.lastName}`.toLowerCase();
        const matchSearch =
          fullName.includes(searchTerm.toLowerCase()) ||
          lead.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone?.includes(searchTerm);

        // Role-based scoping
        if (!(isAdmin || isSuperAdmin) && !isOperations && !isTeamLeader && currentUser?.role === 'consultant') {
          if (lead.assignedConsultantId !== currentUser.id) return false;
        }

        // Team Leader filter
        if (isTeamLeader && agentFilter && lead.assignedConsultantId !== agentFilter) return false;
        if (isTeamLeader && teamViewMode === 'unassigned' && lead.assignedConsultantId) return false;
        if (isTeamLeader && teamViewMode === 'neglected' && lead.status !== 'New Lead') return false;

        const matchStatus = filters.status ? lead.status === filters.status : true;
        const matchConsultant = filters.assignedConsultantId ? lead.assignedConsultantId === filters.assignedConsultantId : true;
        const matchToday = filters.todayOnly ? lead.createdDate?.startsWith(mockToday) : true;

        return matchSearch && matchStatus && matchConsultant && matchToday;
      })
      .sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];
        if (sortColumn === 'name') {
          valA = `${a.firstName} ${a.lastName}`;
          valB = `${b.firstName} ${b.lastName}`;
        }
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [leads, startDate, endDate, searchTerm, isAdmin, isSuperAdmin, isOperations, isTeamLeader, currentUser, agentFilter, teamViewMode, filters, sortColumn, sortDirection]);

  const paginatedLeads = filteredLeads.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSort = (columnId) => {
    const isAsc = sortColumn === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortColumn(columnId);
  };

  // Table Columns (Travel CRM Spec)
  const columns = [
    {
      id: 'isDay',
      label: 'Is Day',
      render: (row) => (
        row.isDay !== false ? (
          <Tooltip title="Daytime in passenger location">
            <WbSunnyIcon sx={{ fontSize: 18, color: '#F59E0B' }} />
          </Tooltip>
        ) : (
          <Tooltip title="Nighttime in passenger location">
            <NightlightIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </Tooltip>
        )
      )
    },
    {
      id: 'labels',
      label: 'Labels',
      render: (row) => {
        const labels = row.labels || ['Hot Lead', 'VIP'];
        return (
          <Box sx={{ display: 'flex', gap: 0.4, flexWrap: 'wrap' }}>
            {labels.map(l => {
              const cfg = LABEL_COLORS[l] || { bg: '#EFF6FF', color: '#2563EB', emoji: '🏷️' };
              return (
                <Chip
                  key={l}
                  size="small"
                  label={`${cfg.emoji} ${l}`}
                  sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                />
              );
            })}
          </Box>
        );
      }
    },
    {
      id: 'name',
      label: 'First & Last Name',
      sortable: true,
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.firstName} {row.lastName}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>#{row.id}</Typography>
        </Box>
      )
    },
    {
      id: 'flightRequest',
      label: 'Flight Request',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <FlightTakeoffIcon sx={{ fontSize: 14, color: 'primary.main' }} />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            {row.origin || 'JFK'} → {row.destination || 'LHR'} &nbsp;·&nbsp; {row.cabinClass || 'Business'}
          </Typography>
        </Box>
      )
    },
    {
      id: 'phone',
      label: 'Verified Phone',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {row.phone?.replace(/(\+\d{1,3}\s\d{3})\d{3}(\d{2})/, '$1***$2') || row.phone}
          </Typography>
          <Tooltip title="Copy Phone">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(row.phone); showAlert('Phone copied!', 'info'); }}>
              <ContentCopyIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      id: 'email',
      label: 'Verified Email',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary">{row.email}</Typography>
          <VerifiedUserIcon sx={{ fontSize: 13, color: 'success.main' }} />
        </Box>
      )
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <Select
          value={row.status || 'New Lead'}
          onChange={(e) => { e.stopPropagation(); handleStatusChange(row.id, e.target.value); }}
          onClick={(e) => e.stopPropagation()}
          size="small"
          sx={{ fontSize: '0.75rem', height: 26, minWidth: 110, bgcolor: 'background.paper', borderRadius: 1.5 }}
        >
          {LEAD_STATUS_FLOW.map((st) => (
            <MenuItem key={st} value={st} sx={{ fontSize: '0.75rem' }}>
              {st}
            </MenuItem>
          ))}
        </Select>
      )
    },
    {
      id: 'assignedConsultant',
      label: 'Assigned',
      render: (row) => {
        const agent = agents.find((c) => c.id === row.assignedConsultantId);
        return agent ? (
          <Typography variant="caption" sx={{ fontWeight: 700 }}>{agent.name.split(' ')[0]}</Typography>
        ) : (
          <Chip size="small" label="Unassigned" color="default" sx={{ fontSize: '0.62rem', height: 18 }} />
        );
      }
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <Button
        startIcon={<KeyboardArrowLeftIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 1.5, color: 'text.secondary', display: 'inline-flex' }}
      >
        Back to Dashboard
      </Button>

      <PageHeader
        title={isTeamLeader ? 'Team Lead Center' : (currentUser?.role === 'consultant' ? 'My Flight Leads' : 'Flight Leads Management')}
        subtitle={isTeamLeader ? 'Monitor team flight leads, reassign cases, approve discounts & track conversion.' : 'Incoming passenger flight requests, qualification status & quote dispatch.'}
        action={
          hasCreateLeadPermission() && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              sx={{ fontWeight: 700 }}
            >
              Add New Lead
            </Button>
          )
        }

      />

      {/* Date Filter & Presets */}
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', mr: 0.5 }}>Date Filter:</Typography>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 0.5, bgcolor: 'background.paper' }}>
          {[
            { label: 'Today', key: 'today' },
            { label: '7D', key: '7d' },
            { label: '30D', key: '30d' },
            { label: 'All', key: 'all' }
          ].map(preset => {
            const isActive =
              preset.key === 'today' ? startDate === mockToday && endDate === mockToday :
              preset.key === '7d' ? startDate === '2026-06-12' && endDate === mockToday :
              preset.key === '30d' ? startDate === '2026-05-20' && endDate === mockToday :
              preset.key === 'all' ? !startDate && !endDate : false;
            return (
              <Button
                key={preset.key}
                size="small"
                variant={isActive ? 'contained' : 'text'}
                color={isActive ? 'primary' : 'inherit'}
                onClick={() => {
                  if (preset.key === 'today') { setStartDate(mockToday); setEndDate(mockToday); }
                  else if (preset.key === '7d') { setStartDate('2026-06-12'); setEndDate(mockToday); }
                  else if (preset.key === '30d') { setStartDate('2026-05-20'); setEndDate(mockToday); }
                  else { setStartDate(''); setEndDate(''); }
                }}
                sx={{ minWidth: 0, px: 1.5, py: 0.5, fontSize: '0.72rem', fontWeight: 700, borderRadius: 1.5 }}
              >
                {preset.label}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Main Table + Controls */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Team Leader Extra View Controls */}
        {isTeamLeader && (
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 0.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 0.5, bgcolor: 'background.paper' }}>
              {['all', 'unassigned', 'neglected'].map(mode => (
                <Button
                  key={mode}
                  size="small"
                  variant={teamViewMode === mode ? 'contained' : 'text'}
                  color={teamViewMode === mode ? 'primary' : 'inherit'}
                  onClick={() => setTeamViewMode(mode)}
                  sx={{ minWidth: 0, px: 1.5, py: 0.5, fontSize: '0.72rem', fontWeight: 700, borderRadius: 1.5, textTransform: 'capitalize' }}
                >
                  {mode === 'all' ? '📋 All Leads' : mode === 'unassigned' ? '⚠️ Unassigned' : '🔴 Neglected'}
                </Button>
              ))}
            </Box>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>🧑‍💼 Filter by Agent</InputLabel>
              <Select
                value={agentFilter}
                label="🧑‍💼 Filter by Agent"
                onChange={e => setAgentFilter(e.target.value)}
              >
                <MenuItem value="">All Agents</MenuItem>
                {agents.map(agent => (
                  <MenuItem key={agent.id} value={agent.id}>{agent.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Search & Status Filter */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          <Box sx={{ width: { xs: '100%', md: '340px' } }}>
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search passenger name, email, phone..."
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <FilterPanel
              filters={filters}
              onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
              onClearFilters={() => {
                setFilters({ serviceId: '', status: '', assignedConsultantId: '', todayOnly: false });
                setStartDate('');
                setEndDate('');
                setAgentFilter('');
                setTeamViewMode('all');
              }}
              statusOptions={LEAD_STATUS_FLOW}
            />
          </Box>
        </Box>

        {/* Leads Table */}
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
          <AppTable
            columns={columns}
            data={paginatedLeads}
            count={filteredLeads.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            loading={isLoading}
            onRowClick={(row) => handleRowSelect(row)}
            actions={(row) => (
              <Box sx={{ display: 'flex', gap: 0.5, whiteSpace: 'nowrap', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                {hasMakeCallPermission() && (
                  <Tooltip title={`Call ${row.firstName || 'Lead'} (WebRTC Softphone)`}>
                    <IconButton size="small" color="success" onClick={() => handleOpenCallModal(row)}>
                      <PhoneIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {hasSendWhatsAppPermission() && (
                  <Tooltip title={`WhatsApp ${row.firstName || 'Lead'}`}>
                    <IconButton size="small" color="success" onClick={() => handleOpenWhatsAppModal(row)}>
                      <WhatsAppIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title={`Email ${row.firstName || 'Lead'}`}>
                  <IconButton size="small" color="primary" onClick={() => handleOpenEmailModal(row)}>
                    <EmailIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Lead Details">
                  <IconButton size="small" color="info" onClick={() => handleRowSelect(row)}>
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {hasAssignLeadPermission() && (
                  <Tooltip title="Assign Sales Executive">
                    <IconButton size="small" color="warning" onClick={() => handleOpenAssignModal(row)}>
                      <PersonAddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                {hasDeleteLeadPermission() && (
                  <Tooltip title="Delete Lead">
                    <IconButton size="small" color="error" onClick={() => setDeleteConfirmLead(row)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          />
        </Paper>
      </Box>

      {/* ─── 2. RIGHT SLIDE-OVER LEAD DETAIL PANEL (SPEC COMPLIANT) ─── */}
      <Drawer
        anchor="right"
        open={detailDrawerOpen}
        onClose={() => setDetailDrawerOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 460 }, p: 3, bgcolor: '#FFFFFF' } }}
      >
        {selectedLead && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                  {selectedLead.firstName} {selectedLead.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                  CLIENT ID: {selectedLead.clientId || selectedLead.id || '463522372'}
                </Typography>
              </Box>
              <IconButton onClick={() => setDetailDrawerOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider />

            {/* Scrollable Content */}
            <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2.5, pr: 0.5 }}>
              {/* Section 1: Personal Data */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'primary.main' }}>
                  🌍 PERSONAL DATA
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 0.8, fontSize: 13 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Country:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.country || 'USA'}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Time Zone:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.timeZone || selectedLead.timezone || 'UTC-05:00 Eastern Time'}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>City:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.city || 'New York'}</Typography>
                </Box>
              </Paper>

              {/* Section 2: Flight Request */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F0F9FF', borderRadius: 2, border: '1px solid #BAE6FD' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'info.main' }}>
                  ✈️ FLIGHT REQUEST
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 0.8, fontSize: 13 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Origin:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{selectedLead.origin || 'DEL (Delhi Indira Gandhi)'}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Destination:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{selectedLead.destination || 'LHR (London Heathrow)'}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Travel Date:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.travelDate || '15 Oct 2026'}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Return Date:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.returnDate || '22 Oct 2026'}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Cabin Class:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>{selectedLead.cabinClass || 'Business'}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Passengers:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.adults || selectedLead.passengers || 2} Adults</Typography>
                </Box>
              </Paper>

              {/* Section 3: Registration Data */}
              <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
                  📋 REGISTRATION DATA
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: 0.8, fontSize: 13 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Email:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.email}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Phone:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.phone}</Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Source:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{selectedLead.source || 'Google Ads'}</Typography>
                </Box>
              </Paper>

              {/* Section 4: Activity History Timeline */}
              <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
                  ⏱️ ACTIVITY HISTORY
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 160, overflowY: 'auto', mb: 1.5 }}>
                  {(localActivities[selectedLead.id] || selectedLead.activities || [
                    { time: '16:16:23', agent: 'agent1', status: 'New Dialed', comments: '—' },
                    { time: '16:36:01', agent: 'agent1', status: 'Follow-up', comments: 'Interested in business class quotes' }
                  ]).map((act, i) => (
                    <Box key={i} sx={{ p: 1, bgcolor: '#F8FAFC', borderRadius: 1.5, fontSize: 12, border: '1px solid #E2E8F0' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>{act.agent}</Typography>
                        <Typography variant="caption" color="text.secondary">{act.time}</Typography>
                      </Box>
                      <Chip size="small" label={act.status} color="primary" variant="outlined" sx={{ fontSize: '0.62rem', height: 18, mb: 0.5 }} />
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{act.comments}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add follow-up comment..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    fullWidth
                  />
                  <Button size="small" variant="contained" onClick={handleAddComment}>
                    Add
                  </Button>
                </Box>
              </Paper>
            </Box>

            {/* Quick Actions Footer */}
            <Divider />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 1 }}>
              <Button
                variant="outlined"
                color="info"
                size="small"
                startIcon={<SendIcon sx={{ fontSize: 14 }} />}
                onClick={() => {
                  showAlert(`Flight quote request for ${selectedLead.firstName} submitted to GDS Desk!`, 'success');
                  navigate(`/${getRolePrefix()}/quotes`);
                }}
                sx={{ fontSize: '0.7rem', fontWeight: 700 }}
              >
                GDS Quote
              </Button>
              <Button
                variant="contained"
                color="success"
                size="small"
                startIcon={<BookmarkAddedIcon sx={{ fontSize: 14 }} />}
                onClick={() => handleCreateBookingFromLead(selectedLead)}
                sx={{ fontSize: '0.7rem', fontWeight: 700 }}
              >
                Create Booking
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<MonetizationOnIcon sx={{ fontSize: 14 }} />}
                onClick={() => setPaymentModalOpen(true)}
                sx={{ fontSize: '0.7rem', fontWeight: 700 }}
              >
                Payment Link
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>

      {/* ─── 3. ADD NEW LEAD MODAL (FULL TRAVEL CRM SPEC) ─── */}
      <AppModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Passenger Flight Lead"
        maxWidth="md"
        actions={
          <>
            <Button onClick={() => setAddModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(handleCreateLead)}
              variant="contained"
              color="primary"
              disabled={createLeadMutation.isPending}
            >
              Save Flight Lead
            </Button>
          </>
        }
      >
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Group 1: Personal Info */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'primary.main' }}>
              👤 PERSONAL INFO
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <TextField {...register('firstName')} label="First Name *" size="small" error={!!errors.firstName} helperText={errors.firstName?.message} />
              <TextField {...register('lastName')} label="Last Name *" size="small" error={!!errors.lastName} helperText={errors.lastName?.message} />
              <TextField {...register('email')} label="Email Address *" size="small" error={!!errors.email} helperText={errors.email?.message} />
              <TextField {...register('phone')} label="Phone Number (with Country Code) *" size="small" error={!!errors.phone} helperText={errors.phone?.message} />
              <TextField {...register('country')} label="Country" size="small" />
              <TextField {...register('city')} label="City" size="small" />
            </Box>
          </Paper>

          {/* Group 2: Flight Request */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F0F9FF', borderRadius: 2, border: '1px solid #BAE6FD' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'info.main' }}>
              ✈️ FLIGHT REQUEST
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Origin Airport *</InputLabel>
                <Select {...register('origin')} defaultValue="DEL" label="Origin Airport *">
                  {AIRPORT_OPTIONS.map(a => (
                    <MenuItem key={a} value={a.split(' - ')[0]}>{a}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Destination Airport *</InputLabel>
                <Select {...register('destination')} defaultValue="LHR" label="Destination Airport *">
                  {AIRPORT_OPTIONS.map(a => (
                    <MenuItem key={a} value={a.split(' - ')[0]}>{a}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Cabin Class *</InputLabel>
                <Select {...register('cabinClass')} defaultValue="Business" label="Cabin Class *">
                  {['Economy', 'Premium Economy', 'Business', 'First Class'].map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField {...register('travelDate')} label="Travel Date *" type="date" size="small" InputLabelProps={{ shrink: true }} />
              <TextField {...register('returnDate')} label="Return Date (optional)" type="date" size="small" InputLabelProps={{ shrink: true }} />
              
              <FormControl size="small" fullWidth>
                <InputLabel>Flexibility</InputLabel>
                <Select {...register('flexibility')} defaultValue="Exact Dates" label="Flexibility">
                  {['Exact Dates', '±3 days', '±7 days', 'Flexible'].map(f => (
                    <MenuItem key={f} value={f}>{f}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField {...register('adults')} label="Adults (1-9) *" type="number" size="small" inputProps={{ min: 1, max: 9 }} />
              <TextField {...register('children')} label="Children (0-6)" type="number" size="small" inputProps={{ min: 0, max: 6 }} />
              <TextField {...register('infants')} label="Infants (0-4)" type="number" size="small" inputProps={{ min: 0, max: 4 }} />

              <FormControl size="small" fullWidth sx={{ gridColumn: { sm: 'span 3' } }}>
                <InputLabel>Budget Range *</InputLabel>
                <Select {...register('budget')} defaultValue="$2,500 - $5,000" label="Budget Range *">
                  {['$500 - $1,000', '$1,000 - $2,500', '$2,500 - $5,000', '$5,000+', 'No limit'].map(b => (
                    <MenuItem key={b} value={b}>{b}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Group 3: Lead Info & Labels */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5 }}>
              🏷️ LEAD INFO & LABELS
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Traffic Source *</InputLabel>
                <Select {...register('source')} defaultValue="Google Ads" label="Traffic Source *">
                  {['Google Ads', 'Facebook Ads', 'WhatsApp', 'Instagram', 'Referral', 'Walk-in'].map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select {...register('priority')} defaultValue="High" label="Priority">
                  {['High', 'Medium', 'Low'].map(p => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.8 }}>
                  Lead Labels:
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                  {['Hot Lead', 'VIP', 'Price Sensitive', 'Corporate', 'Urgent'].map(label => {
                    const isSelected = selectedLabels.includes(label);
                    const cfg = LABEL_COLORS[label];
                    return (
                      <Chip
                        key={label}
                        label={`${cfg.emoji} ${label}`}
                        onClick={() => {
                          setSelectedLabels(prev =>
                            prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]
                          );
                        }}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 700,
                          bgcolor: isSelected ? cfg.bg : 'transparent',
                          color: isSelected ? cfg.color : 'text.primary',
                          borderColor: cfg.color
                        }}
                      />
                    );
                  })}
                </Box>
              </Box>

              <TextField
                {...register('notes')}
                label="Special Requirements / Itinerary Notes"
                multiline
                rows={3}
                fullWidth
                sx={{ gridColumn: { sm: 'span 2' } }}
                placeholder="Enter customer special preferences, preferred airlines, meal requirements..."
              />
            </Box>
          </Paper>
        </Box>
      </AppModal>

      {/* ─── 4. ASSIGN FLIGHT SALES EXECUTIVE MODAL ─── */}
      <AppModal
        open={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Flight Sales Executive"
        actions={
          <>
            <Button onClick={() => setAssignModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleAssignAgentSubmit}
              variant="contained"
              color="primary"
              disabled={assignAgentMutation.isPending}
            >
              Assign Agent
            </Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selectedLead && (
            <Typography variant="body2">
              Assign a dedicated Flight Specialist for{' '}
              <strong>{selectedLead.firstName} {selectedLead.lastName}</strong> ({selectedLead.origin || 'JFK'} → {selectedLead.destination || 'LHR'}, {selectedLead.cabinClass || 'Business'}).
            </Typography>
          )}
          <FormControl fullWidth size="small">
            <InputLabel>Select Sales Executive</InputLabel>
            <Select
              value={targetConsultantId}
              onChange={(e) => setTargetConsultantId(e.target.value)}
              label="Select Sales Executive"
            >
              <MenuItem value="">Unassigned</MenuItem>
              {agents.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} — {c.casesCount || 0} active leads
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </AppModal>

      {/* Payment Link Modal */}
      <PaymentLinkModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={(data) => {
          setPaymentModalOpen(false);
          showAlert(`Payment link generated for ${data.customer} — ${data.currency} ${Number(data.amount).toLocaleString()}`, 'success');
        }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          MODAL 1: WEBRTC SOFTPHONE / LIVE CALL DESK
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(callModalLead)}
        onClose={() => setCallModalLead(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1, textAlign: 'center' } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
              Telnyx WebRTC Softphone Desk
            </Typography>
            <IconButton onClick={() => setCallModalLead(null)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <Box sx={{ my: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${callConnected ? 'bg-green-500/20 text-green-600 animate-pulse' : 'bg-blue-500/20 text-blue-600'}`}>
              <PhoneInTalkIcon sx={{ fontSize: 32 }} />
            </div>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              {callModalLead?.firstName} {callModalLead?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              📞 {callModalLead?.phone}
            </Typography>
            <Chip
              label={callConnected ? `Connected • ${Math.floor(callDuration / 60).toString().padStart(2, '0')}:${(callDuration % 60).toString().padStart(2, '0')}` : 'Connecting Line...'}
              color={callConnected ? 'success' : 'primary'}
              size="small"
              sx={{ fontWeight: 800 }}
            />
            <Typography variant="caption" color="text.secondary">
              Route: {callModalLead?.origin || 'JFK'} ➔ {callModalLead?.destination || 'LHR'} • {callModalLead?.cabinClass || 'Business'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, my: 2 }}>
            <IconButton
              onClick={() => setIsMuted(!isMuted)}
              sx={{ bgcolor: isMuted ? 'error.main' : 'action.hover', color: isMuted ? 'white' : 'text.primary' }}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
            <IconButton
              onClick={() => setIsOnHold(!isOnHold)}
              sx={{ bgcolor: isOnHold ? 'warning.main' : 'action.hover', color: isOnHold ? 'white' : 'text.primary' }}
            >
              {isOnHold ? <PlayArrowIcon /> : <PauseIcon />}
            </IconButton>
            <IconButton
              onClick={() => {
                showAlert(`Call ended with ${callModalLead?.firstName}. Duration: ${callDuration}s`, 'info');
                setCallConnected(false);
                setCallModalLead(null);
              }}
              sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
            >
              <CallEndIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <FormControl fullWidth size="small">
            <InputLabel>Call Outcome / Disposition</InputLabel>
            <Select
              value={callDisposition}
              onChange={(e) => setCallDisposition(e.target.value)}
              label="Call Outcome / Disposition"
            >
              <MenuItem value="Interested - Send Quote">Interested - Send Flight Quote</MenuItem>
              <MenuItem value="Spoke to Client - Follow Up Needed">Spoke to Client - Follow Up Needed</MenuItem>
              <MenuItem value="Voicemail / No Answer">Voicemail / No Answer</MenuItem>
              <MenuItem value="Deal Closed - Won">Deal Closed - Won</MenuItem>
              <MenuItem value="Price Sensitive / Lost">Price Sensitive / Lost</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              showAlert(`✓ Call Log & Disposition (${callDisposition}) saved for ${callModalLead?.firstName}!`, 'success');
              setCallModalLead(null);
            }}
          >
            Save Call Activity & Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL 2: WHATSAPP DIRECT DISPATCHER
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(whatsappModalLead)}
        onClose={() => setWhatsappModalLead(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WhatsAppIcon sx={{ color: '#25D366' }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                WhatsApp Direct Message Desk
              </Typography>
              <Typography variant="caption" color="text.secondary">
                To: {whatsappModalLead?.firstName} {whatsappModalLead?.lastName} ({whatsappModalLead?.phone})
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setWhatsappModalLead(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
            QUICK MESSAGE TEMPLATES:
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
            {[
              { label: '✈️ Exclusive Fare Quote', text: `Hi ${whatsappModalLead?.firstName}, we found special discounted unpublished fares for ${whatsappModalLead?.origin || 'JFK'} ➔ ${whatsappModalLead?.destination || 'LHR'} starting from $850 USD. Would you like to review the flight options?` },
              { label: '⏳ Price Lock Alert', text: `Hi ${whatsappModalLead?.firstName}, this is WowMyFlight. The airline seat hold on your route (${whatsappModalLead?.origin || 'JFK'} to ${whatsappModalLead?.destination || 'LHR'}) expires in 3 hours. Reply to lock this rate.` },
              { label: '👋 Introduction & Info', text: `Hello ${whatsappModalLead?.firstName}, thanks for reaching out to WowMyFlight! I am your dedicated Flight Specialist. Let me know your preferred departure times!` }
            ].map((tmpl) => (
              <Chip
                key={tmpl.label}
                label={tmpl.label}
                size="small"
                onClick={() => setWhatsappMessageText(tmpl.text)}
                clickable
                sx={{ fontWeight: 700 }}
              />
            ))}
          </Box>

          <TextField
            multiline
            rows={4}
            fullWidth
            label="WhatsApp Message Body"
            value={whatsappMessageText}
            onChange={(e) => setWhatsappMessageText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => {
              navigator.clipboard.writeText(whatsappMessageText);
              showAlert('✓ WhatsApp message copied to clipboard!', 'success');
            }}
          >
            Copy Text
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<SendIcon />}
            onClick={() => {
              showAlert(`✓ WhatsApp message sent to ${whatsappModalLead?.phone}!`, 'success');
              setWhatsappModalLead(null);
            }}
          >
            Send WhatsApp Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL 3: EMAIL COMPOSER DESK
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(emailModalLead)}
        onClose={() => setEmailModalLead(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EmailIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                Flight Quotation Email Composer
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Recipient: {emailModalLead?.email}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setEmailModalLead(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Subject"
            size="small"
            fullWidth
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />

          <TextField
            label="Email Body"
            multiline
            rows={6}
            fullWidth
            value={emailBody}
            onChange={(e) => setEmailBody(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEmailModalLead(null)} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={() => {
              showAlert(`✓ Flight proposal email dispatched to ${emailModalLead?.email}!`, 'success');
              setEmailModalLead(null);
            }}
          >
            Send Email Proposal
          </Button>
        </DialogActions>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL 4: DELETE LEAD CONFIRMATION
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(deleteConfirmLead)}
        onClose={() => setDeleteConfirmLead(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main', pb: 1 }}>
          <DeleteIcon />
          <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
            Delete Lead?
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 2 }}>
          <Typography variant="body2">
            Are you sure you want to delete lead <strong>{deleteConfirmLead?.firstName} {deleteConfirmLead?.lastName}</strong> ({deleteConfirmLead?.origin || 'JFK'} → {deleteConfirmLead?.destination || 'LHR'})?
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            This will permanently remove the lead record and all associated quote drafts.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteConfirmLead(null)} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              deleteLeadMutation.mutate(deleteConfirmLead?.id);
              setDeleteConfirmLead(null);
            }}
          >
            Yes, Delete Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminLeadList;
