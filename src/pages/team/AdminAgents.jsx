import React, { useState, useEffect } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
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
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

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
    menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Finance', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance', 'Integrations'],
    cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Pending Payments', 'Total Revenue', 'Active Cases', 'Completed Cases', 'Lost Consultations', 'Revenue Today', 'Outstanding Revenue', 'Refunded (50% Rejections)']
  },
  operations: {
    menus: ['Dashboard', 'Agents', 'Active Cases', 'Doc Verification', 'Closed Cases', 'Clients', 'Leads', 'Social Inbox', 'Marketing', 'Calendar', 'All Agents Performance'],
    cards: ['Total Clients', 'Today\'s Clients', 'Total Consultations', 'Today\'s Consultations', 'Upcoming Meetings', 'Active Cases', 'Completed Cases']
  },
  finance: {
    menus: ['Dashboard', 'Finance'],
    cards: ['Total Revenue', 'Pending Payments']
  },
  consultant: {
    menus: ['Dashboard', 'Clients', 'Leads', 'Social Inbox', 'Calendar'],
    cards: ['Upcoming Meetings', 'Active Cases']
  },
  marketing: {
    menus: ['Dashboard', 'Leads', 'Marketing'],
    cards: ['Total Consultations', 'Today\'s Consultations']
  }
};

export const AdminAgents = () => {
  const queryClient = useQueryClient();
  const { currentUser, isAdmin } = useAuth();
  const { showAlert } = useAlert();

  const [view, setView] = useState('list'); // 'list' or 'details'

  // State
  const [activeAgentId, setActiveAgentId] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [commissionRate, setCommissionRate] = useState(10);

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
  const { data: customizationSettings } = useQuery({ queryKey: ['customization-settings'], queryFn: dbService.getCustomizationSettings });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
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
        cards: customCards
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
        cards: customCards
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

  // Compute 13 KPIs for the active Agent
  const getAgentKPIs = (agent) => {
    if (!agent) return {};

    const agentConsultations = allConsultations.filter((c) => c.assignedConsultantId === agent.id);
    const agentClients = allClients.filter((cl) => cl.assignedConsultantId === agent.id);
    const agentLeads = allLeads.filter((ld) => ld.assignedConsultantId === agent.id);

    // Total Consultations
    const totalConsultations = agentConsultations.length;

    // Today's Consultations (Simulated/Mock checking date match with "2026-06-22" or active date)
    const todayStr = new Date().toISOString().split('T')[0];
    const todayConsultations = agentConsultations.filter((c) => c.date && c.date.startsWith(todayStr)).length;

    // Upcoming Consultations
    const upcomingConsultations = agentConsultations.filter((c) => c.status === 'Scheduled').length;

    // Converted Clients and Payments
    const clientIds = agentClients.map((cl) => cl.id);
    const agentPayments = allPayments.filter((p) => clientIds.includes(p.clientId));

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

    // Agent Performance % = (Closed Cases ÷ Total Consultations) × 100
    const performancePercent =
      totalConsultations > 0 ? Math.round((closedCases / totalConsultations) * 100) : 0;

    // Agent Commission (dynamic rate from agent.commissionRate or fallback to 10)
    const rate = agent.commissionRate !== undefined ? agent.commissionRate : 10;
    const commissionAmount = Math.round(totalRevenueClosed * (rate / 100));

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
      performancePercent,
      commissionAmount };
  };

  const kpis = getAgentKPIs(activeAgent);

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
          isAdmin && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddModal}
              sx={{ borderRadius: 2.5, fontWeight: 700 }}
            >
              Add New Team/Agent
            </Button>
          )
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
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Agents Directory
                </Typography>
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
                              <Button 
                                size="small" 
                                variant="contained" 
                                color="primary" 
                                sx={{ mr: 1, borderRadius: 2 }}
                                onClick={() => {
                                  setActiveAgentId(agent.id);
                                  setView('details');
                                }}
                              >
                                View
                              </Button>
                              <IconButton size="small" color="secondary" onClick={() => {
                                setActiveAgentId(agent.id);
                                setView('details');
                              }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
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
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        {activeAgent.languages?.map((l) => (
                          <Chip key={l} label={l} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                        ))}
                      </Box>
                    </Box>
                  </Box>

                  {isAdmin && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
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

                <Divider sx={{ mb: 3 }} />

                {/* 13 KPI Boxes Grid */}
                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                  Agent Performance Metrics Dashboard
                </Typography>

                <Box className="grid grid-cols-12 gap-2" sx={{ mb: 3 }}>
                  {/* 1. Total Consultations */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Total Consultations</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.totalConsultations}</Typography>
                    </Paper>
                  </Box>

                  {/* 2. Today's Consultations */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Today's Consultations</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.todayConsultations}</Typography>
                    </Paper>
                  </Box>

                  {/* 3. Upcoming Consultations */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Upcoming Consultations</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.upcomingConsultations}</Typography>
                    </Paper>
                  </Box>

                  {/* 4. Pending Payments */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Pending Payments</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'warning.main' }}>{kpis.pendingPaymentsCount}</Typography>
                    </Paper>
                  </Box>

                  {/* 5. Total Revenue (Closed) */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Total Revenue</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'success.main' }}>€{kpis.totalRevenueClosed.toLocaleString()}</Typography>
                    </Paper>
                  </Box>

                  {/* 6. Active Cases */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Active Cases</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.activeCases}</Typography>
                    </Paper>
                  </Box>

                  {/* 7. Closed Cases */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Closed Cases</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.closedCases}</Typography>
                    </Paper>
                  </Box>

                  {/* 8. Client No-Show / Cancelled */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Client No-Show / Canceled</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.clientNoShowCancelled}</Typography>
                    </Paper>
                  </Box>

                  {/* 9. Agent No-Show */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Agent No-Show</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'error.main' }}>{kpis.agentNoShow}</Typography>
                    </Paper>
                  </Box>

                  {/* 10. Agent Cancelled Meetings */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Agent Cancelled Meetings</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5, color: 'error.main' }}>{kpis.agentCancelled}</Typography>
                    </Paper>
                  </Box>

                  {/* 11. Agent Leads */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Tooltip title="This displays lead entries initialized from digital QR business card scans for this agent reference. Note: Leads are only assigned to agent list once a consultation is booked." placement="top">
                      <Paper sx={{ p: 2, border: '1px dashed', borderColor: 'primary.main', bgcolor: 'primary.neutral', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center', cursor: 'help', position: 'relative' }}>
                        <Box sx={{ position: 'absolute', top: 5, right: 5, color: 'primary.main', display: 'flex' }}><InfoIcon sx={{ fontSize: '0.85rem' }} /></Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>Agent Leads</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.agentLeadsCount}</Typography>
                      </Paper>
                    </Tooltip>
                  </Box>

                  {/* 12. Agent Performance % */}
                  <Box className="col-span-6 sm:col-span-4 md:col-span-3">
                    <Paper sx={{ p: 2, border: '2px solid', borderColor: 'secondary.main', bgcolor: 'secondary.neutral', boxShadow: 'none', borderRadius: 2.5, textAlign: 'center' }}>
                      <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 700, display: 'block' }}>Agent Performance</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>{kpis.performancePercent}%</Typography>
                    </Paper>
                  </Box>
                </Box>
                                {/* 13. Commission Box */}
                <Paper sx={{ p: 3, bgcolor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" color="amber.900" sx={{ fontWeight: 800 }}>Agent Commission Earned ({activeAgent.commissionRate !== undefined ? activeAgent.commissionRate : 10}%)</Typography>
                    <Typography variant="caption" color="amber.850">Calculated automatically on paid invoice totals closed by this agent.</Typography>
                  </Box>
                  <Typography variant="h4" color="amber.900" sx={{ fontWeight: 900 }}>€{kpis.commissionAmount.toLocaleString()}</Typography>
                </Paper>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary', textTransform: 'uppercase' }}>Biography</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>{activeAgent.bio || 'No biography recorded for this agent.'}</Typography>
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
      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
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
        <DialogTitle sx={{ fontWeight: 800, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', py: 2, px: { xs: 2, sm: 3 }, bgcolor: 'background.paper' }}>
          Register Team / Agent Account
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
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
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
          
          {currentUser?.customPermissions?.canManageOverrides && (
            <>
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
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ py: 2, px: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: 'background.paper' }}>
          <Button onClick={() => setOpenAddModal(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="secondary" disabled={createAgentMutation.isPending}>Register Agent</Button>
        </DialogActions>
      </Dialog>

      {/* MODAL: Edit Agent */}
      <Dialog
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
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
        <DialogTitle sx={{ fontWeight: 800, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', py: 2, px: { xs: 2, sm: 3 }, bgcolor: 'background.paper' }}>
          Edit Agent Profile
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
            WebkitOverflowScrolling: 'touch',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5
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
          
          {currentUser?.customPermissions?.canManageOverrides && (
            <>
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
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ py: 2, px: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: 'background.paper' }}>
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
    </Box>
  );
};

export default AdminAgents;
