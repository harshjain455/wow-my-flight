import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Badge from '@mui/material/Badge';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import QuotationProposalBuilder from '../../components/QuotationProposalBuilder';
import FlightDealReview from '../public/FlightDealReview';

// Icons
import AddIcon from '@mui/icons-material/Add';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LuggageIcon from '@mui/icons-material/Luggage';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import PublishIcon from '@mui/icons-material/Publish';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalculateIcon from '@mui/icons-material/Calculate';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GavelIcon from '@mui/icons-material/Gavel';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';
import AppModal from '../../components/AppModal';
import { MOCK_QUOTES, MOCK_BOOKINGS, AIRLINES, CABIN_CLASSES } from '../../constants/mockData';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';
import { flightContentService } from '../../services/flightContentService';

const QUOTE_STATUS_FLOW = ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired', 'Archived'];

const STATUS_COLORS = {
  'Draft': { bg: '#F1F5F9', color: '#475569', icon: '📝' },
  'Sent': { bg: '#FEF3C7', color: '#92400E', icon: '📤' },
  'Viewed': { bg: '#EFF6FF', color: '#1E40AF', icon: '👁️' },
  'Accepted': { bg: '#D1FAE5', color: '#065F46', icon: '✅' },
  'Rejected': { bg: '#FEE2E2', color: '#991B1B', icon: '❌' },
  'Expired': { bg: '#F3E8FF', color: '#6B21A8', icon: '⏰' },
  'Archived': { bg: '#E2E8F0', color: '#64748B', icon: '📦' }
};

// Sales Flow Steps: Flight Search → Flight Options → Selected Itinerary → Markup → Service Fee → Final Price → Quote Expiry & Send
const SALES_STEPS = [
  '1. Flight Search',
  '2. Flight Options',
  '3. Selected Itinerary',
  '4. Markup',
  '5. Service Fee',
  '6. Final Price',
  '7. Quote & Customer'
];

export default function Quotes() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();

  const getRolePrefix = () => {
    if (!currentUser) return 'super_admin';
    if (currentUser.role === 'consultant') return 'agent';
    return currentUser.role;
  };

  // Quotes state with initial rich mock data supporting all 19 fields
  const [quotes, setQuotes] = useState(() => [
    {
      id: 'QT-9001',
      customerName: 'Karan Singh',
      customerEmail: 'karan@example.com',
      customerPhone: '+1 212 555 0199',
      route: 'DEL → LHR',
      optionsCount: 3,
      expiryDateTime: '2026-10-16T18:00',
      validity: '24 Hours',
      createdBy: 'Alex M.',
      status: 'Sent',
      createdDate: '2026-08-20',
      flightReqRef: 'REQ-8821',
      options: [
        {
          id: 1,
          airline: 'British Airways (BA)',
          flightNumber: 'BA-117',
          departure: 'DEL 10:30 AM (15 Oct 2026)',
          arrival: 'LHR 03:45 PM (15 Oct 2026)',
          depDateTime: '2026-10-15T10:30',
          arrDateTime: '2026-10-15T15:45',
          origin: 'DEL',
          destination: 'LHR',
          duration: '8h 45m',
          stops: 'Direct Non-Stop',
          cabinClass: 'Business',
          fareFamily: 'Club World Flex',
          baggage: '2x 32kg Checked + 7kg Cabin',
          fareConditions: 'Refundable with $150 penalty; free date change up to 24h prior.',
          supplier: 'Amadeus GDS',
          baseFare: 7200,
          taxes: 1600,
          supplierCost: 8800, // baseFare + taxes
          markupPct: 15,
          markupAmount: 1320,
          serviceFee: 150,
          discount: 50,
          customerPrice: 10220, // 8800 + 1320 + 150 - 50
          profit: 1420,
          notes: 'Lie-flat Club Suite seats, lounge access & fast-track security included.'
        },
        {
          id: 2,
          airline: 'Air India (AI)',
          flightNumber: 'AI-161',
          departure: 'DEL 02:45 AM (15 Oct 2026)',
          arrival: 'LHR 07:30 AM (15 Oct 2026)',
          depDateTime: '2026-10-15T02:45',
          arrDateTime: '2026-10-15T07:30',
          origin: 'DEL',
          destination: 'LHR',
          duration: '9h 15m',
          stops: 'Direct Non-Stop',
          cabinClass: 'Business',
          fareFamily: 'Maharajah Classic',
          baggage: '2x 32kg + 7kg Cabin',
          fareConditions: 'Refundable with $200 fee; change fee $100 + fare diff.',
          supplier: 'Air India Direct NDC',
          baseFare: 6800,
          taxes: 1400,
          supplierCost: 8200,
          markupPct: 18,
          markupAmount: 1476,
          serviceFee: 100,
          discount: 0,
          customerPrice: 9776,
          profit: 1576,
          notes: 'Early morning arrival at London Heathrow T2.'
        },
        {
          id: 3,
          airline: 'Emirates (EK)',
          flightNumber: 'EK-511 / EK-003',
          departure: 'DEL 10:30 AM (15 Oct 2026)',
          arrival: 'LHR 06:20 PM (15 Oct 2026)',
          depDateTime: '2026-10-15T10:30',
          arrDateTime: '2026-10-15T18:20',
          origin: 'DEL',
          destination: 'LHR',
          duration: '11h 20m',
          stops: '1 Stop (DXB 1h 45m)',
          cabinClass: 'Business',
          fareFamily: 'Emirates Saver Flex',
          baggage: '40kg Checked Allowance',
          fareConditions: 'Non-refundable; changes permitted for $250 fee.',
          supplier: 'Sabre GDS',
          baseFare: 6500,
          taxes: 1400,
          supplierCost: 7900,
          markupPct: 20,
          markupAmount: 1580,
          serviceFee: 120,
          discount: 100,
          customerPrice: 9500,
          profit: 1600,
          notes: 'A380 Onboard Lounge Bar access & complementary Chauffeur Drive.'
        }
      ]
    },
    {
      id: 'QT-9002',
      customerName: 'Ankit Sharma',
      customerEmail: 'ankit@example.com',
      customerPhone: '+1 415 882 1092',
      route: 'JFK → DXB',
      optionsCount: 2,
      expiryDateTime: '2026-10-18T12:00',
      validity: '48 Hours',
      createdBy: 'Sofia R.',
      status: 'Accepted',
      createdDate: '2026-08-19',
      flightReqRef: 'REQ-8819',
      options: [
        {
          id: 1,
          airline: 'Emirates (EK)',
          flightNumber: 'EK-202',
          departure: 'JFK 11:00 PM (20 Nov 2026)',
          arrival: 'DXB 07:45 PM (21 Nov 2026)',
          depDateTime: '2026-11-20T23:00',
          arrDateTime: '2026-11-21T19:45',
          origin: 'JFK',
          destination: 'DXB',
          duration: '12h 45m',
          stops: 'Direct Non-Stop',
          cabinClass: 'Economy',
          fareFamily: 'Flex Plus',
          baggage: '2x 23kg Checked',
          fareConditions: 'Fully refundable with $100 fee prior to departure.',
          supplier: 'Emirates Direct NDC',
          baseFare: 2100,
          taxes: 500,
          supplierCost: 2600,
          markupPct: 20,
          markupAmount: 520,
          serviceFee: 80,
          discount: 0,
          customerPrice: 3200,
          profit: 600,
          notes: 'Direct flight on Boeing 777-300ER with inflight Wi-Fi.'
        }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quoteMainTab, setQuoteMainTab] = useState(0);

  // Stepper Sales Flow Modal State
  const [quoteEngineOpen, setQuoteEngineOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Customer Preview Modal State
  const [customerPreviewOpen, setCustomerPreviewOpen] = useState(false);
  const [previewQuote, setPreviewQuote] = useState(null);

  // Quote Engine Form State
  const [engineData, setEngineData] = useState({
    customerName: 'Rohit Verma',
    customerEmail: 'rohit.verma@example.com',
    customerPhone: '+91 98765 43210',
    origin: 'DEL',
    destination: 'LHR',
    departDate: '2026-10-15',
    cabinClass: 'Business',
    passengers: 2,
    preferredSupplier: 'Amadeus GDS',

    // Available Flight Options found during Search
    searchFlightResults: [
      {
        id: 1,
        selected: true,
        airline: 'British Airways (BA)',
        flightNumber: 'BA-142',
        departure: 'DEL 09:15 AM',
        arrival: 'LHR 02:30 PM',
        depDateTime: '2026-10-15T09:15',
        arrDateTime: '2026-10-15T14:30',
        origin: 'DEL',
        destination: 'LHR',
        duration: '8h 45m',
        stops: 'Direct Non-Stop',
        cabinClass: 'Business',
        fareFamily: 'Club World Flex',
        baggage: '2x 32kg Checked + 7kg Cabin',
        fareConditions: 'Refundable ($150 fee); change allowed 24h prior.',
        supplier: 'Amadeus GDS',
        baseFare: 7000,
        taxes: 1500,
        markupPct: 15,
        markupAmount: 1275,
        serviceFee: 100,
        discount: 50,
        notes: 'Lie-flat seats, Fast Track security & lounge access.'
      },
      {
        id: 2,
        selected: true,
        airline: 'Air India (AI)',
        flightNumber: 'AI-161',
        departure: 'DEL 02:45 AM',
        arrival: 'LHR 07:30 AM',
        depDateTime: '2026-10-15T02:45',
        arrDateTime: '2026-10-15T07:30',
        origin: 'DEL',
        destination: 'LHR',
        duration: '9h 15m',
        stops: 'Direct Non-Stop',
        cabinClass: 'Business',
        fareFamily: 'Maharajah Flex',
        baggage: '2x 32kg + 7kg Cabin',
        fareConditions: 'Refundable ($200 fee); free seats.',
        supplier: 'Air India Direct NDC',
        baseFare: 6500,
        taxes: 1300,
        markupPct: 18,
        markupAmount: 1404,
        serviceFee: 80,
        discount: 0,
        notes: 'Early morning arrival Terminal 2.'
      },
      {
        id: 3,
        selected: false,
        airline: 'Emirates (EK)',
        flightNumber: 'EK-511 / EK-003',
        departure: 'DEL 10:30 AM',
        arrival: 'LHR 06:20 PM',
        depDateTime: '2026-10-15T10:30',
        arrDateTime: '2026-10-15T18:20',
        origin: 'DEL',
        destination: 'LHR',
        duration: '11h 20m',
        stops: '1 Stop (DXB 1h 45m)',
        cabinClass: 'Business',
        fareFamily: 'Saver Flex',
        baggage: '40kg Checked Allowance',
        fareConditions: 'Non-refundable; $250 change penalty.',
        supplier: 'Sabre GDS',
        baseFare: 6200,
        taxes: 1400,
        markupPct: 20,
        markupAmount: 1520,
        serviceFee: 120,
        discount: 100,
        notes: 'A380 Lounge bar & Chauffeur drive.'
      }
    ],

    expiryHours: '24',
    expiryDateTime: '2026-08-21T18:00'
  });

  const handleExecuteAdapterSearch = async () => {
    const searchRes = await flightContentService.searchFlightsAcrossAdapters({
      origin: engineData.origin,
      destination: engineData.destination,
      departDate: engineData.departDate,
      cabinClass: engineData.cabinClass,
      passengers: engineData.passengers
    });

    if (searchRes.offers && searchRes.offers.length > 0) {
      setEngineData(prev => ({
        ...prev,
        searchFlightResults: searchRes.offers.map((off, i) => ({
          id: i + 1,
          selected: i < 2,
          airline: off.airline,
          flightNumber: off.flightNumber,
          departure: off.departure,
          arrival: off.arrival,
          depDateTime: off.depDateTime,
          arrDateTime: off.arrDateTime,
          origin: off.origin,
          destination: off.destination,
          duration: off.duration,
          stops: off.stops,
          cabinClass: off.cabinClass,
          fareFamily: off.fareFamily,
          baggage: off.baggage,
          fareConditions: off.fareConditions,
          supplier: off.supplierName,
          baseFare: off.baseFare,
          taxes: off.taxes,
          markupPct: 15,
          markupAmount: Math.round((off.baseFare + off.taxes) * 0.15),
          serviceFee: 100,
          discount: 0,
          notes: off.notes
        }))
      }));
      showAlert(`⚡ Searched ${searchRes.searchedAdaptersCount} Supplier Adapters concurrently! Loaded ${searchRes.offersCount} offers.`, 'success');
    }
  };

  const handleNextStep = () => {
    if (activeStep === 0) {
      handleExecuteAdapterSearch();
    }
    setActiveStep(prev => Math.min(prev + 1, SALES_STEPS.length - 1));
  };

  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const updateFlightResultField = (id, field, value) => {
    setEngineData(prev => ({
      ...prev,
      searchFlightResults: prev.searchFlightResults.map(opt => {
        if (opt.id === id) {
          const updated = { ...opt, [field]: value };
          // recalculate markupAmount if baseFare, taxes, or markupPct change
          const base = Number(updated.baseFare) || 0;
          const tax = Number(updated.taxes) || 0;
          const cost = base + tax;
          const pct = Number(updated.markupPct) || 0;
          const mkAmount = Math.round(cost * (pct / 100));
          updated.markupAmount = mkAmount;
          return updated;
        }
        return opt;
      })
    }));
  };

  const toggleOptionSelection = (id) => {
    setEngineData(prev => ({
      ...prev,
      searchFlightResults: prev.searchFlightResults.map(opt =>
        opt.id === id ? { ...opt, selected: !opt.selected } : opt
      )
    }));
  };

  // Build final calculated Quote Object from engine steps
  const calculatedQuoteObj = useMemo(() => {
    const selectedOptions = engineData.searchFlightResults.filter(o => o.selected);
    const formattedOptions = selectedOptions.map((opt, idx) => {
      const base = Number(opt.baseFare) || 0;
      const tax = Number(opt.taxes) || 0;
      const supplierCost = base + tax;
      const markup = Number(opt.markupAmount) || 0;
      const sFee = Number(opt.serviceFee) || 0;
      const disc = Number(opt.discount) || 0;
      const customerPrice = supplierCost + markup + sFee - disc;
      const profit = markup + sFee - disc;

      return {
        id: idx + 1,
        airline: opt.airline,
        flightNumber: opt.flightNumber,
        departure: `${opt.origin} ${opt.departure.includes('T') ? opt.departure.replace('T', ' ') : opt.departure}`,
        arrival: `${opt.destination} ${opt.arrival.includes('T') ? opt.arrival.replace('T', ' ') : opt.arrival}`,
        depDateTime: opt.depDateTime || '2026-10-15T10:30',
        arrDateTime: opt.arrDateTime || '2026-10-15T15:45',
        origin: opt.origin,
        destination: opt.destination,
        duration: opt.duration,
        stops: opt.stops,
        cabinClass: opt.cabinClass,
        fareFamily: opt.fareFamily,
        baggage: opt.baggage,
        fareConditions: opt.fareConditions,
        supplier: opt.supplier,
        baseFare: base,
        taxes: tax,
        supplierCost: supplierCost,
        markupPct: opt.markupPct,
        markupAmount: markup,
        serviceFee: sFee,
        discount: disc,
        customerPrice: customerPrice,
        profit: profit,
        notes: opt.notes
      };
    });

    const primaryOpt = formattedOptions[0] || {};

    return {
      id: 'QT-900' + (quotes.length + 1),
      customerName: engineData.customerName,
      customerEmail: engineData.customerEmail,
      customerPhone: engineData.customerPhone,
      route: `${engineData.origin} → ${engineData.destination}`,
      optionsCount: formattedOptions.length,
      validity: `${engineData.expiryHours} Hours`,
      expiryDateTime: engineData.expiryDateTime,
      createdBy: currentUser?.name || 'Alex M.',
      status: 'Sent',
      createdDate: new Date().toISOString().split('T')[0],
      flightReqRef: 'REQ-9901',
      options: formattedOptions,
      primaryCustomerPrice: primaryOpt.customerPrice || 0,
      primarySupplierCost: primaryOpt.supplierCost || 0,
      primaryProfit: primaryOpt.profit || 0
    };
  }, [engineData, quotes.length, currentUser]);

  const handleFinishQuoteEngine = (status = 'Sent') => {
    const finalQuoteObj = { ...calculatedQuoteObj, status };
    setQuotes([finalQuoteObj, ...quotes]);
    MOCK_QUOTES.unshift(finalQuoteObj);
    setQuoteEngineOpen(false);
    setActiveStep(0);

    if (status === 'Sent') {
      showAlert(`🎉 Quote ${finalQuoteObj.id} sent directly to ${finalQuoteObj.customerName} via Email & WhatsApp!`, 'success');
    } else {
      showAlert(`Quote ${finalQuoteObj.id} saved as Draft!`, 'info');
    }
  };

  const handleUpdateStatus = (quoteId, newStatus) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: newStatus } : q));
    if (selectedQuote && selectedQuote.id === quoteId) {
      setSelectedQuote(prev => ({ ...prev, status: newStatus }));
    }
    showAlert(`Quote ${quoteId} status marked as ${newStatus}`, 'success');
  };

  const handleConvertToBooking = (quote, optionIndex = 0) => {
    const opt = quote.options?.[optionIndex] || quote.options?.[0] || {};
    const newBookingId = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: newBookingId,
      bookingId: newBookingId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail || 'customer@example.com',
      customerPhone: quote.customerPhone || '+1 212 555 0199',
      route: quote.route,
      origin: opt.origin || 'DEL',
      destination: opt.destination || 'LHR',
      travelDate: opt.depDateTime ? opt.depDateTime.split('T')[0] : '2026-10-15',
      cabinClass: opt.cabinClass || 'Business',
      passengers: 2,
      pnr: 'PNR' + Math.floor(10000 + Math.random() * 89999),
      airline: opt.airline || 'British Airways',
      flightNumber: opt.flightNumber || 'BA-117',
      supplier: opt.supplier || 'Amadeus GDS',
      supplierCost: opt.supplierCost || 8800,
      netFare: opt.baseFare || 7200,
      taxes: opt.taxes || 1600,
      markup: opt.markupAmount || 1320,
      serviceFee: opt.serviceFee || 150,
      discount: opt.discount || 50,
      sellingPrice: opt.customerPrice || 10220,
      profit: opt.profit || 1420,
      bookingStatus: 'CONFIRMED',
      status: 'Confirmed',
      paymentStatus: 'PENDING',
      ticketStatus: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: quote.createdBy || currentUser?.name || 'Agent'
    };

    MOCK_BOOKINGS.unshift(newBooking);
    handleUpdateStatus(quote.id, 'Accepted');
    showAlert(`🎉 Quote ${quote.id} successfully converted into Confirmed Booking ${newBookingId}!`, 'success');
    navigate(`/${getRolePrefix()}/bookings`);
  };

  const handleDirectSendToCustomer = (quote) => {
    handleUpdateStatus(quote.id, 'Sent');
    showAlert(`🚀 Quote ${quote.id} sent directly to ${quote.customerName} (${quote.customerEmail} & ${quote.customerPhone})!`, 'success');
  };

  const handleOpenCustomerPreview = (quote) => {
    setPreviewQuote(quote);
    setCustomerPreviewOpen(true);
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter(q => {
      const matchSearch =
        q.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.route.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter ? q.status === statusFilter : true;
      return matchSearch && matchStatus;
    });
  }, [quotes, searchTerm, statusFilter]);

  const columns = [
    {
      id: 'quoteId',
      label: 'Quote ID',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>
            {row.id}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Ref: {row.flightReqRef || 'N/A'}
          </Typography>
        </Box>
      )
    },
    {
      id: 'customer',
      label: 'Customer & Contact',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.customerName}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{row.customerEmail}</Typography>
          <Typography variant="caption" color="text.secondary">{row.customerPhone}</Typography>
        </Box>
      )
    },
    {
      id: 'route',
      label: 'Route & Options',
      render: (row) => (
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FlightTakeoffIcon sx={{ fontSize: 14, color: 'primary.main' }} />
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.route}</Typography>
          </Box>
          <Chip size="small" label={`${row.optionsCount || row.options?.length || 1} Flight Option(s)`} color="info" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.65rem', mt: 0.5 }} />
        </Box>
      )
    },
    {
      id: 'supplierCost',
      label: 'Supplier Cost',
      render: (row) => {
        const opt = row.options?.[0] || {};
        const cost = opt.supplierCost || (opt.baseFare + opt.taxes) || 8800;
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'monospace' }}>
              ${Number(cost).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.68rem' }}>
              Base: ${opt.baseFare || 0} | Tax: ${opt.taxes || 0}
            </Typography>
          </Box>
        );
      }
    },
    {
      id: 'markupService',
      label: 'Markup / Service Fee',
      render: (row) => {
        const opt = row.options?.[0] || {};
        return (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563EB', display: 'block' }}>
              Markup: +${opt.markupAmount || 0} ({opt.markupPct || 0}%)
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#7C3AED' }}>
              Fee: +${opt.serviceFee || 0} | Disc: -${opt.discount || 0}
            </Typography>
          </Box>
        );
      }
    },
    {
      id: 'customerPrice',
      label: 'Customer Price',
      render: (row) => {
        const opt = row.options?.[0] || {};
        const price = opt.customerPrice || row.sellingPrice || 10220;
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 900, color: 'success.main', fontFamily: 'monospace', fontSize: '0.95rem' }}>
              ${Number(price).toLocaleString()}
            </Typography>
            <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>
              Profit: +${Number(opt.profit || 1420).toLocaleString()}
            </Typography>
          </Box>
        );
      }
    },
    {
      id: 'expiry',
      label: 'Quote Expiry',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 14, color: 'warning.main' }} />
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {row.expiryDateTime?.replace('T', ' ') || row.validity || '24h'}
          </Typography>
        </Box>
      )
    },
    {
      id: 'status',
      label: 'Quote Status',
      render: (row) => {
        const cfg = STATUS_COLORS[row.status] || { bg: '#F1F5F9', color: '#475569', icon: '📝' };
        return (
          <Chip
            size="small"
            label={`${cfg.icon} ${row.status}`}
            sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 800, fontSize: '0.68rem', height: 22 }}
          />
        );
      }
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Flight Quote Engine & Sales Management"
        subtitle="End-to-end sales engine: Flight Search → Flight Options → Selected Itinerary → Markup → Service Fee → Final Price → Customer Quote Dispatch."
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="outlined"
              color="info"
              startIcon={<VisibilityIcon />}
              onClick={() => handleOpenCustomerPreview(quotes[0])}
              sx={{ fontWeight: 700 }}
            >
              👁️ Customer View
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AutoAwesomeIcon />}
              onClick={() => {
                setActiveStep(0);
                setQuoteEngineOpen(true);
              }}
              sx={{ fontWeight: 800, px: 2.5, bgcolor: '#2563EB', '&:hover': { bgcolor: '#1D4ED8' } }}
            >
              ⚡ Launch Quote Engine (Sales Flow)
            </Button>
          </Stack>
        }
      />

      {/* ─── QUOTE MODULE WORKSPACE TABS ─── */}
      <Paper elevation={0} sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', borderRadius: 2 }}>
        <Tabs
          value={quoteMainTab}
          onChange={(_, v) => setQuoteMainTab(v)}
          sx={{ px: 2 }}
        >
          <Tab icon={<ConfirmationNumberIcon />} iconPosition="start" label="1. CRM Quotes Ledger & Engine" sx={{ fontWeight: 800 }} />
          <Tab icon={<EmailIcon />} iconPosition="start" label="2. Rich-Text Proposal Email & WhatsApp Builder" sx={{ fontWeight: 800 }} />
          <Tab icon={<VisibilityIcon />} iconPosition="start" label="3. Client Public Deal Review Page" sx={{ fontWeight: 800 }} />
        </Tabs>
      </Paper>

      {/* ════════════════════════════════════════════════════════════════════
          TAB 0: CRM QUOTES LEDGER & SALES ENGINE
      ════════════════════════════════════════════════════════════════════ */}
      {quoteMainTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Summary KPI Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
            {[
              { label: 'Total Quotes', value: quotes.length, color: '#6366F1', bg: '#EEF2FF', icon: '📝' },
              { label: 'Sent to Customer', value: quotes.filter(q => q.status === 'Sent' || q.status === 'Viewed').length, color: '#F59E0B', bg: '#FFFBEB', icon: '📤' },
              { label: 'Accepted (Won)', value: quotes.filter(q => q.status === 'Accepted').length, color: '#10B981', bg: '#ECFDF5', icon: '✅' },
              { label: 'Average Margin / Quote', value: '$1,480 (16.2%)', color: '#2563EB', bg: '#EFF6FF', icon: '📈' },
            ].map((s, i) => (
              <Paper key={i} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: s.bg }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                  {s.icon} {s.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: s.color, mt: 0.5 }}>{s.value}</Typography>
              </Paper>
            ))}
          </Box>

      {/* Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search quote ID, customer, route..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          sx={{ width: { xs: '100%', md: 340 }, bgcolor: 'background.paper' }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
          }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by Status"
            onChange={e => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {QUOTE_STATUS_FLOW.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Main Quotes Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <AppTable
          columns={columns}
          data={filteredQuotes}
          onRowClick={(row) => {
            setSelectedQuote(row);
            setDrawerOpen(true);
          }}
          actions={(row) => (
            <Box sx={{ display: 'flex', gap: 0.5, whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
              <Tooltip title="View Full 19-Parameter Quote Specifications">
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => { setSelectedQuote(row); setDrawerOpen(true); }}
                  sx={{ py: 0.4, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
                >
                  View Details
                </Button>
              </Tooltip>

              <Tooltip title="Send Quote directly to Customer via Email & WhatsApp">
                <IconButton size="small" color="primary" onClick={() => handleDirectSendToCustomer(row)}>
                  <SendIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Preview Customer View">
                <IconButton size="small" color="info" onClick={() => handleOpenCustomerPreview(row)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Convert Quote to Confirmed Booking">
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  startIcon={<BookmarkAddedIcon sx={{ fontSize: 13 }} />}
                  onClick={() => handleConvertToBooking(row)}
                  sx={{ py: 0.4, px: 1, fontSize: '0.72rem', fontWeight: 700 }}
                >
                  Book Now
                </Button>
              </Tooltip>
            </Box>
          )}
        />
      </Paper>
        </Box>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB 1: RICH-TEXT EMAIL & WHATSAPP PROPOSAL BUILDER (PHASE 4)
      ════════════════════════════════════════════════════════════════════ */}
      {quoteMainTab === 1 && (
        <QuotationProposalBuilder
          clientInfo={{
            name: quotes[0]?.customerName || 'Karan Singh',
            email: quotes[0]?.customerEmail || 'karan@example.com',
            phone: quotes[0]?.customerPhone || '+1 212 555 0199'
          }}
        />
      )}

      {/* ════════════════════════════════════════════════════════════════════
          TAB 2: CLIENT PUBLIC DEAL REVIEW PAGE (PHASE 5)
      ════════════════════════════════════════════════════════════════════ */}
      {quoteMainTab === 2 && (
        <Box sx={{ mt: 1 }}>
          <FlightDealReview />
        </Box>
      )}

      {/* ─── 1. QUOTE ENGINE SALES FLOW WIZARD MODAL ─── */}
      <AppModal
        open={quoteEngineOpen}
        onClose={() => setQuoteEngineOpen(false)}
        title="⚡ Flight CRM Quote Engine — Sales Flow Wizard"
        maxWidth="lg"
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={handlePrevStep}
              disabled={activeStep === 0}
              sx={{ fontWeight: 700 }}
            >
              Back
            </Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleFinishQuoteEngine('Draft')}
                sx={{ fontWeight: 700 }}
              >
                Save as Draft
              </Button>
              {activeStep < SALES_STEPS.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextStep}
                  sx={{ fontWeight: 800, px: 3 }}
                >
                  Continue to {SALES_STEPS[activeStep + 1]?.split('. ')[1]} →
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SendIcon />}
                  onClick={() => handleFinishQuoteEngine('Sent')}
                  sx={{ fontWeight: 900, px: 3, bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
                >
                  Send Quote Directly to Customer 🚀
                </Button>
              )}
            </Box>
          </Box>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          {/* Stepper Header */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {SALES_STEPS.map((label, idx) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: { color: activeStep === idx ? '#2563EB' : 'text.disabled' }
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: activeStep === idx ? 900 : 600, color: activeStep === idx ? 'primary.main' : 'text.secondary' }}>
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Paper>

          {/* STEP 1: FLIGHT SEARCH */}
          {activeStep === 0 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon /> Step 1: Flight Search & Customer Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Customer Full Name *"
                    value={engineData.customerName}
                    onChange={e => setEngineData({ ...engineData, customerName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Customer Email *"
                    value={engineData.customerEmail}
                    onChange={e => setEngineData({ ...engineData, customerEmail: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Customer Phone (WhatsApp) *"
                    value={engineData.customerPhone}
                    onChange={e => setEngineData({ ...engineData, customerPhone: e.target.value })}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Origin (Airport Code) *"
                    value={engineData.origin}
                    onChange={e => setEngineData({ ...engineData, origin: e.target.value.toUpperCase() })}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Destination (Airport Code) *"
                    value={engineData.destination}
                    onChange={e => setEngineData({ ...engineData, destination: e.target.value.toUpperCase() })}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Departure Date *"
                    value={engineData.departDate}
                    onChange={e => setEngineData({ ...engineData, departDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Cabin Class *</InputLabel>
                    <Select
                      value={engineData.cabinClass}
                      label="Cabin Class *"
                      onChange={e => setEngineData({ ...engineData, cabinClass: e.target.value })}
                    >
                      {['Economy', 'Premium Economy', 'Business', 'First Class'].map(c => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Preferred GDS / Supplier *</InputLabel>
                    <Select
                      value={engineData.preferredSupplier}
                      label="Preferred GDS / Supplier *"
                      onChange={e => setEngineData({ ...engineData, preferredSupplier: e.target.value })}
                    >
                      {['Amadeus GDS', 'Sabre GDS', 'Travelport GDS', 'Air India Direct NDC', 'Emirates Direct NDC', 'Mystifly Aggregator'].map(s => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Passengers Count"
                    value={engineData.passengers}
                    onChange={e => setEngineData({ ...engineData, passengers: Number(e.target.value) })}
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* STEP 2: FLIGHT OPTIONS (Search Results & Supplier Specs) */}
          {activeStep === 1 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <FlightTakeoffIcon /> Step 2: Available Supplier Flight Options
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Found 3 live options via <b>{engineData.preferredSupplier}</b> for {engineData.origin} → {engineData.destination} ({engineData.departDate}). Review Base Fare, Taxes, Supplier Cost, Fare Family & Conditions.
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {engineData.searchFlightResults.map((opt, idx) => (
                  <Paper key={opt.id} elevation={0} sx={{ p: 2.5, border: '2px solid', borderColor: opt.selected ? '#2563EB' : '#E2E8F0', borderRadius: 2, bgcolor: opt.selected ? '#EFF6FF' : '#FFFFFF' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip label={`Option #${idx + 1}`} color={opt.selected ? 'primary' : 'default'} sx={{ fontWeight: 800 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>{opt.airline} ({opt.flightNumber})</Typography>
                      </Box>
                      <Button
                        size="small"
                        variant={opt.selected ? 'contained' : 'outlined'}
                        color={opt.selected ? 'primary' : 'default'}
                        onClick={() => toggleOptionSelection(opt.id)}
                        sx={{ fontWeight: 800 }}
                      >
                        {opt.selected ? '✓ Selected for Quote' : '+ Add to Quote'}
                      </Button>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={3}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Departure & Arrival:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{opt.departure} → {opt.arrival}</Typography>
                        <Typography variant="caption" color="text.secondary">{opt.duration} · {opt.stops}</Typography>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Supplier & Fare Family:</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{opt.supplier}</Typography>
                        <Chip size="small" label={opt.fareFamily} color="secondary" variant="outlined" sx={{ fontWeight: 700, fontSize: '0.65rem', mt: 0.3 }} />
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Baggage & Fare Conditions:</Typography>
                        <Typography variant="caption" sx={{ display: 'block', fontWeight: 700 }}>🧳 {opt.baggage}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.72rem' }}>📜 {opt.fareConditions}</Typography>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Supplier Cost Breakdown:</Typography>
                        <Typography variant="caption" sx={{ display: 'block' }}>Base: <b>${opt.baseFare}</b> | Tax: <b>${opt.taxes}</b></Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.5 }}>
                          Supplier Cost: ${(opt.baseFare + opt.taxes).toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Box>
            </Paper>
          )}

          {/* STEP 3: SELECTED ITINERARY */}
          {activeStep === 2 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConfirmationNumberIcon /> Step 3: Selected Itineraries ({engineData.searchFlightResults.filter(o => o.selected).length} Selected)
              </Typography>
              <Alert severity="success" sx={{ mb: 2 }}>
                You have selected {engineData.searchFlightResults.filter(o => o.selected).length} itinerary option(s) for <b>{engineData.customerName}</b>. You can customize details below.
              </Alert>

              {engineData.searchFlightResults.filter(o => o.selected).map((opt, idx) => (
                <Paper key={opt.id} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #BAE6FD', bgcolor: '#F0F9FF', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'info.main', mb: 1.5 }}>
                    Option #{idx + 1}: {opt.airline} — {opt.flightNumber} ({opt.origin} → {opt.destination})
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Airline Name *"
                        value={opt.airline}
                        onChange={e => updateFlightResultField(opt.id, 'airline', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Flight Number *"
                        value={opt.flightNumber}
                        onChange={e => updateFlightResultField(opt.id, 'flightNumber', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Fare Family *"
                        value={opt.fareFamily}
                        onChange={e => updateFlightResultField(opt.id, 'fareFamily', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Baggage Allowance *"
                        value={opt.baggage}
                        onChange={e => updateFlightResultField(opt.id, 'baggage', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Fare Conditions & Penalties *"
                        value={opt.fareConditions}
                        onChange={e => updateFlightResultField(opt.id, 'fareConditions', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Paper>
          )}

          {/* STEP 4: MARKUP CONFIGURATION */}
          {activeStep === 3 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalculateIcon /> Step 4: Configure Markup Margins ($ / %)
              </Typography>

              {engineData.searchFlightResults.filter(o => o.selected).map((opt, idx) => {
                const cost = opt.baseFare + opt.taxes;
                return (
                  <Paper key={opt.id} elevation={0} sx={{ p: 2.5, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>
                      Option #{idx + 1}: {opt.airline} ({opt.flightNumber}) — Supplier Cost: ${cost.toLocaleString()}
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label="Markup Percentage (%) *"
                          value={opt.markupPct}
                          onChange={e => updateFlightResultField(opt.id, 'markupPct', Number(e.target.value))}
                          InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label="Markup Amount ($) *"
                          value={opt.markupAmount}
                          onChange={e => updateFlightResultField(opt.id, 'markupAmount', Number(e.target.value))}
                          InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ p: 1.5, bgcolor: '#ECFDF5', borderRadius: 1.5, border: '1px solid #6EE7B7' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Cost + Markup Subtotal:</Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'success.main' }}>
                            ${(cost + Number(opt.markupAmount)).toLocaleString()}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })}
            </Paper>
          )}

          {/* STEP 5: SERVICE FEE & DISCOUNT */}
          {activeStep === 4 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalOfferIcon /> Step 5: Service Fee & Customer Discount Setup
              </Typography>

              {engineData.searchFlightResults.filter(o => o.selected).map((opt, idx) => (
                <Paper key={opt.id} elevation={0} sx={{ p: 2.5, mb: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>
                    Option #{idx + 1}: {opt.airline} ({opt.flightNumber})
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Agency Service Fee ($) *"
                        value={opt.serviceFee}
                        onChange={e => updateFlightResultField(opt.id, 'serviceFee', Number(e.target.value))}
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        helperText="Handling and ticketing fee for sales agent"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        type="number"
                        label="Customer Discount ($)"
                        value={opt.discount}
                        onChange={e => updateFlightResultField(opt.id, 'discount', Number(e.target.value))}
                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                        helperText="Special promotional or loyalty discount"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Paper>
          )}

          {/* STEP 6: FINAL PRICE CALCULATION SUMMARY */}
          {activeStep === 5 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoneyIcon /> Step 6: Transparent Final Price & Margin Engine
              </Typography>

              <Grid container spacing={2}>
                {calculatedQuoteObj.options.map((opt, idx) => (
                  <Grid item xs={12} md={6} key={idx}>
                    <Paper elevation={0} sx={{ p: 2.5, border: '2px solid #3B82F6', borderRadius: 2.5, bgcolor: '#F8FAFC' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main' }}>
                          Option #{idx + 1}: {opt.airline}
                        </Typography>
                        <Chip size="small" label={opt.supplier} color="info" sx={{ fontWeight: 800 }} />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: 13 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">1. Base Fare:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>${opt.baseFare.toLocaleString()}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">2. Airline & GDS Taxes:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>${opt.taxes.toLocaleString()}</Typography>
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#F1F5F9', p: 1, borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>Supplier Cost (1+2):</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 900 }}>${opt.supplierCost.toLocaleString()}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#2563EB' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>+ Markup Margin ({opt.markupPct}%):</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>+${opt.markupAmount.toLocaleString()}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#7C3AED' }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>+ Service Fee:</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>+${opt.serviceFee.toLocaleString()}</Typography>
                        </Box>

                        {opt.discount > 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#DC2626' }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>- Customer Discount:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>-${opt.discount.toLocaleString()}</Typography>
                          </Box>
                        )}

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#ECFDF5', p: 1.5, borderRadius: 1.5, border: '1px solid #6EE7B7' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#065F46' }}>FINAL CUSTOMER PRICE:</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 900, color: '#047857' }}>${opt.customerPrice.toLocaleString()}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Agent Net Profit:</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main' }}>
                            +${opt.profit.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {/* STEP 7: QUOTE EXPIRY & DIRECT SEND */}
          {activeStep === 6 && (
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SendIcon /> Step 7: Quote Expiry & Customer Direct Dispatch
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Quote Expiry Duration *</InputLabel>
                    <Select
                      value={engineData.expiryHours}
                      label="Quote Expiry Duration *"
                      onChange={e => setEngineData({ ...engineData, expiryHours: e.target.value })}
                    >
                      <MenuItem value="12">12 Hours Expiry</MenuItem>
                      <MenuItem value="24">24 Hours Expiry (Standard)</MenuItem>
                      <MenuItem value="48">48 Hours Expiry</MenuItem>
                      <MenuItem value="72">72 Hours Expiry</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="datetime-local"
                    label="Exact Expiry Date & Time *"
                    value={engineData.expiryDateTime}
                    onChange={e => setEngineData({ ...engineData, expiryDateTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              {/* Delivery Preview Card */}
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                  📩 Ready to Dispatch Quote to Customer:
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Recipient: <b>{engineData.customerName}</b> ({engineData.customerEmail} | {engineData.customerPhone})
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Quote Options Included: <b>{calculatedQuoteObj.options.length} Flight Option(s)</b> | Primary Price: <b>${calculatedQuoteObj.primaryCustomerPrice.toLocaleString()}</b>
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip icon={<EmailIcon />} label="Email Instant Dispatch Enabled" color="primary" size="small" />
                  <Chip icon={<WhatsAppIcon />} label="WhatsApp Interactive Card Enabled" color="success" size="small" />
                </Stack>
              </Paper>
            </Paper>
          )}
        </Box>
      </AppModal>

      {/* ─── 2. DETAILED 19-PARAMETER QUOTE VIEW MODAL ─── */}
      <AppModal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedQuote ? `Detailed Quote Specification: ${selectedQuote.id}` : ''}
        maxWidth="md"
        actions={
          selectedQuote && (
            <Box sx={{ display: 'flex', gap: 1.5, width: '100%', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SendIcon />}
                onClick={() => { handleDirectSendToCustomer(selectedQuote); setDrawerOpen(false); }}
                sx={{ fontWeight: 800 }}
              >
                Send to Customer
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<BookmarkAddedIcon />}
                onClick={() => { handleConvertToBooking(selectedQuote, 0); setDrawerOpen(false); }}
                sx={{ fontWeight: 900 }}
              >
                Convert to Booking
              </Button>
            </Box>
          )
        }
      >
        {selectedQuote && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Header info */}
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    Quote {selectedQuote.id} for <b>{selectedQuote.customerName}</b>
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Email: {selectedQuote.customerEmail} | Phone: {selectedQuote.customerPhone} | Agent: {selectedQuote.createdBy}
                  </Typography>
                </Box>
                <Chip
                  label={`${STATUS_COLORS[selectedQuote.status]?.icon || ''} ${selectedQuote.status}`}
                  sx={{ bgcolor: STATUS_COLORS[selectedQuote.status]?.bg, color: STATUS_COLORS[selectedQuote.status]?.color, fontWeight: 800 }}
                />
              </Box>
            </Paper>

            {/* Flight options list displaying all 19 parameters */}
            {selectedQuote.options?.map((opt, idx) => (
              <Paper key={idx} elevation={0} sx={{ p: 2.5, border: '2px solid', borderColor: idx === 0 ? '#3B82F6' : 'divider', borderRadius: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip size="small" label={`Option #${idx + 1}`} color={idx === 0 ? 'primary' : 'default'} sx={{ fontWeight: 800 }} />
                    <Typography variant="h6" sx={{ fontWeight: 900, fontSize: '1.05rem' }}>
                      ● Airline: {opt.airline}
                    </Typography>
                  </Box>
                  <Chip size="small" label={`● Supplier: ${opt.supplier || 'Amadeus GDS'}`} color="secondary" variant="outlined" sx={{ fontWeight: 700 }} />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5, height: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                        ✈️ FLIGHT ITINERARY SPECS
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>● <b>Flight Number:</b> {opt.flightNumber}</Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>● <b>Departure:</b> {opt.departure || opt.depDateTime}</Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>● <b>Arrival:</b> {opt.arrival || opt.arrDateTime}</Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>● <b>Duration:</b> {opt.duration || '8h 45m'}</Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>● <b>Stops:</b> {opt.stops}</Typography>
                      <Typography variant="body2">● <b>Cabin Class:</b> {opt.cabinClass}</Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5, height: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', mb: 1 }}>
                        📜 FARE FAMILY & CONDITIONS
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>● <b>Fare Family:</b> {opt.fareFamily || 'Flex Classic'}</Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>● <b>Baggage:</b> 🧳 {opt.baggage}</Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>● <b>Fare Conditions:</b> {opt.fareConditions}</Typography>
                      <Typography variant="body2" color="warning.main">
                        ● <b>Quote Expiry:</b> ⏰ {selectedQuote.expiryDateTime?.replace('T', ' ') || selectedQuote.validity}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Pricing & Markup Table */}
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1E40AF', mb: 1 }}>
                    💰 FINANCIAL & MARGIN BREAKDOWN
                  </Typography>
                  <Grid container spacing={1} sx={{ fontSize: 13 }}>
                    <Grid item xs={6} sm={3}>● <b>Base Fare:</b> ${opt.baseFare || 7200}</Grid>
                    <Grid item xs={6} sm={3}>● <b>Taxes:</b> ${opt.taxes || 1600}</Grid>
                    <Grid item xs={6} sm={3}>● <b>Supplier Cost:</b> ${opt.supplierCost || ((opt.baseFare || 7200) + (opt.taxes || 1600))}</Grid>
                    <Grid item xs={6} sm={3}>● <b>Markup:</b> +${opt.markupAmount || 1320} ({opt.markupPct || 15}%)</Grid>
                    <Grid item xs={6} sm={3}>● <b>Service Fee:</b> +${opt.serviceFee || 150}</Grid>
                    <Grid item xs={6} sm={3}>● <b>Discount:</b> -${opt.discount || 50}</Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'success.main' }}>
                        ● <b>Customer Price:</b> ${Number(opt.customerPrice || 10220).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Paper>
            ))}
          </Box>
        )}
      </AppModal>

      {/* ─── 3. CUSTOMER PORTAL QUOTE PREVIEW MODAL ─── */}
      <AppModal
        open={customerPreviewOpen}
        onClose={() => setCustomerPreviewOpen(false)}
        title="👁️ Customer Live Quote View (Client Portal Mode)"
        maxWidth="md"
      >
        {previewQuote && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              This is the interactive view sent directly to customer <b>{previewQuote.customerName}</b>.
            </Alert>

            <Paper elevation={0} sx={{ p: 3, border: '2px solid #2563EB', borderRadius: 3, bgcolor: '#FAFAFA' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  ✈️ Official Flight Quote ({previewQuote.id})
                </Typography>
                <Chip icon={<AccessTimeIcon />} label={`Expires: ${previewQuote.expiryDateTime?.replace('T', ' ') || previewQuote.validity}`} color="warning" sx={{ fontWeight: 800 }} />
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Prepared for: <b>{previewQuote.customerName}</b> | Travel Route: <b>{previewQuote.route}</b>
              </Typography>

              {previewQuote.options?.map((opt, i) => (
                <Paper key={i} elevation={0} sx={{ p: 2.5, mb: 2, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Option {i + 1}: {opt.airline} ({opt.flightNumber})</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.main' }}>${Number(opt.customerPrice || 10220).toLocaleString()}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {opt.departure} → {opt.arrival} | {opt.duration} ({opt.stops})
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: 'primary.main' }}>
                    Cabin: {opt.cabinClass} | Fare Family: {opt.fareFamily} | Baggage: 🧳 {opt.baggage}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Fare Conditions: {opt.fareConditions}
                  </Typography>

                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    sx={{ mt: 2, fontWeight: 900, py: 1 }}
                    onClick={() => {
                      setCustomerPreviewOpen(false);
                      handleConvertToBooking(previewQuote, i);
                    }}
                  >
                    Accept Quote & Proceed to Booking →
                  </Button>
                </Paper>
              ))}
            </Paper>
          </Box>
        )}
      </AppModal>
    </Box>
  );
}
