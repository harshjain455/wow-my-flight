import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

export default function ReallocationTool({ onReassign }) {
  const [agent, setAgent] = useState('');
  
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4, mt: 2, bgcolor: '#f8fafc' }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SwapHorizIcon color="primary" />
        REALLOCATION TOOL
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 600 }}>
        Force transfer wasted or unattended leads to an active agent.
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Select 
          displayEmpty 
          size="small" 
          value={agent} 
          onChange={e => setAgent(e.target.value)} 
          sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
        >
          <MenuItem value="" disabled>Select Target Agent</MenuItem>
          <MenuItem value="Maria S.">Maria S. (Online)</MenuItem>
          <MenuItem value="Sara K.">Sara K. (Online)</MenuItem>
          <MenuItem value="Sofia R.">Sofia R. (Online)</MenuItem>
        </Select>
        <Button 
          variant="contained" 
          onClick={() => { if (agent) onReassign(agent); }}
          disabled={!agent}
          sx={{ borderRadius: 2, fontWeight: 800, py: 1 }}
        >
          Transfer 5 Neglected Leads
        </Button>
      </Box>
    </Paper>
  );
}
