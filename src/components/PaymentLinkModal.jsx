import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import LinkIcon from '@mui/icons-material/Link';

export default function PaymentLinkModal({ open, onClose, onSubmit }) {
  const [data, setData] = useState({
    customer: 'Karan Singh',
    booking: 'BK-001',
    amount: '10350',
    currency: 'USD',
    description: 'Flight DEL → LHR for Karan Singh',
    expiry: '24h',
    sendVia: ['email', 'whatsapp'],
  });
  const [generated, setGenerated] = useState(false);
  const [mockLink] = useState('https://pay.wowmyflight.com/lnk/A3F9X2');

  const set = (key) => (e) => setData({ ...data, [key]: e.target.value });

  const toggleSendVia = (method) => {
    setData(prev => ({
      ...prev,
      sendVia: prev.sendVia.includes(method)
        ? prev.sendVia.filter(m => m !== method)
        : [...prev.sendVia, method]
    }));
  };

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleSend = () => {
    onSubmit?.(data);
    setGenerated(false);
  };

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
          <LinkIcon color="success" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Generate Payment Link</Typography>
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
          <TextField size="small" label="Customer Name" value={data.customer} onChange={set('customer')} fullWidth />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            <TextField size="small" label="Booking Reference" value={data.booking} onChange={set('booking')} fullWidth />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField size="small" label="Amount" type="number" value={data.amount} onChange={set('amount')} sx={{ flex: 1 }} />
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <InputLabel>Currency</InputLabel>
                <Select value={data.currency} label="Currency" onChange={set('currency')}>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="AED">AED</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <TextField size="small" label="Description" value={data.description} onChange={set('description')} fullWidth />
          <FormControl size="small" fullWidth>
            <InputLabel>Link Expiry</InputLabel>
            <Select value={data.expiry} label="Link Expiry" onChange={set('expiry')}>
              <MenuItem value="24h">24 Hours</MenuItem>
              <MenuItem value="48h">48 Hours</MenuItem>
              <MenuItem value="7 days">7 Days</MenuItem>
            </Select>
          </FormControl>

          {/* Send via */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.8 }}>
              SEND VIA
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { key: 'email', icon: <EmailIcon sx={{ fontSize: 16 }} />, label: 'Email' },
                { key: 'whatsapp', icon: <WhatsAppIcon sx={{ fontSize: 16 }} />, label: 'WhatsApp' },
                { key: 'sms', icon: <SmsIcon sx={{ fontSize: 16 }} />, label: 'SMS' },
              ].map(m => (
                <Chip
                  key={m.key}
                  icon={m.icon}
                  label={m.label}
                  onClick={() => toggleSendVia(m.key)}
                  color={data.sendVia.includes(m.key) ? 'primary' : 'default'}
                  variant={data.sendVia.includes(m.key) ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          {/* Generated link preview */}
          {generated && (
            <>
              <Divider />
              <Box sx={{ p: 1.5, bgcolor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'success.main', display: 'block', mb: 0.5 }}>
                  ✅ PAYMENT LINK GENERATED
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', flex: 1, wordBreak: 'break-all' }}>
                    {mockLink}
                  </Typography>
                  <IconButton size="small" onClick={() => navigator.clipboard?.writeText(mockLink)}>
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                  Expires in {data.expiry} · {data.currency} {Number(data.amount).toLocaleString()}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, gap: 1, flexWrap: 'wrap', justifyContent: { xs: 'stretch', sm: 'flex-end' }, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
        <Button onClick={onClose} variant="outlined" sx={{ flex: { xs: 1, sm: 'none' }, minHeight: 40 }}>Cancel</Button>
        {!generated ? (
          <Button variant="contained" color="success" onClick={handleGenerate} sx={{ flex: { xs: 1, sm: 'none' }, minHeight: 40 }}>
            Generate Link
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleSend} sx={{ flex: { xs: 1, sm: 'none' }, minHeight: 40 }}>
            Send via {data.sendVia.join(' + ')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
