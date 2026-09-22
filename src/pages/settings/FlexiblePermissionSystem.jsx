import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import InputAdornment from '@mui/material/InputAdornment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Grid from '@mui/material/Grid';

// Icons
import SecurityIcon from '@mui/icons-material/Security';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ShieldIcon from '@mui/icons-material/Shield';
import BadgeIcon from '@mui/icons-material/Badge';
import TuneIcon from '@mui/icons-material/Tune';

import { useNavigate } from 'react-router-dom';

import { usePermissions } from '../../contexts/PermissionContext';
import { PERMISSION_MODULES, ACCESS_SCOPES, INITIAL_HIERARCHY, permissionService } from '../../services/permissionService';
import { useAlert } from '../../contexts/AlertContext';
import { AGENTS } from '../../constants/mockData';
import DualClock from '../../components/DualClock';

export default function FlexiblePermissionSystem() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const {
    roles,
    userOverrides,
    auditLogs,
    saveRole,
    cloneRole,
    deleteRole,
    saveUserOverride,
    checkUserPermission
  } = usePermissions();

  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  // Role Form / Edit Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormDesc, setRoleFormDesc] = useState('');
  const [roleFormPerms, setRoleFormPerms] = useState({});

  // Clone Role Modal State
  const [cloneModalOpen, setCloneModalOpen] = useState(false);
  const [sourceRoleId, setSourceRoleId] = useState('');
  const [clonedRoleName, setClonedRoleName] = useState('');

  // User Override Modal State
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userOverridePerms, setUserOverridePerms] = useState({});

  // --------------------------------------------------------------------------
  // HANDLERS FOR ROLE CREATION & EDITING
  // --------------------------------------------------------------------------
  const handleOpenCreateRole = () => {
    setEditingRoleId(null);
    setRoleFormName('');
    setRoleFormDesc('');
    
    // Initialize default permissions mapping
    const initMap = {};
    PERMISSION_MODULES.forEach(m => {
      m.permissions.forEach(p => {
        initMap[p.key] = { enabled: false, scope: p.defaultScope || 'own' };
      });
    });
    setRoleFormPerms(initMap);
    setRoleModalOpen(true);
  };

  const handleOpenEditRole = (role) => {
    setEditingRoleId(role.id);
    setRoleFormName(role.name);
    setRoleFormDesc(role.description);

    const initMap = {};
    PERMISSION_MODULES.forEach(m => {
      m.permissions.forEach(p => {
        const existing = role.permissions.find(rp => rp.key === p.key);
        initMap[p.key] = {
          enabled: existing ? existing.enabled : false,
          scope: existing ? existing.scope : (p.defaultScope || 'own')
        };
      });
    });
    setRoleFormPerms(initMap);
    setRoleModalOpen(true);
  };

  const handleTogglePermission = (permKey, enabled) => {
    setRoleFormPerms(prev => ({
      ...prev,
      [permKey]: { ...prev[permKey], enabled }
    }));
  };

  const handleScopeChange = (permKey, scope) => {
    setRoleFormPerms(prev => ({
      ...prev,
      [permKey]: { ...prev[permKey], scope }
    }));
  };

  const handleSaveRoleSubmit = () => {
    if (!roleFormName.trim()) {
      showAlert('Please provide a valid Role Name.', 'warning');
      return;
    }

    const permArray = Object.keys(roleFormPerms).map(key => ({
      key,
      enabled: roleFormPerms[key].enabled,
      scope: roleFormPerms[key].scope
    }));

    saveRole({
      id: editingRoleId,
      name: roleFormName,
      description: roleFormDesc,
      permissions: permArray
    });

    setRoleModalOpen(false);
    showAlert(`Role "${roleFormName}" saved successfully!`, 'success');
  };

  // --------------------------------------------------------------------------
  // CLONE ROLE
  // --------------------------------------------------------------------------
  const handleOpenClone = (roleId) => {
    const target = roles.find(r => r.id === roleId);
    setSourceRoleId(roleId);
    setClonedRoleName(target ? `${target.name} (Copy)` : 'New Custom Role');
    setCloneModalOpen(true);
  };

  const handleConfirmClone = () => {
    if (!clonedRoleName.trim()) {
      showAlert('Please enter a name for the cloned role.', 'warning');
      return;
    }
    cloneRole(sourceRoleId, clonedRoleName);
    setCloneModalOpen(false);
    showAlert(`Role cloned as "${clonedRoleName}"`, 'success');
  };

  // --------------------------------------------------------------------------
  // USER OVERRIDE HANDLERS
  // --------------------------------------------------------------------------
  const handleOpenUserOverride = (user) => {
    setSelectedUserId(user.id);
    const existing = userOverrides[user.id] || [];
    const initMap = {};
    existing.forEach(o => {
      initMap[o.key] = { enabled: o.enabled, scope: o.scope };
    });
    setUserOverridePerms(initMap);
    setOverrideModalOpen(true);
  };

  const handleSaveUserOverrideSubmit = () => {
    const targetUser = AGENTS.find(a => a.id === selectedUserId) || { id: selectedUserId, name: 'Selected User' };
    const overridesArray = Object.keys(userOverridePerms)
      .filter(k => userOverridePerms[k].isSet)
      .map(k => ({
        key: k,
        enabled: userOverridePerms[k].enabled,
        scope: userOverridePerms[k].scope
      }));

    saveUserOverride(targetUser.id, targetUser.name, overridesArray);
    setOverrideModalOpen(false);
    showAlert(`Custom permission overrides saved for ${targetUser.name}!`, 'success');
  };

  // Export Matrix CSV
  const handleExportCSV = () => {
    const csvContent = permissionService.exportMatrixCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CRM_Permissions_Matrix_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert('Permission Matrix CSV exported successfully!', 'success');
  };

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = selectedRoleFilter === 'ALL' || (selectedRoleFilter === 'CUSTOM' ? r.isCustom : !r.isCustom);
      return matchesSearch && matchesFilter;
    });
  }, [roles, searchQuery, selectedRoleFilter]);

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* ─── 1. TOP EXECUTIVE HEADER ─── */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          px: { xs: 2, sm: 3 },
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, flexWrap: 'wrap', minWidth: 0, width: '100%' }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(63,81,181,0.3)' }}>
            <SecurityIcon fontSize="medium" />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, fontFamily: 'Outfit, sans-serif', fontSize: { xs: '1.1rem', sm: '1.4rem' } }}>
                Flexible Permission & Access Control Center
              </Typography>
              <Chip label="ENTERPRISE RBAC" size="small" color="primary" sx={{ fontWeight: 900, fontSize: '0.65rem', height: 22 }} />
              <Chip label="SCOPE-BASED ACCESS" size="small" variant="outlined" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
              Granular per-feature permissions with access scopes (Own, Team, Department, Branch, All Records) & user overrides
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateRole}
            sx={{ fontWeight: 800, width: { xs: '100%', sm: 'auto' } }}
          >
            Create Custom Role
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<TuneIcon />}
            onClick={() => navigate('/super_admin/customization')}
            sx={{ fontWeight: 800, width: { xs: '100%', sm: 'auto' } }}
          >
            Menu & Card Access
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportCSV}
            sx={{ fontWeight: 800, width: { xs: '100%', sm: 'auto' } }}
          >
            Export Matrix CSV
          </Button>
          <DualClock client={{ timezone: 'America/New_York', label: 'Security EST' }} />
        </Box>
      </Paper>

      {/* ─── 2. NAVIGATION TABS ─── */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: 'background.paper' }}>
        <Tabs
          value={currentTab}
          onChange={(e, v) => setCurrentTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 800,
              fontSize: '0.78rem',
              py: 1.8,
              minHeight: 48,
              textTransform: 'none'
            }
          }}
        >
          <Tab label={`1. Role Builder & Configurator (${roles.length})`} icon={<AdminPanelSettingsIcon fontSize="small" />} iconPosition="start" />
          <Tab label="2. Permission Matrix Grid" icon={<GridOnIcon fontSize="small" />} iconPosition="start" />
          <Tab label="3. User Permission Overrides" icon={<TuneIcon fontSize="small" />} iconPosition="start" />
          <Tab label="4. Organizational Hierarchy" icon={<AccountTreeIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`5. Permission Audit Trail (${auditLogs.length})`} icon={<HistoryIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* ==================================================================== */}
      {/* TAB 0: ROLE BUILDER & CONFIGURATOR */}
      {/* ==================================================================== */}
      {currentTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Search & Filter Bar */}
          <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                size="small"
                placeholder="Search role name or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{ width: { xs: '100%', sm: 320 } }}
              />
              <FormControl size="small" sx={{ width: { xs: '100%', sm: 180 } }}>
                <InputLabel>Role Type</InputLabel>
                <Select value={selectedRoleFilter} label="Role Type" onChange={e => setSelectedRoleFilter(e.target.value)}>
                  <MenuItem value="ALL">All Roles</MenuItem>
                  <MenuItem value="BUILTIN">System Built-In</MenuItem>
                  <MenuItem value="CUSTOM">Custom Roles</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Role Cards Grid */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }, gap: 2.5 }}>
            {filteredRoles.map(role => {
              const enabledCount = role.permissions.filter(p => p.enabled).length;
              const totalPerms = PERMISSION_MODULES.reduce((acc, m) => acc + m.permissions.length, 0);

              return (
                <Paper
                  key={role.id}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 6px 18px rgba(0,0,0,0.5)' : '0 6px 18px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Avatar sx={{ bgcolor: role.isCustom ? '#7C3AED' : 'primary.main', width: 36, height: 36, fontWeight: 900, fontSize: '0.8rem' }}>
                          {role.name.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                            {role.name}
                          </Typography>
                          <Chip
                            label={role.isCustom ? 'CUSTOM ROLE' : 'SYSTEM BUILT-IN'}
                            size="small"
                            color={role.isCustom ? 'secondary' : 'default'}
                            sx={{ height: 18, fontSize: '0.6rem', fontWeight: 800, mt: 0.3 }}
                          />
                        </Box>
                      </Box>
                      <Chip
                        icon={<BadgeIcon sx={{ fontSize: '0.8rem !important' }} />}
                        label={`${role.userCount} Users`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ height: 22, fontSize: '0.65rem', fontWeight: 800 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem', mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {role.description}
                    </Typography>

                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.50', border: '1px solid', borderColor: 'divider', mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>Permission Coverage</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main' }}>
                          {enabledCount} / {totalPerms} Enabled
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', bgcolor: 'divider', height: 6, borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ width: `${(enabledCount / totalPerms) * 100}%`, bgcolor: 'primary.main', height: '100%' }} />
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      fullWidth
                      size="small"
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenEditRole(role)}
                      sx={{ fontWeight: 800, fontSize: '0.72rem' }}
                    >
                      Configure Permissions
                    </Button>
                    <Tooltip title="Clone Role">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenClone(role.id)}
                        sx={{ minWidth: 36, px: 1 }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </Button>
                    </Tooltip>
                    {role.isCustom && (
                      <Tooltip title="Delete Role">
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => {
                            deleteRole(role.id);
                            showAlert(`Role ${role.name} deleted.`, 'info');
                          }}
                          sx={{ minWidth: 36, px: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>
      )}

      {/* ==================================================================== */}
      {/* TAB 1: PERMISSION MATRIX GRID */}
      {/* ==================================================================== */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Enterprise Permission & Scope Matrix
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Complete grid mapping of Roles vs System Feature Permissions & Access Scopes
              </Typography>
            </Box>
            <Button size="small" variant="contained" startIcon={<FileDownloadIcon />} onClick={handleExportCSV} sx={{ fontWeight: 800 }}>
              Export Matrix CSV
            </Button>
          </Box>

          <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Table stickyHeader size="small" sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100', width: 220 }}>Module & Permission</TableCell>
                  {roles.map(r => (
                    <TableCell key={r.id} align="center" sx={{ fontWeight: 900, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100', whiteSpace: 'nowrap' }}>
                      {r.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {PERMISSION_MODULES.map(mod => (
                  <React.Fragment key={mod.id}>
                    <TableRow>
                      <TableCell colSpan={roles.length + 1} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.selected' : 'primary.50', fontWeight: 900, color: 'primary.main', py: 1 }}>
                        📌 {mod.name.toUpperCase()} ({mod.description})
                      </TableCell>
                    </TableRow>
                    {mod.permissions.map(p => (
                      <TableRow key={p.key} hover>
                        <TableCell sx={{ pl: 3 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{p.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{p.key}</Typography>
                        </TableCell>
                        {roles.map(r => {
                          const rp = r.permissions.find(item => item.key === p.key);
                          const isEnabled = rp ? rp.enabled : false;
                          const scope = rp ? rp.scope : 'own';

                          return (
                            <TableCell key={r.id} align="center">
                              {isEnabled ? (
                                <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <Chip
                                    icon={<CheckCircleIcon sx={{ fontSize: '0.8rem !important' }} />}
                                    label={scope.toUpperCase()}
                                    size="small"
                                    color={scope === 'all' ? 'success' : scope === 'branch' ? 'primary' : 'secondary'}
                                    sx={{ height: 20, fontSize: '0.6rem', fontWeight: 900 }}
                                  />
                                </Box>
                              ) : (
                                <Chip label="DISABLED" size="small" variant="outlined" sx={{ height: 18, fontSize: '0.58rem', opacity: 0.4 }} />
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: USER PERMISSION OVERRIDES */}
      {/* ==================================================================== */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              User Permission Override Management
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Override specific permissions for individual users without modifying their base role template.
            </Typography>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Staff Member</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Base Role</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Override Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {AGENTS.map(agent => {
                  const overrides = userOverrides[agent.id] || [];
                  const hasOverrides = overrides.length > 0;

                  return (
                    <TableRow key={agent.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar src={agent.avatar} sx={{ width: 34, height: 34, fontWeight: 900 }}>
                            {agent.name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{agent.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{agent.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={agent.role || 'Sales Agent'} size="small" color="primary" variant="outlined" sx={{ fontWeight: 800, height: 22 }} />
                      </TableCell>
                      <TableCell>
                        {hasOverrides ? (
                          <Chip label={`${overrides.length} Custom Overrides`} size="small" color="secondary" sx={{ fontWeight: 900, height: 22 }} />
                        ) : (
                          <Chip label="Standard Role (Inherited)" size="small" variant="outlined" sx={{ height: 22, opacity: 0.7 }} />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          startIcon={<TuneIcon />}
                          onClick={() => handleOpenUserOverride(agent)}
                          sx={{ fontWeight: 800, fontSize: '0.72rem' }}
                        >
                          Configure Overrides
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: ORGANIZATIONAL HIERARCHY */}
      {/* ==================================================================== */}
      {currentTab === 3 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
              Company Organizational Access Hierarchy
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              Company → Branch → Department → Team → User (Automatic Scope Enforcement Engine)
            </Typography>
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5 }}>
              🏢 {INITIAL_HIERARCHY.company}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Scope evaluation automatically matches user branch, department, and team memberships when executing record lookups.
            </Typography>
          </Paper>

          <Grid container spacing={2}>
            {INITIAL_HIERARCHY.branches.map(branch => (
              <Grid item xs={12} md={6} key={branch.id}>
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: 'background.paper' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary' }}>
                      📍 {branch.name}
                    </Typography>
                    <Chip label={branch.code} size="small" color="primary" sx={{ fontWeight: 900 }} />
                  </Box>
                  {branch.departments.map(dept => (
                    <Paper key={dept.id} variant="outlined" sx={{ p: 1.5, mb: 1.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, mb: 1 }}>
                        📂 {dept.name}
                      </Typography>
                      {dept.teams.map(t => (
                        <Box key={t.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 0.8, bgcolor: 'background.paper', borderRadius: 1.5, mb: 0.5, border: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="caption" sx={{ fontWeight: 800 }}>👥 {t.name}</Typography>
                          <Typography variant="caption" color="text.secondary">Leader: <b>{t.leader}</b></Typography>
                        </Box>
                      ))}
                    </Paper>
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: PERMISSION AUDIT TRAIL */}
      {/* ==================================================================== */}
      {currentTab === 4 && (
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}>
          <Box sx={{ mb: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Permission Modification Audit Logs
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Immutable audit trail tracking all RBAC policy changes, custom role creations, and user overrides
              </Typography>
            </Box>
            <Chip label={`${auditLogs.length} Audit Entries`} size="small" color="primary" sx={{ fontWeight: 800 }} />
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 750 }}>
              <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'action.hover' : 'grey.100' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Audit ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Target Role / User</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Modified By</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">No permission audit entries recorded yet.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map(log => (
                    <TableRow key={log.id} hover>
                      <TableCell><Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{log.id}</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{log.formattedTime}</Typography></TableCell>
                      <TableCell>
                        <Chip
                          label={log.action}
                          size="small"
                          color={log.action.includes('CREATE') ? 'success' : log.action.includes('DELETE') ? 'error' : 'primary'}
                          sx={{ height: 20, fontSize: '0.62rem', fontWeight: 900 }}
                        />
                      </TableCell>
                      <TableCell><Typography variant="body2" sx={{ fontWeight: 800 }}>{log.targetName}</Typography></TableCell>
                      <TableCell><Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>{log.modifiedBy}</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{log.details}</Typography></TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ==================================================================== */}
      {/* MODAL: CREATE / EDIT ROLE */}
      {/* ==================================================================== */}
      <Dialog open={roleModalOpen} onClose={() => setRoleModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>
          {editingRoleId ? 'Configure Role Permissions & Scopes' : 'Create New Custom Role'}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <TextField
              label="Role Name"
              fullWidth
              size="small"
              value={roleFormName}
              onChange={e => setRoleFormName(e.target.value)}
              placeholder="e.g. Regional Visa Specialist"
            />
            <TextField
              label="Role Description"
              fullWidth
              size="small"
              multiline
              rows={2}
              value={roleFormDesc}
              onChange={e => setRoleFormDesc(e.target.value)}
              placeholder="Brief summary of job responsibilities and authority bounds"
            />
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: 'primary.main' }}>
            Module-Wise Grouped Permissions & Access Scope Selection
          </Typography>

          {PERMISSION_MODULES.map(mod => (
            <Accordion key={mod.id} defaultExpanded sx={{ mb: 1, border: '1px solid', borderColor: 'divider', borderRadius: '8px !important' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  📁 {mod.name} ({mod.permissions.length} Features)
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#F8FAFC', pt: 0 }}>
                {mod.permissions.map(p => {
                  const state = roleFormPerms[p.key] || { enabled: false, scope: 'own' };
                  return (
                    <Box
                      key={p.key}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        flexWrap: 'wrap',
                        gap: 1
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={state.enabled}
                            onChange={e => handleTogglePermission(p.key, e.target.checked)}
                            color="primary"
                          />
                        }
                        label={<Typography variant="body2" sx={{ fontWeight: 700 }}>{p.label}</Typography>}
                      />

                      {state.enabled && (
                        <FormControl size="small" sx={{ width: 180 }}>
                          <InputLabel>Access Scope</InputLabel>
                          <Select
                            value={state.scope}
                            label="Access Scope"
                            onChange={e => handleScopeChange(p.key, e.target.value)}
                          >
                            {ACCESS_SCOPES.map(s => (
                              <MenuItem key={s.key} value={s.key}>
                                <b>{s.label}</b>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Box>
                  );
                })}
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRoleModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSaveRoleSubmit} sx={{ fontWeight: 800 }}>
            Save Role Permissions
          </Button>
        </DialogActions>
      </Dialog>

      {/* ==================================================================== */}
      {/* MODAL: CLONE ROLE */}
      {/* ==================================================================== */}
      <Dialog open={cloneModalOpen} onClose={() => setCloneModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>Clone Existing Role</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="New Cloned Role Name"
            fullWidth
            size="small"
            value={clonedRoleName}
            onChange={e => setClonedRoleName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCloneModalOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleConfirmClone} sx={{ fontWeight: 800 }}>
            Confirm Clone
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
