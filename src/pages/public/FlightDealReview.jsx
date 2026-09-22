import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

// Icons
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import LuggageIcon from '@mui/icons-material/Luggage';
import WifiIcon from '@mui/icons-material/Wifi';
import PowerIcon from '@mui/icons-material/Power';
import Co2Icon from '@mui/icons-material/Co2';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import LockClockIcon from '@mui/icons-material/LockClock';
import ShieldIcon from '@mui/icons-material/Shield';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import AncillariesAndSSRHub from '../../components/AncillariesAndSSRHub';
import { useAlert } from '../../contexts/AlertContext';

export default function FlightDealReview() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // 24 Hour Countdown Timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 21,
    minutes: 46,
    seconds: 16
  });

  const [ancillaryAddonCost, setAncillaryAddonCost] = useState(298); // insurance + lounge + fastTrack + exit row by default

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Passenger state
  const [passengers, setPassengers] = useState([
    {
      title: 'Mr',
      firstName: 'Robert',
      lastName: 'Vance',
      dob: '1978-06-15',
      passportNo: 'USA94820193',
      nationality: 'United States',
      meal: 'Standard Non-Veg'
    },
    {
      title: 'Mrs',
      firstName: 'Phyllis',
      lastName: 'Vance',
      dob: '1981-11-20',
      passportNo: 'USA94820194',
      nationality: 'United States',
      meal: 'Vegetarian Hindu'
    }
  ]);

  const [contactEmail, setContactEmail] = useState('robert.vance@vancerefrigeration.com');
  const [contactPhone, setContactPhone] = useState('+1 (555) 234-8901');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [assignedPnr, setAssignedPnr] = useState('');

  const formatTimer = () => {
    const h = String(timeLeft.hours).padStart(2, '0');
    const m = String(timeLeft.minutes).padStart(2, '0');
    const s = String(timeLeft.seconds).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleBookNow = () => {
    const newPnr = 'PNR' + Math.floor(100000 + Math.random() * 900000);
    setAssignedPnr(newPnr);
    setBookingConfirmed(true);
    showAlert(`🎉 Booking successfully held under PNR #${newPnr}! E-ticket will be issued within 15 minutes.`, 'success');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 8 }}>
      {/* ─── TOP BRAND & EMERGENCY CALL HEADER ─── */}
      <Box
        sx={{
          bgcolor: '#0F172A',
          color: '#FFFFFF',
          py: 1.5,
          px: 3,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 1, color: '#38BDF8' }}>
                CEOFLIGHTS
              </Typography>
              <Chip label="PREMIER PRIVATE CONCIERGE" size="small" sx={{ bgcolor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', fontWeight: 800, fontSize: '0.65rem' }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#1E293B', px: 2, py: 0.5, borderRadius: 2, border: '1px solid #334155' }}>
                <LockClockIcon sx={{ color: '#F59E0B', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 900, color: '#F8FAFC' }}>
                  Price Locked: <span style={{ color: '#F59E0B' }}>{formatTimer()}</span>
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="small"
                startIcon={<PhoneInTalkIcon />}
                href="tel:+18005550199"
                sx={{
                  bgcolor: '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#059669' }
                }}
              >
                Call Concierge: +1 (800) 555-0199
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── MAIN CONTAINER ─── */}
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {/* SUCCESS STATE */}
        {bookingConfirmed ? (
          <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid #86EFAC', bgcolor: '#F0FDF4' }}>
            <CheckCircleIcon sx={{ fontSize: 64, color: '#16A34A', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#14532D', mb: 1 }}>
              Booking Confirmed & PNR Generated!
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#15803D', mb: 3 }}>
              GDS Record Locator: <span style={{ fontFamily: 'monospace', textDecoration: 'underline' }}>{assignedPnr}</span>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
              Your British Airways Business Class itinerary has been locked. Confirmation and official 13-digit E-Tickets are being issued by our ticketing desk and will be sent to <b>{contactEmail}</b>.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ fontWeight: 800, px: 4, py: 1.2 }}
            >
              Return to Flight Desk
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* LEFT COLUMN: ITINERARY & PASSENGERS */}
            <Grid item xs={12} lg={8}>
              {/* Phone-Only Banner */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.2, bgcolor: '#2563EB', color: '#FFFFFF', borderRadius: 2 }}>
                    <PhoneInTalkIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1E40AF' }}>
                      Secret Phone-Only Unpublished Tariff!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Call your assigned agent <b>Xavier Noah</b> to unlock an extra <b>$150 Instant Rebate</b>.
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  href="tel:+18005550199"
                  sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                  Call +1 (800) 555-0199
                </Button>
              </Paper>

              {/* FLIGHT ITINERARY CARD */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3, bgcolor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ px: 2, py: 1, bgcolor: '#0F172A', color: '#FFFFFF', fontWeight: 900, borderRadius: 2 }}>
                      BA
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>
                        British Airways · Club World (Business)
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        New York (JFK) ⇄ New Delhi (DEL) · 14 Oct 2026 – 13 Nov 2026
                      </Typography>
                    </Box>
                  </Box>
                  <Chip label="180° Fully Lie-Flat Bed" color="primary" sx={{ fontWeight: 800 }} />
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* OUTBOUND FLIGHT */}
                <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlightTakeoffIcon fontSize="small" /> Outbound Flight · Wed 14 Oct 2026
                  </Typography>

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>15:45 · John F. Kennedy Intl (JFK)</Typography>
                      <Typography variant="caption" color="text.secondary">BA 178 · Boeing 777-300ER</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>16h 00m</Typography>
                      <Chip label="1 Stop (LHR)" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                    </Grid>
                    <Grid item xs={12} sm={5} sx={{ textAlign: { sm: 'right' } }}>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>19:20 +1 · Indira Gandhi Intl (DEL)</Typography>
                      <Typography variant="caption" color="text.secondary">Arrival next day</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 1.5, p: 1, bgcolor: '#FFFBEB', borderRadius: 1.5, border: '1px dashed #F59E0B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ConnectingAirportsIcon sx={{ color: '#D97706', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 800 }}>
                      2h 15m Layover at London Heathrow Airport (LHR) · Terminal 5 Galleries Lounge Access Included
                    </Typography>
                  </Box>
                </Box>

                {/* INBOUND FLIGHT */}
                <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'secondary.main', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FlightLandIcon fontSize="small" /> Inbound Flight · Fri 13 Nov 2026
                  </Typography>

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>10:45 · Indira Gandhi Intl (DEL)</Typography>
                      <Typography variant="caption" color="text.secondary">BA 142 · Boeing 787-9 Dreamliner</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2} sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block' }}>17h 15m</Typography>
                      <Chip label="1 Stop (LHR)" size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                    </Grid>
                    <Grid item xs={12} sm={5} sx={{ textAlign: { sm: 'right' } }}>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>19:30 · John F. Kennedy Intl (JFK)</Typography>
                      <Typography variant="caption" color="text.secondary">Same day arrival</Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 1.5, p: 1, bgcolor: '#FFFBEB', borderRadius: 1.5, border: '1px dashed #F59E0B', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ConnectingAirportsIcon sx={{ color: '#D97706', fontSize: 18 }} />
                    <Typography variant="caption" sx={{ color: '#B45309', fontWeight: 800 }}>
                      1h 55m Layover at London Heathrow Airport (LHR) · Fast-Track International Transfer
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* PASSENGER DETAILS FORM */}
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: '#FFFFFF' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                  Passenger & Passport Information (2 Adult Travelers)
                </Typography>

                {passengers.map((pax, idx) => (
                  <Box key={idx} sx={{ p: 2, mb: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
                      Adult Passenger #{idx + 1}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={2}>
                        <TextField fullWidth size="small" label="Title" value={pax.title} onChange={e => {
                          const updated = [...passengers];
                          updated[idx].title = e.target.value;
                          setPassengers(updated);
                        }} />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField fullWidth size="small" label="First & Middle Name *" value={pax.firstName} onChange={e => {
                          const updated = [...passengers];
                          updated[idx].firstName = e.target.value;
                          setPassengers(updated);
                        }} />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <TextField fullWidth size="small" label="Last Name / Surname *" value={pax.lastName} onChange={e => {
                          const updated = [...passengers];
                          updated[idx].lastName = e.target.value;
                          setPassengers(updated);
                        }} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" type="date" label="Date of Birth" value={pax.dob} InputLabelProps={{ shrink: true }} onChange={e => {
                          const updated = [...passengers];
                          updated[idx].dob = e.target.value;
                          setPassengers(updated);
                        }} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" label="Passport Number *" value={pax.passportNo} onChange={e => {
                          const updated = [...passengers];
                          updated[idx].passportNo = e.target.value;
                          setPassengers(updated);
                        }} />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField fullWidth size="small" label="Nationality" value={pax.nationality} onChange={e => {
                          const updated = [...passengers];
                          updated[idx].nationality = e.target.value;
                          setPassengers(updated);
                        }} />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Paper>

              {/* AIRLINE ANCILLARIES & SSR HUB */}
              <AncillariesAndSSRHub
                pnr="WFL9482"
                passengers={passengers.length}
                onUpdateTotal={(total) => setAncillaryAddonCost(total)}
              />
            </Grid>

            {/* RIGHT COLUMN: PRICE BREAKDOWN & BOOK BUTTON */}
            <Grid item xs={12} lg={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '2px solid #3B82F6', bgcolor: '#FFFFFF', position: 'sticky', top: 90 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
                  Fare & Price Protection
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Adult Fare (x2 Pax):</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>$6,400.00</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Airport Taxes & Carrier Fees:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>$1,300.00</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">2x 32kg Checked Bags:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>FREE (Included)</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Lounge & Fast-Track Access:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>FREE (Included)</Typography>
                  </Box>

                  {ancillaryAddonCost > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#ECFDF5', p: 1, borderRadius: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#047857' }}>Selected Ancillaries & SSR:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#047857' }}>+${ancillaryAddonCost.toLocaleString()}.00</Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Total Selling Price:</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 900, color: '#2563EB' }}>
                      ${(7700 + ancillaryAddonCost).toLocaleString()}.00
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800, textAlign: 'right' }}>
                    ✓ Guaranteed No Hidden Fees · Instant E-Ticket Delivery
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleBookNow}
                  sx={{
                    fontWeight: 900,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.35)'
                  }}
                >
                  Confirm Booking & Issue Tickets →
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2, color: 'text.secondary' }}>
                  <VerifiedUserIcon sx={{ fontSize: 18, color: '#10B981' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    256-Bit SSL Encrypted & ARC/IATA Certified
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
