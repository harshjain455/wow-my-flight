import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

// Icons
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import LuggageIcon from '@mui/icons-material/Luggage';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GavelIcon from '@mui/icons-material/Gavel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import GroupsIcon from '@mui/icons-material/Groups';
import SpeedIcon from '@mui/icons-material/Speed';
import TerminalIcon from '@mui/icons-material/Terminal';

import DualClock from '../../components/DualClock';
import FlightRequestQueue, { DEMO_QUEUE_REQUESTS } from '../../components/FlightRequestQueue';
import GDSParsingBox from '../../components/GDSParsingBox';
import MarginCalculator from '../../components/MarginCalculator';
import UpsellEngine from '../../components/UpsellEngine';
import FareRulesView from '../../components/FareRulesView';
import GDSTerminalModal from '../../components/GDSTerminalModal';
import MultiGdsFlightSearch from '../../components/MultiGdsFlightSearch';
import AncillariesAndSSRHub from '../../components/AncillariesAndSSRHub';
import { useAlert } from '../../contexts/AlertContext';

export default function FlightExpertDesk() {
  const { showAlert } = useAlert();

  // Active Workspace Tab (0 = Expert Search & Filters, 1 = GDS Queue & Console, 2 = Advanced Info Inspector)
  const [workspaceTab, setWorkspaceTab] = useState(0);
  const [gdsModalOpen, setGdsModalOpen] = useState(false);

  // 1. ROUTE TYPES: One Way | Round Trip | Multi-City | Open Jaw
  const [tripType, setTripType] = useState('Round Trip'); // 'One Way' | 'Round Trip' | 'Multi-City' | 'Open Jaw'

  // 2. SEARCH OPTIONS: Nearby Airports | Flexible Dates | Multiple Passengers
  const [nearbyAirports, setNearbyAirports] = useState(true);
  const [flexibleDates, setFlexibleDates] = useState(true);
  const [passengers, setPassengers] = useState({
    adults: 2,
    children: 0,
    infantsInSeat: 0,
    infantsInLap: 0
  });

  // Multi-City Legs state
  const [multiCityLegs, setMultiCityLegs] = useState([
    { legId: 1, origin: 'DEL', destination: 'LHR', date: '2026-10-15' },
    { legId: 2, origin: 'LHR', destination: 'JFK', date: '2026-10-22' },
    { legId: 3, origin: 'JFK', destination: 'DEL', date: '2026-11-05' }
  ]);

  // Open Jaw Legs state
  const [openJawRoute, setOpenJawRoute] = useState({
    outboundOrigin: 'DEL',
    outboundDest: 'LHR',
    outboundDate: '2026-10-15',
    inboundOrigin: 'CDG', // Open jaw: returning from Paris instead of London
    inboundDest: 'DEL',
    inboundDate: '2026-10-25'
  });

  // 3. 10 ADVANCED FILTERS
  const [filters, setFilters] = useState({
    airline: 'All', // BA, AI, EK, VS, QR, DL, AA
    alliance: 'All', // Star Alliance, Oneworld, SkyTeam, Non-Aligned
    stops: 'Direct', // Non-Stop, 1 Stop Max, 2+ Stops
    baggage: '2+ Bags (Included)', // 1 Bag, 2+ Bags, 32kg Heavy
    fareFamily: 'Flex', // Saver, Flex, Classic, Ultimate Flex
    depTime: 'Morning (06:00 - 12:00)', // Early Morning, Morning, Afternoon, Night
    arrTime: 'Afternoon (12:00 - 18:00)',
    connectionDuration: 'Under 4 Hours', // Under 2h, Under 4h, Under 8h, Overnight
    aircraft: 'Widebody Only (A380/B777/A350/B787)', // Widebody, Narrowbody, Any
    cabin: 'Business' // Economy, Premium Economy, Business, First Class
  });

  // 4. ADVANCED INFORMATION INSPECTOR TAB STATE
  const [inspectorTab, setInspectorTab] = useState(0);

  // Queue state
  const [requestsList, setRequestsList] = useState(DEMO_QUEUE_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState(DEMO_QUEUE_REQUESTS[0]);

  const handleSelectRequest = (req) => {
    setSelectedRequest(req);
  };

  const handleParseSuccess = (parsedFlights) => {
    showAlert(`✓ Parsed ${parsedFlights.length} flight segments from GDS. Expert margin & pricing synced.`, 'success');
  };

  const handlePublishQuote = (quoteData) => {
    setRequestsList(prev =>
      prev.map(r => r.id === quoteData.requestId ? { ...r, status: 'Sent to Agent', netFare: quoteData.netFare } : r)
    );
    if (selectedRequest && selectedRequest.id === quoteData.requestId) {
      setSelectedRequest(prev => ({ ...prev, status: 'Sent to Agent', netFare: quoteData.netFare }));
    }
    showAlert(`🚀 Quote for #${quoteData.requestId} published to ${selectedRequest?.salesAgent || 'Sales Agent'}. Selling: $${quoteData.sellingPrice.toFixed(0)} | Profit: $${quoteData.profit.toFixed(0)}`, 'success');
  };

  const addMultiCityLeg = () => {
    if (multiCityLegs.length >= 6) {
      showAlert('Maximum 6 legs allowed for Multi-City itinerary', 'warning');
      return;
    }
    const nextLegId = multiCityLegs.length + 1;
    const lastLeg = multiCityLegs[multiCityLegs.length - 1];
    setMultiCityLegs([
      ...multiCityLegs,
      { legId: nextLegId, origin: lastLeg ? lastLeg.destination : 'JFK', destination: 'SIN', date: '2026-11-12' }
    ]);
  };

  const removeMultiCityLeg = (index) => {
    if (multiCityLegs.length <= 2) {
      showAlert('Multi-City itinerary requires at least 2 legs', 'warning');
      return;
    }
    setMultiCityLegs(multiCityLegs.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* ─── 1. TOP HEADER & DUAL CLOCKS ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          px: 3,
          mb: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: '#EEF2FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <AirplanemodeActiveIcon sx={{ fontSize: 30 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Flight Expert Workspace
              </Typography>
              <Chip size="small" label="GDS Operations & Tariff Desk" color="primary" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Specialized interface for Flight Experts: Advanced Search, 10 Expert Filters & 7 Information Audit Inspectors.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<TerminalIcon sx={{ color: '#38BDF8' }} />}
            onClick={() => setGdsModalOpen(true)}
            sx={{
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem',
              py: 1,
              px: 2.2,
              borderRadius: 2,
              border: '1px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#1E293B', borderColor: '#38BDF8' }
            }}
          >
            Launch GDS Cryptic Terminal & PNR Builder
          </Button>

          <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
        </Box>
      </Paper>

      {/* ─── WORKSPACE NAVIGATION TABS ─── */}
      <Paper elevation={0} sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', borderRadius: 2 }}>
        <Tabs
          value={workspaceTab}
          onChange={(_, v) => setWorkspaceTab(v)}
          sx={{ px: 2 }}
        >
          <Tab icon={<ConnectingAirportsIcon />} iconPosition="start" label="1. Advanced Flight Search & 10 Filters" sx={{ fontWeight: 800 }} />
          <Tab icon={<FlightTakeoffIcon />} iconPosition="start" label="2. GDS Request Queue & PNR Console" sx={{ fontWeight: 800 }} />
          <Tab icon={<InfoIcon />} iconPosition="start" label="3. Advanced Information & Audit Inspector" sx={{ fontWeight: 800 }} />
        </Tabs>
      </Paper>

      {/* ════════════════════════════════════════════════════════════════════
          TAB 0: ADVANCED FLIGHT SEARCH & 10 EXPERT FILTERS
      ════════════════════════════════════════════════════════════════════ */}
      {workspaceTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* SECTION 1: ROUTE TYPES & SEARCH OPTIONS */}
          <Paper elevation={0} sx={{ p: 3, border: '2px solid #3B82F6', borderRadius: 3, bgcolor: '#FFFFFF' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlightTakeoffIcon /> 1. Itinerary Route Selector & Search Options
            </Typography>

            {/* ROUTE TYPE BUTTONS */}
            <Grid container spacing={1.5} sx={{ mb: 3 }}>
              {['One Way', 'Round Trip', 'Multi-City', 'Open Jaw'].map((type) => (
                <Grid item xs={6} sm={3} key={type}>
                  <Button
                    fullWidth
                    variant={tripType === type ? 'contained' : 'outlined'}
                    color={tripType === type ? 'primary' : 'inherit'}
                    onClick={() => setTripType(type)}
                    sx={{ fontWeight: 800, py: 1, borderRadius: 2 }}
                  >
                    ● {type}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {/* SEARCH OPTIONS TOGGLES */}
            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0', mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={nearbyAirports}
                        onChange={e => setNearbyAirports(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>● Nearby Airports Search</Typography>
                        <Typography variant="caption" color="text.secondary">Includes alternate hubs (+/- 100mi)</Typography>
                      </Box>
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={flexibleDates}
                        onChange={e => setFlexibleDates(e.target.checked)}
                        color="secondary"
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>● Flexible Dates Matrix</Typography>
                        <Typography variant="caption" color="text.secondary">Grid search (+/- 3 days flexibility)</Typography>
                      </Box>
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon color="primary" />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>● Multiple Passengers (Pax)</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {passengers.adults} Adults | {passengers.children} Child | {passengers.infantsInSeat + passengers.infantsInLap} Infant
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {/* ROUTE BUILDER DEPENDING ON TRIP TYPE */}
            {tripType === 'Multi-City' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'info.main' }}>
                    ✈️ Multi-City Route Builder ({multiCityLegs.length} Legs)
                  </Typography>
                  <Button size="small" startIcon={<AddIcon />} onClick={addMultiCityLeg} sx={{ fontWeight: 800 }}>
                    Add Leg #{multiCityLegs.length + 1}
                  </Button>
                </Box>
                {multiCityLegs.map((leg, index) => (
                  <Paper key={leg.legId} elevation={0} sx={{ p: 2, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF', borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={1}>
                        <Chip size="small" label={`Leg ${index + 1}`} color="primary" sx={{ fontWeight: 800 }} />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Origin Airport"
                          value={leg.origin}
                          onChange={e => {
                            const updated = [...multiCityLegs];
                            updated[index].origin = e.target.value.toUpperCase();
                            setMultiCityLegs(updated);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          size="small"
                          fullWidth
                          label="Destination Airport"
                          value={leg.destination}
                          onChange={e => {
                            const updated = [...multiCityLegs];
                            updated[index].destination = e.target.value.toUpperCase();
                            setMultiCityLegs(updated);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          size="small"
                          fullWidth
                          type="date"
                          label="Departure Date"
                          value={leg.date}
                          onChange={e => {
                            const updated = [...multiCityLegs];
                            updated[index].date = e.target.value;
                            setMultiCityLegs(updated);
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton color="error" onClick={() => removeMultiCityLeg(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            )}

            {tripType === 'Open Jaw' && (
              <Box sx={{ p: 2, border: '1px solid #C7D2FE', bgcolor: '#EEF2FF', borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#3730A3', mb: 1.5 }}>
                  ✈️ Open Jaw Itinerary Configuration
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>Outbound Leg:</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <TextField size="small" label="From" value={openJawRoute.outboundOrigin} onChange={e => setOpenJawRoute({ ...openJawRoute, outboundOrigin: e.target.value.toUpperCase() })} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField size="small" label="To" value={openJawRoute.outboundDest} onChange={e => setOpenJawRoute({ ...openJawRoute, outboundDest: e.target.value.toUpperCase() })} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField size="small" type="date" label="Date" value={openJawRoute.outboundDate} onChange={e => setOpenJawRoute({ ...openJawRoute, outboundDate: e.target.value })} InputLabelProps={{ shrink: true }} />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>Inbound Return Leg (Open Jaw Hub):</Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <TextField size="small" label="Return From" value={openJawRoute.inboundOrigin} onChange={e => setOpenJawRoute({ ...openJawRoute, inboundOrigin: e.target.value.toUpperCase() })} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField size="small" label="Return To" value={openJawRoute.inboundDest} onChange={e => setOpenJawRoute({ ...openJawRoute, inboundDest: e.target.value.toUpperCase() })} />
                      </Grid>
                      <Grid item xs={4}>
                        <TextField size="small" type="date" label="Return Date" value={openJawRoute.inboundDate} onChange={e => setOpenJawRoute({ ...openJawRoute, inboundDate: e.target.value })} InputLabelProps={{ shrink: true }} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Standard One Way / Round Trip Fields */}
            {(tripType === 'One Way' || tripType === 'Round Trip') && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth size="small" label="Origin (Airport / City) *" defaultValue="DEL" />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth size="small" label="Destination (Airport / City) *" defaultValue="LHR" />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth size="small" type="date" label="Departure Date *" defaultValue="2026-10-15" InputLabelProps={{ shrink: true }} />
                </Grid>
                {tripType === 'Round Trip' && (
                  <Grid item xs={12} sm={3}>
                    <TextField fullWidth size="small" type="date" label="Return Date *" defaultValue="2026-10-25" InputLabelProps={{ shrink: true }} />
                  </Grid>
                )}
              </Grid>
            )}
          </Paper>

          {/* SECTION 2: 10 ADVANCED FILTERS PANEL */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterListIcon /> 2. 10 Advanced Flight Expert Filters
            </Typography>

            <Grid container spacing={2}>
              {/* 1. Airline */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Airline</InputLabel>
                  <Select value={filters.airline} label="● Airline" onChange={e => setFilters({ ...filters, airline: e.target.value })}>
                    <MenuItem value="All">All Airlines</MenuItem>
                    <MenuItem value="BA">British Airways (BA)</MenuItem>
                    <MenuItem value="AI">Air India (AI)</MenuItem>
                    <MenuItem value="EK">Emirates (EK)</MenuItem>
                    <MenuItem value="VS">Virgin Atlantic (VS)</MenuItem>
                    <MenuItem value="QR">Qatar Airways (QR)</MenuItem>
                    <MenuItem value="AA">American Airlines (AA)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 2. Alliance */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Alliance</InputLabel>
                  <Select value={filters.alliance} label="● Alliance" onChange={e => setFilters({ ...filters, alliance: e.target.value })}>
                    <MenuItem value="All">All Alliances</MenuItem>
                    <MenuItem value="Star Alliance">Star Alliance (AI, LH, UA)</MenuItem>
                    <MenuItem value="Oneworld">Oneworld (BA, AA, QR)</MenuItem>
                    <MenuItem value="SkyTeam">SkyTeam (VS, AF, DL)</MenuItem>
                    <MenuItem value="Non-Aligned">Non-Aligned Carriers</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 3. Stops */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Stops</InputLabel>
                  <Select value={filters.stops} label="● Stops" onChange={e => setFilters({ ...filters, stops: e.target.value })}>
                    <MenuItem value="Direct">Direct Non-Stop Only</MenuItem>
                    <MenuItem value="1 Stop Max">1 Stop Max</MenuItem>
                    <MenuItem value="2+ Stops">2+ Stops Permitted</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 4. Baggage */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Baggage</InputLabel>
                  <Select value={filters.baggage} label="● Baggage" onChange={e => setFilters({ ...filters, baggage: e.target.value })}>
                    <MenuItem value="1 Bag">1 Checked Bag (23kg)</MenuItem>
                    <MenuItem value="2+ Bags (Included)">2+ Bags Included (32kg)</MenuItem>
                    <MenuItem value="Heavy Baggage">Heavy Baggage Allowance (40kg+)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 5. Fare Family */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Fare Family</InputLabel>
                  <Select value={filters.fareFamily} label="● Fare Family" onChange={e => setFilters({ ...filters, fareFamily: e.target.value })}>
                    <MenuItem value="Saver">Saver / Light</MenuItem>
                    <MenuItem value="Flex">Flex / Standard</MenuItem>
                    <MenuItem value="Classic">Classic Flex</MenuItem>
                    <MenuItem value="Ultimate Flex">Ultimate Super Flex</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 6. Departure Time */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Departure Time</InputLabel>
                  <Select value={filters.depTime} label="● Departure Time" onChange={e => setFilters({ ...filters, depTime: e.target.value })}>
                    <MenuItem value="Early Morning (00:00 - 06:00)">Early Morning (00:00 - 06:00)</MenuItem>
                    <MenuItem value="Morning (06:00 - 12:00)">Morning (06:00 - 12:00)</MenuItem>
                    <MenuItem value="Afternoon (12:00 - 18:00)">Afternoon (12:00 - 18:00)</MenuItem>
                    <MenuItem value="Night (18:00 - 24:00)">Night (18:00 - 24:00)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 7. Arrival Time */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Arrival Time</InputLabel>
                  <Select value={filters.arrTime} label="● Arrival Time" onChange={e => setFilters({ ...filters, arrTime: e.target.value })}>
                    <MenuItem value="Morning (06:00 - 12:00)">Morning Arrival</MenuItem>
                    <MenuItem value="Afternoon (12:00 - 18:00)">Afternoon Arrival</MenuItem>
                    <MenuItem value="Evening (18:00 - 22:00)">Evening Arrival</MenuItem>
                    <MenuItem value="Night (22:00 - 06:00)">Night Arrival</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 8. Connection Duration */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Connection Duration</InputLabel>
                  <Select value={filters.connectionDuration} label="● Connection Duration" onChange={e => setFilters({ ...filters, connectionDuration: e.target.value })}>
                    <MenuItem value="Under 2 Hours">Under 2 Hours Layover</MenuItem>
                    <MenuItem value="Under 4 Hours">Under 4 Hours Layover</MenuItem>
                    <MenuItem value="Under 8 Hours">Under 8 Hours Layover</MenuItem>
                    <MenuItem value="Overnight Stopover">Overnight Stopover</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 9. Aircraft */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Aircraft</InputLabel>
                  <Select value={filters.aircraft} label="● Aircraft" onChange={e => setFilters({ ...filters, aircraft: e.target.value })}>
                    <MenuItem value="Widebody Only (A380/B777/A350/B787)">Widebody Only (A380/B777/A350/B787)</MenuItem>
                    <MenuItem value="Narrowbody (A320/B737)">Narrowbody (A320/B737)</MenuItem>
                    <MenuItem value="Any Aircraft">Any Aircraft Type</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* 10. Cabin */}
              <Grid item xs={12} sm={4} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>● Cabin Class</InputLabel>
                  <Select value={filters.cabin} label="● Cabin Class" onChange={e => setFilters({ ...filters, cabin: e.target.value })}>
                    <MenuItem value="Economy">Economy</MenuItem>
                    <MenuItem value="Premium Economy">Premium Economy</MenuItem>
                    <MenuItem value="Business">Business Class</MenuItem>
                    <MenuItem value="First Class">First Class</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              startIcon={<SpeedIcon />}
              onClick={() => showAlert('⚡ Executed Flight Expert Search with 10 Advanced Filters across GDS Adapters!', 'success')}
              sx={{ mt: 3, fontWeight: 900, px: 4, py: 1 }}
            >
              Execute Expert Flight Search →
            </Button>
          </Paper>

          {/* SECTION 3: MULTI-GDS SEARCH RESULTS & POS TARIFF BREAKDOWN */}
          <MultiGdsFlightSearch
            onSelectFlight={(fl) => {
              showAlert(`✓ Selected flight ${fl.airline} (${fl.airlineCode}) for active request pricing.`, 'success');
            }}
            onGenerateQuote={(fl) => {
              showAlert(`✓ Forwarded ${fl.airline} itinerary to Rich-Text Email Quotation Desk!`, 'success');
            }}
          />
        </Box>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB 1: GDS QUEUE & CONSOLE (Original Request Queue & PNR Parsing)
      ════════════════════════════════════════════════════════════════════ */}
      {workspaceTab === 1 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '35% 65%' },
            gap: 2.5,
            alignItems: 'start'
          }}
        >
          {/* LEFT: Request Queue */}
          <Box>
            <FlightRequestQueue
              requests={requestsList}
              selectedId={selectedRequest?.id}
              onSelectRequest={handleSelectRequest}
            />
          </Box>

          {/* RIGHT: PNR Console & Calculators */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {selectedRequest && (
              <Paper
                elevation={0}
                sx={{
                  p: 1.8,
                  px: 2.5,
                  border: '1px solid',
                  borderColor: 'primary.light',
                  borderRadius: 2.5,
                  bgcolor: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1.5
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FlightTakeoffIcon color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                      Active Request #{selectedRequest.id} &nbsp;·&nbsp; {selectedRequest.origin} → {selectedRequest.destination}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Date: <b>{selectedRequest.travelDate}</b> &nbsp;|&nbsp;
                      Class: <b>{selectedRequest.cabinClass}</b> &nbsp;|&nbsp;
                      Pax: <b>{selectedRequest.passengers} Pax</b> &nbsp;|&nbsp;
                      Agent: <b>{selectedRequest.salesAgent}</b>
                    </Typography>
                  </Box>
                </Box>
                <Chip size="small" label={selectedRequest.status} color="info" sx={{ fontWeight: 800 }} />
              </Paper>
            )}

            <GDSParsingBox activeRequest={selectedRequest} onParseSuccess={handleParseSuccess} />
            <MarginCalculator activeRequest={selectedRequest} onPublishQuote={handlePublishQuote} />
            <UpsellEngine />
          </Box>
        </Box>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB 2: 7 ADVANCED INFORMATION AUDIT INSPECTORS
      ════════════════════════════════════════════════════════════════════ */}
      {workspaceTab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            <b>Flight Expert Audit Inspector</b>: Provides low-level GDS tariff rules, seat inventory bucket counts, linear fare construction, and TTL auto-cancellation timers.
          </Alert>

          <Paper elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', borderRadius: 2 }}>
            <Tabs
              value={inspectorTab}
              onChange={(_, v) => setInspectorTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ px: 2 }}
            >
              <Tab icon={<GavelIcon />} iconPosition="start" label="1. Fare Rules" sx={{ fontWeight: 800 }} />
              <Tab icon={<LocalOfferIcon />} iconPosition="start" label="2. Brand Rules" sx={{ fontWeight: 800 }} />
              <Tab icon={<LuggageIcon />} iconPosition="start" label="3. Baggage Rules" sx={{ fontWeight: 800 }} />
              <Tab icon={<AirlineSeatReclineExtraIcon />} iconPosition="start" label="4. Seat Availability (J9 C9...)" sx={{ fontWeight: 800 }} />
              <Tab icon={<AccessTimeIcon />} iconPosition="start" label="5. Ticketing Time Limit (TTL)" sx={{ fontWeight: 800 }} />
              <Tab icon={<ReceiptLongIcon />} iconPosition="start" label="6. Fare Construction" sx={{ fontWeight: 800 }} />
              <Tab icon={<EventAvailableIcon />} iconPosition="start" label="7. Exchange Conditions" sx={{ fontWeight: 800 }} />
              <Tab icon={<LuggageIcon />} iconPosition="start" label="8. Ancillaries & SSR Hub" sx={{ fontWeight: 800 }} />
            </Tabs>
          </Paper>

          {/* INSPECTOR TAB 0: FARE RULES */}
          {inspectorTab === 0 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
                📜 Category 16 & Tariff Penalty Rules
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'error.main', mb: 1 }}>
                      ● Cancellation & Refund Fee (Category 16)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • <b>Before Departure:</b> Refundable with $150 penalty fee per ticket.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • <b>After Departure:</b> Non-refundable once partially flown.
                    </Typography>
                    <Typography variant="body2">
                      • <b>No-Show Fee:</b> $300 penalty plus fare difference.
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'info.main', mb: 1 }}>
                      ● Date Changes & Advance Purchase (Category 5 & 6)
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • <b>Date Changes:</b> Permitted up to 24h before departure for $100 fee + fare difference.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      • <b>Advance Purchase (CAT 5):</b> Fare basis <code>JOWUS</code> requires booking 7 days in advance.
                    </Typography>
                    <Typography variant="body2">
                      • <b>Minimum Stay (CAT 6):</b> 3 days or Sunday night rule applies.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* INSPECTOR TAB 1: BRAND RULES */}
          {inspectorTab === 1 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
                🏷️ Fare Family Brand Rules & Entitlements
              </Typography>
              <Grid container spacing={2}>
                {['British Airways Club World Flex', 'Air India Maharajah Classic', 'Emirates Saver Flex'].map((brand, i) => (
                  <Grid item xs={12} md={4} key={i}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF', borderRadius: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#0369A1', mb: 1 }}>
                        {brand}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>✓ <b>Lounge Access:</b> Included (Galleries / Club Lounge)</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>✓ <b>Fast-Track Security:</b> Enabled</Typography>
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>✓ <b>Seat Selection:</b> Free at booking</Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>✓ <b>Tier Miles Accrual:</b> 150% Avios / Flying Returns</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* INSPECTOR TAB 2: BAGGAGE RULES */}
          {inspectorTab === 2 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
                🧳 Baggage Allowance & Excess Weight Tariffs
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Checked Baggage Allowance:</Typography>
                  <Typography variant="body2">• Business Class: <b>2x 32kg (70lbs)</b> per passenger.</Typography>
                  <Typography variant="body2">• Max Dimensions: 90cm x 75cm x 43cm.</Typography>
                </Paper>
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>Excess Baggage Fees:</Typography>
                  <Typography variant="body2">• Additional Piece (3rd bag): $180 prepaid / $220 airport.</Typography>
                  <Typography variant="body2">• Overweight Fee (32kg - 45kg): $120 flat fee.</Typography>
                </Paper>
              </Box>
            </Paper>
          )}

          {/* INSPECTOR TAB 3: SEAT AVAILABILITY BUCKETS */}
          {inspectorTab === 3 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
                💺 GDS Live Seat Bucket Availability Inventory
              </Typography>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#1E293B', color: '#38BDF8', borderRadius: 2, fontFamily: 'monospace', mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#F1F5F9' }}>
                  1 BA 142 J9 C9 D7 I4 R0 W9 E7 T0 Y9 B9 H9 K7 M4 L0 V0 N0 O0 Q0 S0 G0
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#F1F5F9' }}>
                  2 AI 161 J7 C5 D4 I2 Y9 B9 M9 H9 Q7 V4 W0 G0
                </Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary">
                Bucket breakdown: <b>J9 C9 D7</b> = Business class open seats available. <b>Y9 B9 M9</b> = Economy class open seats available.
              </Typography>
            </Paper>
          )}

          {/* INSPECTOR TAB 4: TICKETING TIME LIMIT (TTL) */}
          {inspectorTab === 4 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
                ⏰ GDS Ticketing Time Limit (TTL Auto-Cancel Deadline)
              </Typography>
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                <b>TTL Warning</b>: PNR <code>QTPNR8812</code> must be ticketed prior to <b>2026-08-22 23:59 GMT</b> or airline GDS will release held seats automatically.
              </Alert>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip icon={<AccessTimeIcon />} label="TTL Countdown: 51 Hours Remaining" color="warning" sx={{ fontWeight: 900 }} />
                <Typography variant="caption" color="text.secondary">Auto-sync with GDS Queue 8 enabled.</Typography>
              </Box>
            </Paper>
          )}

          {/* INSPECTOR TAB 5: FARE CONSTRUCTION */}
          {inspectorTab === 5 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
                🧾 Full GDS Linear Fare Construction Ladder
              </Typography>
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#0F172A', color: '#4ADE80', borderRadius: 2, fontFamily: 'monospace', mb: 2, fontSize: 13, wordBreak: 'break-all' }}>
                DEL BA LON Q15.00 420.00BA DEL 420.00NUC855.00END ROE 1.000000 XT 120.00IN 45.00GB 85.00UB 12.00F4
              </Paper>
              <Typography variant="caption" color="text.secondary">
                Linear breakdown: Base NUC: <b>855.00</b> | Q Surcharge: <b>15.00</b> | ROE: <b>1.000000</b> | Total Taxes: <b>$262.00</b>
              </Typography>
            </Paper>
          )}

          {/* INSPECTOR TAB 6: EXCHANGE CONDITIONS */}
          {inspectorTab === 6 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
                🔄 Involuntary Rerouting & Exchange Conditions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="body2">• <b>Re-issuance Fee:</b> $100 exchange penalty + difference in fare basis code.</Typography>
                <Typography variant="body2">• <b>Involuntary Schedule Change:</b> Free rebooking within +/- 3 days if flight changed by &gt; 120 mins.</Typography>
                <Typography variant="body2">• <b>Residual Credit Voucher:</b> Unused ticket value valid for 12 months from original issuance date.</Typography>
              </Box>
            </Paper>
          )}

          {/* INSPECTOR TAB 7: ANCILLARIES & SSR HUB */}
          {inspectorTab === 7 && (
            <AncillariesAndSSRHub
              pnr={selectedRequest?.pnr || 'QTPNR88'}
              passengers={selectedRequest?.passengers || 2}
            />
          )}
        </Box>
      )}

      {/* ─── GDS TERMINAL & ITINERARY DESK MODAL (PHASE 1) ─── */}
      <GDSTerminalModal
        open={gdsModalOpen}
        onClose={() => setGdsModalOpen(false)}
        initialData={{
          rawEdifact: selectedRequest?.gdsRaw,
          pax: selectedRequest?.passengers || 2,
          netPrice: 1225.00,
          markup: 284.24
        }}
        onSave={(data) => {
          showAlert(`✓ Saved GDS PNR #${data.pnr} with Total Selling: $${data.totalSelling} USD (${data.marginPercentage}% margin)`, 'success');
        }}
      />
    </Box>
  );
}
