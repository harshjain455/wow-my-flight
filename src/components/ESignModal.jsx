import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import GavelIcon from '@mui/icons-material/Gavel';
import SendIcon from '@mui/icons-material/Send';

const AUTH_TEXT = (name, amount, booking) =>
  `I, ${name}, authorize WOW MY FLIGHT to charge the amount of USD ${amount} for ${booking}. ` +
  `I confirm that I am the authorized cardholder and agree to the terms and conditions. ` +
  `This authorization is valid for the specified transaction only.`;

export default function ESignModal({ open, onClose, onSubmit }) {
  const [data, setData] = useState({
    name: 'Karan Singh',
    amount: '10350',
    booking: 'Booking BK-001, Flight DEL → LHR',
    email: 'karan@example.com',
    method: 'DocuSign',
  });

  const set = (key) => (e) => setData({ ...data, [key]: e.target.value });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{
        sx: {
          mx: { xs: 1.5, sm: 3 },
          my: { xs: 1, sm: 2 },
          maxHeight: { xs: 'calc(100dvh - 32px)', sm: '85vh' },
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: { xs: 2, sm: 3 }, py: 2, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GavelIcon color="secondary" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>E-Sign Authorization Form</Typography>
        </Box>
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent
        className="modal-scroll"
        sx={{
          px: { xs: 2, sm: 3 },
          py: 2.5,
          maxHeight: { xs: '55vh', sm: '60vh', md: '65vh' },
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
          flexGrow: 1,
        }}
      >
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            <TextField size="small" label="Customer Name" value={data.name} onChange={set('name')} fullWidth />
            <TextField size="small" label="Amount (USD)" type="number" value={data.amount} onChange={set('amount')} fullWidth />
          </Box>
          <TextField size="small" label="For (Booking & Flight)" value={data.booking} onChange={set('booking')} fullWidth />
          <TextField size="small" label="Send To (Email)" value={data.email} onChange={set('email')} type="email" fullWidth />
          <FormControl size="small" fullWidth>
            <InputLabel>Signature Method</InputLabel>
            <Select value={data.method} label="Signature Method" onChange={set('method')}>
              <MenuItem value="DocuSign">DocuSign (recommended)</MenuItem>
              <MenuItem value="Manual Upload">Manual Upload / Scan</MenuItem>
              <MenuItem value="In-person">In-person Signature</MenuItem>
            </Select>
          </FormControl>

          {/* Authorization preview */}
          <Divider />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.8 }}>
              AUTHORIZATION TEXT (PREVIEW)
            </Typography>
            <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 2, fontSize: '0.78rem', color: '#374151', lineHeight: 1.6 }}>
              {AUTH_TEXT(data.name || '[Customer Name]', Number(data.amount).toLocaleString() || '[Amount]', data.booking || '[Booking Details]')}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'stretch', sm: 'flex-end' }, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
        <Button onClick={onClose} variant="outlined" sx={{ flex: { xs: 1, sm: 'none' }, minHeight: 40 }}>Cancel</Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SendIcon />}
          onClick={() => onSubmit?.(data)}
          sx={{ flex: { xs: 1, sm: 'none' }, minHeight: 40 }}
        >
          Send for Signature
        </Button>
      </DialogActions>
    </Dialog>
  );
}
