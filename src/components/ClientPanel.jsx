import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export default function ClientPanel({ lead, onComment, onAction }) {
  const [comment, setComment] = useState('');
  const add = () => { if (comment.trim()) { onComment(comment); setComment(''); } };
  
  const section = (name, children) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '.06em', display: 'block', mb: 0.5 }}>
        {name}
      </Typography>
      {children}
    </Box>
  );

  return (
    <Paper elevation={0} sx={{ 
      p: 2.5, 
      border: '1px solid', 
      borderColor: 'divider', 
      borderRadius: 4, 
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      bgcolor: 'background.paper',
      boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
    }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main', fontSize: '1.1rem' }}>
          {lead.firstName} {lead.lastName}
        </Typography>
        <Typography component="div" variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          CLIENT ID: <span style={{ color: '#000' }}>{lead.clientId}</span>
        </Typography>
      </Box>
      <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 1 }}>
        {section('PERSONAL DATA', 
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '0.8rem', color: 'text.secondary' }}>
            <span>Country: <b style={{ color: '#000' }}>{lead.country}</b></span>
            <span>Time Zone: <b style={{ color: '#000' }}>{lead.timeZone.split(' ')[0]}</b></span>
            <span>City: <b style={{ color: '#000' }}>{lead.city}</b></span>
          </Box>
        )}
        {section('CONTACT', 
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, fontSize: '0.8rem', color: 'text.secondary' }}>
            <span>Email: <b style={{ color: '#000' }}>{lead.email}</b></span>
            <span>Phone: <b style={{ color: '#000' }}>{lead.fullPhone}</b></span>
            <span>Source: <b style={{ color: '#000' }}>{lead.source}</b></span>
          </Box>
        )}
      </Box>

      {section('FLIGHT REQUEST', 
        <Box sx={{ 
          bgcolor: 'primary.50', 
          p: 1.5, 
          borderRadius: 3, 
          fontSize: '0.85rem', 
          border: '1px solid',
          borderColor: 'primary.100',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5
        }}>
          <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FlightTakeoffIcon fontSize="small" />
            {lead.origin} → {lead.destination}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', fontWeight: 600, mt: 0.5, fontSize: '0.75rem' }}>
            <span>Depart: {lead.travelDate}</span>
            {lead.returnDate && <span>Return: {lead.returnDate}</span>}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>
            <span>{lead.cabinClass}</span>
            <span>{lead.passengers} Adults</span>
          </Box>
        </Box>
      )}

      {section('ACTIVITY HISTORY', 
        <Paper variant="outlined" sx={{ flexGrow: 1, overflow: 'auto', borderRadius: 2.5, minHeight: 130, p: 1.5, bgcolor: '#F8FAFC' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {lead.activities.map((a, i) => (
              <Box key={`${a.time}-${i}`} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 800, minWidth: 55, fontSize: '0.7rem' }}>
                  {a.time}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{a.agent}</Typography>
                    <Chip 
                      label={a.status} 
                      size="small" 
                      sx={{ 
                        height: 18, 
                        fontSize: '0.62rem', 
                        fontWeight: 800, 
                        bgcolor: a.status === 'Quote Sent' ? '#DCFCE7' : '#EFF6FF', 
                        color: a.status === 'Quote Sent' ? '#15803D' : '#1D4ED8',
                        border: 'none'
                      }} 
                    />
                  </Box>
                  {a.comments && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.2, fontSize: '0.72rem' }}>
                      {a.comments}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
            {lead.activities.length === 0 && (
              <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', display: 'block', py: 2 }}>
                No recent activity logs.
              </Typography>
            )}
          </Box>
        </Paper>
      )}
      
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <TextField 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          size="small" 
          fullWidth 
          placeholder="Add comment..." 
          onKeyDown={e => e.key === 'Enter' && add()} 
          sx={{ '& .MuiInputBase-root': { borderRadius: 2, fontSize: '0.85rem' } }}
        />
        <Button onClick={add} variant="contained" size="small" sx={{ borderRadius: 2, px: 3, fontWeight: 800 }}>Add</Button>
      </Box>
      
      <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

      {/* Quick Action Matrix for Travel Sales CRM */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1, mb: 1 }}>
        <Button 
          onClick={() => onAction('flight_expert')} 
          size="small" 
          variant="contained" 
          color="primary"
          sx={{ borderRadius: 2, fontWeight: 800, py: 0.8, fontSize: '0.72rem', textTransform: 'none' }}
        >
          ✈️ Send to GDS Desk
        </Button>
        <Button 
          onClick={() => onAction('tl_approval')} 
          size="small" 
          variant="outlined" 
          color="warning"
          sx={{ borderRadius: 2, fontWeight: 800, py: 0.8, fontSize: '0.72rem', textTransform: 'none' }}
        >
          🛡️ Request TL Discount
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1 }}>
        <Button onClick={() => onAction('whatsapp_quote')} size="small" variant="outlined" color="success" sx={{ borderRadius: 2, fontWeight: 700, py: 0.8, fontSize: '0.7rem', textTransform: 'none' }}>📱 WhatsApp</Button>
        <Button onClick={() => onAction('quote')} size="small" variant="outlined" sx={{ borderRadius: 2, fontWeight: 700, py: 0.8, fontSize: '0.7rem', textTransform: 'none' }}>📄 Full Quote</Button>
        <Button onClick={() => onAction('payment')} size="small" variant="outlined" color="secondary" sx={{ borderRadius: 2, fontWeight: 700, py: 0.8, fontSize: '0.7rem', textTransform: 'none' }}>💳 Pay Link</Button>
      </Box>
    </Paper>
  );
}

