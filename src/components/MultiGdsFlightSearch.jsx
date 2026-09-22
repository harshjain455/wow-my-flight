import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PolicyIcon from '@mui/icons-material/Policy';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate } from 'react-router-dom';

// Icons
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import LuggageIcon from '@mui/icons-material/Luggage';
import WifiIcon from '@mui/icons-material/Wifi';
import PowerIcon from '@mui/icons-material/Power';
import TvIcon from '@mui/icons-material/Tv';
import Co2Icon from '@mui/icons-material/Co2';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PublicIcon from '@mui/icons-material/Public';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

import { useAlert } from '../contexts/AlertContext';

export const SAMPLE_MULTI_GDS_RESULTS = [
  {
    id: 'GDS-FL-101',
    airline: 'Etihad Airways',
    airlineCode: 'EY',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=80',
    posCountry: 'United Kingdom',
    currency: 'GBP',
    baseFare: 87.00,
    taxes: 451.60,
    supplierFee: 15.00,
    totalNetPrice: 553.60,
    usdEquivalent: 715.00,
    suggestedSellingPrice: 980.00,
    gdsSource: 'Galileo GDS',
    fareBasis: 'ELN1Q119',
    cabinClass: 'Economy Basic / DPC',
    baggage: '2PC Included (2x 23kg)',
    refundable: 'Refundable with £100 penalty',
    outbound: {
      date: 'Wed 14 Oct 2026',
      route: 'JFK → AUH → DEL',
      totalDuration: '17 hrs 35 min',
      stops: 1,
      emissions: '784 kg CO2e (-8% emissions)',
      leg1: {
        flightNo: 'EY0004',
        aircraft: 'Airbus A350-1000',
        origin: 'John F. Kennedy Intl Airport (JFK)',
        originCode: 'JFK',
        depTime: '15:45',
        dest: 'Zayed Intl Airport (AUH)',
        destCode: 'AUH',
        arrTime: '12:25 +1',
        duration: '12 hrs 40 min',
        overnight: true
      },
      layover: {
        duration: '1 hr 45 min layover',
        airport: 'Zayed International Airport (AUH)'
      },
      leg2: {
        flightNo: 'EY0212',
        aircraft: 'Boeing 787-9 Dreamliner',
        origin: 'Zayed Intl Airport (AUH)',
        originCode: 'AUH',
        depTime: '14:10 +1',
        dest: 'Indira Gandhi Intl Airport (DEL)',
        destCode: 'DEL',
        arrTime: '19:20 +1',
        duration: '3 hrs 40 min',
        overnight: false
      }
    },
    inbound: {
      date: 'Fri 13 Nov 2026',
      route: 'DEL → AUH → JFK',
      totalDuration: '21 hrs 10 min',
      stops: 1,
      emissions: '797 kg CO2e (+6% emissions)',
      leg1: {
        flightNo: 'EY0219',
        aircraft: 'Boeing 787-10 Dreamliner',
        origin: 'Indira Gandhi Intl Airport (DEL)',
        originCode: 'DEL',
        depTime: '04:25',
        dest: 'Zayed Intl Airport (AUH)',
        destCode: 'AUH',
        arrTime: '06:55',
        duration: '4 hrs 00 min',
        overnight: true
      },
      layover: {
        duration: '2 hrs 45 min layover',
        airport: 'Zayed International Airport (AUH)'
      },
      leg2: {
        flightNo: 'EY0003',
        aircraft: 'Airbus A350-1000',
        origin: 'Zayed Intl Airport (AUH)',
        originCode: 'AUH',
        depTime: '09:40',
        dest: 'John F. Kennedy Intl Airport (JFK)',
        destCode: 'JFK',
        arrTime: '15:05',
        duration: '14 hrs 25 min',
        overnight: false
      }
    },
    amenities: {
      legroom: 'Average legroom (79 cm / 31")',
      wifi: 'Wi-Fi available for a fee',
      power: 'In-seat power and USB outlets',
      entertainment: 'On-demand seatback audio & video'
    }
  },
  {
    id: 'GDS-FL-102',
    airline: 'LOT Polish Airlines',
    airlineCode: 'LO',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=80',
    posCountry: 'USA',
    currency: 'USD',
    baseFare: 5120.00,
    taxes: 1823.82,
    supplierFee: 0.00,
    totalNetPrice: 6943.82,
    usdEquivalent: 6943.82,
    suggestedSellingPrice: 8250.00,
    gdsSource: 'Amadeus GDS',
    fareBasis: 'JNCUSBIZ',
    cabinClass: 'Business Class (Lie-Flat)',
    baggage: '3PC Included (3x 32kg Business)',
    refundable: 'Fully Refundable with $0 cancellation fee',
    outbound: {
      date: 'Sat 19 Sep 2026',
      route: 'SFO → WAW → DEL',
      totalDuration: '19 hrs 05 min',
      stops: 1,
      emissions: '1,120 kg CO2e (Business Class)',
      leg1: {
        flightNo: 'LO 38',
        aircraft: 'Boeing 787-9 Dreamliner',
        origin: 'San Francisco Intl Airport (SFO)',
        originCode: 'SFO',
        depTime: '19:15',
        dest: 'Warsaw Chopin Airport (WAW)',
        destCode: 'WAW',
        arrTime: '11:25 +1',
        duration: '11 hrs 10 min',
        overnight: true
      },
      layover: {
        duration: '2 hrs 25 min layover',
        airport: 'Warsaw Chopin Airport (WAW)'
      },
      leg2: {
        flightNo: 'LO 71',
        aircraft: 'Boeing 787-8 Dreamliner',
        origin: 'Warsaw Chopin Airport (WAW)',
        originCode: 'WAW',
        depTime: '13:50 +1',
        dest: 'Indira Gandhi Intl Airport (DEL)',
        destCode: 'DEL',
        arrTime: '01:35 +2',
        duration: '7 hrs 15 min',
        overnight: true
      }
    },
    inbound: {
      date: 'Wed 21 Oct 2026',
      route: 'DEL → WAW → SFO',
      totalDuration: '20 hrs 30 min',
      stops: 1,
      emissions: '1,140 kg CO2e (Business Class)',
      leg1: {
        flightNo: 'LO 72',
        aircraft: 'Boeing 787-8 Dreamliner',
        origin: 'Indira Gandhi Intl Airport (DEL)',
        originCode: 'DEL',
        depTime: '07:15',
        dest: 'Warsaw Chopin Airport (WAW)',
        destCode: 'WAW',
        arrTime: '11:55',
        duration: '8 hrs 10 min',
        overnight: false
      },
      layover: {
        duration: '2 hrs 35 min layover',
        airport: 'Warsaw Chopin Airport (WAW)'
      },
      leg2: {
        flightNo: 'LO 35',
        aircraft: 'Boeing 787-9 Dreamliner',
        origin: 'Warsaw Chopin Airport (WAW)',
        originCode: 'WAW',
        depTime: '14:30',
        dest: 'San Francisco Intl Airport (SFO)',
        destCode: 'SFO',
        arrTime: '18:15',
        duration: '12 hrs 45 min',
        overnight: false
      }
    },
    amenities: {
      legroom: '180° Fully Lie-Flat Bed (198 cm / 78")',
      wifi: 'High-speed satellite Wi-Fi',
      power: 'Dual AC universal power & USB ports',
      entertainment: '15.4" HD Touchscreen with Bose headphones'
    }
  },
  {
    id: 'GDS-FL-103',
    airline: 'Cathay Pacific',
    airlineCode: 'CX',
    logo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=80',
    posCountry: 'Ireland (Dynamic)',
    currency: 'USD',
    baseFare: 2450.00,
    taxes: 568.49,
    supplierFee: 0.00,
    totalNetPrice: 3018.49,
    usdEquivalent: 3018.49,
    suggestedSellingPrice: 3650.00,
    gdsSource: 'Sabre GDS',
    fareBasis: 'J18OWUS',
    cabinClass: 'Business Class',
    baggage: '2PC Included (2x 32kg)',
    refundable: 'Refundable with $150 fee',
    outbound: {
      date: 'Fri 25 Sep 2026',
      route: 'BOM → HKG → SFO',
      totalDuration: '18 hrs 10 min',
      stops: 1,
      emissions: '950 kg CO2e',
      leg1: {
        flightNo: 'CX 696',
        aircraft: 'Boeing 777-300ER',
        origin: 'Chhatrapati Shivaji Intl (BOM)',
        originCode: 'BOM',
        depTime: '22:25',
        dest: 'Hong Kong Intl Airport (HKG)',
        destCode: 'HKG',
        arrTime: '06:55 +1',
        duration: '6 hrs 00 min',
        overnight: true
      },
      layover: {
        duration: '6 hrs 30 min layover',
        airport: 'Hong Kong International (HKG)'
      },
      leg2: {
        flightNo: 'CX 870',
        aircraft: 'Boeing 777-300ER',
        origin: 'Hong Kong Intl Airport (HKG)',
        originCode: 'HKG',
        depTime: '13:25 +1',
        dest: 'San Francisco Intl (SFO)',
        destCode: 'SFO',
        arrTime: '10:55 +1',
        duration: '12 hrs 30 min',
        overnight: false
      }
    },
    inbound: {
      date: 'Sat 24 Oct 2026',
      route: 'SFO → HKG → BOM',
      totalDuration: '19 hrs 45 min',
      stops: 1,
      emissions: '980 kg CO2e',
      leg1: {
        flightNo: 'CX 879',
        aircraft: 'Airbus A350-900',
        origin: 'San Francisco Intl (SFO)',
        originCode: 'SFO',
        depTime: '13:50',
        dest: 'Hong Kong Intl (HKG)',
        destCode: 'HKG',
        arrTime: '19:10 +1',
        duration: '14 hrs 20 min',
        overnight: true
      },
      layover: {
        duration: '2 hrs 10 min layover',
        airport: 'Hong Kong International (HKG)'
      },
      leg2: {
        flightNo: 'CX 663',
        aircraft: 'Boeing 777-300ER',
        origin: 'Hong Kong Intl (HKG)',
        originCode: 'HKG',
        depTime: '21:20 +1',
        dest: 'Chhatrapati Shivaji Intl (BOM)',
        destCode: 'BOM',
        arrTime: '01:35 +2',
        duration: '6 hrs 45 min',
        overnight: true
      }
    },
    amenities: {
      legroom: 'Reverse Herringbone Lie-Flat Suite',
      wifi: 'High-speed Wi-Fi',
      power: 'Universal AC & USB 3.0 power',
      entertainment: '18.5" 4K HDR in-flight entertainment'
    }
  }
];

export default function MultiGdsFlightSearch({ onSelectFlight, onGenerateQuote }) {
  const { showAlert } = useAlert();

  // Search parameters
  const [tripType, setTripType] = useState('Round Trip');
  const [origin, setOrigin] = useState('JFK');
  const [destination, setDestination] = useState('DEL');
  const [departDate, setDepartDate] = useState('2026-10-14');
  const [returnDate, setReturnDate] = useState('2026-11-13');
  const [cabinClass, setCabinClass] = useState('Business');
  const [passengers, setPassengers] = useState(2);
  const [isSearching, setIsSearching] = useState(false);

  // Point of Sale (POS) Filter Tabs (Screenshot 5)
  const [posTab, setPosTab] = useState(0); // 0 = UK, 1 = USA, 2 = Ireland Dynamic

  const navigate = useNavigate();

  // Active Modals for Buttons
  const [fareRulesFlight, setFareRulesFlight] = useState(null);
  const [quoteFlight, setQuoteFlight] = useState(null);
  const [bookFlight, setBookFlight] = useState(null);
  const [quoteMarkup, setQuoteMarkup] = useState(250);
  const [paxName, setPaxName] = useState('John Doe');

  const copyWhatsAppQuote = (flight) => {
    const text = `✈️ *FLIGHT QUOTATION - WOWMYFLIGHT*\n` +
      `Airline: ${flight.airline} (${flight.airlineCode})\n` +
      `Route: ${origin} ➔ ${destination} (${cabinClass})\n` +
      `Flight: ${flight.outbound.flightNo} (${flight.outbound.departTime} - ${flight.outbound.arriveTime})\n` +
      `Baggage: ${flight.baggage} | Refundable: ${flight.refundable}\n` +
      `Special Quote Price: $${(flight.suggestedSellingPrice || (flight.usdEquivalent + quoteMarkup)).toLocaleString()} USD\n\n` +
      `Reply YES to hold your seat or lock this price!`;
    navigator.clipboard.writeText(text);
    showAlert('✓ WhatsApp Quotation copied to clipboard!', 'success');
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      showAlert(`✓ Found 400 flight results across 23 carriers from GDS adapters for ${origin} ⇄ ${destination}`, 'success');
    }, 600);
  };

  const currentPos = posTab === 0 ? 'United Kingdom' : posTab === 1 ? 'USA' : 'Ireland (Dynamic)';

  const filteredResults = SAMPLE_MULTI_GDS_RESULTS.filter(res => {
    if (posTab === 0 && res.posCountry !== 'United Kingdom') return true; // Show all with highlighted POS
    return true;
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ─── SEARCH INPUTS BAR ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'primary.light',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['Round Trip', 'One Way', 'Multi-City'].map((t) => (
              <Button
                key={t}
                size="small"
                variant={tripType === t ? 'contained' : 'outlined'}
                onClick={() => setTripType(t)}
                sx={{
                  borderRadius: 2,
                  fontWeight: 800,
                  fontSize: '0.74rem',
                  textTransform: 'none',
                  py: 0.4,
                  px: 1.8
                }}
              >
                {t}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              GDS Gateway: <b>Amadeus + Sabre + Galileo (Active)</b>
            </Typography>
            <Chip label="Live Inventory Connected" size="small" color="success" sx={{ fontWeight: 800, height: 22, fontSize: '0.65rem' }} />
          </Box>
        </Box>

        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              size="small"
              label="Origin Airport"
              value={origin}
              onChange={(e) => setOrigin(e.target.value.toUpperCase())}
              InputProps={{ startAdornment: <FlightTakeoffIcon sx={{ color: 'primary.main', mr: 1, fontSize: 18 }} /> }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              size="small"
              label="Destination Airport"
              value={destination}
              onChange={(e) => setDestination(e.target.value.toUpperCase())}
              InputProps={{ startAdornment: <FlightLandIcon sx={{ color: 'secondary.main', mr: 1, fontSize: 18 }} /> }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              label="Depart Date"
              type="date"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {tripType === 'Round Trip' && (
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Return Date"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}

          <Grid item xs={6} md={tripType === 'Round Trip' ? 1.5 : 2.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Cabin</InputLabel>
              <Select value={cabinClass} label="Cabin" onChange={(e) => setCabinClass(e.target.value)}>
                <MenuItem value="Economy">Economy</MenuItem>
                <MenuItem value="Premium Economy">Premium Economy</MenuItem>
                <MenuItem value="Business">Business</MenuItem>
                <MenuItem value="First Class">First Class</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={tripType === 'Round Trip' ? 1.5 : 2.5}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={isSearching}
              startIcon={isSearching ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              sx={{ fontWeight: 800, py: 1, borderRadius: 2 }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ─── POINT OF SALE (POS) COUNTRY TABS (Exact to Screenshot 5) ─── */}
      <Paper elevation={0} sx={{ p: 1.5, px: 2, borderRadius: 2.5, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <Tabs
            value={posTab}
            onChange={(_, val) => setPosTab(val)}
            sx={{
              minHeight: 38,
              '& .MuiTab-root': {
                minHeight: 38,
                py: 0.5,
                px: 2,
                fontWeight: 800,
                fontSize: '0.78rem',
                borderRadius: 2,
                textTransform: 'none',
                '&.Mui-selected': {
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8'
                }
              }
            }}
          >
            <Tab label="🇬🇧 United Kingdom (359)" />
            <Tab label="🇺🇸 USA (1,291)" />
            <Tab label="🇮🇪 Ireland (Dynamic) (100)" />
          </Tabs>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              Supplier Fees: <b>EXCH $11 · VOID $11 · RFND $11</b>
            </Typography>
            <Chip label="SORT: Lowest Net Price" size="small" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.7rem' }} />
          </Box>
        </Box>
      </Paper>

      {/* ─── FLIGHT RESULT CARDS LIST (Etihad & LOT Polish Style) ─── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {filteredResults.map((res) => (
          <Paper
            key={res.id}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)'
              }
            }}
          >
            {/* Card Header */}
            <Box
              sx={{
                p: 2,
                px: 3,
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.6,
                    borderRadius: 1.5,
                    backgroundColor: '#1E293B',
                    color: '#F8FAFC',
                    fontWeight: 900,
                    fontSize: '0.82rem',
                    letterSpacing: 0.5
                  }}
                >
                  {res.airlineCode}
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                    {res.airline}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {res.gdsSource} · Fare Basis: <span style={{ fontFamily: 'monospace', color: '#2563EB' }}>{res.fareBasis}</span> · {res.cabinClass}
                  </Typography>
                </Box>
              </Box>

              {/* Pricing Breakup (Screenshot 5) */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, textAlign: 'right' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', fontWeight: 700 }}>
                    Net Fare ({res.currency})
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', lineHeight: 1 }}>
                    {res.currency} {res.totalNetPrice.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800 }}>
                    ({res.baseFare} Base + {res.taxes} Tax)
                  </Typography>
                </Box>

                <Box sx={{ pl: 2, borderLeft: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="caption" sx={{ color: 'secondary.main', display: 'block', fontWeight: 800 }}>
                    Suggested Selling Price
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#D97706', lineHeight: 1 }}>
                    ${res.suggestedSellingPrice.toLocaleString()} USD
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    +${(res.suggestedSellingPrice - res.usdEquivalent).toFixed(0)} Agency Margin
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Itinerary Timeline Body (Screenshot 6 & 7) */}
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* OUTBOUND FLIGHT */}
              <Box sx={{ backgroundColor: '#F8FAFC', p: 2, borderRadius: 2, border: '1px solid #E2E8F0' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlightTakeoffIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                      Departing Flight · {res.outbound.date} ({res.outbound.route})
                    </Typography>
                  </Box>
                  <Chip size="small" icon={<Co2Icon />} label={res.outbound.emissions} color="success" sx={{ fontWeight: 800, height: 22, fontSize: '0.68rem' }} />
                </Box>

                {/* Leg 1 */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pl: 1, mb: 1.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2563EB', mt: 0.6, flexShrink: 0 }} />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>
                        {res.outbound.leg1.depTime} · {res.outbound.leg1.origin}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        Travel time: {res.outbound.leg1.duration} {res.outbound.leg1.overnight && '· Overnight 🌙'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {res.airline} · {res.outbound.leg1.flightNo} · {res.outbound.leg1.aircraft}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {res.outbound.leg1.arrTime} · {res.outbound.leg1.dest}
                    </Typography>
                  </Box>
                </Box>

                {/* Layover Banner */}
                {res.outbound.layover && (
                  <Box
                    sx={{
                      my: 1.5,
                      mx: 2,
                      py: 0.8,
                      px: 2,
                      borderRadius: 1.5,
                      backgroundColor: '#FFFBEB',
                      border: '1px dashed #F59E0B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5
                    }}
                  >
                    <ConnectingAirportsIcon sx={{ color: '#D97706', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 800 }}>
                      {res.outbound.layover.duration} · {res.outbound.layover.airport}
                    </Typography>
                  </Box>
                )}

                {/* Leg 2 */}
                {res.outbound.leg2 && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pl: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', mt: 0.6, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {res.outbound.leg2.depTime} · {res.outbound.leg2.origin}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                          Travel time: {res.outbound.leg2.duration}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {res.airline} · {res.outbound.leg2.flightNo} · {res.outbound.leg2.aircraft}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
                        {res.outbound.leg2.arrTime} · {res.outbound.leg2.dest}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* INBOUND / RETURNING FLIGHT */}
              {res.inbound && (
                <Box sx={{ backgroundColor: '#F8FAFC', p: 2, borderRadius: 2, border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlightLandIcon color="secondary" fontSize="small" />
                      <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                        Returning Flight · {res.inbound.date} ({res.inbound.route})
                      </Typography>
                    </Box>
                    <Chip size="small" icon={<Co2Icon />} label={res.inbound.emissions} color="success" sx={{ fontWeight: 800, height: 22, fontSize: '0.68rem' }} />
                  </Box>

                  {/* Return Leg 1 */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pl: 1, mb: 1.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#8B5CF6', mt: 0.6, flexShrink: 0 }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {res.inbound.leg1.depTime} · {res.inbound.leg1.origin}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                          Travel time: {res.inbound.leg1.duration} {res.inbound.leg1.overnight && '· Overnight 🌙'}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {res.airline} · {res.inbound.leg1.flightNo} · {res.inbound.leg1.aircraft}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
                        {res.inbound.leg1.arrTime} · {res.inbound.leg1.dest}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Return Layover */}
                  {res.inbound.layover && (
                    <Box
                      sx={{
                        my: 1.5,
                        mx: 2,
                        py: 0.8,
                        px: 2,
                        borderRadius: 1.5,
                        backgroundColor: '#FFFBEB',
                        border: '1px dashed #F59E0B',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5
                      }}
                    >
                      <ConnectingAirportsIcon sx={{ color: '#D97706', fontSize: 18 }} />
                      <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 800 }}>
                        {res.inbound.layover.duration} · {res.inbound.layover.airport}
                      </Typography>
                    </Box>
                  )}

                  {/* Return Leg 2 */}
                  {res.inbound.leg2 && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pl: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#10B981', mt: 0.6, flexShrink: 0 }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>
                            {res.inbound.leg2.depTime} · {res.inbound.leg2.origin}
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            Travel time: {res.inbound.leg2.duration}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {res.airline} · {res.inbound.leg2.flightNo} · {res.inbound.leg2.aircraft}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
                          {res.inbound.leg2.arrTime} · {res.inbound.leg2.dest}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}

              {/* Amenities Bar (Screenshot 6 & 7) */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#F1F5F9',
                  fontSize: '0.74rem'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AirlineSeatReclineExtraIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <span>{res.amenities.legroom}</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WifiIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <span>{res.amenities.wifi}</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PowerIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <span>{res.amenities.power}</span>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LuggageIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <span><b>{res.baggage}</b></span>
                </Box>
              </Box>

              {/* Card Action Buttons (Screenshot 2 & 5) */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  pt: 1,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label={`🧳 ${res.baggage}`} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                  <Chip label={`🛡️ ${res.refundable}`} size="small" variant="outlined" sx={{ fontWeight: 800 }} />
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    onClick={() => setFareRulesFlight(res)}
                    sx={{ fontWeight: 700, fontSize: '0.74rem', textTransform: 'none' }}
                  >
                    Fare Rules
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<RequestQuoteIcon />}
                    onClick={() => {
                      setQuoteFlight(res);
                      if (onGenerateQuote) onGenerateQuote(res);
                    }}
                    sx={{ fontWeight: 800, fontSize: '0.74rem', textTransform: 'none' }}
                  >
                    Generate Quote
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setBookFlight(res);
                      if (onSelectFlight) onSelectFlight(res);
                    }}
                    sx={{ fontWeight: 900, px: 2.5, fontSize: '0.74rem', textTransform: 'none' }}
                  >
                    Book Now →
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL 1: FARE RULES MODAL
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(fareRulesFlight)}
        onClose={() => setFareRulesFlight(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PolicyIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                GDS Fare Rules & Penalties
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {fareRulesFlight?.airline} • Fare Basis: <b style={{ color: '#2563EB' }}>{fareRulesFlight?.fareBasis}</b>
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setFareRulesFlight(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.5 }}>
              FLIGHT ROUTE & CABIN
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {origin} ➔ {destination} • {fareRulesFlight?.cabinClass} ({fareRulesFlight?.gdsSource})
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'error.main' }}>
                  🚫 Cancellation / Refund Policy
                </Typography>
                <Chip label={fareRulesFlight?.refundable || 'Refundable with fee'} size="small" color={fareRulesFlight?.refundable === 'Refundable' ? 'success' : 'warning'} sx={{ fontWeight: 800, height: 22 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                • Cancellation before departure: $150 penalty fee per passenger.<br />
                • Cancellation after departure (No-show): Non-refundable, taxes only.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'warning.main' }}>
                🔄 Date Change & Reissue Fee
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                • Change fee: $100 per passenger + any applicable difference in fare.<br />
                • Changes permitted up to 4 hours prior to departure time.
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'info.main' }}>
                🧳 Baggage Allowance & Restrictions
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                • Checked Baggage: {fareRulesFlight?.baggage || '2 x 23kg per passenger'}<br />
                • Cabin Baggage: 1 x 7kg trolley + 1 personal laptop bag.
              </Typography>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setFareRulesFlight(null)} variant="outlined">
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              showAlert(`✓ Fare rules verified for ${fareRulesFlight?.fareBasis}`, 'success');
              setFareRulesFlight(null);
            }}
          >
            Acknowledge & Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL 2: GENERATE QUOTE MODAL
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(quoteFlight)}
        onClose={() => setQuoteFlight(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RequestQuoteIcon color="primary" />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                Instant Client Quotation Builder
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {quoteFlight?.airline} ({quoteFlight?.airlineCode}) • {origin} ➔ {destination}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setQuoteFlight(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block' }}>
              FLIGHT QUOTE SUMMARY
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 900, mt: 0.5 }}>
              {quoteFlight?.airline} • {quoteFlight?.outbound?.flightNo} ({quoteFlight?.cabinClass})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Net Fare: ${quoteFlight?.usdEquivalent || quoteFlight?.totalNetPrice} USD | Suggested Sell: ${quoteFlight?.suggestedSellingPrice} USD
            </Typography>
          </Paper>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <TextField
              label="Agency Markup ($)"
              type="number"
              size="small"
              value={quoteMarkup}
              onChange={(e) => setQuoteMarkup(Number(e.target.value) || 0)}
            />
            <TextField
              label="Final Client Price ($)"
              size="small"
              value={`$${((quoteFlight?.usdEquivalent || 715) + quoteMarkup).toLocaleString()} USD`}
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              color="success"
              fullWidth
              startIcon={<WhatsAppIcon />}
              onClick={() => {
                if (quoteFlight) copyWhatsAppQuote(quoteFlight);
              }}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              Copy WhatsApp Ready Pitch
            </Button>
            <Button
              variant="contained"
              fullWidth
              startIcon={<ReceiptLongIcon />}
              onClick={() => {
                setQuoteFlight(null);
                navigate('/quotes');
                showAlert('✓ Forwarded flight details to Quotes Desk!', 'success');
              }}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              Open Full Quotation Proposal Editor →
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          MODAL 3: BOOK NOW / INSTANT PNR ISSUANCE MODAL
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog
        open={Boolean(bookFlight)}
        onClose={() => setBookFlight(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ConfirmationNumberIcon color="secondary" />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.2 }}>
                Instant Booking & PNR Creation Desk
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Live GDS Hold on {bookFlight?.gdsSource}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setBookFlight(null)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'secondary.50', border: '1px solid', borderColor: 'secondary.200', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'secondary.main', display: 'block' }}>
              CONFIRMING GDS SEAT HOLD
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              {bookFlight?.airline} ({bookFlight?.outbound?.flightNo})
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Route: {origin} ➔ {destination} | Class: {bookFlight?.cabinClass} | Price: ${bookFlight?.suggestedSellingPrice} USD
            </Typography>
          </Paper>

          <TextField
            label="Lead Passenger Name"
            size="small"
            fullWidth
            value={paxName}
            onChange={(e) => setPaxName(e.target.value)}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setBookFlight(null);
                navigate('/payment-links');
                showAlert('✓ Flight mapped to Payment Link Generator!', 'success');
              }}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              Generate Payment Link
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => {
                setBookFlight(null);
                navigate('/issuance-queue');
                showAlert(`✓ Created PNR #7KL98P for ${paxName}. Moved to Ticketing Queue!`, 'success');
              }}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              Hold PNR & Go to Queue →
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
