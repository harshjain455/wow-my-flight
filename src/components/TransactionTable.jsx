import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import GavelIcon from '@mui/icons-material/Gavel';

const TRANSACTIONS = [
  { id: 'OFF132350', client: 'Culast Garner',  booking: 'OF395735', amount: '$3,200.00', method: 'Credit Card', risk: 'High' },
  { id: 'OFF132360', client: 'Itim Sthoer',   booking: 'OF132373', amount: '$5,800.00', method: 'Credit Card', risk: 'High' },
  { id: 'OFF132370', client: 'Brach Name',    booking: 'OF382327', amount: '$1,200.00', method: 'Debit Card',  risk: 'High' },
  { id: 'OFF132550', client: 'Auth Devan',    booking: 'OF392576', amount: '$480.00',   method: 'Bank Transfer',risk: 'Low' },
  { id: 'OFF122510', client: 'Josen Name',    booking: 'OF383338', amount: '$920.00',   method: 'Credit Card', risk: 'Low' },
];

export default function TransactionTable({ onRefund, onAuth }) {
  const [reviewed, setReviewed] = useState(new Set());

  return (
    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <ReceiptLongIcon fontSize="small" color="primary" />
        <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>TRANSACTIONS</Typography>
        <Chip size="small" label={`${TRANSACTIONS.filter(r => r.risk === 'High').length} High Risk`} color="error" sx={{ fontSize: '0.65rem', ml: 'auto' }} />
      </Box>

      {/* Table */}
      <Box sx={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 580 }}>
          <thead>
            <tr>
              {['Transaction ID', 'Client Name', 'Booking Ref', 'Amount ($)', 'Risk Score', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 8px', color: '#64748B', fontWeight: 700, fontSize: 11, borderBottom: '2px solid #F1F5F9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((row) => {
              const isHighRisk = row.risk === 'High';
              const isReviewed = reviewed.has(row.id);
              return (
                <tr
                  key={row.id}
                  style={{
                    background: isHighRisk ? '#FEF2F2' : 'transparent',
                    borderBottom: '1px solid #F1F5F9',
                  }}
                >
                  <td style={{ padding: '8px', fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>{row.id}</td>
                  <td style={{ padding: '8px' }}>{row.client}</td>
                  <td style={{ padding: '8px', color: '#64748B' }}>{row.booking}</td>
                  <td style={{ padding: '8px', fontWeight: 700 }}>{row.amount}</td>
                  <td style={{ padding: '8px' }}>
                    <Chip
                      size="small"
                      label={isHighRisk ? '🔴 High' : '🟢 Low'}
                      color={isHighRisk ? 'error' : 'success'}
                      sx={{ fontSize: '0.65rem', height: 20 }}
                    />
                  </td>
                  <td style={{ padding: '8px', whiteSpace: 'nowrap' }}>
                    <Tooltip title="View transaction details">
                      <IconButton
                        size="small"
                        color={isReviewed ? 'success' : 'primary'}
                        onClick={() => setReviewed(prev => new Set([...prev, row.id]))}
                        sx={{ p: 0.5 }}
                      >
                        <VisibilityIcon sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                    {isHighRisk && (
                      <>
                        <Tooltip title="Issue Refund">
                          <IconButton size="small" color="error" onClick={onRefund} sx={{ p: 0.5 }}>
                            <CurrencyExchangeIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Send E-Sign Auth Form">
                          <IconButton size="small" color="secondary" onClick={onAuth} sx={{ p: 0.5 }}>
                            <GavelIcon sx={{ fontSize: 15 }} />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>
    </Paper>
  );
}
