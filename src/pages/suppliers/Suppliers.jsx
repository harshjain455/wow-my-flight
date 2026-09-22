import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// Icons
import AddIcon from '@mui/icons-material/Add';
import FlightIcon from '@mui/icons-material/Flight';
import ApiIcon from '@mui/icons-material/Api';
import ShieldIcon from '@mui/icons-material/Shield';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SpeedIcon from '@mui/icons-material/Speed';
import HubIcon from '@mui/icons-material/Hub';
import CableIcon from '@mui/icons-material/Cable';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StorageIcon from '@mui/icons-material/Storage';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';
import AppModal from '../../components/AppModal';
import { useAlert } from '../../contexts/AlertContext';
import { flightContentService } from '../../services/flightContentService';

const MOCK_SUPPLIERS = [
  {
    id: 'SUP-001',
    name: 'Sabre GDS',
    type: 'GDS Gateway',
    status: 'Active',
    contact: 'api-support@sabre.com',
    commission: 'N/A',
    balance: '$12,450'
  },
  {
    id: 'SUP-002',
    name: 'Amadeus GDS',
    type: 'GDS Gateway',
    status: 'Active',
    contact: 'tech@amadeus.com',
    commission: 'N/A',
    balance: '$8,200'
  },
  {
    id: 'SUP-003',
    name: 'Mystifly Consolidator A',
    type: 'Consolidator',
    status: 'Active',
    contact: 'b2b@mystifly.com',
    commission: '8%',
    balance: '$15,000'
  },
  {
    id: 'SUP-004',
    name: 'Mondee Consolidator B',
    type: 'Consolidator',
    status: 'Active',
    contact: 'api@mondee.com',
    commission: '6.5%',
    balance: '$9,800'
  },
  {
    id: 'SUP-005',
    name: 'Air India Direct NDC',
    type: 'NDC Supplier',
    status: 'Active',
    contact: 'ndc@airindia.in',
    commission: '5%',
    balance: '$4,100'
  }
];

export default function Suppliers() {
  const { showAlert } = useAlert();
  
  // Traditional Suppliers List
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('crm-suppliers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_SUPPLIERS;
  });

  // Decoupled Supplier Adapters from FlightContentService
  const [adapters, setAdapters] = useState(() => flightContentService.getAdapters());

  // Sandbox Live Search state
  const [searchSandboxOpen, setSearchSandboxOpen] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Add Supplier Modal state
  const [openModal, setOpenModal] = useState(false);
  const [openAdapterModal, setOpenAdapterModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'Consolidator',
    contact: '',
    commission: '5%',
    balance: '$0',
    status: 'Active'
  });

  const [adapterFormData, setAdapterFormData] = useState({
    name: '',
    type: 'Consolidator',
    protocol: 'REST / JSON API',
    endpoint: '',
    authType: 'API Key',
    description: ''
  });

  const handleToggleAdapter = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const updated = flightContentService.toggleAdapterStatus(id, nextStatus);
    setAdapters(updated);
    showAlert(`Supplier Adapter "${id}" set to ${nextStatus}`, nextStatus === 'Active' ? 'success' : 'info');
  };

  const handlePingAdapter = async (id) => {
    const res = await flightContentService.pingAdapter(id);
    if (res.success) {
      setAdapters(flightContentService.getAdapters());
      showAlert(`⚡ Ping ${res.name}: Response latency ${res.latency}`, 'success');
    }
  };

  const handleRunLiveSearchTest = async () => {
    setIsSearching(true);
    const results = await flightContentService.searchFlightsAcrossAdapters({
      origin: 'DEL',
      destination: 'LHR',
      departDate: '2026-10-15',
      cabinClass: 'Business',
      passengers: 2
    });
    setSearchResults(results);
    setIsSearching(false);
    setSearchSandboxOpen(true);
  };

  const handleAddAdapter = (e) => {
    if (e) e.preventDefault();
    if (!adapterFormData.name.trim() || !adapterFormData.endpoint.trim()) {
      showAlert('Please enter adapter name and API endpoint', 'error');
      return;
    }

    const created = flightContentService.registerAdapter(adapterFormData);
    setAdapters(flightContentService.getAdapters());
    setOpenAdapterModal(false);
    showAlert(`New Supplier Adapter "${created.name}" registered successfully!`, 'success');
  };

  const activeGdsCount = suppliers.filter(s => s.type.includes('GDS') && s.status === 'Active').length;
  const activeAdaptersCount = adapters.filter(a => a.status === 'Active').length;

  const columns = [
    {
      id: 'id',
      label: 'Supplier ID',
      render: row => <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{row.id}</Typography>
    },
    {
      id: 'name',
      label: 'Supplier Name',
      render: row => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {row.type.includes('Airline') || row.type.includes('NDC') ? <FlightIcon fontSize="small" color="primary" /> : <ApiIcon fontSize="small" color="secondary" />}
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.name}</Typography>
        </Box>
      )
    },
    { id: 'type', label: 'Supplier Type' },
    { id: 'contact', label: 'Contact Email' },
    {
      id: 'commission',
      label: 'Commission',
      render: row => <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>{row.commission}</Typography>
    },
    {
      id: 'balance',
      label: 'Account Balance',
      render: row => <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.balance}</Typography>
    },
    {
      id: 'status',
      label: 'Status',
      render: row => (
        <Chip
          label={row.status}
          size="small"
          color={row.status === 'Active' ? 'success' : 'default'}
          sx={{ fontWeight: 800, fontSize: '0.7rem' }}
        />
      )
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Flight Content Service & Suppliers Management"
        subtitle="Decoupled architecture: CRM → Flight Content Service → Supplier Adapters (Consolidator A, Consolidator B, GDS, NDC)."
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="info"
              startIcon={<PlayArrowIcon />}
              onClick={handleRunLiveSearchTest}
              sx={{ fontWeight: 800 }}
            >
              ⚡ Run Multi-Supplier Live Search Test
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdapterModal(true)}
              sx={{ fontWeight: 800, borderRadius: 2 }}
            >
              + Add Supplier Adapter
            </Button>
          </Stack>
        }
      />

      {/* KPI Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#EFF6FF' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D4ED8' }}>
            <HubIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E40AF' }}>{activeAdaptersCount} / {adapters.length}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Active Supplier Adapters</Typography>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#ECFDF5' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#047857' }}>
            <SpeedIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#065F46' }}>112 ms</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Avg Aggregation Latency</Typography>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFBEB' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
            <CableIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#92400E' }}>4 Protocols</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>REST, SOAP, IATA NDC, EDIFACT</Typography>
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2.5, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#F3E8FF' }}>
          <Box sx={{ width: 44, height: 44, borderRadius: '50%', bgcolor: '#E9D5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7E22CE' }}>
            <ShieldIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#6B21A8' }}>100% Decoupled</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Zero Lock-in Architecture</Typography>
          </Box>
        </Paper>
      </Box>

      {/* ─── VISUAL ARCHITECTURAL DIAGRAM CARD ─── */}
      <Paper elevation={0} sx={{ p: 3, mb: 3.5, border: '2px solid #3B82F6', borderRadius: 3, bgcolor: '#F8FAFC' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <HubIcon /> Decoupled Architecture: CRM → Flight Content Service → Supplier Adapters
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          The CRM application is completely isolated from underlying GDS or Consolidator APIs. The <b>Flight Content Service</b> queries adapters concurrently and normalizes all fares into a single CRM schema.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2, bgcolor: '#FFFFFF', p: 2.5, borderRadius: 2, border: '1px solid #E2E8F0' }}>
          {/* Node 1: CRM UI */}
          <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#EFF6FF', border: '1px solid #93C5FD', borderRadius: 2, minWidth: 160 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>📱 CRM Application</Typography>
            <Typography variant="caption" color="text.secondary">Quote Engine / Search</Typography>
          </Paper>

          <CompareArrowsIcon sx={{ color: '#2563EB', fontSize: 28, transform: { xs: 'rotate(90deg)', md: 'rotate(0deg)' } }} />

          {/* Node 2: Flight Content Service */}
          <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 2, minWidth: 200 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#92400E' }}>⚙️ Flight Content Service</Typography>
            <Typography variant="caption" color="text.secondary">Aggregator & Normalizer</Typography>
          </Paper>

          <CompareArrowsIcon sx={{ color: '#2563EB', fontSize: 28, transform: { xs: 'rotate(90deg)', md: 'rotate(0deg)' } }} />

          {/* Node 3: Supplier Adapters */}
          <Grid container spacing={1} sx={{ maxWidth: 500 }}>
            {['Consolidator A (Mystifly)', 'Consolidator B (Mondee)', 'GDS Adapter (Amadeus)', 'NDC Supplier (Air India)'].map((name, i) => (
              <Grid item xs={6} key={i}>
                <Paper elevation={0} sx={{ p: 1, textAlign: 'center', bgcolor: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: 1.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#065F46', display: 'block' }}>🔌 {name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Paper>

      {/* ─── LIVE SUPPLIER ADAPTERS MANAGER ─── */}
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <CableIcon color="primary" /> Registered Supplier Adapters (Pluggable Layer)
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 4 }}>
        {adapters.map((adapter) => (
          <Paper key={adapter.id} elevation={0} sx={{ p: 2.5, border: '2px solid', borderColor: adapter.status === 'Active' ? '#10B981' : '#CBD5E1', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>{adapter.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>ID: {adapter.id} | Protocol: {adapter.protocol}</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={adapter.status === 'Active'}
                    onChange={() => handleToggleAdapter(adapter.id, adapter.status)}
                    color="success"
                  />
                }
                label={<Typography variant="caption" sx={{ fontWeight: 800 }}>{adapter.status}</Typography>}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: 13 }}>
              {adapter.description}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, bgcolor: '#F8FAFC', p: 1.5, borderRadius: 1.5, mb: 2, fontSize: 12 }}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>API Endpoint:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace', wordBreak: 'break-all' }}>{adapter.endpoint}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Auth & Security:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{adapter.authType}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Latency Benchmark:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'success.main' }}>⚡ {adapter.latency}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Supported Cabins:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>{adapter.supportedCabins?.join(', ')}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Stack direction="row" spacing={0.5}>
                {adapter.features?.map((f, i) => (
                  <Chip key={i} size="small" label={f} variant="outlined" sx={{ fontSize: '0.65rem', fontWeight: 700 }} />
                ))}
              </Stack>
              <Button
                size="small"
                variant="outlined"
                color="info"
                startIcon={<RefreshIcon />}
                onClick={() => handlePingAdapter(adapter.id)}
                sx={{ fontWeight: 800, fontSize: '0.72rem' }}
              >
                Ping Health
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Traditional Suppliers Table */}
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <StorageIcon color="secondary" /> Account Balances & Commercial Contracts
      </Typography>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <AppTable columns={columns} data={suppliers} />
      </Paper>

      {/* ─── LIVE SEARCH SANDBOX TEST MODAL ─── */}
      <AppModal
        open={searchSandboxOpen}
        onClose={() => setSearchSandboxOpen(false)}
        title="⚡ Multi-Supplier Live Search Aggregation Test"
        maxWidth="md"
      >
        {searchResults && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success">
              Flight Content Service queried <b>{searchResults.searchedAdaptersCount} active supplier adapters</b> concurrently and retrieved <b>{searchResults.offersCount} normalized flight offers</b>!
            </Alert>

            <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
              Query: {searchResults.query.origin} → {searchResults.query.destination} ({searchResults.query.departDate}) | Cabin: {searchResults.query.cabinClass}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {searchResults.offers.map((offer, idx) => (
                <Paper key={offer.id} elevation={0} sx={{ p: 2, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip size="small" label={offer.supplierName} color="primary" sx={{ fontWeight: 800 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>{offer.airline} ({offer.flightNumber})</Typography>
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'success.main' }}>
                      Supplier Cost: ${offer.supplierCost.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {offer.departure} → {offer.arrival} | {offer.duration} ({offer.stops})
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    Protocol Used: <code>{offer.protocolUsed}</code> | Fare Family: <b>{offer.fareFamily}</b> | 🧳 {offer.baggage}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </AppModal>

      {/* ─── ADD SUPPLIER ADAPTER MODAL ─── */}
      <AppModal
        open={openAdapterModal}
        onClose={() => setOpenAdapterModal(false)}
        title="Add New Supplier Adapter to Flight Content Service"
        actions={
          <>
            <Button onClick={() => setOpenAdapterModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleAddAdapter} variant="contained" color="primary" sx={{ fontWeight: 800 }}>
              Register Adapter
            </Button>
          </>
        }
      >
        <Box component="form" onSubmit={handleAddAdapter} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
          <TextField
            label="Adapter Name *"
            value={adapterFormData.name}
            onChange={e => setAdapterFormData({ ...adapterFormData, name: e.target.value })}
            placeholder="e.g. Travelport GDS Adapter or Mystifly NDC"
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Supplier Type</InputLabel>
            <Select
              value={adapterFormData.type}
              label="Supplier Type"
              onChange={e => setAdapterFormData({ ...adapterFormData, type: e.target.value })}
            >
              <MenuItem value="Consolidator">Consolidator B2B</MenuItem>
              <MenuItem value="GDS Gateway">GDS Gateway</MenuItem>
              <MenuItem value="NDC Direct Connect">NDC Direct Connect</MenuItem>
              <MenuItem value="LCC Aggregator">LCC Aggregator</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Protocol Standard</InputLabel>
            <Select
              value={adapterFormData.protocol}
              label="Protocol Standard"
              onChange={e => setAdapterFormData({ ...adapterFormData, protocol: e.target.value })}
            >
              <MenuItem value="REST / JSON API">REST / JSON API</MenuItem>
              <MenuItem value="SOAP / XML">SOAP / XML</MenuItem>
              <MenuItem value="IATA NDC 21.3 XML">IATA NDC 21.3 XML</MenuItem>
              <MenuItem value="EDIFACT GDS">EDIFACT GDS</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Auth & Security</InputLabel>
            <Select
              value={adapterFormData.authType}
              label="Auth & Security"
              onChange={e => setAdapterFormData({ ...adapterFormData, authType: e.target.value })}
            >
              <MenuItem value="API Key + Secret">API Key + Secret</MenuItem>
              <MenuItem value="OAuth 2.0 / Bearer">OAuth 2.0 / Bearer</MenuItem>
              <MenuItem value="WSS Security Token">WSS Security Token</MenuItem>
              <MenuItem value="Digital Certificate">Digital Certificate</MenuItem>
            </Select>
          </FormControl>

          <Grid item xs={12} style={{ gridColumn: 'span 2' }}>
            <TextField
              label="API Endpoint URL *"
              value={adapterFormData.endpoint}
              onChange={e => setAdapterFormData({ ...adapterFormData, endpoint: e.target.value })}
              placeholder="https://api.supplier.com/v1/search"
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} style={{ gridColumn: 'span 2' }}>
            <TextField
              label="Description & Notes"
              value={adapterFormData.description}
              onChange={e => setAdapterFormData({ ...adapterFormData, description: e.target.value })}
              placeholder="Internal notes about API credentials, rate limits, or contract details"
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
        </Box>
      </AppModal>
    </Box>
  );
}
