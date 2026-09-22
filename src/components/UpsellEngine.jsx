import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { useAlert } from '../contexts/AlertContext';

export const UPSELL_ITEMS = [
  {
    id: 'seat_upgrade',
    icon: '💺',
    title: 'Seat Selection Upgrade',
    desc: 'Recommend extra legroom, exit row, or lie-flat seat selection.',
    revenue: '+$120',
    category: 'Flight Experience'
  },
  {
    id: 'extra_baggage',
    icon: '🧳',
    title: 'Extra Baggage',
    desc: 'Add 23kg or 32kg checked luggage allowance for high-volume travelers.',
    revenue: '+$80',
    category: 'Baggage'
  },
  {
    id: 'travel_insurance',
    icon: '🛡️',
    title: 'Travel Insurance',
    desc: 'Comprehensive medical & trip cancellation protection based on booking value.',
    revenue: '+$45',
    category: 'Protection'
  },
  {
    id: 'hotel_package',
    icon: '🏨',
    title: 'Hotel Package',
    desc: 'Partner 4-star / 5-star hotel recommendations at destination.',
    revenue: '+$250/night',
    category: 'Accommodation'
  },
  {
    id: 'airport_transfer',
    icon: '🚌',
    title: 'Airport Transfer',
    desc: 'Private luxury transfer from origin residence and destination airport.',
    revenue: '+$60',
    category: 'Ground Transit'
  },
  {
    id: 'priority_checkin',
    icon: '⚡',
    title: 'Priority Check-in',
    desc: 'Fast-track security line pass and priority boarding pass access.',
    revenue: '+$35',
    category: 'Airport VIP'
  }
];

export default function UpsellEngine({ onAddUpsell }) {
  const { showAlert } = useAlert();
  const [selectedUpsells, setSelectedUpsells] = useState([]);

  const toggleUpsell = (item) => {
    const isSelected = selectedUpsells.includes(item.id);
    let updated;
    if (isSelected) {
      updated = selectedUpsells.filter(id => id !== item.id);
      showAlert(`Removed ${item.title} from quote`, 'info');
    } else {
      updated = [...selectedUpsells, item.id];
      showAlert(`✨ Added ${item.title} (${item.revenue}) to client quote proposal!`, 'success');
    }
    setSelectedUpsells(updated);
    if (onAddUpsell) {
      onAddUpsell(item, !isSelected);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TipsAndUpdatesIcon color="warning" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
            UPSELL SUGGESTIONS ENGINE
          </Typography>
        </Box>
        <Chip
          size="small"
          label={`${selectedUpsells.length} Selected`}
          color={selectedUpsells.length > 0 ? 'warning' : 'default'}
          sx={{ fontWeight: 800, fontSize: '0.7rem' }}
        />
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        AI-recommended ancillary add-ons to boost profit margin per booking. Click any card to attach to quote.
      </Typography>

      {/* Grid of Suggestion Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 1.5
        }}
      >
        {UPSELL_ITEMS.map((item) => {
          const isSelected = selectedUpsells.includes(item.id);
          return (
            <Paper
              key={item.id}
              variant="outlined"
              onClick={() => toggleUpsell(item)}
              sx={{
                p: 1.8,
                borderRadius: 2,
                cursor: 'pointer',
                borderColor: isSelected ? 'warning.main' : 'divider',
                bgcolor: isSelected ? '#FFFBEB' : 'background.paper',
                boxShadow: isSelected ? '0 0 0 2px rgba(245,158,11,0.2)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                '&:hover': {
                  borderColor: 'warning.main',
                  bgcolor: '#FFFBEB',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography sx={{ fontSize: '1.4rem', lineHeight: 1 }}>{item.icon}</Typography>
                  <Chip
                    size="small"
                    label={item.revenue}
                    color="warning"
                    variant={isSelected ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 900, fontSize: '0.65rem', height: 20 }}
                  />
                </Box>

                <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '0.85rem', mb: 0.5 }}>
                  {item.title}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.72rem', lineHeight: 1.3, mb: 1.5 }}>
                  {item.desc}
                </Typography>
              </Box>

              <Button
                size="small"
                variant={isSelected ? 'contained' : 'outlined'}
                color="warning"
                startIcon={isSelected ? <CheckIcon fontSize="small" /> : <AddIcon fontSize="small" />}
                sx={{ py: 0.3, fontSize: '0.7rem', fontWeight: 700, mt: 'auto', borderRadius: 1.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleUpsell(item);
                }}
              >
                {isSelected ? 'Attached to Quote' : 'Add to Proposal'}
              </Button>
            </Paper>
          );
        })}
      </Box>
    </Paper>
  );
}
