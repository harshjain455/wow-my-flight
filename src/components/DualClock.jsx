import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PublicIcon from '@mui/icons-material/Public';

export default function DualClock({ client }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (timezone) => {
    try {
      return time.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return '00:00';
    }
  };

  const getClientHour = (timezone) => {
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: 'numeric', hourCycle: 'h23' }).formatToParts(time);
      const hr = parts.find(p => p.type === 'hour')?.value;
      return parseInt(hr || '0', 10);
    } catch {
      return 12;
    }
  };

  const agentTime = formatTime(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const clientTime = formatTime(client.timezone);
  const hour = getClientHour(client.timezone);
  const isDay = hour >= 6 && hour < 18;

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: { xs: 'space-between', sm: 'flex-start' },
      flexWrap: 'wrap',
      gap: { xs: 1, sm: 2 }, 
      bgcolor: 'background.paper',
      p: { xs: 1, sm: 1.5 },
      px: { xs: 1.5, sm: 3 },
      borderRadius: { xs: 2.5, sm: 4 },
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
      border: '1px solid',
      borderColor: 'divider',
      width: { xs: '100%', sm: 'auto' },
      transition: 'all 0.3s ease',
      '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.06)' }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <AccessTimeIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: { xs: 'none', sm: 'inline' } }}>Agent (Local):</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: { xs: 'inline', sm: 'none' } }}>Agent:</Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>{agentTime}</Typography>
      </Box>
      <Box sx={{ width: '1px', height: 18, bgcolor: 'divider' }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <PublicIcon sx={{ color: 'text.secondary', fontSize: 16 }} />
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: { xs: 'none', sm: 'inline' } }}>Client ({client?.label || 'EST'}):</Typography>
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: { xs: 'inline', sm: 'none' } }}>Client:</Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'secondary.main', fontFamily: 'monospace' }}>{clientTime}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.3, borderRadius: 1.5, bgcolor: isDay ? '#FFFBEB' : '#F1F5F9' }}>
        {isDay ? <WbSunnyIcon sx={{ color: '#F59E0B', fontSize: 14 }} /> : <NightlightRoundIcon sx={{ color: '#475569', fontSize: 14 }} />}
        <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.62rem', color: isDay ? '#D97706' : '#334155' }}>
          {isDay ? 'DAY' : 'NIGHT'}
        </Typography>
      </Box>
    </Box>
  );
}
