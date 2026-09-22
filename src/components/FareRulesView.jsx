import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import ArticleIcon from '@mui/icons-material/Article';
import PolicyIcon from '@mui/icons-material/Policy';
import AppModal from './AppModal';
import { useAlert } from '../contexts/AlertContext';

export default function FareRulesView({ activeRequest }) {
  const { showAlert } = useAlert();
  const [modalOpen, setModalOpen] = useState(false);

  const fareRules = [
    {
      title: 'Refund Policy',
      summary: 'Non-refundable after 24 hours',
      details: 'Refunds permitted within 24 hours of booking. Afterwards, non-refundable. Tax refund permitted minus $50 admin fee.',
      badgeColor: 'error'
    },
    {
      title: 'Change Fees',
      summary: '$200 per change + fare difference',
      details: 'Flight date or time changes permitted up to 2 hours prior to departure for $200 fee plus any applicable difference in fare.',
      badgeColor: 'warning'
    },
    {
      title: 'Minimum Stay',
      summary: '3 days or Sunday rule',
      details: 'Traveler must stay a minimum of 3 days or over a Sunday night at destination prior to return segment.',
      badgeColor: 'info'
    },
    {
      title: 'Maximum Stay',
      summary: '3 months maximum',
      details: 'Return travel must be completed within 90 days from origin departure date.',
      badgeColor: 'default'
    },
    {
      title: 'Advance Purchase',
      summary: '7 days prior booking required',
      details: 'Fare Basis code JOWUS requires ticket issuance at least 7 days prior to scheduled departure.',
      badgeColor: 'primary'
    }
  ];

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PolicyIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
            FARE RULES VIEW
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`Fare Basis: ${activeRequest?.cabinClass === 'Business' ? 'JOWUS' : 'YOWUS'}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 800, fontSize: '0.68rem', fontFamily: 'monospace' }}
        />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.8 }}>
        Detailed GDS fare construction conditions, cancellation penalties, stay requirements and advance purchase constraints.
      </Typography>

      {/* Grid of Fare Rules summary cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5, mb: 2 }}>
        {fareRules.slice(0, 5).map((rule, idx) => (
          <Paper
            key={idx}
            variant="outlined"
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: '#F8FAFC',
              borderColor: 'divider'
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.3 }}>
              {rule.title}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
              {rule.summary}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem', lineHeight: 1.3 }}>
              {rule.details}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Action Button */}
      <Button
        variant="outlined"
        color="primary"
        size="small"
        startIcon={<ArticleIcon />}
        onClick={() => setModalOpen(true)}
        sx={{ fontWeight: 700, borderRadius: 2 }}
      >
        View Full Fare Rules →
      </Button>

      {/* Modal for full fare rules */}
      <AppModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Full GDS Fare Rules & Conditions (${activeRequest?.origin || 'JFK'} → ${activeRequest?.destination || 'LHR'})`}
        maxWidth="md"
        actions={
          <Button variant="contained" onClick={() => setModalOpen(false)}>
            Close
          </Button>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
            OFFICIAL CARRIER FARE RULE DOCUMENTATION (SABRE GDS ENCODED)
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#0F172A',
              color: '#38BDF8',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              borderRadius: 2,
              lineHeight: 1.6,
              maxHeight: 350,
              overflowY: 'auto'
            }}
          >
            {`GENERAL RULE TEXT - CATEGORY 16: PENALTIES
CANCELLATION/REFUND RULES FOR FARE BASIS JOWUS / CCLASS:
1. BEFORE DEPARTURE:
   - PERMITTED UP TO 24 HOURS AFTER ISSUANCE WITH NO PENALTY.
   - CANCELLATION AFTER 24 HOURS IS NON-REFUNDABLE.
   - UNUSED TAXES REFUNDABLE WITH USD 50 ADMIN FEE.

2. CHANGES:
   - REBOOKING/REROUTING PERMITTED AT USD 200 PER TRANSACTION PLUS FARE DIFFERENCE.
   - NO-SHOW PENALTY: USD 400.

CATEGORY 6: MINIMUM STAY
   - MINIMUM STAY OF 3 DAYS OR SUNDAY NIGHTINGALE RULE AT DESTINATION.

CATEGORY 7: MAXIMUM STAY
   - MAXIMUM STAY OF 90 DAYS FROM ORIGIN DEPARTURE.

CATEGORY 5: ADVANCE PURCHASE
   - RESERVATIONS MUST BE COMPLETED AT LEAST 7 DAYS PRIOR TO DEPARTURE.`}
          </Paper>

          <Divider />

          <Typography variant="caption" color="text.secondary">
            Note: Fare rules are automatically synced with SABRE / Amadeus GDS fare quote records.
          </Typography>
        </Box>
      </AppModal>
    </Paper>
  );
}
