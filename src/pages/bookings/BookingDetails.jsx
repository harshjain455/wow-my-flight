import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import PersonIcon from '@mui/icons-material/Person';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PaymentsIcon from '@mui/icons-material/Payments';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import GroupsIcon from '@mui/icons-material/Groups';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LinkIcon from '@mui/icons-material/Link';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import ForumIcon from '@mui/icons-material/Forum';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import SecurityIcon from '@mui/icons-material/Security';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';


// ==========================================
// CENTRAL BOOKING RECORD DATASET
// ==========================================

const CENTRAL_BOOKING_RECORD = {
  // Sticky Header Summary
  id: 'BK-10231',
  status: 'CONFIRMED & TICKETED',
  type: 'Multi-City / RTW',
  travelDate: '2026-09-15',
  createdDate: '2026-08-18 10:15',
  agent: 'Sarah Jenkins',
  teamLeader: 'Michael Chang',
  priority: 'Critical VIP',

  // 14-Stage Real-Time Lifecycle
  lifecycleStages: [
    { label: '1. Lead Created', time: 'Aug 18 10:15', user: 'System (Web Form)' },
    { label: '2. Lead Assigned', time: 'Aug 18 10:16', user: 'Sarah Jenkins (Agent)' },
    { label: '3. First Contact', time: 'Aug 18 10:18', user: 'Sarah Jenkins (Call 2m)' },
    { label: '4. Requirements Captured', time: 'Aug 18 10:25', user: 'Sarah Jenkins' },
    { label: '5. Quote Created', time: 'Aug 18 11:30', user: 'Sarah Jenkins (Q-8812)' },
    { label: '6. Follow-up Completed', time: 'Aug 19 14:10', user: 'Sarah Jenkins' },
    { label: '7. Payment Requested', time: 'Aug 19 14:15', user: 'Sarah Jenkins ($28,500)' },
    { label: '8. Payment Received', time: 'Aug 19 14:20', user: 'Elena Finance (Amex)' },
    { label: '9. Booking Confirmed', time: 'Aug 19 14:22', user: 'System (PNR SAB78K)' },
    { label: '10. Ticket Issued', time: 'Aug 20 11:30', user: 'Carlos (13381235436196)' },
    { label: '11. Confirmation Sent', time: 'Aug 20 11:32', user: 'System WhatsApp/Email' },
    { label: '12. After-Sales Activity', time: 'Aug 20 12:00', user: 'After-Sales Desk' },
    { label: '13. Refund/Reissue Check', time: 'Aug 20 12:15', user: 'None Required' },
    { label: '14. Booking Completed', time: 'Aug 20 12:30', user: 'Lifecycle 100% Completed' }
  ],

  // Real-Time 4-Question Tracking
  realtime4Q: {
    activity: { what: 'Ticket Issued & Dispatched via WhatsApp', who: 'Carlos Ticketing & System', when: '2026-08-20 11:32', dept: 'Ticketing & After-Sales' },
    operational: { status: 'CONFIRMED & TICKETED', nextAction: '24h Pre-departure Courtesy Call', pendingFollowup: 'Scheduled for 2026-09-14', slaStatus: '🟢 On Time (0 Breaches)' },
    financial: { customerPrice: 28500, supplierCost: 25800, markup: 2700, grossProfit: 2700, revenue: 28500, refund: 0, balance: 0 },
    accountability: { leadOwner: 'Sarah Jenkins', bookingOwner: 'Sarah Jenkins', priceApprover: 'Michael Chang (TL)', ticketIssuer: 'Carlos Ticketing', paymentProcessor: 'Elena Finance', qaVerifier: 'QA Verified Passed (14/14)' }
  },

  // Customer Profile
  customer: {
    name: 'Ambassador Harold Vance',
    phone: '+1 (555) 234-8901',
    email: 'harold.vance@embassy.gov',
    nationality: 'United States',
    passport: 'P-9918234 (Exp: 2031-10-12)',
    dob: '1978-04-12',
    vipTier: 'Tier 1 Black Diamond'
  },

  // Lead & Marketing Attribution
  lead: {
    leadId: 'LD-99120',
    source: 'Google Ads Search',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'summer_europe_sale_2026',
    utmTerm: 'cheap_first_class_flights',
    utmContent: 'banner_blue_v2',
    landingPage: '/flights/europe-summer-sale',
    referral: 'google.com Direct',
    leadOwner: 'Sarah Jenkins'
  },

  // Quote & Commercial Breakdown
  quote: {
    quoteId: 'Q-8812',
    version: 'v2.1 (Accepted)',
    customerPrice: 28500,
    supplierCost: 25800,
    markup: 2700,
    discount: 0,
    grossProfit: 2700,
    status: 'ACCEPTED & APPROVED',
    approvalHistory: 'Approved by Expert Team Leader at 2026-08-18 11:30'
  },

  // Travelers / Pax Manifest
  travelers: [
    { id: 1, name: 'Ambassador Harold Vance', gender: 'Male', dob: '1978-04-12', passport: 'P-9918234', nationality: 'USA', seat: '1A (Window)', meal: 'Halal (MOML)', assistance: 'None' },
    { id: 2, name: 'Lady Eleanor Vance', gender: 'Female', dob: '1982-08-24', passport: 'P-9918235', nationality: 'USA', seat: '1B (Aisle)', meal: 'Vegan (VGML)', assistance: 'None' }
  ],

  // Flight Segments & Itinerary
  segments: [
    { segId: 1, origin: 'DEL (New Delhi)', destination: 'LHR (London Heathrow)', airline: 'British Airways (BA-142)', dep: '2026-09-15 02:15', arr: '2026-09-15 06:40', cabin: 'First Class', baggage: '2x32kg Checked', fareClass: 'F' },
    { segId: 2, origin: 'LHR (London Heathrow)', destination: 'JFK (New York)', airline: 'British Airways (BA-117)', dep: '2026-09-18 10:15', arr: '2026-09-18 13:20', cabin: 'First Class', baggage: '2x32kg Checked', fareClass: 'F' }
  ],

  // PNR & GDS Engine
  pnr: {
    primaryPnr: 'SAB78K',
    secondaryPnr: '1A-99210X',
    airline: 'British Airways',
    gdsEngine: 'Sabre 1S',
    status: 'CONFIRMED',
    createdDate: '2026-08-18 10:20',
    deadline: '2026-08-20 18:00',
    supplierRef: 'BA-SUP-7712'
  },

  // Ticket Issuance & Reissues
  tickets: [
    { traveler: 'Ambassador Harold Vance', ticketNumber: '13381235436196', airline: 'British Airways', status: 'TICKET ISSUED', issueDate: '2026-08-20 11:30', reissueStatus: 'INVOL WAIVER APPLIED' },
    { traveler: 'Lady Eleanor Vance', ticketNumber: '13381235436197', airline: 'British Airways', status: 'TICKET ISSUED', issueDate: '2026-08-20 11:30', reissueStatus: 'NONE' }
  ],

  // Supplier Details
  supplier: {
    name: 'Amadeus 1A Air Aggregator',
    bookingRef: 'AMAD-991204',
    cost: 25800,
    paymentStatus: 'PAID IN FULL',
    contact: '+1-800-AMADEUS-AIR',
    notes: 'Corporate GDS contract override applied. Commission credited.'
  },

  // Payments & Ledger
  payment: {
    status: 'PAID IN FULL ($28,500)',
    method: 'Credit Card (Amex Black)',
    customerPaid: 28500,
    supplierPaid: 25800,
    netProfit: 2700,
    balance: 0,
    timeline: '2026-08-19 14:10 - Full Payment Recvd ($28,500)'
  },

  // Refunds Lifecycle
  refund: {
    refundId: 'RF-NONE',
    amount: 0,
    reason: 'No Refund Requested',
    status: 'NONE',
    requestedDate: 'N/A',
    completedDate: 'N/A'
  },

  // Document Manager
  documents: [
    { name: 'Passport_Copy_Harold_Vance.pdf', type: 'Passport', date: '2026-08-18' },
    { name: 'US_Diplomatic_Visa_Copy.pdf', type: 'Visa', date: '2026-08-18' },
    { name: 'E_Ticket_Receipt_BA_13381235436196.pdf', type: 'E-Ticket', date: '2026-08-20' },
    { name: 'Tax_Invoice_INV-9912.pdf', type: 'Invoice', date: '2026-08-19' }
  ],

  // Communications Timeline
  communications: [
    { type: 'Email', sender: 'System', text: 'E-Ticket PDF dispatched to harold.vance@embassy.gov', time: '2026-08-20 11:32' },
    { type: 'WhatsApp', sender: 'Sarah Jenkins', text: 'Confirmed seat 1A and 1B with British Airways concierge', time: '2026-08-20 10:15' },
    { type: 'Call', sender: 'Customer', text: 'Inbound call: Confirmed Halal meal preference for Mr. Vance', time: '2026-08-19 16:20' },
    { type: 'Note', sender: 'Expert TL', text: 'Executive waiver authorized for schedule change', time: '2026-08-19 11:00' }
  ],

  // Tasks & SLA Management
  tasks: [
    { name: 'Issue E-Tickets in Sabre', assignedTo: 'Ticketing Agent', dueDate: '2026-08-20', status: 'Completed', sla: 'On Time' },
    { name: '24h Pre-departure Courtesy Call', assignedTo: 'Sarah Jenkins', dueDate: '2026-09-14', status: 'Pending', sla: 'Scheduled' }
  ],

  // Audit Trail
  auditLog: [
    { user: 'Sarah Jenkins', role: 'Sales Agent', action: 'Created Booking from Lead LD-99120', time: '2026-08-18 10:15' },
    { user: 'Michael Chang', role: 'Team Leader', action: 'Approved Commercial Quote Q-8812', time: '2026-08-18 11:30' },
    { user: 'Elena Finance', role: 'Finance', action: 'Confirmed Receipt of $28,500 via Amex', time: '2026-08-19 14:10' },
    { user: 'Carlos Ticketing', role: 'Ticketing', action: 'Issued E-Tickets 13381235436196/97', time: '2026-08-20 11:30' }
  ]
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);

  // States
  const [booking, setBooking] = useState(CENTRAL_BOOKING_RECORD);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleDepartmentAction = (dept, actionName) => {
    showAlert(`✓ [${dept.toUpperCase()}] ${actionName} triggered on Central Record ${booking.id}`, 'success');
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/bookings')}
        sx={{ mb: 2, fontWeight: 700 }}
      >
        Back to Bookings
      </Button>

      {/* STICKY TOP EXECUTIVE SUMMARY BANNER */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF', position: 'sticky', top: 10, zIndex: 100, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem' }}>
              BK
            </Avatar>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                  Central Booking Record: {booking.id}
                </Typography>
                <Chip label={booking.status} size="small" color="success" sx={{ fontWeight: 900, fontSize: '0.7rem' }} />
                <Chip label={booking.priority} size="small" color="error" sx={{ fontWeight: 900, fontSize: '0.7rem' }} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
                Single Source of Truth • Type: <b>{booking.type}</b> • Travel Date: <b>{booking.travelDate}</b>
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Assigned Team:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>Rep: {booking.agent} • TL: {booking.teamLeader}</Typography>
            </Box>
            <DualClock client={{ timezone: 'America/New_York', label: 'Client EST' }} />
          </Box>

        </Box>
      </Paper>

      {/* 14-STAGE REAL-TIME BOOKING LIFECYCLE STEPPER */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#3F51B5', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          🔄 14-Stage Real-Time Booking Lifecycle Stepper
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', lg: 'repeat(7, 1fr)' }, gap: 1.2 }}>
          {booking.lifecycleStages.map((stg, i) => (
            <Paper key={i} variant="outlined" sx={{ p: 1.2, borderRadius: 2, bgcolor: '#F0FDF4', borderColor: '#86EFAC', textAlign: 'center' }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#059669', display: 'block', fontSize: '0.68rem' }}>
                {stg.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.6rem', display: 'block' }}>
                {stg.time}
              </Typography>
              <Typography variant="caption" color="text.primary" sx={{ fontWeight: 800, fontSize: '0.62rem' }}>
                {stg.user}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* REAL-TIME 4-QUESTION BUSINESS INSPECTION PANEL */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#C59B27', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          ⚡ Real-Time 4-Question Business Inspection Widget
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
          {/* Activity */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#EFF6FF', borderColor: '#BFDBFE' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#2563EB', mb: 1 }}>1. Activity Tracking</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>What Happened:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 900, mb: 0.5 }}>{booking.realtime4Q.activity.what}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>Who & When:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{booking.realtime4Q.activity.who} ({booking.realtime4Q.activity.when})</Typography>
          </Paper>

          {/* Operational */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#FEFCE8', borderColor: '#FDE047' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#D97706', mb: 1 }}>2. Operational Tracking</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>Current Status:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 900, color: '#059669', mb: 0.5 }}>{booking.realtime4Q.operational.status}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>Next Action & SLA:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{booking.realtime4Q.operational.nextAction} • {booking.realtime4Q.operational.slaStatus}</Typography>
          </Paper>

          {/* Financial */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#ECFDF5', borderColor: '#A7F3D0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#059669', mb: 1 }}>3. Financial Tracking</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>Selling Price vs Cost:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main' }}>${booking.realtime4Q.financial.customerPrice.toLocaleString()} (Cost: ${booking.realtime4Q.financial.supplierCost.toLocaleString()})</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>Gross Profit:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 900, color: '#059669', display: 'block' }}>+${booking.realtime4Q.financial.grossProfit.toLocaleString()} Net Profit</Typography>
          </Paper>

          {/* Accountability */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#F5F3FF', borderColor: '#DDD6FE' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#7C3AED', mb: 1 }}>4. Accountability Tracking</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>Lead & Booking Owner:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 900 }}>{booking.realtime4Q.accountability.leadOwner}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>Approver & Ticket Issuer:</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{booking.realtime4Q.accountability.priceApprover} • {booking.realtime4Q.accountability.ticketIssuer}</Typography>
          </Paper>
        </Box>
      </Paper>

      {/* MULTI-DEPARTMENT COLLABORATION ACTION BAR */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#F8FAFC', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 900, textTransform: 'uppercase', mr: 1 }}>
          🏢 Department Actions on Single Record:
        </Typography>
        <Button size="small" variant="contained" color="primary" onClick={() => handleDepartmentAction('Sales', 'Update Quote & Commercials')} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
          Sales: Update Quote
        </Button>
        <Button size="small" variant="contained" color="secondary" onClick={() => handleDepartmentAction('Ticketing', 'Issue GDS E-Ticket')} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
          Ticketing: Issue E-Ticket
        </Button>
        <Button size="small" variant="contained" color="success" onClick={() => handleDepartmentAction('Finance', 'Record Ledger Payment')} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
          Finance: Record Payment
        </Button>
        <Button size="small" variant="contained" color="warning" onClick={() => handleDepartmentAction('QA', 'Verify Booking QA')} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
          QA: Verify Checklist
        </Button>
        <Button size="small" variant="outlined" color="inherit" onClick={() => handleDepartmentAction('After-Sales', 'Send Departure Alert')} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
          After-Sales: Schedule Alert
        </Button>
      </Paper>

      {/* 14 UNIFIED CENTRAL RECORD TABS */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 800,
              fontSize: '0.75rem',
              py: 1.8,
              minHeight: 48,
              textTransform: 'none'
            }
          }}
        >
          <Tab label="1. Overview & Customer" icon={<PersonIcon fontSize="small" />} iconPosition="start" />
          <Tab label="2. Lead & UTM Attribution" icon={<LinkIcon fontSize="small" />} iconPosition="start" />
          <Tab label="3. Quote & Commercials" icon={<RequestQuoteIcon fontSize="small" />} iconPosition="start" />
          <Tab label="4. Travelers Manifest" icon={<GroupsIcon fontSize="small" />} iconPosition="start" />
          <Tab label="5. Flight Segments" icon={<FlightTakeoffIcon fontSize="small" />} iconPosition="start" />
          <Tab label="6. PNR & GDS Engine" icon={<ConnectingAirportsIcon fontSize="small" />} iconPosition="start" />
          <Tab label="7. Ticket Issuance" icon={<ConfirmationNumberIcon fontSize="small" />} iconPosition="start" />
          <Tab label="8. Supplier & Costs" icon={<StorefrontIcon fontSize="small" />} iconPosition="start" />
          <Tab label="9. Payments & Ledger" icon={<PaymentsIcon fontSize="small" />} iconPosition="start" />
          <Tab label="10. Refunds Lifecycle" icon={<CurrencyExchangeIcon fontSize="small" />} iconPosition="start" />
          <Tab label="11. Documents Manager" icon={<DescriptionIcon fontSize="small" />} iconPosition="start" />
          <Tab label="12. Communications" icon={<ForumIcon fontSize="small" />} iconPosition="start" />
          <Tab label="13. Tasks & SLA" icon={<AssignmentTurnedInIcon fontSize="small" />} iconPosition="start" />
          <Tab label="14. Audit Log & Trail" icon={<HistoryIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* TAB CONTENT SECTIONS */}

      {/* TAB 1: OVERVIEW & CUSTOMER */}
      {currentTab === 0 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
            👤 Customer Profile & Executive Summary
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, fontSize: 14 }}>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Customer Name:</Typography><Typography variant="body1" sx={{ fontWeight: 900 }}>{booking.customer.name}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Phone Number:</Typography><Typography variant="body1" sx={{ fontWeight: 800 }}>{booking.customer.phone}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Email Address:</Typography><Typography variant="body1" sx={{ fontWeight: 800 }}>{booking.customer.email}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Nationality:</Typography><Typography variant="body1" sx={{ fontWeight: 800 }}>{booking.customer.nationality}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Passport Details:</Typography><Typography variant="body1" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{booking.customer.passport}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Loyalty / VIP Status:</Typography><Chip label={booking.customer.vipTier} size="small" color="secondary" sx={{ fontWeight: 900, mt: 0.3 }} /></Box>
          </Box>
        </Paper>
      )}

      {/* TAB 2: LEAD & UTM ATTRIBUTION */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563EB', mb: 2 }}>
            🔗 Original Lead & Permanent UTM Attribution
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Original Lead ID:</Typography><Typography variant="body1" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{booking.lead.leadId}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Source Platform:</Typography><Typography variant="body1" sx={{ fontWeight: 800 }}>{booking.lead.source}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>UTM Source:</Typography><Typography variant="body1" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>{booking.lead.utmSource}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>UTM Medium:</Typography><Typography variant="body1" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{booking.lead.utmMedium}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>UTM Campaign:</Typography><Typography variant="body1" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{booking.lead.utmCampaign}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Landing Page:</Typography><Typography variant="body1" sx={{ fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>{booking.lead.landingPage}</Typography></Box>
          </Box>
        </Paper>
      )}

      {/* TAB 3: QUOTE & COMMERCIALS */}
      {currentTab === 2 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#C59B27', mb: 2 }}>
            💰 Quote & Commercial Profitability Breakdown
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Selling Price:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>${booking.quote.customerPrice.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Supplier Cost:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>${booking.quote.supplierCost.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Margin / Markup:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#C59B27' }}>+${booking.quote.markup.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Net Gross Profit:</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669' }}>${booking.quote.grossProfit.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* TAB 4: TRAVELERS MANIFEST */}
      {currentTab === 3 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
            👥 Passenger Manifest ({booking.travelers.length} Travelers)
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Gender & DOB</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Passport & Nationality</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Seat Preference</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Meal Request</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {booking.travelers.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell sx={{ fontWeight: 900 }}>{t.name}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{t.gender} ({t.dob})</TableCell>
                    <TableCell sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{t.passport} ({t.nationality})</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>{t.seat}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#059669' }}>{t.meal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* TAB 5: FLIGHT SEGMENTS */}
      {currentTab === 4 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0284C7', mb: 2 }}>
            ✈️ Flight Segments & Itinerary Breakdown
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {booking.segments.map((s) => (
              <Paper key={s.segId} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#F8FAFC' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    Segment {s.segId}: {s.origin} ➔ {s.destination}
                  </Typography>
                  <Chip label={s.cabin} color="primary" size="small" sx={{ fontWeight: 800 }} />
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>Airline: {s.airline}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Departure: <b>{s.dep}</b> | Arrival: <b>{s.arr}</b> | Baggage: <b>{s.baggage}</b>
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* TAB 6: PNR & GDS ENGINE */}
      {currentTab === 5 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#7C3AED', mb: 2 }}>
            🎫 PNR & GDS Sabre/Amadeus Engine Details
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Primary GDS PNR:</Typography><Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>{booking.pnr.primaryPnr}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Airline PNR:</Typography><Typography variant="h6" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{booking.pnr.secondaryPnr}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>GDS Provider:</Typography><Typography variant="h6" sx={{ fontWeight: 900, color: '#059669' }}>{booking.pnr.gdsEngine}</Typography></Box>
          </Box>
        </Paper>
      )}

      {/* TAB 7: TICKET ISSUANCE */}
      {currentTab === 6 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669', mb: 2 }}>
            🎟️ Issued 13-Digit E-Tickets
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {booking.tickets.map((t) => (
              <Paper key={t.ticketNumber} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#F0FDF4', borderColor: '#86EFAC' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Passenger: {t.traveler}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669', fontFamily: 'monospace' }}>E-Ticket #: {t.ticketNumber}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Airline: {t.airline} • Issued: {t.issueDate} • Reissue: {t.reissueStatus}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* TAB 8: SUPPLIER DETAILS */}
      {currentTab === 7 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
            🏢 GDS Supplier Contract & Payables
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 900 }}>Supplier: {booking.supplier.name}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>Supplier Ref: {booking.supplier.bookingRef} • Payable: ${booking.supplier.cost.toLocaleString()}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mt: 1, display: 'block' }}>Notes: {booking.supplier.notes}</Typography>
        </Paper>
      )}

      {/* TAB 9: PAYMENTS & LEDGER */}
      {currentTab === 8 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669', mb: 2 }}>
            💳 Financial Ledger & Payment History
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#059669', mb: 1 }}>{booking.payment.status}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>Method: {booking.payment.method} • Balance Due: ${booking.payment.balance}</Typography>
        </Paper>
      )}

      {/* TAB 10: REFUNDS LIFECYCLE */}
      {currentTab === 9 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', mb: 2 }}>
            🔄 Refund Lifecycle Status
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 800 }}>Refund Status: {booking.refund.status}</Typography>
          <Typography variant="caption" color="text.secondary">{booking.refund.reason}</Typography>
        </Paper>
      )}

      {/* TAB 11: DOCUMENTS MANAGER */}
      {currentTab === 10 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
            📁 Document Manager & Attachments
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
            {booking.documents.map((doc) => (
              <Paper key={doc.name} variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{doc.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{doc.type} • Uploaded {doc.date}</Typography>
                </Box>
                <Button size="small" variant="outlined" color="primary" onClick={() => showAlert(`Downloading ${doc.name}`, 'info')} sx={{ fontWeight: 800 }}>
                  Download
                </Button>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* TAB 12: COMMUNICATIONS TIMELINE */}
      {currentTab === 11 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', mb: 2 }}>
            💬 Unified Communications Timeline
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {booking.communications.map((c, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Chip label={c.type} size="small" color="primary" sx={{ fontWeight: 800 }} />
                  <Typography variant="caption" color="text.secondary">{c.time}</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.text}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* TAB 13: TASKS & SLA */}
      {currentTab === 12 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#7C3AED', mb: 2 }}>
            ✅ Booking Tasks & SLA Timers
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {booking.tasks.map((tsk, i) => (
              <Paper key={i} variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>{tsk.name}</Typography>
                  <Typography variant="caption" color="text.secondary">Assigned: {tsk.assignedTo} • Due: {tsk.dueDate}</Typography>
                </Box>
                <Chip label={tsk.status} size="small" color={tsk.status === 'Completed' ? 'success' : 'warning'} sx={{ fontWeight: 800 }} />
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* TAB 14: AUDIT LOG */}
      {currentTab === 13 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', mb: 2 }}>
            📜 Complete Multi-Department Activity Audit Trail
          </Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>User & Role</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Department Action</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {booking.auditLog.map((log, i) => (
                  <TableRow key={i} hover>
                    <TableCell sx={{ fontWeight: 900 }}>{log.user} ({log.role})</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{log.action}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{log.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

    </Box>
  );
}
