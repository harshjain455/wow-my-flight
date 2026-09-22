import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

const agents = [
  { name: 'Maria S.', status: 'On Call', tone: '#22c55e', timer: '00:02:44', recent: 'Active' }, 
  { name: 'John D.', status: 'Idle', tone: '#f59e0b', timer: '12m 00s', recent: 'No activity' }, 
  { name: 'Ken T.', status: 'Away (Break)', tone: '#ef4444', timer: '00:02:40', recent: 'Activity' }, 
  { name: 'Sara K.', status: 'On Call', tone: '#22c55e', timer: '00:14:00', recent: 'Long call' }
];

export default function AgentActivityFeed() { 
  const [actions, setActions] = useState({}); 
  const select = (id, label, choices) => (
    <Select 
      displayEmpty 
      size="small" 
      value={actions[`${id}-${label}`] || ''} 
      onChange={e => setActions({ ...actions, [`${id}-${label}`]: e.target.value })} 
      sx={{ 
        height: 32, 
        fontSize: '0.75rem', 
        bgcolor: 'background.paper',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
      }}
    >
      <MenuItem value="" disabled sx={{ fontSize: '0.75rem' }}>{label} ▾</MenuItem>
      {choices.map(x => <MenuItem key={x} value={x} sx={{ fontSize: '0.75rem' }}>{x}</MenuItem>)}
    </Select>
  );

  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 2, bgcolor: '#fafafa' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, color: 'text.primary', letterSpacing: '.05em' }}>
        REAL-TIME AGENT ACTIVITY FEED
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {agents.map((agent, id) => (
          <Paper key={agent.name} elevation={0} sx={{ 
            p: 2, 
            border: '1px solid', 
            borderColor: agent.status === 'On Call' ? '#86efac' : 'divider',
            borderRadius: 3,
            bgcolor: 'background.paper',
            boxShadow: agent.status === 'On Call' ? '0 4px 15px rgba(34, 197, 94, 0.05)' : 'none',
            transition: 'all 0.2s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.04)' }
          }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Badge 
                overlap="circular" 
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                sx={{ '& .MuiBadge-badge': { backgroundColor: agent.tone, width: 10, height: 10, borderRadius: '50%', border: '2px solid #fff' } }}
              >
                <Avatar sx={{ width: 42, height: 42, bgcolor: agent.tone + '20', color: agent.tone, fontWeight: 700 }}>
                  {agent.name[0]}
                </Avatar>
              </Badge>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 800 }}>{agent.name}</Typography>
                <Typography variant="caption" sx={{ color: agent.tone, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {agent.status === 'On Call' ? <PhoneInTalkIcon sx={{ fontSize: 12 }} /> : agent.status === 'Idle' ? <AccessTimeIcon sx={{ fontSize: 12 }} /> : <PauseCircleFilledIcon sx={{ fontSize: 12 }} />}
                  {agent.status}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1.5, p: 1, bgcolor: '#f1f5f9', borderRadius: 2 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>⏱ {agent.timer}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>{agent.recent}</Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gap: 1 }}>
              {select(id, 'Barge / Whisper', ['Barge Into Call', 'Whisper to Agent', 'Listen Only'])}
              {select(id, 'Lead Options', ['Recycle All Leads', "Recycle Today's", 'Select Leads'])}
            </Box>
          </Paper>
        ))}
      </Box>
    </Paper>
  ); 
}
