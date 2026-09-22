import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

// Icons
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShieldIcon from '@mui/icons-material/Shield';

import { useAlert } from '../contexts/AlertContext';

export const MEAL_OPTIONS = [
  { code: 'VGML', label: 'Vegetarian Vegan Meal (VGML)' },
  { code: 'HNML', label: 'Hindu Non-Vegetarian Meal (HNML)' },
  { code: 'MOML', label: 'Muslim Halal Meal (MOML)' },
  { code: 'KSML', label: 'Kosher Meal (KSML)' },
  { code: 'DBML', label: 'Diabetic Meal (DBML)' },
  { code: 'GFML', label: 'Gluten-Free Meal (GFML)' },
  { code: 'CHML', label: 'Child Meal (CHML)' },
  { code: 'BBML', label: 'Baby / Infant Meal (BBML)' },
];

export const SPECIAL_ASSISTANCE_OPTIONS = [
  { code: 'NONE', label: 'No Special Assistance Required' },
  { code: 'WCHR', label: 'Wheelchair (WCHR) — Can climb stairs & walk to seat' },
  { code: 'WCHS', label: 'Wheelchair (WCHS) — Cannot climb stairs, can walk to seat' },
  { code: 'WCHC', label: 'Wheelchair (WCHC) — Immobile, needs cabin wheelchair' },
  { code: 'BLND', label: 'Visually Impaired Passenger (BLND)' },
  { code: 'DEAF', label: 'Hearing Impaired Passenger (DEAF)' },
  { code: 'MEDA', label: 'Medical Case / Oxygen Clearance (MEDA)' },
];

export default function AncillariesAndSSRHub({ pnr, passengers = 2, onUpdateTotal }) {
  const { showAlert } = useAlert();

  // Selected Ancillaries State
  const [extraBagsPax1, setExtraBagsPax1] = useState(0); // $150 each
  const [extraBagsPax2, setExtraBagsPax2] = useState(0);
  const [mealPax1, setMealPax1] = useState('HNML');
  const [mealPax2, setMealPax2] = useState('VGML');
  const [assistancePax1, setAssistancePax1] = useState('NONE');
  const [assistancePax2, setAssistancePax2] = useState('NONE');
  const [seatTypePax1, setSeatTypePax1] = useState('Extra Legroom (Exit Row +$85)');
  const [seatTypePax2, setSeatTypePax2] = useState('Standard Window Seat ($0)');
  const [travelInsurance, setTravelInsurance] = useState(true); // +$98
  const [loungePass, setLoungePass] = useState(true); // +$75
  const [fastTrack, setFastTrack] = useState(true); // +$40

  // Calculate Ancillary Total
  const bagCost = (extraBagsPax1 + extraBagsPax2) * 150;
  const seatCost = (seatTypePax1.includes('+$85') ? 85 : 0) + (seatTypePax2.includes('+$85') ? 85 : 0);
  const insuranceCost = travelInsurance ? 98 : 0;
  const loungeCost = loungePass ? 75 : 0;
  const fastTrackCost = fastTrack ? 40 : 0;
  const totalAncillaries = bagCost + seatCost + insuranceCost + loungeCost + fastTrackCost;

  const handleApplyGdsSsr = () => {
    showAlert(`✓ Generated GDS SSR strings for PNR #${pnr || 'QTPNR88'}: SSR CKIN, SSR VGML, SSR HNML, SSR WCHR transmitted to airline.`, 'success');
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#2563EB' }}>
            <AirlineSeatReclineExtraIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
              Airline Ancillaries & SSR (Special Service Requests) Desk
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pre-book checked baggage pieces, IATA special meals, wheelchair assistance, seat pitch upgrades, and VIP airport services.
            </Typography>
          </Box>
        </Box>
        <Chip label={`Ancillaries: +$${totalAncillaries} USD`} color="primary" sx={{ fontWeight: 900 }} />
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* PASSENGER 1 SSR */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              👤 Passenger 1 Ancillaries & SSR Preferences
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Extra Baggage */}
              <FormControl fullWidth size="small">
                <InputLabel>Extra Checked Baggage (23kg / 50lbs)</InputLabel>
                <Select value={extraBagsPax1} label="Extra Checked Baggage (23kg / 50lbs)" onChange={e => setExtraBagsPax1(Number(e.target.value))}>
                  <MenuItem value={0}>0 Extra Bags (Standard Allowance Included)</MenuItem>
                  <MenuItem value={1}>+1 Extra Bag 23kg (+$150 USD)</MenuItem>
                  <MenuItem value={2}>+2 Extra Bags 23kg (+$300 USD)</MenuItem>
                  <MenuItem value={3}>+3 Extra Heavy Bags (+$450 USD)</MenuItem>
                </Select>
              </FormControl>

              {/* Special Meal */}
              <FormControl fullWidth size="small">
                <InputLabel>Special Meal Request (SSR MEAL)</InputLabel>
                <Select value={mealPax1} label="Special Meal Request (SSR MEAL)" onChange={e => setMealPax1(e.target.value)}>
                  {MEAL_OPTIONS.map(m => (
                    <MenuItem key={m.code} value={m.code}>{m.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Special Assistance */}
              <FormControl fullWidth size="small">
                <InputLabel>Special Assistance (SSR WCHR / MEDA)</InputLabel>
                <Select value={assistancePax1} label="Special Assistance (SSR WCHR / MEDA)" onChange={e => setAssistancePax1(e.target.value)}>
                  {SPECIAL_ASSISTANCE_OPTIONS.map(a => (
                    <MenuItem key={a.code} value={a.code}>{a.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Seat Selection */}
              <FormControl fullWidth size="small">
                <InputLabel>Seat Allocation Preference</InputLabel>
                <Select value={seatTypePax1} label="Seat Allocation Preference" onChange={e => setSeatTypePax1(e.target.value)}>
                  <MenuItem value="Standard Window Seat ($0)">Standard Window Seat ($0)</MenuItem>
                  <MenuItem value="Standard Aisle Seat ($0)">Standard Aisle Seat ($0)</MenuItem>
                  <MenuItem value="Extra Legroom (Exit Row +$85)">Extra Legroom (Exit Row +$85 USD)</MenuItem>
                  <MenuItem value="Front Row Bulkhead (+$85)">Front Row Bulkhead (+$85 USD)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>

        {/* PASSENGER 2 SSR */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #E2E8F0' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#7C3AED', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              👤 Passenger 2 Ancillaries & SSR Preferences
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Extra Baggage */}
              <FormControl fullWidth size="small">
                <InputLabel>Extra Checked Baggage (23kg / 50lbs)</InputLabel>
                <Select value={extraBagsPax2} label="Extra Checked Baggage (23kg / 50lbs)" onChange={e => setExtraBagsPax2(Number(e.target.value))}>
                  <MenuItem value={0}>0 Extra Bags (Standard Allowance Included)</MenuItem>
                  <MenuItem value={1}>+1 Extra Bag 23kg (+$150 USD)</MenuItem>
                  <MenuItem value={2}>+2 Extra Bags 23kg (+$300 USD)</MenuItem>
                </Select>
              </FormControl>

              {/* Special Meal */}
              <FormControl fullWidth size="small">
                <InputLabel>Special Meal Request (SSR MEAL)</InputLabel>
                <Select value={mealPax2} label="Special Meal Request (SSR MEAL)" onChange={e => setMealPax2(e.target.value)}>
                  {MEAL_OPTIONS.map(m => (
                    <MenuItem key={m.code} value={m.code}>{m.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Special Assistance */}
              <FormControl fullWidth size="small">
                <InputLabel>Special Assistance (SSR WCHR / MEDA)</InputLabel>
                <Select value={assistancePax2} label="Special Assistance (SSR WCHR / MEDA)" onChange={e => setAssistancePax2(e.target.value)}>
                  {SPECIAL_ASSISTANCE_OPTIONS.map(a => (
                    <MenuItem key={a.code} value={a.code}>{a.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Seat Selection */}
              <FormControl fullWidth size="small">
                <InputLabel>Seat Allocation Preference</InputLabel>
                <Select value={seatTypePax2} label="Seat Allocation Preference" onChange={e => setSeatTypePax2(e.target.value)}>
                  <MenuItem value="Standard Window Seat ($0)">Standard Window Seat ($0)</MenuItem>
                  <MenuItem value="Standard Aisle Seat ($0)">Standard Aisle Seat ($0)</MenuItem>
                  <MenuItem value="Extra Legroom (Exit Row +$85)">Extra Legroom (Exit Row +$85 USD)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ─── VALUE ADDED SERVICES & VIP CONCIERGE ADDONS ─── */}
      <Box sx={{ mt: 3, p: 2.5, bgcolor: '#FFFBEB', borderRadius: 2.5, border: '1px solid #FDE68A' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#92400E', mb: 1.5 }}>
          🛡️ VIP Travel Concierge & Protection Add-ons
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Switch checked={travelInsurance} onChange={e => setTravelInsurance(e.target.checked)} color="warning" />}
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Comprehensive Travel Shield ($98)</Typography>
                  <Typography variant="caption" color="text.secondary">$100k Medical, Trip Delay & Baggage Lost</Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Switch checked={loungePass} onChange={e => setLoungePass(e.target.checked)} color="warning" />}
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>VIP Airport Lounge Pass ($75)</Typography>
                  <Typography variant="caption" color="text.secondary">Access to international transit lounges</Typography>
                </Box>
              }
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={<Switch checked={fastTrack} onChange={e => setFastTrack(e.target.checked)} color="warning" />}
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>Fast-Track Security Pass ($40)</Typography>
                  <Typography variant="caption" color="text.secondary">Priority immigration clearance lanes</Typography>
                </Box>
              }
            />
          </Grid>
        </Grid>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">Total Ancillaries & SSR Fee:</Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669' }}>
            +${totalAncillaries.toLocaleString()} USD
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={handleApplyGdsSsr}
            sx={{ fontWeight: 800, textTransform: 'none' }}
          >
            Generate GDS SSR Commands
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (onUpdateTotal) onUpdateTotal(totalAncillaries);
              showAlert(`✓ Applied $${totalAncillaries} ancillaries and SSR preferences to booking itinerary!`, 'success');
            }}
            sx={{ fontWeight: 900, px: 3, textTransform: 'none' }}
          >
            Save Ancillaries & Update Total →
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
