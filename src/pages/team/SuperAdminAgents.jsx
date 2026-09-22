import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Badge from '@mui/material/Badge';
import TuneIcon from '@mui/icons-material/Tune';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

// Services & Components
import PageHeader from '../../components/PageHeader';
import { dbService } from '../../services/dbService';
import { useAuth } from '../../hooks/useAuth';
import { useAlert } from '../../contexts/AlertContext';

const AVAILABLE_MENUS = [
  'Dashboard',
  'Priority Roadmap',
  'Leads',
  'Customer 360',
  'Calling System',
  'Follow-ups',
  'Quotes',
  'Lead Distribution',
  'Lead Lifecycle',
  'Duplicate Protection',
  'Communication Hub',
  'Calling & Softphone',
  'Call Dispositions',
  'Sales Dashboard',
  'Flight Search',
  'Bookings',
  'Ticketing',
  'Payments',
  'After-Sales',
  'Suppliers / GDS',
  'Team Leader Dashboard',
  'QA',
  'SLA Management',
  'Automation',
  'Finance',
  'Management Reports',
  'Permission Control',
  'Audit Trail',
  'Marketing Dashboard',
  'Social Inbox',
  'Agents',
  'Integrations'
];

const AVAILABLE_CARDS = [
  'Total Clients',
  'Today\'s Clients',
  'Total Consultations',
  'Today\'s Consultations',
  'Upcoming Meetings',
  'Pending Payments',
  'Total Revenue',
  'Active Cases',
  'Completed Cases',
  'Lost Consultations',
  'Revenue Today',
  'Outstanding Revenue',
  'Refunded (50% Rejections)'
];

const ROLE_DEFAULTS = {
  admin: {
    menus: ['Dashboard', 'Priority Roadmap', 'Leads', 'Customer 360', 'Calling System', 'Follow-ups', 'Quotes', 'Lead Distribution', 'Lead Lifecycle', 'Duplicate Protection', 'Communication Hub', 'Calling & Softphone', 'Call Dispositions', 'Sales Dashboard', 'Flight Search', 'Bookings', 'Ticketing', 'Payments', 'After-Sales', 'Suppliers / GDS', 'Team Leader Dashboard', 'QA', 'SLA Management', 'Automation', 'Finance', 'Management Reports', 'Permission Control', 'Audit Trail', 'Marketing Dashboard', 'Social Inbox', 'Agents', 'Integrations'],
    cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Pending Payments', 'Total Revenue', 'Active Cases', 'Completed Cases', 'Lost Consultations', 'Revenue Today', 'Outstanding Revenue', 'Refunded (50% Rejections)']
  },
  team_leader: {
    menus: ['Dashboard', 'Priority Roadmap', 'Leads', 'Customer 360', 'Calling System', 'Follow-ups', 'Quotes', 'Lead Distribution', 'Lead Lifecycle', 'Duplicate Protection', 'Communication Hub', 'Calling & Softphone', 'Call Dispositions', 'Sales Dashboard', 'Bookings', 'Team Leader Dashboard', 'QA', 'SLA Management', 'Automation', 'Management Reports', 'Permission Control', 'Audit Trail', 'Social Inbox'],
    cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Active Cases', 'Completed Cases']
  },
  consultant: {
    menus: ['Dashboard', 'Priority Roadmap', 'Leads', 'Customer 360', 'Calling System', 'Follow-ups', 'Quotes', 'Lead Distribution', 'Lead Lifecycle', 'Duplicate Protection', 'Communication Hub', 'Calling & Softphone', 'Call Dispositions', 'Sales Dashboard', 'Bookings', 'SLA Management', 'Automation', 'Management Reports', 'Permission Control', 'Audit Trail', 'Social Inbox'],
    cards: ['Upcoming Meetings', 'Active Cases']
  }
};

export const SuperAdminAgents = () => {
  const queryClient = useQueryClient();
  const { currentUser, isAdmin, isSuperAdmin, refreshUser } = useAuth();
  const { showAlert } = useAlert();

  const [view, setView] = useState('list'); // 'list' or 'details'


  // State
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10);
  const [timeRange, setTimeRange] = useState('All Time');
  const [customDays, setCustomDays] = useState(14);
  const [activeTab, setActiveTab] = useState(0);
  const [historySearch, setHistorySearch] = useState('');
  const [historyFilter, setHistoryFilter] = useState('all');

  // KPI Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [modalType, setModalType] = useState('');

  // Form Fields
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('consultant');
  const [avatarBase64, setAvatarBase64] = useState('');
  const [languages, setLanguages] = useState('');
  const [nationalities, setNationalities] = useState('');
  const [bio, setBio] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [customPermissionsEnabled, setCustomPermissionsEnabled] = useState(false);
  const [customMenus, setCustomMenus] = useState([]);
  const [customCards, setCustomCards] = useState([]);
  const [customCanManageOverrides, setCustomCanManageOverrides] = useState(false);

  // Granular Permissions & Scope Matrix State
  const [openPermsModal, setOpenPermsModal] = useState(false);
  const [permsAgent, setPermsAgent] = useState(null);
  const [permScope, setPermScope] = useState('Own records');
  const [granularPerms, setGranularPerms] = useState({
    viewLead: true, createLead: true, editLead: true, assignLead: false, reassignLead: false, deleteLead: false,
    viewCustomer: true, editCustomer: true, exportCustomer: false,
    makeCall: true, viewCallRecording: true, downloadRecording: false, sendWhatsApp: true,
    createBooking: true, modifyBooking: true, cancelBooking: false, createTicket: false, voidTicket: false, reissueTicket: false,
    viewPayment: false, createPaymentRequest: true, refundPayment: false, viewFinanceReports: false,
    createUser: false, disableUser: false, configureApi: false, viewAuditLogs: false
  });

  const handleOpenPermsModal = (agent) => {
    setPermsAgent(agent);
    setPermScope(agent.customPermissions?.scope || (agent.role === 'admin' ? 'All records' : agent.role === 'team_leader' ? 'Own team' : 'Own records'));
    setGranularPerms(agent.customPermissions?.granular || {
      viewLead: true,
      createLead: true,
      editLead: true,
      assignLead: agent.role === 'team_leader' || agent.role === 'admin',
      reassignLead: agent.role === 'team_leader' || agent.role === 'admin',
      deleteLead: agent.role === 'admin',
      viewCustomer: true,
      editCustomer: true,
      exportCustomer: agent.role === 'admin',
      makeCall: true,
      viewCallRecording: true,
      downloadRecording: agent.role === 'team_leader' || agent.role === 'admin',
      sendWhatsApp: true,
      createBooking: true,
      modifyBooking: true,
      cancelBooking: agent.role === 'team_leader' || agent.role === 'admin',
      createTicket: agent.role === 'ticketing_agent' || agent.role === 'admin',
      voidTicket: agent.role === 'admin',
      reissueTicket: agent.role === 'ticketing_agent' || agent.role === 'admin',
      viewPayment: agent.role === 'finance' || agent.role === 'admin',
      createPaymentRequest: true,
      refundPayment: agent.role === 'finance' || agent.role === 'admin',
      viewFinanceReports: agent.role === 'finance' || agent.role === 'admin',
      createUser: agent.role === 'admin',
      disableUser: agent.role === 'admin',
      configureApi: agent.role === 'admin',
      viewAuditLogs: agent.role === 'admin'
    });
    setOpenPermsModal(true);
  };

  const handleSaveGranularPerms = () => {
    if (!permsAgent) return;
    updateAgentMutation.mutate({
      ...permsAgent,
      customPermissions: {
        ...(permsAgent.customPermissions || {}),
        enabled: true,
        scope: permScope,
        granular: granularPerms
      }
    });
    setOpenPermsModal(false);
    showAlert(`Granular permissions & Scope (${permScope}) saved for ${permsAgent.name}!`, 'success');
  };


  useEffect(() => {
    if (customPermissionsEnabled && customMenus.length === 0 && customCards.length === 0) {
      const defaults = ROLE_DEFAULTS[role] || { menus: [], cards: [] };
      setCustomMenus(defaults.menus);
      setCustomCards(defaults.cards);
    }
  }, [customPermissionsEnabled, role]);

  const { data: allLeads = [] } = useQuery({ queryKey: ['leads'], queryFn: dbService.getLeads });
  const { data: allClients = [] } = useQuery({ queryKey: ['clients'], queryFn: dbService.getClients });
  const { data: allConsultations = [] } = useQuery({ queryKey: ['consultations'], queryFn: dbService.getConsultations });
  const { data: allPayments = [] } = useQuery({ queryKey: ['payments'], queryFn: dbService.getPayments });

  // Fetch Agents dynamically
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: dbService.getAgents });

  // Set first agent as active if none selected
  useEffect(() => {
    if (agents.length > 0 && !activeAgentId) {
      setActiveAgentId(agents[0].id);
    }
  }, [agents, activeAgentId]);

  // Mutations
  const createAgentMutation = useMutation({
    mutationFn: (agentData) => dbService.createAgent(agentData),
    onSuccess: (newAgent) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      showAlert('Agent registered successfully!', 'success');
      setOpenAddModal(false);
      resetForm();
      if (newAgent) {
        setActiveAgentId(newAgent.id);
      }
    },
    onError: () => showAlert('Error registering agent.', 'error') });

  const deleteAgentMutation = useMutation({
    mutationFn: (id) => dbService.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      showAlert('Agent removed successfully.', 'success');
      setActiveAgentId(agents[0]?.id || null);
    },
    onError: () => showAlert('Error removing agent.', 'error') });

  const resetPasswordMutation = useMutation({
    mutationFn: ({ id, newPassword }) => dbService.resetAgentPassword(id, newPassword),
    onSuccess: () => {
      showAlert('Agent password reset successfully!', 'success');
      setOpenResetPasswordModal(false);
      setNewPassword('');
    },
    onError: () => showAlert('Error resetting password.', 'error') });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, newRole }) => dbService.updateAgentRole(id, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      showAlert('Agent role updated successfully!', 'success');
    },
    onError: () => showAlert('Error updating role.', 'error') });

  const updateAgentMutation = useMutation({
    mutationFn: (agentData) => dbService.updateAgent(agentData),
    onSuccess: (updatedAgent) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // If the updated agent is the currently logged-in user, sync their session immediately
      if (updatedAgent && refreshUser) refreshUser(updatedAgent);
      showAlert('Agent profile updated successfully!', 'success');
      setOpenEditModal(false);
      resetForm();
    },
    onError: () => showAlert('Error updating agent profile.', 'error') });


  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setRole('consultant');
    setAvatarBase64('');
    setLanguages('');
    setNationalities('');
    setBio('');
    setCommissionRate(10);
    setCustomPermissionsEnabled(false);
    setCustomMenus([]);
    setCustomCards([]);
    setCustomCanManageOverrides(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setOpenAddModal(true);
  };

  const handleOpenEditModal = (agent) => {
    setSelectedAgent(agent);
    setName(agent.name || '');
    setEmail(agent.email || '');
    setPhone(agent.phone || '');
    setRole(agent.role || 'consultant');
    setAvatarBase64(agent.avatar || '');
    setLanguages(agent.languages ? agent.languages.join(', ') : '');
    setNationalities(agent.nationalities ? agent.nationalities.join(', ') : '');
    setBio(agent.bio || '');
    setCommissionRate(agent.commissionRate !== undefined ? agent.commissionRate : 10);
    setCustomPermissionsEnabled(agent.customPermissions?.enabled || false);
    setCustomMenus(agent.customPermissions?.menus || []);
    setCustomCards(agent.customPermissions?.cards || []);
    setCustomCanManageOverrides(agent.customPermissions?.canManageOverrides || false);
    setOpenEditModal(true);
  };

  const handleOpenResetPasswordModal = (agent) => {
    setSelectedAgent(agent);
    setOpenResetPasswordModal(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showAlert('Image must be less than 2MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setAvatarBase64(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim() || !languages.trim()) {
      showAlert('Please fill in all required fields.', 'warning');
      return;
    }

    const langsArray = languages.split(',').map((l) => l.trim()).filter(Boolean);
    const nationalitiesArray = nationalities.split(',').map((n) => n.trim()).filter(Boolean);

    createAgentMutation.mutate({
      name,
      email,
      password,
      phone,
      role,
      avatar: avatarBase64,
      languages: langsArray,
      nationalities: nationalitiesArray,
      bio,
      commissionRate,
      customPermissions: {
        enabled: customPermissionsEnabled,
        menus: customMenus,
        cards: customCards,
        canManageOverrides: customCanManageOverrides
      }
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !languages.trim()) {
      showAlert('Please fill in all required fields.', 'warning');
      return;
    }

    const langsArray = languages.split(',').map((l) => l.trim()).filter(Boolean);
    const nationalitiesArray = nationalities.split(',').map((n) => n.trim()).filter(Boolean);

    updateAgentMutation.mutate({
      id: selectedAgent.id,
      name,
      email,
      phone,
      role,
      avatar: avatarBase64,
      languages: langsArray,
      nationalities: nationalitiesArray,
      bio,
      commissionRate,
      customPermissions: {
        enabled: customPermissionsEnabled,
        menus: customMenus,
        cards: customCards,
        canManageOverrides: customCanManageOverrides
      }
    });
  };

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      showAlert('Please enter a password.', 'warning');
      return;
    }
    resetPasswordMutation.mutate({ id: selectedAgent.id, newPassword });
  };

  const handleDeleteAgent = (id, name) => {
    if (window.confirm(`Are you sure you want to remove Agent ${name}?`)) {
      deleteAgentMutation.mutate(id);
    }
  };

  const activeAgent = agents.find((a) => a.id === activeAgentId);

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-');
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getPeriodRange = (rangeType, customDaysVal = 14) => {
    const todayDateStr = '2026-06-18';
    const today = parseDate(todayDateStr);
    let start, end;

    if (rangeType === 'Last 7 Days') {
      end = new Date(today);
      start = new Date(today);
      start.setDate(today.getDate() - 6);
    } else if (rangeType === 'Last 30 Days') {
      end = new Date(today);
      start = new Date(today);
      start.setDate(today.getDate() - 29);
    } else if (rangeType === 'Custom Days') {
      end = new Date(today);
      start = new Date(today);
      start.setDate(today.getDate() - (customDaysVal - 1));
    } else if (rangeType === 'This Year') {
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
    } else {
      // All Time
      start = new Date(2000, 0, 1);
      end = new Date(2100, 0, 1);
    }

    return {
      start: formatDate(start),
      end: formatDate(end)
    };
  };

  // Compute KPIs for the active Agent (supporting date-range filters)
  const getAgentKPIs = (agent, rangeType = 'All Time', customDaysVal = 14) => {
    if (!agent) return {};

    const { start, end } = getPeriodRange(rangeType, customDaysVal);

    const rawConsultations = allConsultations.filter((c) => c.assignedConsultantId === agent.id);
    const rawClients = allClients.filter((cl) => cl.assignedConsultantId === agent.id);
    const rawLeads = allLeads.filter((ld) => ld.assignedConsultantId === agent.id);

    const agentConsultations = rawConsultations.filter(
      (c) => rangeType === 'All Time' || (c.meetingDate >= start && c.meetingDate <= end)
    );
    const agentClients = rawClients.filter(
      (cl) => rangeType === 'All Time' || (cl.onboardingDate >= start && cl.onboardingDate <= end)
    );
    const agentLeads = rawLeads.filter(
      (ld) => rangeType === 'All Time' || (ld.date >= start && ld.date <= end)
    );

    // Total Consultations
    const totalConsultations = agentConsultations.length;

    // Today's Consultations
    const todayDateStr = '2026-06-18';
    const todayConsultations = rawConsultations.filter((c) => c.meetingDate === todayDateStr).length;

    // Upcoming Consultations
    const upcomingConsultations = agentConsultations.filter((c) => c.status === 'Scheduled').length;

    // Converted Clients and Payments
    const clientIds = agentClients.map((cl) => cl.id);
    const agentPayments = allPayments.filter(
      (p) => clientIds.includes(p.clientId) && (rangeType === 'All Time' || ((p.paymentDate || p.dueDate) >= start && (p.paymentDate || p.dueDate) <= end))
    );

    // Pending Payments count
    const pendingPaymentsCount = agentPayments.filter((p) => p.status === 'Pending').length;

    // Total Revenue (Closed)
    const totalRevenueClosed = agentPayments
      .filter((p) => p.status === 'Paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    // Active Cases (still under process, visaStatus !== 'Approved' and status !== 'Completed')
    const activeCases = agentClients.filter(
      (cl) => cl.visaStatus !== 'Approved' && cl.status !== 'Completed'
    ).length;

    // Closed Cases
    const closedCases = agentClients.filter(
      (cl) => cl.visaStatus === 'Approved' || cl.status === 'Completed'
    ).length;

    // Client No-Show / Cancelled
    const clientNoShowCancelled = agentConsultations.filter(
      (c) => c.status === 'No-Show' || c.status === 'Cancelled'
    ).length;

    // Agent No-Show (simulated data check or fallback mock logic)
    const agentNoShow = agentConsultations.filter((c) => c.noShow === 'agent').length || 0;

    // Agent Cancelled Meetings (simulated data check or fallback mock logic)
    const agentCancelled = agentConsultations.filter((c) => c.cancelledBy === 'agent').length || 0;

    // Agent Leads (from card scans / references)
    const agentLeadsCount = agentLeads.length;

    // Conversion Rate (%) = (Closed Cases ÷ Total Consultations) × 100
    const conversionRate =
      totalConsultations > 0 ? Math.round((closedCases / totalConsultations) * 100) : 0;

    // Agent Commission (dynamic rate from agent.commissionRate or fallback to 10)
    const rate = agent.commissionRate !== undefined ? agent.commissionRate : 10;
    
    // Monthly Agent Commission (simulated for current mock month 2026-06)
    const currentMonthStr = '2026-06';
    const monthlyRevenue = allPayments.filter(p => clientIds.includes(p.clientId))
      .filter((p) => p.status === 'Paid' && (p.paymentDate || p.dueDate)?.startsWith(currentMonthStr))
      .reduce((sum, p) => sum + (p.totalPaid || 0), 0);
    const monthlyCommission = Math.round(monthlyRevenue * (rate / 100));

    // Total Commission since joining
    const totalCommissionSinceJoining = Math.round(totalRevenueClosed * (rate / 100));

    return {
      totalConsultations,
      todayConsultations,
      upcomingConsultations,
      pendingPaymentsCount,
      totalRevenueClosed,
      activeCases,
      closedCases,
      clientNoShowCancelled,
      agentNoShow,
      agentCancelled,
      agentLeadsCount,
      conversionRate,
      monthlyCommission,
      totalCommissionSinceJoining };
  };

  const getAgentHistory = (agent) => {
    if (!agent) return [];
    
    const list = [];
    
    // 1. Join event
    list.push({
      id: 'join',
      date: agent.joiningDate || '2025-01-15',
      title: 'Joined AAA Consultancy Team',
      description: 'Account registered as Spain Immigration Consultant.',
      type: 'system',
      icon: 'person'
    });
    
    // 2. Consultations
    const agentConsultations = allConsultations.filter(c => c.assignedConsultantId === agent.id);
    agentConsultations.forEach(c => {
      list.push({
        id: `c_${c.id}`,
        date: c.meetingDate || '2025-06-01',
        title: `Consultation Booked: ${c.firstName} ${c.lastName}`,
        description: `Slot: ${c.slot} | Preferred Language: ${c.preferredLanguage} | Status: ${c.status}`,
        type: 'consultation',
        icon: 'meeting'
      });
    });
    
    // 3. Client Cases
    const agentClients = allClients.filter(cl => cl.assignedConsultantId === agent.id);
    agentClients.forEach(cl => {
      list.push({
        id: `cl_open_${cl.id}`,
        date: cl.onboardingDate || '2025-02-10',
        title: `Client Onboarded: ${cl.firstName} ${cl.lastName}`,
        description: `Visa Case started for Spain ${cl.serviceId?.toUpperCase() || 'Immigration'}. Current Status: ${cl.status}`,
        type: 'case',
        icon: 'case'
      });
      
      if (cl.status === 'Completed' || cl.visaStatus === 'Approved') {
        list.push({
          id: `cl_close_${cl.id}`,
          date: cl.completionDate || cl.onboardingDate || '2025-06-15',
          title: `Visa Approved: ${cl.firstName} ${cl.lastName}`,
          description: `Spain Visa application successfully approved and case file closed.`,
          type: 'case',
          icon: 'check'
        });
      }
    });
    
    // 4. Payments
    const clientIds = agentClients.map(cl => cl.id);
    const agentPayments = allPayments.filter(p => clientIds.includes(p.clientId));
    agentPayments.forEach(p => {
      list.push({
        id: `pay_${p.id}`,
        date: p.paymentDate || p.dueDate || '2025-06-01',
        title: p.status === 'Paid' ? `Invoice Paid: €${p.amount - (p.discount || 0)}` : `Invoice Issued (Pending): €${p.amount - (p.discount || 0)}`,
        description: `Invoice: ${p.id} | Method: ${p.paymentMethod || 'Credit Card'} | Status: ${p.status} | Agent Commission (10%): €${Math.round((p.amount - (p.discount || 0)) * 0.1)}`,
        type: 'payment',
        icon: 'payment'
      });
    });
    
    return list.sort((a, b) => b.date.localeCompare(a.date));
  };

  const kpis = getAgentKPIs(activeAgent, timeRange, customDays);

  const handleKPIBoxClick = (kpiName) => {
    if (!activeAgent) return;
    const { start, end } = getPeriodRange(timeRange, customDays);

    const rawConsultations = allConsultations.filter((c) => c.assignedConsultantId === activeAgent.id);
    const rawClients = allClients.filter((cl) => cl.assignedConsultantId === activeAgent.id);
    const rawLeads = allLeads.filter((ld) => ld.assignedConsultantId === activeAgent.id);
    
    const agentConsultations = rawConsultations.filter(
      (c) => timeRange === 'All Time' || (c.meetingDate >= start && c.meetingDate <= end)
    );
    const agentClients = rawClients.filter(
      (cl) => timeRange === 'All Time' || (cl.onboardingDate >= start && cl.onboardingDate <= end)
    );
    const agentLeads = rawLeads.filter(
      (ld) => timeRange === 'All Time' || (ld.date >= start && ld.date <= end)
    );

    const agentClientIds = agentClients.map((c) => c.id);
    const agentPayments = allPayments.filter(
      (p) => agentClientIds.includes(p.clientId) && (timeRange === 'All Time' || ((p.paymentDate || p.dueDate) >= start && (p.paymentDate || p.dueDate) <= end))
    );
    const todayDateStr = '2026-06-18';

    let data = [];
    let type = '';
    let title = '';

    if (kpiName === 'Total Consultations') {
      title = `${activeAgent.name}'s Total Consultations`;
      data = agentConsultations;
      type = 'consultation';
    } else if (kpiName === "Today's Consultations") {
      title = `${activeAgent.name}'s Today's Consultations`;
      data = agentConsultations.filter(c => c.meetingDate === todayDateStr);
      type = 'consultation';
    } else if (kpiName === 'Upcoming Consultations') {
      title = `${activeAgent.name}'s Upcoming Consultations`;
      data = agentConsultations.filter(c => c.status === 'Scheduled');
      type = 'consultation';
    } else if (kpiName === 'Active Cases') {
      title = `${activeAgent.name}'s Active Cases`;
      data = agentClients.filter(cl => cl.status === 'Under Process');
      type = 'client';
    } else if (kpiName === 'Closed Cases') {
      title = `${activeAgent.name}'s Closed Cases`;
      data = agentClients.filter(cl => cl.status === 'Completed');
      type = 'client';
    } else if (kpiName === 'Pending Payments') {
      title = `${activeAgent.name}'s Pending Invoices`;
      data = agentPayments.filter(p => p.status === 'Pending');
      type = 'payment';
    } else if (kpiName === 'Total Revenue') {
      title = `${activeAgent.name}'s Closed Revenue Payments`;
      data = agentPayments.filter(p => p.status === 'Paid');
      type = 'payment';
    } else if (kpiName === 'Client No-Show / Cancelled') {
      title = `${activeAgent.name}'s Client Missed / Cancelled Meetings`;
      data = agentConsultations.filter(c => c.status === 'No-Show' || c.status === 'Cancelled');
      type = 'consultation';
    } else if (kpiName === 'Agent No-Show') {
      title = `${activeAgent.name}'s Agent No-Shows`;
      data = agentConsultations.filter(c => c.noShow === 'agent');
      type = 'consultation';
    } else if (kpiName === 'Agent Cancelled Meetings') {
      title = `${activeAgent.name}'s Agent Cancellations`;
      data = agentConsultations.filter(c => c.cancelledBy === 'agent');
      type = 'consultation';
    } else if (kpiName === 'Agent Leads') {
      title = `${activeAgent.name}'s Leads`;
      data = agentLeads;
      type = 'client';
    } else if (kpiName === 'Conversion Rate') {
      title = `${activeAgent.name}'s Completed Consultations for Conversion`;
      data = agentConsultations.filter(c => c.status === 'Completed');
      type = 'consultation';
    } else if (kpiName === 'Monthly Agent Commission') {
      title = `${activeAgent.name}'s June 2026 Commission Paid Invoices`;
      data = allPayments.filter(p => clientIds.includes(p.clientId))
        .filter((p) => p.status === 'Paid' && (p.paymentDate || p.dueDate)?.startsWith('2026-06'));
      type = 'payment';
    } else if (kpiName === 'Total Commission') {
      title = `${activeAgent.name}'s Lifetime Paid Commission Invoices`;
      data = allPayments.filter(p => clientIds.includes(p.clientId) && p.status === 'Paid');
      type = 'payment';
    } else {
      return;
    }

    setModalTitle(title);
    setModalData(data);
    setModalType(type);
    setDetailsModalOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        title="Agents Management"
        subtitle="Manage agent accounts, review key performance metrics, commissions, and access privileges."
        action={
          (() => {
            // Check granular createUser permission
            if (currentUser?.customPermissions?.enabled) {
              if (!currentUser.customPermissions.granular?.createUser) return null;
            }
            return (isAdmin || isSuperAdmin) ? (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleOpenAddModal}
                sx={{ borderRadius: 2.5, fontWeight: 700 }}
              >
                Add New Team/Agent
              </Button>
            ) : null;
          })()
        }

      />

      <Box className="grid grid-cols-12 gap-2" sx={{ flexGrow: 1, minHeight: 0, width: '100%' }}>
        {/* Left Side: Agent List Panel */}
        {view === 'list' && (
          <Box className="col-span-12" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                overflow: 'hidden' }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.neutral' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                    Agents Directory
                  </Typography>
                  {/* Custom Override Summary Badge */}
                  {(() => {
                    const overrideCount = agents.filter(a => a.customPermissions?.enabled).length;
                    return overrideCount > 0 ? (
                      <Tooltip title={`${overrideCount} agent${overrideCount > 1 ? 's have' : ' has'} individual permission overrides active — shown with a purple badge`} arrow>
                        <Chip
                          icon={<TuneIcon sx={{ fontSize: '0.85rem !important' }} />}
                          label={`${overrideCount} Custom Override${overrideCount > 1 ? 's' : ''} Active`}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(124, 58, 237, 0.12)',
                            color: '#7C3AED',
                            fontWeight: 700,
                            fontSize: '0.7rem',
                            border: '1px solid rgba(124, 58, 237, 0.3)',
                            '& .MuiChip-icon': { color: '#7C3AED' },
                            cursor: 'default'
                          }}
                        />
                      </Tooltip>
                    ) : null;
                  })()}
                </Box>
              </Box>

                <TableContainer sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800 }}>Avatar</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Calls</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Leads</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Revenue</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>Conversion</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 800 }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {agents.map((agent) => {
                        // Mock data for travel stats if not present
                        const calls = agent.calls || Math.floor(Math.random() * 20) + 5;
                        const leadsAssigned = agent.leadsAssigned || Math.floor(Math.random() * 40) + 10;
                        const leadsClosed = agent.leadsClosed || Math.floor(Math.random() * leadsAssigned);
                        const revenue = agent.revenue || (leadsClosed * (Math.floor(Math.random() * 500) + 1000));
                        const conversion = Math.round((leadsClosed / leadsAssigned) * 100) || 0;
                        const isOnline = agent.status === 'Active' || agent.status === 'Online';
                        
                        return (
                          <TableRow key={agent.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                              <Avatar src={agent.avatar} alt={agent.name} />
                            </TableCell>
                            <TableCell>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{agent.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{agent.email}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={agent.role === 'admin' ? 'Admin' : agent.role === 'operations' ? 'Operations' : agent.role === 'finance' ? 'Finance' : agent.role === 'marketing' ? 'Marketing' : 'Agent'}
                                size="small"
                                color={agent.role === 'admin' ? 'primary' : agent.role === 'operations' ? 'info' : agent.role === 'finance' ? 'warning' : agent.role === 'marketing' ? 'success' : 'secondary'}
                                sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip label={isOnline ? '🟢 On Call' : '🟡 Away'} size="small" variant="outlined" sx={{ border: 'none', fontWeight: 600, color: isOnline ? 'success.main' : 'warning.main' }} />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{calls}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{leadsClosed}/{leadsAssigned}</TableCell>
                            <TableCell sx={{ fontWeight: 700, color: 'success.main' }}>${revenue.toLocaleString()}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>{conversion}%</TableCell>
                            <TableCell align="center">
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  color="primary" 
                                  sx={{ borderRadius: 1.5, fontSize: '0.72rem', py: 0.2 }}
                                  onClick={() => {
                                    setActiveAgentId(agent.id);
                                    setView('details');
                                  }}
                                >
                                  View
                                </Button>
                                {(isAdmin || isSuperAdmin) && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<VerifiedUserIcon sx={{ fontSize: 13 }} />}
                                    sx={{ borderRadius: 1.5, fontSize: '0.7rem', py: 0.2 }}
                                    onClick={() => handleOpenPermsModal(agent)}
                                  >
                                    Permissions
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
            </Paper>
          </Box>
        )}

        {/* Right Side: Active Agent Dashboard Pane */}
        {view === 'details' && (
          <Box className="col-span-12" sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            {activeAgent ? (
              <Paper
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: 'none',
                  overflowY: 'auto',
                  p: 3,
                  position: 'relative'
                }}
              >
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setView('list')}
                  sx={{ alignSelf: 'flex-start', mb: 2, fontWeight: 700 }}
                  variant="outlined"
                  size="small"
                  color="secondary"
                >
                  Back to Directory
                </Button>
                {/* Header Info */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar src={activeAgent.avatar} sx={{ width: 70, height: 70 }} />
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {activeAgent.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activeAgent.email} | {activeAgent.phone}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        <strong>Joining Date:</strong> {activeAgent.joiningDate || '2025-01-15'} | <strong>Nationalities:</strong> {activeAgent.nationalities?.join(', ') || 'N/A'}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        {activeAgent.languages?.map((l) => (
                          <Chip key={l} label={l} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                      select
                      size="small"
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      sx={{ minWidth: 150, bgcolor: 'background.paper' }}
                      InputProps={{ style: { fontWeight: 700, fontSize: '0.85rem' } }}
                    >
                      <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                      <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                      <MenuItem value="Custom Days">Custom Days</MenuItem>
                      <MenuItem value="This Year">This Year</MenuItem>
                      <MenuItem value="All Time">All Time</MenuItem>
                    </TextField>
                    {timeRange === 'Custom Days' && (
                      <TextField
                        type="number"
                        size="small"
                        label="Days"
                        value={customDays}
                        onChange={(e) => setCustomDays(Math.max(1, Number(e.target.value)))}
                        sx={{ width: 80, bgcolor: 'background.paper' }}
                        inputProps={{ min: 1, style: { fontWeight: 700, fontSize: '0.85rem' } }}
                      />
                    )}

                    {(isAdmin || isSuperAdmin) && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          startIcon={<VerifiedUserIcon />}
                          onClick={() => handleOpenPermsModal(activeAgent)}
                          sx={{ borderRadius: 2, fontWeight: 700 }}
                        >
                          🛡️ Permissions & Scope
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenEditModal(activeAgent)}
                          sx={{ borderRadius: 2 }}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          startIcon={<LockResetIcon />}
                          onClick={() => handleOpenResetPasswordModal(activeAgent)}
                          sx={{ borderRadius: 2 }}
                        >
                          Reset Password
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteAgent(activeAgent.id, activeAgent.name)}
                          sx={{ borderRadius: 2 }}
                        >
                          Remove
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: 1, minWidth: 250, p: 2, bgcolor: 'background.neutral', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1.5, textTransform: 'uppercase' }}>
                      Performance (Travel-Specific)
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Calls (Today/Month)</Typography>
                        <Typography variant="body2" fontWeight={700}>15 / 142</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Avg Call Duration</Typography>
                        <Typography variant="body2" fontWeight={700}>4m 32s</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Leads Closed</Typography>
                        <Typography variant="body2" fontWeight={700}>8 / 33 Assigned</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">Conversion Rate</Typography>
                        <Typography variant="body2" fontWeight={700} color="success.main">68%</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ flex: 1, minWidth: 250, p: 2, bgcolor: 'background.neutral', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1.5, textTransform: 'uppercase' }}>
                      Agent Skills & Expertise
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">GDS Proficiency</Typography>
                        <Typography variant="body2" fontWeight={700}>Sabre, Amadeus</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Specialized Routes</Typography>
                        <Typography variant="body2" fontWeight={700}>Europe, Middle East</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">Flight Classes</Typography>
                        <Typography variant="body2" fontWeight={700}>Business, First Class</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                  <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} color="secondary">
                    <Tab label="Performance Dashboard" sx={{ fontWeight: 700 }} />
                    <Tab label="Activity History Log" sx={{ fontWeight: 700 }} />
                  </Tabs>
                </Box>

                {activeTab === 0 ? (
                  <Box>
                    {/* 13 KPI Boxes Grid */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                      Agent Performance Metrics Dashboard
                    </Typography>

                    <Box className="grid grid-cols-12 gap-2" sx={{ mb: 3 }}>
                      {/* 1. Total Consultations */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Total Consultations')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Total Consultations</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.totalConsultations}</Typography>
                        </Paper>
                      </Box>

                      {/* 2. Today's Consultations */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick("Today's Consultations")}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Today's Consultations</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.todayConsultations}</Typography>
                        </Paper>
                      </Box>

                      {/* 3. Upcoming Consultations */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Upcoming Consultations')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Upcoming Consultations</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.upcomingConsultations}</Typography>
                        </Paper>
                      </Box>

                      {/* 4. Pending Payments */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Pending Payments')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Pending Payments</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'warning.main' }}>{kpis.pendingPaymentsCount}</Typography>
                        </Paper>
                      </Box>

                      {/* 5. Total Revenue (Closed) */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Total Revenue')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Total Revenue</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'success.main' }}>€{kpis.totalRevenueClosed.toLocaleString()}</Typography>
                        </Paper>
                      </Box>

                      {/* 6. Active Cases */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Active Cases')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Active Cases</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.activeCases}</Typography>
                        </Paper>
                      </Box>

                      {/* 7. Closed Cases */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Closed Cases')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Closed Cases</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.closedCases}</Typography>
                        </Paper>
                      </Box>

                      {/* 8. Client No-Show / Cancelled */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Client No-Show / Cancelled')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Client No-Show / Canceled</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.clientNoShowCancelled}</Typography>
                        </Paper>
                      </Box>

                      {/* 9. Agent No-Show */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Agent No-Show')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Agent No-Show</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'error.main' }}>{kpis.agentNoShow}</Typography>
                        </Paper>
                      </Box>

                      {/* 10. Agent Cancelled Meetings */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Agent Cancelled Meetings')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Agent Cancelled Meetings</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'error.main' }}>{kpis.agentCancelled}</Typography>
                        </Paper>
                      </Box>

                      {/* 11. Agent Leads */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Tooltip title="This displays lead entries initialized from digital QR business card scans for this agent reference. Click to view detailed leads directory." placement="top">
                          <Paper 
                            onClick={() => handleKPIBoxClick('Agent Leads')}
                            sx={{ p: 2, border: '2px dashed', borderColor: 'primary.main', bgcolor: 'primary.neutral', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' }, position: 'relative' }}
                          >
                            <Box sx={{ position: 'absolute', top: 5, right: 5, color: 'primary.main', display: 'flex' }}><InfoIcon sx={{ fontSize: '0.85rem' }} /></Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Agent Leads</Typography>
                            <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.agentLeadsCount}</Typography>
                          </Paper>
                        </Tooltip>
                      </Box>

                       {/* 12. Conversion Rate */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Conversion Rate')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'secondary.main', bgcolor: 'secondary.neutral', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 700, display: 'block' }}>Conversion Rate</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.conversionRate}%</Typography>
                        </Paper>
                      </Box>

                      {/* 13. Monthly Agent Commission Earned */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Monthly Agent Commission')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Monthly Agent Commission Earned</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'amber.950' }}>€{kpis.monthlyCommission.toLocaleString()}</Typography>
                        </Paper>
                      </Box>

                      {/* 14. Total Commission Since Joining */}
                      <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                        <Paper 
                          onClick={() => handleKPIBoxClick('Total Commission')}
                          sx={{ p: 2, border: '2px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s ease-in-out', '&:hover': { borderColor: '#D97706', bgcolor: '#FFFBEB', transform: 'translateY(-2px)' }, '&:active': { transform: 'scale(0.98)' } }}
                        >
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Total Commission Since Joining</Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'success.main' }}>€{kpis.totalCommissionSinceJoining.toLocaleString()}</Typography>
                        </Paper>
                      </Box>
                    </Box>

                    {/* Highlight Commission Box */}
                    <Paper sx={{ p: 3, bgcolor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box>
                        <Typography variant="subtitle2" color="amber.900" sx={{ fontWeight: 800 }}>Total Commission Earned since joining ({activeAgent.commissionRate !== undefined ? activeAgent.commissionRate : 10}%)</Typography>
                        <Typography variant="caption" color="amber.850">Calculated automatically on paid invoice totals closed by this agent.</Typography>
                      </Box>
                      <Typography variant="h4" color="amber.900" sx={{ fontWeight: 900 }}>€{kpis.totalCommissionSinceJoining.toLocaleString()}</Typography>
                    </Paper>

                    <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary', textTransform: 'uppercase' }}>Biography</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{activeAgent.bio || 'No biography recorded for this agent.'}</Typography>
                  </Box>
                ) : (
                  <Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        Complete Activity Logs & History ({getAgentHistory(activeAgent).filter(item => {
                          const matchesSearch = item.title.toLowerCase().includes(historySearch.toLowerCase()) || 
                                                item.description.toLowerCase().includes(historySearch.toLowerCase()) ||
                                                item.date.includes(historySearch);
                          const matchesFilter = historyFilter === 'all' || 
                                                (historyFilter === 'consultations' && item.type === 'consultation') ||
                                                (historyFilter === 'cases' && item.type === 'case') ||
                                                (historyFilter === 'payments' && item.type === 'payment');
                          return matchesSearch && matchesFilter;
                        }).length})
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <TextField
                          size="small"
                          placeholder="Search logs..."
                          value={historySearch}
                          onChange={(e) => setHistorySearch(e.target.value)}
                          sx={{ width: 220 }}
                        />
                        <TextField
                          select
                          size="small"
                          value={historyFilter}
                          onChange={(e) => setHistoryFilter(e.target.value)}
                          sx={{ minWidth: 150 }}
                        >
                          <MenuItem value="all">All Activities</MenuItem>
                          <MenuItem value="consultations">Consultations</MenuItem>
                          <MenuItem value="cases">Client Cases</MenuItem>
                          <MenuItem value="payments">Payments & Invoices</MenuItem>
                        </TextField>
                      </Box>
                    </Box>

                    {getAgentHistory(activeAgent).filter(item => {
                      const matchesSearch = item.title.toLowerCase().includes(historySearch.toLowerCase()) || 
                                            item.description.toLowerCase().includes(historySearch.toLowerCase()) ||
                                            item.date.includes(historySearch);
                      const matchesFilter = historyFilter === 'all' || 
                                            (historyFilter === 'consultations' && item.type === 'consultation') ||
                                            (historyFilter === 'cases' && item.type === 'case') ||
                                            (historyFilter === 'payments' && item.type === 'payment');
                      return matchesSearch && matchesFilter;
                    }).length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No matching activity logs found.
                      </Typography>
                    ) : (
                      <Box sx={{ position: 'relative', pl: 4, '&::before': { content: '""', position: 'absolute', left: 15, top: 8, bottom: 8, width: 2, bgcolor: 'divider' } }}>
                        {getAgentHistory(activeAgent).filter(item => {
                          const matchesSearch = item.title.toLowerCase().includes(historySearch.toLowerCase()) || 
                                                item.description.toLowerCase().includes(historySearch.toLowerCase()) ||
                                                item.date.includes(historySearch);
                          const matchesFilter = historyFilter === 'all' || 
                                                (historyFilter === 'consultations' && item.type === 'consultation') ||
                                                (historyFilter === 'cases' && item.type === 'case') ||
                                                (historyFilter === 'payments' && item.type === 'payment');
                          return matchesSearch && matchesFilter;
                        }).map((item, idx) => {
                          let dotColor = 'primary.main';
                          let bgLight = '#EFF6FF';
                          if (item.type === 'case') {
                            dotColor = 'secondary.main';
                            bgLight = '#F5F3FF';
                          } else if (item.type === 'payment') {
                            dotColor = 'success.main';
                            bgLight = '#ECFDF5';
                          } else if (item.type === 'system') {
                            dotColor = 'amber.700';
                            bgLight = '#FFFBEB';
                          }

                          return (
                            <Box key={item.id} sx={{ position: 'relative', mb: 3 }}>
                              {/* Timeline Dot Icon */}
                              <Box 
                                sx={{ 
                                  position: 'absolute', 
                                  left: -33, 
                                  top: 2, 
                                  width: 24, 
                                  height: 24, 
                                  borderRadius: '50%', 
                                  bgcolor: dotColor, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 'bold',
                                  boxShadow: 2
                                }}
                              >
                                {item.icon === 'person' && '👤'}
                                {item.icon === 'meeting' && '📅'}
                                {item.icon === 'case' && '📁'}
                                {item.icon === 'check' && '✅'}
                                {item.icon === 'payment' && '💶'}
                              </Box>

                              <Paper 
                                sx={{ 
                                  p: 2, 
                                  border: '1px solid', 
                                  borderColor: 'divider', 
                                  boxShadow: 'none', 
                                  borderRadius: 2.5,
                                  bgcolor: bgLight,
                                  '&:hover': {
                                    borderColor: '#D97706',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                  },
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                    {item.title}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    Date: {item.date}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                                  {item.description}
                                </Typography>
                              </Paper>
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            ) : (
              <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 3, p: 3, position: 'relative' }}>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={() => setView('list')}
                  sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 700 }}
                  variant="outlined"
                  size="small"
                  color="secondary"
                >
                  Back to Directory
                </Button>
                <Typography color="text.secondary">No agent accounts active.</Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>

      {/* MODAL: Add New Agent */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            mx: { xs: 1.5, sm: 3 },
            my: { xs: 1, sm: 2 },
            maxHeight: { xs: 'calc(100dvh - 32px)', sm: '85vh' },
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', py: 2, px: { xs: 2, sm: 3 } }}>Register Team / Agent Account</DialogTitle>
        <DialogContent
          className="modal-scroll"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            pt: 2.5,
            pb: 2,
            px: { xs: 2, sm: 3 },
            maxHeight: { xs: '55vh', sm: '60vh', md: '65vh' },
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={avatarBase64} sx={{ width: 90, height: 90, mb: 1, border: '1px dashed', borderColor: 'divider' }} />
            <Button variant="outlined" component="label" size="small" startIcon={<PhotoCamera />} sx={{ borderRadius: 2 }}>
              Upload Photo
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>
          </Box>
          <TextField label="Full Name *" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          <TextField label="Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
          <TextField label="Password *" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required helperText="Provide credentials for the agent login." />
          <TextField label="Hotline Number *" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth required />
          <TextField
            select
            label="User Role *"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            required
            helperText="Assign the system role determining permissions and sidebar access."
          >
            <MenuItem value="admin">Admin (General Manager)</MenuItem>
            <MenuItem value="operations">Operations Manager</MenuItem>
            <MenuItem value="finance">Finance Manager</MenuItem>
            <MenuItem value="consultant">Agent (Spain Visa Expert)</MenuItem>
            <MenuItem value="marketing">Marketing Executive</MenuItem>
          </TextField>
          <TextField label="Spoken Languages (comma-separated) *" placeholder="English, Spanish" value={languages} onChange={(e) => setLanguages(e.target.value)} fullWidth required />
          <TextField label="Nationalities (comma-separated)" placeholder="British" value={nationalities} onChange={(e) => setNationalities(e.target.value)} fullWidth />
          <TextField
            label="Commission Rate (%)"
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(Math.max(0, Math.min(100, Number(e.target.value))))}
            fullWidth
            required
            helperText="Specify the commission percentage of total closed revenue (e.g. 10)."
          />
          <TextField label="Immigration Bio Description" multiline rows={3} value={bio} onChange={(e) => setBio(e.target.value)} fullWidth />
          
          <FormControlLabel
            control={
              <Switch
                checked={customPermissionsEnabled}
                onChange={(e) => setCustomPermissionsEnabled(e.target.checked)}
                color="secondary"
              />
            }
            label={<strong>Custom Permissions Override</strong>}
          />

          {customPermissionsEnabled && (
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'action.hover' }}>
              {(role === 'admin' || role === 'operations') && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={customCanManageOverrides}
                        onChange={(e) => setCustomCanManageOverrides(e.target.checked)}
                        color="secondary"
                        size="small"
                      />
                    }
                    label={<Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 800 }}>Can customize other team members' permissions</Typography>}
                  />
                  <Divider sx={{ my: 1.5 }} />
                </>
              )}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Allowed Sidebar Pages (Menus)</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
                {AVAILABLE_MENUS.map((menuName) => (
                  <FormControlLabel
                    key={menuName}
                    control={
                      <Checkbox
                        size="small"
                        checked={customMenus.includes(menuName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomMenus([...customMenus, menuName]);
                          } else {
                            setCustomMenus(customMenus.filter((m) => m !== menuName));
                          }
                        }}
                      />
                    }
                    label={<Typography variant="body2">{menuName}</Typography>}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Allowed Dashboard KPI Cards</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
                {AVAILABLE_CARDS.map((cardName) => (
                  <FormControlLabel
                    key={cardName}
                    control={
                      <Checkbox
                        size="small"
                        checked={customCards.includes(cardName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomCards([...customCards, cardName]);
                          } else {
                            setCustomCards(customCards.filter((c) => c !== cardName));
                          }
                        }}
                      />
                    }
                    label={<Typography variant="body2">{cardName}</Typography>}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary" disabled={createAgentMutation.isPending}>Register Agent</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL: Edit Agent */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            mx: { xs: 1.5, sm: 3 },
            my: { xs: 1, sm: 2 },
            maxHeight: { xs: 'calc(100dvh - 32px)', sm: '85vh' },
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', py: 2, px: { xs: 2, sm: 3 } }}>Edit Agent Profile</DialogTitle>
        <DialogContent
          className="modal-scroll"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            pt: 2.5,
            pb: 2,
            px: { xs: 2, sm: 3 },
            maxHeight: { xs: '55vh', sm: '60vh', md: '65vh' },
            overflowY: 'auto',
            overflowX: 'hidden',
            overscrollBehavior: 'contain',
            flexGrow: 1,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar src={avatarBase64} sx={{ width: 90, height: 90, mb: 1, border: '1px dashed', borderColor: 'divider' }} />
            <Button variant="outlined" component="label" size="small" startIcon={<PhotoCamera />} sx={{ borderRadius: 2 }}>
              Upload Photo
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>
          </Box>
          <TextField label="Full Name *" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
          <TextField label="Email Address *" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required />
          <TextField label="Hotline Number *" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth required />
          <TextField
            select
            label="User Role *"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
            required
            helperText="Update the user system role determining permissions and sidebar access."
          >
            <MenuItem value="admin">Admin (General Manager)</MenuItem>
            <MenuItem value="operations">Operations Manager</MenuItem>
            <MenuItem value="finance">Finance Manager</MenuItem>
            <MenuItem value="consultant">Agent (Spain Visa Expert)</MenuItem>
            <MenuItem value="marketing">Marketing Executive</MenuItem>
          </TextField>
          <TextField label="Spoken Languages (comma-separated) *" placeholder="English, Spanish" value={languages} onChange={(e) => setLanguages(e.target.value)} fullWidth required />
          <TextField label="Nationalities (comma-separated)" placeholder="British" value={nationalities} onChange={(e) => setNationalities(e.target.value)} fullWidth />
          <TextField
            label="Commission Rate (%) *"
            type="number"
            value={commissionRate}
            onChange={(e) => setCommissionRate(Math.max(0, Math.min(100, Number(e.target.value))))}
            fullWidth
            required
          />
          <TextField label="Immigration Bio Description" multiline rows={3} value={bio} onChange={(e) => setBio(e.target.value)} fullWidth />
          
          <FormControlLabel
            control={
              <Switch
                checked={customPermissionsEnabled}
                onChange={(e) => setCustomPermissionsEnabled(e.target.checked)}
                color="secondary"
              />
            }
            label={<strong>Custom Permissions Override</strong>}
          />

          {customPermissionsEnabled && (
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2, bgcolor: 'action.hover' }}>
              {(role === 'admin' || role === 'operations') && (
                <>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={customCanManageOverrides}
                        onChange={(e) => setCustomCanManageOverrides(e.target.checked)}
                        color="secondary"
                        size="small"
                      />
                    }
                    label={<Typography variant="subtitle2" sx={{ color: 'secondary.main', fontWeight: 800 }}>Can customize other team members' permissions</Typography>}
                  />
                  <Divider sx={{ my: 1.5 }} />
                </>
              )}
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Allowed Sidebar Pages (Menus)</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
                {AVAILABLE_MENUS.map((menuName) => (
                  <FormControlLabel
                    key={menuName}
                    control={
                      <Checkbox
                        size="small"
                        checked={customMenus.includes(menuName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomMenus([...customMenus, menuName]);
                          } else {
                            setCustomMenus(customMenus.filter((m) => m !== menuName));
                          }
                        }}
                      />
                    }
                    label={<Typography variant="body2">{menuName}</Typography>}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>Allowed Dashboard KPI Cards</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1 }}>
                {AVAILABLE_CARDS.map((cardName) => (
                  <FormControlLabel
                    key={cardName}
                    control={
                      <Checkbox
                        size="small"
                        checked={customCards.includes(cardName)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCustomCards([...customCards, cardName]);
                          } else {
                            setCustomCards(customCards.filter((c) => c !== cardName));
                          }
                        }}
                      />
                    }
                    label={<Typography variant="body2">{cardName}</Typography>}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="secondary" disabled={updateAgentMutation.isPending}>Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL: Reset Password Override */}
      <Dialog
        open={openResetPasswordModal}
        onClose={() => setOpenResetPasswordModal(false)}
        maxWidth="xs"
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
        <DialogTitle sx={{ fontWeight: 800, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', py: 2, px: { xs: 2, sm: 3 }, bgcolor: 'background.paper' }}>
          Reset Password Override
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Provide a new password for Agent <strong>{selectedAgent?.name}</strong>. They will be required to log in with these new credentials.
          </Typography>
          <TextField
            label="New Account Password *"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions sx={{ py: 2, px: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: 'background.paper' }}>
          <Button onClick={() => setOpenResetPasswordModal(false)}>Cancel</Button>
          <Button onClick={handleResetPasswordSubmit} variant="contained" color="secondary" disabled={resetPasswordMutation.isPending}>Reset Password</Button>
        </DialogActions>
      </Dialog>
      {/* MODAL: KPI Details Dialog */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
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
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, py: 2, px: { xs: 2, sm: 3 }, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider' }}>{modalTitle}</DialogTitle>
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
          }}
        >
          {modalData.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No records found for this category.
            </Typography>
          ) : (
            <Box>
              {modalType === 'consultation' && (
                <List>
                  {modalData.map((item, idx) => (
                    <Box key={idx} sx={{ mb: 1.5, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Meeting Date: {item.meetingDate} | Time: {item.slot}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Client Name: {item.firstName} {item.lastName} | Language: {item.preferredLanguage}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                        Status: <Chip label={item.status} size="small" color={item.status === 'Completed' ? 'success' : item.status === 'Scheduled' ? 'primary' : 'default'} />
                      </Typography>
                    </Box>
                  ))}
                </List>
              )}
              {modalType === 'client' && (
                <List>
                  {modalData.map((item, idx) => (
                    <Box key={idx} sx={{ mb: 1.5, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Client: {item.firstName} {item.lastName} (ID: {item.id})
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Nationality: {item.nationality} | Visa: {item.serviceId?.toUpperCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                        Status: <Chip label={item.status} size="small" color={item.status === 'Completed' ? 'success' : 'secondary'} />
                      </Typography>
                    </Box>
                  ))}
                </List>
              )}
              {modalType === 'payment' && (
                <List>
                  {modalData.map((item, idx) => (
                    <Box key={idx} sx={{ mb: 1.5, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Invoice ID: {item.id} | Amount: €{item.amount - item.discount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Method: {item.paymentMethod || 'N/A'} | Date: {item.paymentDate || item.dueDate}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                        Status: <Chip label={item.status} size="small" color={item.status === 'Paid' ? 'success' : 'warning'} />
                      </Typography>
                    </Box>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
          <Button onClick={() => setDetailsModalOpen(false)} variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {/* ─── GRANULAR PERMISSION & SCOPE MATRIX DIALOG ─── */}
      <Dialog
        open={openPermsModal}
        onClose={() => setOpenPermsModal(false)}
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
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1, borderBottom: '1px solid', borderColor: 'divider', py: 2, px: { xs: 2, sm: 3 }, flexShrink: 0 }}>
          <VerifiedUserIcon color="secondary" />
          Individual Permissions & Data Scope Matrix: {permsAgent?.name} ({permsAgent?.role})
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
          }}
        >
          {/* Top: Scope Selector */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2.5, bgcolor: '#F8FAFC' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  🌐 DATA VISIBILITY & ACCESS SCOPE
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Controls how far this staff member can view records across the organization
                </Typography>
              </Box>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Data Scope</InputLabel>
                <Select
                  value={permScope}
                  label="Data Scope"
                  onChange={(e) => setPermScope(e.target.value)}
                  sx={{ fontWeight: 800, bgcolor: 'background.paper' }}
                >
                  <MenuItem value="Own records">🔒 Own Records Only</MenuItem>
                  <MenuItem value="Own team">👥 Own Team</MenuItem>
                  <MenuItem value="Own department">🏢 Own Department</MenuItem>
                  <MenuItem value="Own branch">📍 Own Branch</MenuItem>
                  <MenuItem value="All records">🌐 All Records (Global)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* 6 Permission Action Categories */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {[
              {
                category: '📋 Leads Management',
                perms: [
                  { key: 'viewLead', label: 'View Leads' },
                  { key: 'createLead', label: 'Create New Leads' },
                  { key: 'editLead', label: 'Edit Lead Details' },
                  { key: 'assignLead', label: 'Assign Leads to Others' },
                  { key: 'reassignLead', label: 'Reassign Stalled Leads' },
                  { key: 'deleteLead', label: 'Delete / Purge Leads' },
                ]
              },
              {
                category: '👤 Customers & CRM',
                perms: [
                  { key: 'viewCustomer', label: 'View Customer 360' },
                  { key: 'editCustomer', label: 'Edit Customer Data' },
                  { key: 'exportCustomer', label: 'Export Customer CSV' },
                ]
              },
              {
                category: '📞 Calls & Communications',
                perms: [
                  { key: 'makeCall', label: 'Make Outbound Calls (WebRTC)' },
                  { key: 'viewCallRecording', label: 'Listen to Call Recordings' },
                  { key: 'downloadRecording', label: 'Download Recording Audio' },
                  { key: 'sendWhatsApp', label: 'Send WhatsApp Itinerary' },
                ]
              },
              {
                category: '✈️ Bookings & Ticketing',
                perms: [
                  { key: 'createBooking', label: 'Create PNR Bookings' },
                  { key: 'modifyBooking', label: 'Modify Travel Dates / PNR' },
                  { key: 'cancelBooking', label: 'Cancel Bookings' },
                  { key: 'createTicket', label: 'Issue 13-Digit E-Tickets' },
                  { key: 'voidTicket', label: 'Void / Cancel E-Tickets' },
                  { key: 'reissueTicket', label: 'Reissue & Date Change' },
                ]
              },
              {
                category: '💰 Finance & Settlements',
                perms: [
                  { key: 'viewPayment', label: 'View Gateway Payments' },
                  { key: 'createPaymentRequest', label: 'Generate Payment Links' },
                  { key: 'refundPayment', label: 'Authorize Refunds' },
                  { key: 'viewFinanceReports', label: 'View Profit & Margin P&L' },
                ]
              },
              {
                category: '⚙️ Administration & API',
                perms: [
                  { key: 'createUser', label: 'Create Staff Accounts' },
                  { key: 'disableUser', label: 'Deactivate / Block Users' },
                  { key: 'configureApi', label: 'Configure GDS / Telnyx API' },
                  { key: 'viewAuditLogs', label: 'View Full Audit Trail Logs' },
                ]
              },
            ].map((group) => (
              <Paper key={group.category} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                  {group.category}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ display: 'grid', gap: 0.5 }}>
                  {group.perms.map((p) => (
                    <FormControlLabel
                      key={p.key}
                      control={
                        <Checkbox
                          size="small"
                          checked={!!granularPerms[p.key]}
                          onChange={(e) => setGranularPerms({ ...granularPerms, [p.key]: e.target.checked })}
                          color="secondary"
                        />
                      }
                      label={<Typography variant="body2" sx={{ fontSize: '0.82rem', fontWeight: 600 }}>{p.label}</Typography>}
                    />
                  ))}
                </Box>
              </Paper>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
          <Button onClick={() => setOpenPermsModal(false)} variant="outlined" sx={{ fontWeight: 700 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveGranularPerms} variant="contained" color="secondary" sx={{ fontWeight: 800, px: 3 }}>
            Save Permissions & Scope
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminAgents;
