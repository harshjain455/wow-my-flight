import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ShieldIcon from '@mui/icons-material/Shield';

const RISK_FACTORS = [
  { id: 'OFF132316', risk: 'High',   reason: 'Card Billing vs. Passenger Country Mismatch', amount: '$3,200', color: 'error',   gridPos: { row: 0, col: 2 } },
  { id: 'OFF372313', risk: 'High',   reason: 'AVS Address Verification Failed',              amount: '$5,800', color: 'error',   gridPos: { row: 1, col: 2 } },
  { id: 'OFF152753', risk: 'Medium', reason: '3D Secure Not Verified',                       amount: '$1,200', color: 'warning', gridPos: { row: 1, col: 1 } },
  { id: 'OFF132523', risk: 'Low',    reason: 'New customer — 3D Secure OK',                  amount: '$480',   color: 'success', gridPos: { row: 2, col: 0 } },
];

// 3x3 heatmap grid: rows = risk level (High/Med/Low), cols = impact (Low/Med/High)
const HEATMAP_CELLS = [
  // [row, col, id or null]
  [0, 0, null],       [0, 1, null],       [0, 2, 'OFF132316'],
  [1, 0, null],       [1, 1, 'OFF152753'],[1, 2, 'OFF372313'],
  [2, 0, 'OFF132523'],[2, 1, null],       [2, 2, null],
];

const CELL_BG = {
  '0-2': '#FEE2E2', '1-2': '#FEE2E2',  // High col — red tint
  '1-1': '#FEF3C7',                      // Med col — yellow tint
  '2-0': '#DCFCE7',                      // Low col — green tint
};

const RISK_CONFIG = {
  High:   { color: 'error',   icon: '🔴', bg: '#FEF2F2', border: '#FECACA' },
  Medium: { color: 'warning', icon: '🟡', bg: '#FFFBEB', border: '#FDE68A' },
  Low:    { color: 'success', icon: '🟢', bg: '#F0FDF4', border: '#BBF7D0' },
};

export default function ChargebackRadar() {
  const getCell = (row, col) => HEATMAP_CELLS.find(([r, c]) => r === row && c === col);
  const findFactor = (id) => RISK_FACTORS.find(f => f.id === id);

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <ShieldIcon fontSize="small" color="warning" />
        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>CHARGEBACK RISK RADAR</Typography>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        AI-driven risk analysis of recent transactions
      </Typography>

      {/* Risk Heatmap */}
      <Box sx={{ mb: 2 }}>
        {/* Column headers */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '70px repeat(3, 1fr)', mb: 0.5 }}>
          <Box />
          {['Low Impact', 'Med Impact', 'High Impact'].map(h => (
            <Typography key={h} variant="caption" sx={{ fontWeight: 700, textAlign: 'center', color: 'text.secondary', fontSize: '0.65rem' }}>{h}</Typography>
          ))}
        </Box>

        {/* Rows: High/Medium/Low likelihood */}
        {[['High', 0], ['Medium', 1], ['Low', 2]].map(([rowLabel, rowIdx]) => (
          <Box key={rowLabel} sx={{ display: 'grid', gridTemplateColumns: '70px repeat(3, 1fr)', mb: 0.5, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.65rem', pr: 0.5 }}>
              {rowLabel}
            </Typography>
            {[0, 1, 2].map(colIdx => {
              const cell = getCell(rowIdx, colIdx);
              const factorId = cell?.[2];
              const factor = factorId ? findFactor(factorId) : null;
              const bgKey = `${rowIdx}-${colIdx}`;
              return (
                <Box
                  key={colIdx}
                  sx={{
                    height: 44,
                    borderRadius: 1,
                    bgcolor: CELL_BG[bgKey] || '#F8FAFC',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 0.3,
                  }}
                >
                  {factor && (
                    <Tooltip title={`${factor.id}: ${factor.reason}`}>
                      <Chip
                        size="small"
                        label={factor.id}
                        color={factor.color}
                        sx={{ fontSize: '0.58rem', height: 20, cursor: 'help' }}
                      />
                    </Tooltip>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Risk factor list */}
      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', display: 'block', mb: 1 }}>
        Risk Factors
      </Typography>
      {RISK_FACTORS.map(f => {
        const cfg = RISK_CONFIG[f.risk];
        return (
          <Box
            key={f.id}
            sx={{
              display: 'flex', alignItems: 'flex-start', gap: 1,
              mb: 0.8, p: 1,
              bgcolor: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: 1.5,
            }}
          >
            <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{cfg.icon}</Typography>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{f.id}</Typography>
                <Chip size="small" label={`${f.risk} Risk`} color={f.color} sx={{ fontSize: '0.6rem', height: 18 }} />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.68rem' }}>
                {f.reason} · {f.amount}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Paper>
  );
}
