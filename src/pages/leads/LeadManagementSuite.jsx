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
import Drawer from '@mui/material/Drawer';
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import PeopleIcon from '@mui/icons-material/People';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// MANDATORY DATASETS & CONSTANTS
// ==========================================

const LEAD_SOURCES = [
  'Website', 'Phone', 'Email', 'Facebook', 'Instagram',
  'Google Ads', 'Organic Search', 'WhatsApp', 'Referral',
  'Affiliate', 'Partner', 'API Integration', 'Manual Entry'
];

const STAGES = [
  { id: 'New', label: '1. New', color: '#3F51B5' },
  { id: 'Assigned', label: '2. Assigned', color: '#0284C7' },
  { id: 'Contacted', label: '3. Contacted', color: '#059669' },
  { id: 'Interested', label: '4. Interested', color: '#D97706' },
  { id: 'Qualified', label: '5. Qualified', color: '#7C3AED' },
  { id: 'Quote Sent', label: '6. Quote Sent', color: '#2563EB' },
  { id: 'Follow-up Pending', label: '7. Follow-up Pending', color: '#C59B27' },
  { id: 'Negotiation', label: '8. Negotiation', color: '#DC2626' },
  { id: 'Payment Pending', label: '9. Payment Pending', color: '#059669' },
  { id: 'Booked', label: '10. Booked', color: '#16A34A' },
  { id: 'Lost', label: '11. Lost', color: '#6B7280' },
  { id: 'Cancelled', label: '12. Cancelled', color: '#9CA3AF' }
];

const INITIAL_LEADS = [
  {
    id: 'LD-99120',
    firstName: 'Harold',
    lastName: 'Vance',
    email: 'harold.vance@embassy.gov',
    phone: '+1 555-234-8901',
    country: 'United States',
    language: 'English',
    contactMethod: 'WhatsApp',
    timeZone: 'EST (UTC-5)',
    origin: 'DEL',
    destination: 'LHR → JFK',
    depDate: '2026-09-15',
    retDate: '2026-09-25',
    tripType: 'Multi-City',
    adults: 2,
    children: 0,
    infants: 0,
    cabinClass: 'First Class',
    flexible: 'Yes (±3 Days)',
    airlinePref: 'British Airways',
    baggage: '2x32kg Checked',
    source: 'Google Ads',
    campaign: 'summer_europe_sale_2026',
    assignedAgent: 'Sarah Jenkins',
    assignedTeam: 'Alpha Sales Team',
    priority: 'VIP',
    score: 95,
    status: 'Quote Sent',
    expectedValue: 28500,
    expectedTravelDate: '2026-09-15',
    lostReason: '',
    slaTimer: '02m 45s (SLA Met)',
    createdDate: '2026-08-20 10:15'
  },
  {
    id: 'LD-99121',
    firstName: 'Sophia',
    lastName: 'Chen',
    email: 'sophia.chen@techcorp.io',
    phone: '+1 415-889-1200',
    country: 'USA',
    language: 'English',
    contactMethod: 'Call',
    timeZone: 'PST (UTC-8)',
    origin: 'SFO',
    destination: 'HND (Tokyo)',
    depDate: '2026-10-01',
    retDate: '2026-10-14',
    tripType: 'Round Trip',
    adults: 1,
    children: 0,
    infants: 0,
    cabinClass: 'Business',
    flexible: 'No',
    airlinePref: 'ANA / Japan Airlines',
    baggage: '2x23kg Checked',
    source: 'Website',
    campaign: 'organic_search',
    assignedAgent: 'Alex Miller',
    assignedTeam: 'Corporate Sales',
    priority: 'High',
    score: 88,
    status: 'Contacted',
    expectedValue: 8400,
    expectedTravelDate: '2026-10-01',
    lostReason: '',
    slaTimer: '04m 10s',
    createdDate: '2026-08-20 11:30'
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function LeadManagementSuite() {
  const { showAlert } = useAlert();
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' or 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newLeadModalOpen, setNewLeadModalOpen] = useState(false);

  // New Lead Form State
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: 'United States',
    language: 'English', contactMethod: 'Call', timeZone: 'EST',
    origin: '', destination: '', depDate: '', retDate: '', tripType: 'Round Trip',
    adults: 1, children: 0, infants: 0, cabinClass: 'Economy', flexible: 'No',
    airlinePref: 'Any Airline', baggage: 'Standard',
    source: 'Website', campaign: 'direct_inbound', assignedAgent: 'Sarah Jenkins',
    assignedTeam: 'Alpha Sales', priority: 'High', score: 85, status: 'New',
    expectedValue: 3500, expectedTravelDate: ''
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateLead = () => {
    const newId = `LD-${Math.floor(10000 + Math.random() * 90000)}`;
    const createdLead = { ...formData, id: newId, createdDate: new Date().toISOString().slice(0, 16).replace('T', ' ') };
    setLeads([createdLead, ...leads]);
    setNewLeadModalOpen(false);
    showAlert(`✓ New Lead ${newId} created & auto-assigned to ${formData.assignedAgent}!`, 'success');
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch = l.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === 'ALL' || l.source === sourceFilter;
    return matchesSearch && matchesSource;
  });

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            🎯
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Lead Management & Customer 360 Module
              </Typography>
              <Chip label="PRIORITY 1 — SALES CONVERSION" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#3F51B5', color: '#FFF' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Comprehensive multi-channel lead capture, automated SLA timers, and Customer 360 profiles
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setNewLeadModalOpen(true)}
            sx={{ fontWeight: 800, borderRadius: 2, px: 2.5 }}
          >
            + Create New Lead
          </Button>
          <DualClock client={{ timezone: 'America/New_York', label: 'Sales EST' }} />
        </Box>
      </Paper>

      {/* 10 TOP LEAD MANAGEMENT KPI CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(5, 1fr)' }, gap: 1.5, mb: 3 }}>
        {[
          { label: 'Total Leads', val: '12,450', color: '#3F51B5' },
          { label: 'New Today', val: '142', color: '#0284C7' },
          { label: 'Contacted', val: '890', color: '#059669' },
          { label: 'Qualified', val: '420', color: '#7C3AED' },
          { label: 'Quotes Sent', val: '310', color: '#2563EB' },
          { label: 'Pending Follow-ups', val: '88', color: '#C59B27' },
          { label: 'Booked Leads', val: '184', color: '#16A34A' },
          { label: 'Lost Leads', val: '45', color: '#6B7280' },
          { label: 'Conversion %', val: '14.8%', color: '#059669' },
          { label: 'Expected Value', val: '$1.42M', color: '#C59B27' }
        ].map((kpi, i) => (
          <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: kpi.color } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.68rem', display: 'block' }}>{kpi.label}</Typography>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.2 }}>{kpi.val}</Typography>
          </Paper>
        ))}
      </Box>

      {/* CONTROLS BAR: SEARCH, FILTERS & VIEW TOGGLE */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flexGrow: 1 }}>
          <TextField
            size="small"
            placeholder="Search by ID, Name, Email, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ width: { xs: '100%', sm: 280 } }}
          />

          <TextField
            select
            size="small"
            label="Filter by Lead Source"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All Sources (13)</MenuItem>
            {LEAD_SOURCES.map((src) => (
              <MenuItem key={src} value={src}>{src}</MenuItem>
            ))}
          </TextField>
        </Box>

        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} sx={{ '& .MuiTab-root': { fontWeight: 800, fontSize: '0.75rem' } }}>
          <Tab label="📋 12-Stage Pipeline (Kanban)" value="kanban" />
          <Tab label="📑 Leads Data Table" value="table" />
        </Tabs>
      </Paper>

      {/* KANBAN BOARD VIEW */}
      {activeTab === 'kanban' && (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {STAGES.map((stg) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stg.id);
            return (
              <Paper
                key={stg.id}
                elevation={0}
                sx={{
                  minWidth: 280,
                  maxWidth: 280,
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: stg.color }}>
                    {stg.label}
                  </Typography>
                  <Chip label={stageLeads.length} size="small" sx={{ fontWeight: 900, bgcolor: stg.color, color: '#FFF' }} />
                </Box>

                <Divider sx={{ mb: 1.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, overflowY: 'auto', maxHeight: 600 }}>
                  {stageLeads.map((lead) => (
                    <Paper
                      key={lead.id}
                      elevation={0}
                      onClick={() => { setSelectedLead(lead); setDrawerOpen(true); }}
                      sx={{
                        p: 2,
                        borderRadius: 2.5,
                        border: '1px solid #E2E8F0',
                        bgcolor: '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: stg.color,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary' }}>
                          {lead.firstName} {lead.lastName}
                        </Typography>
                        <Chip label={lead.priority} size="small" color={lead.priority === 'VIP' ? 'secondary' : 'primary'} sx={{ fontWeight: 900, height: 20, fontSize: '0.62rem' }} />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.75rem', mb: 0.5 }}>
                        ✈️ {lead.origin} ➔ {lead.destination} ({lead.tripType})
                      </Typography>

                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, mb: 1 }}>
                        Source: <b>{lead.source}</b> • Rep: <b>{lead.assignedAgent}</b>
                      </Typography>

                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, color: '#059669' }}>
                          ${lead.expectedValue.toLocaleString()}
                        </Typography>
                        <Chip label={`Score: ${lead.score}`} size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.62rem', height: 20 }} />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* DATA TABLE VIEW */}
      {activeTab === 'table' && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Lead ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Route & Dates</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Source & Campaign</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Assigned Agent</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Priority & Score</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Expected Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLeads.map((l) => (
                  <TableRow key={l.id} hover onClick={() => { setSelectedLead(l); setDrawerOpen(true); }} sx={{ cursor: 'pointer' }}>
                    <TableCell sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>{l.id}</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{l.firstName} {l.lastName}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{l.origin} ➔ {l.destination}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{l.source} ({l.campaign})</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{l.assignedAgent}</TableCell>
                    <TableCell><Chip label={`${l.priority} (${l.score})`} size="small" color={l.priority === 'VIP' ? 'secondary' : 'primary'} sx={{ fontWeight: 800 }} /></TableCell>
                    <TableCell><Chip label={l.status} size="small" color="success" sx={{ fontWeight: 800 }} /></TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: '#059669' }}>${l.expectedValue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* CUSTOMER 360 & TIMELINE DRAWER */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 540 }, p: 3 } }}>
        {selectedLead && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5' }}>
                Customer 360: {selectedLead.firstName} {selectedLead.lastName}
              </Typography>
              <Button onClick={() => setDrawerOpen(false)}><CloseIcon /></Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary', mb: 1 }}>
              📌 Travel Requirements & Commercials
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 2, bgcolor: '#F8FAFC' }}>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Route: {selectedLead.origin} ➔ {selectedLead.destination}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                Dates: {selectedLead.depDate} to {selectedLead.retDate} • Cabin: {selectedLead.cabinClass}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                Pax: {selectedLead.adults} Adults, {selectedLead.children} Children • Flex: {selectedLead.flexible}
              </Typography>
            </Paper>

            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary', mb: 1 }}>
              🕒 Chronological Lead Activity Timeline
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {[
                { event: 'Lead Created via ' + selectedLead.source, time: selectedLead.createdDate, user: 'System Auto-Capture' },
                { event: 'Auto-Assigned to Agent', time: selectedLead.createdDate, user: selectedLead.assignedAgent },
                { event: 'First Outbound Call Connected (2m 14s)', time: 'Aug 20 10:18', user: selectedLead.assignedAgent },
                { event: 'Flight Quote Q-8812 Dispatched via WhatsApp', time: 'Aug 20 11:30', user: selectedLead.assignedAgent }
              ].map((ev, i) => (
                <Paper key={i} variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>{ev.time} • {ev.user}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{ev.event}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Drawer>

      {/* MULTI-STEP NEW LEAD CREATION MODAL */}
      <Dialog
        open={newLeadModalOpen}
        onClose={() => setNewLeadModalOpen(false)}
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
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main', display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 2, px: { xs: 2, sm: 3 }, flexShrink: 0, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <span>+ Create Comprehensive New Lead (3-Section Form)</span>
          <Chip label={`Section ${formStep} of 3`} size="small" color="primary" sx={{ fontWeight: 800 }} />
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
          
          {/* SECTION 1: CUSTOMER INFORMATION */}
          {formStep === 1 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, pt: 1 }}>
              <TextField label="First Name *" size="small" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} fullWidth />
              <TextField label="Last Name *" size="small" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} fullWidth />
              <TextField label="Email Address *" size="small" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} fullWidth />
              <TextField label="Mobile Number *" size="small" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} fullWidth />
              <TextField label="Country" size="small" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} fullWidth />
              <TextField select label="Preferred Contact Method" size="small" value={formData.contactMethod} onChange={(e) => handleInputChange('contactMethod', e.target.value)} fullWidth>
                {['Call', 'WhatsApp', 'Email', 'SMS'].map((m) => <MenuItem key={m} value={m}>{m}</MenuItem>)}
              </TextField>
            </Box>
          )}

          {/* SECTION 2: TRAVEL REQUIREMENT */}
          {formStep === 2 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, pt: 1 }}>
              <TextField label="Origin Airport (e.g. DEL)" size="small" value={formData.origin} onChange={(e) => handleInputChange('origin', e.target.value)} fullWidth />
              <TextField label="Destination Airport (e.g. LHR)" size="small" value={formData.destination} onChange={(e) => handleInputChange('destination', e.target.value)} fullWidth />
              <TextField type="date" label="Departure Date" InputLabelProps={{ shrink: true }} size="small" value={formData.depDate} onChange={(e) => handleInputChange('depDate', e.target.value)} fullWidth />
              <TextField type="date" label="Return Date" InputLabelProps={{ shrink: true }} size="small" value={formData.retDate} onChange={(e) => handleInputChange('retDate', e.target.value)} fullWidth />
              <TextField select label="Trip Type" size="small" value={formData.tripType} onChange={(e) => handleInputChange('tripType', e.target.value)} fullWidth>
                {['One Way', 'Round Trip', 'Multi-City'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
              <TextField select label="Cabin Class" size="small" value={formData.cabinClass} onChange={(e) => handleInputChange('cabinClass', e.target.value)} fullWidth>
                {['Economy', 'Premium Economy', 'Business', 'First Class'].map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Box>
          )}

          {/* SECTION 3: SALES INFORMATION */}
          {formStep === 3 && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, pt: 1 }}>
              <TextField select label="Lead Source (13 Channels)" size="small" value={formData.source} onChange={(e) => handleInputChange('source', e.target.value)} fullWidth>
                {LEAD_SOURCES.map((src) => <MenuItem key={src} value={src}>{src}</MenuItem>)}
              </TextField>
              <TextField label="Campaign Name" size="small" value={formData.campaign} onChange={(e) => handleInputChange('campaign', e.target.value)} fullWidth />
              <TextField select label="Assigned Agent" size="small" value={formData.assignedAgent} onChange={(e) => handleInputChange('assignedAgent', e.target.value)} fullWidth>
                {['Sarah Jenkins', 'Alex Miller', 'Michael Chang', 'Unassigned (Auto-Assign)'].map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
              </TextField>
              <TextField select label="Priority" size="small" value={formData.priority} onChange={(e) => handleInputChange('priority', e.target.value)} fullWidth>
                {['Low', 'Medium', 'High', 'VIP'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
              </TextField>
              <TextField type="number" label="Expected Booking Value ($)" size="small" value={formData.expectedValue} onChange={(e) => handleInputChange('expectedValue', e.target.value)} fullWidth />
            </Box>
          )}

        </DialogContent>
        <DialogActions sx={{ py: 2, px: { xs: 2, sm: 3 }, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0, bgcolor: 'background.paper', justifyContent: 'space-between' }}>
          <Button disabled={formStep === 1} onClick={() => setFormStep(formStep - 1)}>Back</Button>
          {formStep < 3 ? (
            <Button variant="contained" onClick={() => setFormStep(formStep + 1)}>Next Section ➔</Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleCreateLead} sx={{ fontWeight: 800 }}>Submit Lead & Auto-Assign</Button>
          )}
        </DialogActions>
      </Dialog>

    </Box>
  );
}
