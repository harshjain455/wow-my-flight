import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkIcon from '@mui/icons-material/Link';

const PIPELINE_DATA = [
  { id: '0000005', url: 'transaction link/0000005', status: 'GENERATED', amount: '$10,350', customer: 'Karan Singh', time: '2m ago' },
  { id: '042525',  url: 'transaction link/042525',  status: 'VIEWED',     amount: '$3,200',  customer: 'Ankit Sharma', time: '5m ago' },
  { id: '333333',  url: 'transaction link/333333',  status: 'PAID',       amount: '$5,800',  customer: 'M. Chen',      time: '12m ago' },
  { id: '6050751', url: 'transaction link/6050751', status: 'DECLINED',   amount: '$2,400',  customer: 'S. Williams',  time: '18m ago' },
  { id: '6060751', url: 'transaction link/6060751', status: 'DECLINED',   amount: '$1,200',  customer: 'R. Verma',     time: '25m ago' },
  { id: '2050910', url: 'transaction link/2050910', status: 'REFUNDED',   amount: '$4,100',  customer: 'J. Smith',     time: '1h ago' },
  { id: 'A233315', url: 'transaction link/A233315', status: 'REFUNDED',   amount: '$890',    customer: 'A. Lee',       time: '2h ago' },
];

const STATUS_CONFIG = {
  GENERATED: { color: 'default', bg: '#F8FAFC', dot: '#94A3B8', label: 'GENERATED' },
  VIEWED:    { color: 'info',    bg: '#EFF6FF', dot: '#3B82F6', label: 'VIEWED' },
  PAID:      { color: 'success', bg: '#F0FDF4', dot: '#22C55E', label: 'PAID ✅' },
  DECLINED:  { color: 'error',   bg: '#FEF2F2', dot: '#EF4444', label: 'DECLINED ❌' },
  EXPIRED:   { color: 'default', bg: '#F8FAFC', dot: '#9CA3AF', label: 'EXPIRED ⏰' },
  REFUNDED:  { color: 'warning', bg: '#FFFBEB', dot: '#F59E0B', label: 'REFUNDED 🔄' },
  CHARGEBACK:{ color: 'error',   bg: '#FEF2F2', dot: '#DC2626', label: 'CHARGEBACK ⚠️' },
};

export default function PaymentPipeline() {
  const [copied, setCopied] = useState(null);

  const handleCopy = (id) => {
    navigator.clipboard?.writeText(`https://pay.wowmyflight.com/${id}`).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, height: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>PAYMENT PIPELINE</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'success.main' }} />
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 700, fontSize: '0.65rem' }}>LIVE</Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Real-time feed of transaction links
      </Typography>

      {/* Summary strip */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.8, mb: 1.5 }}>
        {[
          { label: 'Paid', count: PIPELINE_DATA.filter(r => r.status === 'PAID').length, color: 'success.main' },
          { label: 'Declined', count: PIPELINE_DATA.filter(r => r.status === 'DECLINED').length, color: 'error.main' },
          { label: 'Refunded', count: PIPELINE_DATA.filter(r => r.status === 'REFUNDED').length, color: 'warning.main' },
        ].map(s => (
          <Box key={s.label} sx={{ textAlign: 'center', p: 0.8, border: '1px solid', borderColor: 'divider', borderRadius: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: s.color }}>{s.count}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{s.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Feed rows */}
      {PIPELINE_DATA.map(row => {
        const cfg = STATUS_CONFIG[row.status] || STATUS_CONFIG.GENERATED;
        return (
          <Box
            key={row.id}
            sx={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              py: 1.2, px: 1, mb: 0.8,
              borderRadius: 1.5,
              bgcolor: cfg.bg,
              border: `1px solid ${cfg.dot}22`,
            }}
          >
            {/* Left: link info */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: cfg.dot, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  https://pay.wowmyflight.com/...
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', pl: 1.5 }}>
                {row.customer} · {row.amount} · {row.time}
              </Typography>
            </Box>

            {/* Right: status + copy */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
              <Chip size="small" label={cfg.label} color={cfg.color} sx={{ fontSize: '0.6rem', height: 20 }} />
              <Tooltip title={copied === row.id ? 'Copied!' : 'Copy link'}>
                <IconButton size="small" onClick={() => handleCopy(row.id)} sx={{ p: 0.3 }}>
                  <ContentCopyIcon sx={{ fontSize: 13, color: copied === row.id ? 'success.main' : 'text.secondary' }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        );
      })}

      <Button size="small" fullWidth variant="outlined" startIcon={<RefreshIcon />} sx={{ mt: 1, fontSize: '0.72rem' }}>
        Refresh Feed
      </Button>
    </Paper>
  );
}
