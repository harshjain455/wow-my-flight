import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

import PaymentPipeline from '../../components/PaymentPipeline';
import ChargebackRadar from '../../components/ChargebackRadar';
import TransactionTable from '../../components/TransactionTable';
import PaymentLinkModal from '../../components/PaymentLinkModal';
import ESignModal from '../../components/ESignModal';
import { useAlert } from '../../contexts/AlertContext';

const SUMMARY_CARDS = [
  { label: 'Total Collected', value: '$185,000', icon: <MonetizationOnIcon />, color: '#22C55E', bg: '#F0FDF4' },
  { label: 'Pending Collection', value: '$24,000', icon: <TrendingUpIcon />, color: '#3B82F6', bg: '#EFF6FF' },
  { label: 'Declined', value: '$3,200', icon: <CancelIcon />, color: '#EF4444', bg: '#FEF2F2' },
  { label: 'Refunded', value: '$8,500', icon: <CurrencyExchangeIcon />, color: '#F59E0B', bg: '#FFFBEB' },
];

const MAIN_MODULES = [
  { title: 'Payments', desc: 'Create, monitor and reconcile payment links. Track transaction status in real-time.' },
  { title: 'Invoices', desc: 'Issue invoices, resend PDFs and follow payment status for every booking.' },
  { title: 'Refunds & Commissions', desc: 'Process refunds, record agent commissions and handle chargeback disputes.' },
];

const SETTLEMENT_RECORDS = [
  { id: 'BK-9901', pnr: 'ABC12D', passenger: 'M. Chen', route: 'JFK → LHR', grossPrice: 1250, bspCost: 950, gatewayFee: 31.25, netProfit: 268.75, marginPct: '21.5%', status: 'Cleared', bspStatus: 'Settled' },
  { id: 'BK-9902', pnr: 'LMN78F', passenger: 'A. Lee', route: 'DEL → SIN', grossPrice: 530, bspCost: 420, gatewayFee: 13.25, netProfit: 96.75, marginPct: '18.2%', status: 'Cleared', bspStatus: 'Pending Cycle' },
  { id: 'BK-9903', pnr: 'QRS90G', passenger: 'K. Singh', route: 'DXB → LHR', grossPrice: 1850, bspCost: 1450, gatewayFee: 46.25, netProfit: 353.75, marginPct: '19.1%', status: 'Pending Review', bspStatus: 'Under Audit' },
  { id: 'BK-9904', pnr: 'SAB89A', passenger: 'K. Patel', route: 'DEL → LHR', grossPrice: 2500, bspCost: 2100, gatewayFee: 62.50, netProfit: 337.50, marginPct: '13.5%', status: 'Cleared', bspStatus: 'Settled' },
];


export default function FinanceDashboard() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [tab, setTab] = useState(0);
  const [linkOpen, setLinkOpen] = useState(false);
  const [signOpen, setSignOpen] = useState(false);

  // ─── Right column: Actions & Tools ───
  const toolsColumn = (
    <Box sx={{ display: 'grid', gap: 2, alignContent: 'start' }}>
      {/* Actions & Tools */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>ACTIONS & TOOLS</Typography>
        <Button
          fullWidth variant="contained" color="success"
          sx={{ mb: 1, borderRadius: 2, fontWeight: 700, py: 1.1 }}
          onClick={() => setLinkOpen(true)}
        >
          💳 Generate Payment Link
        </Button>
        <Button
          fullWidth variant="outlined" color="secondary"
          sx={{ borderRadius: 2, fontWeight: 700, py: 1.1 }}
          onClick={() => setSignOpen(true)}
        >
          ✍️ Create E-Sign Authorization
        </Button>
      </Paper>

      {/* Refunds & Cancellations */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>REFUNDS & CANCELLATIONS</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.78rem' }}>
          Calculate supplier and service fees, choose a refund method and notify the customer automatically.
        </Typography>
        <Button
          variant="contained" color="warning" fullWidth
          sx={{ borderRadius: 2, fontWeight: 700 }}
          onClick={() => showAlert('Refund flow started: select booking and refund reason.', 'info')}
        >
          🔄 Initiate Refund
        </Button>
      </Paper>

      {/* Quick summary */}
      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>TODAY'S SUMMARY</Typography>
        {[
          ['Links Generated', '12'],
          ['Payments Received', '8'],
          ['Declined', '2'],
          ['Pending Review', '3'],
        ].map(([label, val]) => (
          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.6, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{val}</Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );

  return (
    <Box sx={{ pb: 4 }}>
      {/* ─── Header ─── */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>Finance Dashboard</Typography>
        <Typography variant="body2" color="text.secondary">Payment operations, risk monitoring and financial overview</Typography>
      </Box>

      {/* ─── Tabs ─── */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {['📊 Dashboard', '👁 Monitoring', '📦 Main Modules', '⚙ Overview', '💰 Flight Margins & BSP'].map((label, i) => (
          <Tab key={label} label={label} id={`finance-tab-${i}`} sx={{ fontWeight: 700, fontSize: '0.8rem' }} />
        ))}
      </Tabs>


      {/* ─── Tab 0: Dashboard ─── */}
      {tab === 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2.5fr 4.5fr 3fr' }, gap: 2 }}>
          <PaymentPipeline />
          <Box sx={{ display: 'grid', gap: 2 }}>
            <ChargebackRadar />
            <TransactionTable
              onRefund={() => setSignOpen(true)}
              onAuth={() => setSignOpen(true)}
            />
          </Box>
          {toolsColumn}
        </Box>
      )}

      {/* ─── Tab 1: Monitoring ─── */}
      {tab === 1 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1.35fr' }, gap: 2 }}>
          <PaymentPipeline />
          <Box sx={{ display: 'grid', gap: 2 }}>
            <ChargebackRadar />
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>MONITORING ALERTS</Typography>
              {[
                { icon: '🔴', msg: '3 high-risk transactions require immediate review' },
                { icon: '🟡', msg: '2 declined payment links need customer follow-up' },
                { icon: '🟡', msg: '1 chargeback response due today — OFF132316' },
                { icon: '✅', msg: 'AVS check passed for 8 transactions today' },
              ].map((a, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 1, py: 0.8, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Typography sx={{ fontSize: '0.85rem' }}>{a.icon}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>{a.msg}</Typography>
                </Box>
              ))}
            </Paper>
          </Box>
        </Box>
      )}

      {/* ─── Tab 2: Main Modules ─── */}
      {tab === 2 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {MAIN_MODULES.map(({ title, desc }) => (
            <Paper key={title} elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>{title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 48 }}>{desc}</Typography>
              <Button
                variant="outlined" fullWidth
                onClick={() => {
                  if (title === 'Payments') navigate('/payments');
                  else if (title === 'Invoices') navigate('/payments/invoices');
                  else if (title === 'Refunds & Commissions') navigate('/payments/refund-commission');
                }}
                sx={{ borderRadius: 2 }}
              >
                Open {title}
              </Button>
            </Paper>
          ))}
        </Box>
      )}

      {/* ─── Tab 3: Overview ─── */}
      {tab === 3 && (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {/* Summary KPI cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {SUMMARY_CARDS.map(({ label, value, icon, color, bg }) => (
              <Paper key={label} elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: bg }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color }}>
                  {React.cloneElement(icon, { sx: { fontSize: 22, color } })}
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.68rem' }}>
                    {label}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color }}>{value}</Typography>
              </Paper>
            ))}
          </Box>

          {/* Financial Health */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>FINANCIAL HEALTH OVERVIEW</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {[
                { metric: 'Collection Rate', value: '88%', status: '🟢 On Target', color: 'success.main' },
                { metric: 'Refund Rate', value: '4.6%', status: '🟢 Within Limit', color: 'success.main' },
                { metric: 'High-Risk Transactions', value: '3 Active', status: '🔴 Under Review', color: 'error.main' },
              ].map(({ metric, value, status, color }) => (
                <Box key={metric} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>{metric}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>{value}</Typography>
                  <Typography variant="caption" sx={{ color, fontWeight: 600 }}>{status}</Typography>
                </Box>
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontSize: '0.78rem' }}>
              Collection rate is 88% — above the 80% target. Refund rate is within acceptable limits.
              High-risk transactions are flagged and under active compliance review.
            </Typography>
          </Paper>
        </Box>
      )}

      {/* ─── Tab 4: Flight Margins & BSP Settlement ─── */}
      {tab === 4 && (
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          {/* Summary KPI Strip */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            {[
              { label: 'Gross Flight Collections', value: '$6,130.00', color: '#16A34A', bg: '#F0FDF4' },
              { label: 'Net BSP / Supplier Cost', value: '$4,920.00', color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Merchant Gateway Fees (2.5%)', value: '$153.25', color: '#D97706', bg: '#FFFBEB' },
              { label: 'Net Agency Profit Margin', value: '$1,056.75 (17.2%)', color: '#059669', bg: '#ECFDF5' },
            ].map((kpi, idx) => (
              <Paper key={idx} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: kpi.bg }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  {kpi.label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: kpi.color }}>
                  {kpi.value}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Detailed Settlement Table */}
          <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                  ✈️ TICKET PROFIT & MARGIN SETTLEMENT MATRIX
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Live reconciliation: Client gross payment vs. BSP consolidator cost & net profit breakdown
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => showAlert('Reconciliation export (CSV) downloaded successfully.', 'success')}
                sx={{ fontWeight: 700, borderRadius: 2 }}
              >
                📥 Export P&L Report
              </Button>
            </Box>

            <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {['Booking / PNR', 'Passenger & Sector', 'Gross Collected', 'Net BSP Cost', 'Gateway Fee', 'Net Profit ($)', 'Margin %', 'Ticketing Clearance', 'Action'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 8px', color: '#64748B', fontWeight: 700 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SETTLEMENT_RECORDS.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 8px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main' }}>{rec.id}</Typography>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{rec.pnr}</Typography>
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{rec.passenger}</Typography>
                      <Typography variant="caption" color="text.secondary">{rec.route}</Typography>
                    </td>
                    <td style={{ padding: '10px 8px', fontWeight: 800, color: '#16A34A' }}>
                      ${rec.grossPrice.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 8px', fontWeight: 700, color: '#2563EB' }}>
                      ${rec.bspCost.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 8px', color: '#64748B' }}>
                      ${rec.gatewayFee.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 8px', fontWeight: 900, color: '#059669' }}>
                      +${rec.netProfit.toFixed(2)}
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <Chip label={rec.marginPct} size="small" color="success" sx={{ fontWeight: 800, height: 20, fontSize: '0.68rem' }} />
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <Chip
                        label={rec.status}
                        size="small"
                        color={rec.status === 'Cleared' ? 'success' : 'warning'}
                        sx={{ fontWeight: 800, height: 20, fontSize: '0.68rem' }}
                      />
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <Button
                        size="small"
                        variant={rec.status === 'Cleared' ? 'text' : 'contained'}
                        color={rec.status === 'Cleared' ? 'inherit' : 'primary'}
                        onClick={() => showAlert(`Finance cleared for Booking #${rec.id} (${rec.pnr}). Ticketing queue notified.`, 'success')}
                        sx={{ fontSize: '0.68rem', fontWeight: 800, py: 0.2, px: 1 }}
                      >
                        {rec.status === 'Cleared' ? '✓ Verified' : 'Clear for Issue'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Box>
      )}


      {/* ─── Modals ─── */}
      <PaymentLinkModal
        open={linkOpen}
        onClose={() => setLinkOpen(false)}
        onSubmit={(data) => {
          setLinkOpen(false);
          showAlert(`Payment link generated for ${data.customer} — ${data.currency} ${Number(data.amount).toLocaleString()}`, 'success');
        }}
      />
      <ESignModal
        open={signOpen}
        onClose={() => setSignOpen(false)}
        onSubmit={(data) => {
          setSignOpen(false);
          showAlert(`E-Sign authorization sent to ${data.name} via ${data.method}`, 'success');
        }}
      />
    </Box>
  );
}
