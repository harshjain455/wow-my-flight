import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const leaders = [
  { name: 'Maria S.', sales: '$42,500', deals: 12, rank: 1, avatarColor: '#fbbf24' },
  { name: 'Sofia R.', sales: '$38,200', deals: 10, rank: 2, avatarColor: '#94a3b8' },
  { name: 'John D.', sales: '$24,100', deals: 6, rank: 3, avatarColor: '#b45309' },
  { name: 'Ken T.', sales: '$18,000', deals: 4, rank: 4, avatarColor: 'divider' },
];

export default function Leaderboard() {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 4, mt: 2 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 900, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <EmojiEventsIcon sx={{ color: '#f59e0b' }} />
        LIVE LEADERBOARD (TODAY)
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {leaders.map((agent) => (
          <Box key={agent.name} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 3, bgcolor: agent.rank === 1 ? '#fffbeb' : '#fafafa', border: '1px solid', borderColor: agent.rank === 1 ? '#fde68a' : 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: agent.avatarColor, fontSize: '0.8rem', fontWeight: 800, color: agent.rank <= 3 ? '#fff' : '#64748b' }}>
                #{agent.rank}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>{agent.name}</Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>{agent.sales}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>{agent.deals} Deals</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
