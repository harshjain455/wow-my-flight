import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';

// Icons
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LinkIcon from '@mui/icons-material/Link';
import DrawIcon from '@mui/icons-material/Draw';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SecurityIcon from '@mui/icons-material/Security';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalculateIcon from '@mui/icons-material/Calculate';
import LockIcon from '@mui/icons-material/Lock';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import VerifiedIcon from '@mui/icons-material/Verified';

import AppTable from '../../components/AppTable';
import PaymentLinkModal from '../../components/PaymentLinkModal';
import ESignModal from '../../components/ESignModal';
import DualClock from '../../components/DualClock';
import { PAYMENT_STATUSES } from '../../constants/mockData';
import { useAlert } from '../../contexts/AlertContext';

// Payment Status Styling Config for 10 Exact Statuses
export const PAYMENT_STATUS_CONFIG = {
  'Payment Pending': { bg: '#FEF3C7', color: '#D97706', borderColor: '#FCD34D' },
  'Payment Processing': { bg: '#F3E8FF', color: '#9333EA', borderColor: '#D8B4FE' },
  'Payment Successful': { bg: '#DCFCE7', color: '#15803D', borderColor: '#86EFAC' },
  'Payment Failed': { bg: '#FEE2E2', color: '#B91C1C', borderColor: '#FCA5A5' },
  'Payment Cancelled': { bg: '#F1F5F9', color: '#475569', borderColor: '#CBD5E1' },
  'Partially Paid': { bg: '#E0F2FE', color: '#0369A1', borderColor: '#7DD3FC' },
  'Refund Pending': { bg: '#FFEDD5', color: '#EA580C', borderColor: '#FDBA74' },
  'Refunded': { bg: '#DBEAFE', color: '#1E40AF', borderColor: '#93C5FD' },
  'Partially Refunded': { bg: '#E0E7FF', color: '#3730A3', borderColor: '#A5B4FC' },
  'Chargeback': { bg: '#FFE4E6', color: '#BE123C', borderColor: '#FDA4AF' },
};

// Pipeline Links Mock
const PIPELINE_LINKS = [
  { link: 'https://payment.co/tx/001', customer: 'Karan Singh (BK-1001)', amount: '$10,350', status: 'Payment Successful', color: '#15803D', bg: '#DCFCE7' },
  { link: 'https://payment.co/tx/002', customer: 'A. Lee (BK-1002)', amount: '$3,200', status: 'Payment Processing', color: '#9333EA', bg: '#F3E8FF' },
  { link: 'https://payment.co/tx/003', customer: 'M. Chen (BK-1003)', amount: '$5,800', status: 'Payment Successful', color: '#15803D', bg: '#DCFCE7', highlight: true },
  { link: 'https://payment.co/tx/004', customer: 'P. Kumar (BK-1004)', amount: '$8,400', status: 'Partially Refunded', color: '#3730A3', bg: '#E0E7FF' },
  { link: 'https://payment.co/tx/005', customer: 'Emma Novak (BK-1005)', amount: '$2,100', status: 'Chargeback', color: '#BE123C', bg: '#FFE4E6' }
];

// 10-Point Booking Financial Records Mock Data
export const DEMO_BOOKING_FINANCIAL_RECORDS = [
  {
    id: 'BK-1001',
    pnr: 'ABC12D',
    customerName: 'M. Chen',
    route: 'JFK → LHR',
    agentName: 'Maria Santos (Senior Consultant)',
    supplierName: 'British Airways (Sabre GDS)',
    
    // Formula components: Customer Price − Supplier Cost − Payment Processing Fee − Refunds − Discounts = Gross Profit
    customerPrice: 10350.00,
    supplierCost: 8200.00,
    processingFee: 258.75,
    refunds: 0.00,
    discounts: 100.00,
    grossProfit: 1791.25,
    profitMarginPct: 17.3,
    
    // 10 Tracking Elements
    paymentStatus: 'Payment Successful',
    webhookEventId: 'evt_stripe_9923841',
    webhookSignature: 'hmac_sha256_valid_0x9f82',
    webhookTimestamp: '2026-08-12 14:32:05 EST',
    
    invoice: { id: 'INV-9001', issueDate: '2026-08-12', amount: '$10,350.00', status: 'Payment Successful' },
    payment: { amountPaid: '$10,350.00', method: 'Card (Visa 3DS •••• 4242)', date: '2026-08-12 14:32', txnRef: 'TXN-882341' },
    refund: { amount: '$0.00', status: 'None', reason: 'N/A' },
    chargeback: { status: 'Protected (3DS Verified)', riskLevel: 'LOW 🟢', eSignSigned: true },
    supplierPayable: { netAmount: '$8,200.00', supplier: 'British Airways (BSP Link)', dueDate: '2026-09-01' },
    commission: { grossCommission: '$1,150.00', rate: '11.1%' },
    agentCommission: { agentShare: '$268.68 (15%)', agentName: 'Maria Santos' },
    markup: { amount: '$650.00', pct: '6.7%' },
    serviceFee: { amount: '$150.00', type: 'Ticketing & Concierge Fee' },
    tax: { amount: '$350.00', breakdown: 'GDS Airport Tax ($280) + Govt VAT ($70)' }
  },
  {
    id: 'BK-1002',
    pnr: 'LMN78F',
    customerName: 'A. Lee',
    route: 'DEL → SIN',
    agentName: 'Karan Singh (Flight Expert)',
    supplierName: 'Singapore Airlines (Amadeus 1A)',
    
    customerPrice: 3200.00,
    supplierCost: 2600.00,
    processingFee: 64.00,
    refunds: 0.00,
    discounts: 50.00,
    grossProfit: 486.00,
    profitMarginPct: 15.2,
    
    paymentStatus: 'Payment Processing',
    webhookEventId: 'evt_stripe_9923842',
    webhookSignature: 'hmac_sha256_valid_0x3a71',
    webhookTimestamp: '2026-08-14 11:15:20 IST',
    
    invoice: { id: 'INV-9002', issueDate: '2026-08-14', amount: '$3,200.00', status: 'Payment Processing' },
    payment: { amountPaid: '$3,200.00', method: 'Card (Mastercard •••• 8812)', date: '2026-08-14 11:15', txnRef: 'TXN-882342' },
    refund: { amount: '$0.00', status: 'None', reason: 'N/A' },
    chargeback: { status: 'Protected (AVS Full Match)', riskLevel: 'LOW 🟢', eSignSigned: true },
    supplierPayable: { netAmount: '$2,600.00', supplier: 'Singapore Airlines', dueDate: '2026-09-05' },
    commission: { grossCommission: '$350.00', rate: '10.9%' },
    agentCommission: { agentShare: '$72.90 (15%)', agentName: 'Karan Singh' },
    markup: { amount: '$200.00', pct: '6.25%' },
    serviceFee: { amount: '$80.00', type: 'Standard Booking Fee' },
    tax: { amount: '$120.00', breakdown: 'Intl Departure Tax ($120)' }
  },
  {
    id: 'BK-1003',
    pnr: 'QRS90G',
    customerName: 'K. Singh',
    route: 'DXB → LHR',
    agentName: 'Omar Farouq (Ticketing Desk)',
    supplierName: 'Emirates Direct API',
    
    customerPrice: 5800.00,
    supplierCost: 4600.00,
    processingFee: 0.00,
    refunds: 0.00,
    discounts: 0.00,
    grossProfit: 1200.00,
    profitMarginPct: 20.7,
    
    paymentStatus: 'Payment Successful',
    webhookEventId: 'evt_swift_wire_77192',
    webhookSignature: 'hmac_sha256_valid_0x8b12',
    webhookTimestamp: '2026-08-15 16:40:00 GST',
    
    invoice: { id: 'INV-9003', issueDate: '2026-08-15', amount: '$5,800.00', status: 'Payment Successful' },
    payment: { amountPaid: '$5,800.00', method: 'Bank Wire (SWIFT Transfer)', date: '2026-08-15 16:40', txnRef: 'SWIFT-EK99812' },
    refund: { amount: '$0.00', status: 'None', reason: 'N/A' },
    chargeback: { status: 'Zero Risk (Verified Wire)', riskLevel: 'LOW 🟢', eSignSigned: true },
    supplierPayable: { netAmount: '$4,600.00', supplier: 'Emirates Airline Direct', dueDate: '2026-08-30' },
    commission: { grossCommission: '$800.00', rate: '13.8%' },
    agentCommission: { agentShare: '$180.00 (15%)', agentName: 'Omar Farouq' },
    markup: { amount: '$400.00', pct: '6.9%' },
    serviceFee: { amount: '$120.00', type: 'VIP Support Service Fee' },
    tax: { amount: '$240.00', breakdown: 'UAE Airport Facility Charge ($240)' }
  },
  {
    id: 'BK-1004',
    pnr: 'SAB89X',
    customerName: 'P. Kumar',
    route: 'BOM → JFK',
    agentName: 'Maria Santos (Senior Consultant)',
    supplierName: 'American Airlines (Travelport GDS)',
    
    customerPrice: 8400.00,
    supplierCost: 7100.00,
    processingFee: 210.00,
    refunds: 500.00,
    discounts: 100.00,
    grossProfit: 490.00,
    profitMarginPct: 5.8,
    
    paymentStatus: 'Partially Refunded',
    webhookEventId: 'evt_stripe_refund_1049',
    webhookSignature: 'hmac_sha256_valid_0x5c40',
    webhookTimestamp: '2026-08-16 09:22:15 IST',
    
    invoice: { id: 'INV-9004', issueDate: '2026-08-16', amount: '$8,400.00', status: 'Partially Refunded' },
    payment: { amountPaid: '$8,400.00', method: 'Card (Amex •••• 1004)', date: '2026-08-16 09:22', txnRef: 'TXN-882344' },
    refund: { amount: '$500.00', status: 'Partially Refunded', reason: 'Flight segment cancellation refund' },
    chargeback: { status: 'Medium Risk 🟡', riskLevel: 'MEDIUM 🟡', eSignSigned: false },
    supplierPayable: { netAmount: '$7,100.00', supplier: 'American Airlines GDS', dueDate: '2026-09-02' },
    commission: { grossCommission: '$750.00', rate: '8.9%' },
    agentCommission: { agentShare: '$73.50 (15%)', agentName: 'Maria Santos' },
    markup: { amount: '$450.00', pct: '5.3%' },
    serviceFee: { amount: '$100.00', type: 'Standard Booking Fee' },
    tax: { amount: '$300.00', breakdown: 'India Passenger Service Fee + US Customs' }
  },
  {
    id: 'BK-1005',
    pnr: '1A990P',
    customerName: 'Emma Novak',
    route: 'CDG → DXB',
    agentName: 'Sarah Jenkins (Customer Care)',
    supplierName: 'Lufthansa (Consolidator AirDesk)',
    
    customerPrice: 2100.00,
    supplierCost: 1750.00,
    processingFee: 52.50,
    refunds: 0.00,
    discounts: 0.00,
    grossProfit: 297.50,
    profitMarginPct: 14.1,
    
    paymentStatus: 'Chargeback',
    webhookEventId: 'evt_dispute_created_991',
    webhookSignature: 'hmac_sha256_valid_0x2e88',
    webhookTimestamp: '2026-08-17 18:05:40 CET',
    
    invoice: { id: 'INV-9005', issueDate: '2026-08-17', amount: '$2,100.00', status: 'Chargeback' },
    payment: { amountPaid: '$2,100.00', method: 'Card (Visa •••• 9012)', date: '2026-08-17 18:05', txnRef: 'TXN-882345' },
    refund: { amount: '$0.00', status: 'None', reason: 'N/A' },
    chargeback: { status: 'Disputed (Cardholder Claim)', riskLevel: 'HIGH 🔴', eSignSigned: true },
    supplierPayable: { netAmount: '$1,750.00', supplier: 'Lufthansa Group', dueDate: '2026-09-10' },
    commission: { grossCommission: '$220.00', rate: '10.4%' },
    agentCommission: { agentShare: '$44.62 (15%)', agentName: 'Sarah Jenkins' },
    markup: { amount: '$130.00', pct: '6.1%' },
    serviceFee: { amount: '$50.00', type: 'E-Ticket Processing Fee' },
    tax: { amount: '$90.00', breakdown: 'EU Solidarity Tax ($90)' }
  }
];

// Initial Provider Webhook Event Feed Log
export const INITIAL_WEBHOOK_LOGS = [
  { id: 'evt_stripe_9923841', type: 'payment_intent.succeeded', bookingRef: 'BK-1001', pnr: 'ABC12D', statusResult: 'Payment Successful', amount: '$10,350.00', sigStatus: 'HMAC-SHA256: VALID 🟢', timestamp: '2026-08-12 14:32:05 EST' },
  { id: 'evt_stripe_9923842', type: 'payment_intent.processing', bookingRef: 'BK-1002', pnr: 'LMN78F', statusResult: 'Payment Processing', amount: '$3,200.00', sigStatus: 'HMAC-SHA256: VALID 🟢', timestamp: '2026-08-14 11:15:20 IST' },
  { id: 'evt_swift_wire_77192', type: 'bank_transfer.confirmed', bookingRef: 'BK-1003', pnr: 'QRS90G', statusResult: 'Payment Successful', amount: '$5,800.00', sigStatus: 'SWIFT MT103 VALIDATED 🟢', timestamp: '2026-08-15 16:40:00 GST' },
  { id: 'evt_stripe_refund_1049', type: 'charge.refund.updated', bookingRef: 'BK-1004', pnr: 'SAB89X', statusResult: 'Partially Refunded', amount: '$500.00', sigStatus: 'HMAC-SHA256: VALID 🟢', timestamp: '2026-08-16 09:22:15 IST' },
  { id: 'evt_dispute_created_991', type: 'charge.dispute.created', bookingRef: 'BK-1005', pnr: '1A990P', statusResult: 'Chargeback', amount: '$2,100.00', sigStatus: 'HMAC-SHA256: VALID 🟢', timestamp: '2026-08-17 18:05:40 CET' },
];

export const SuperAdminPaymentDashboard = () => {
  const { showAlert } = useAlert();

  // Tab State
  const [activeTab, setActiveTab] = useState('PROFITABILITY');

  // Data States
  const [financialRecords, setFinancialRecords] = useState(DEMO_BOOKING_FINANCIAL_RECORDS);
  const [webhookLogs, setWebhookLogs] = useState(INITIAL_WEBHOOK_LOGS);
  const [pipelineLinks, setPipelineLinks] = useState(PIPELINE_LINKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modals & Drawers
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [eSignModalOpen, setESignModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Read-only alert modal when trying to manually edit status
  const [manualAttemptModalOpen, setManualAttemptModalOpen] = useState(false);

  // Webhook Simulator Handler
  const handleSimulateWebhook = (eventType, targetStatus, bookingId = 'BK-1001') => {
    const eventId = `evt_${Date.now()}`;
    const timestamp = new Date().toLocaleString();

    // 1. Update financial record status automatically via provider event
    setFinancialRecords(prev => prev.map(rec => {
      if (rec.id === bookingId) {
        return {
          ...rec,
          paymentStatus: targetStatus,
          webhookEventId: eventId,
          webhookTimestamp: timestamp,
          invoice: { ...rec.invoice, status: targetStatus }
        };
      }
      return rec;
    }));

    // 2. Add to Provider Webhook Event Feed Log
    const newLog = {
      id: eventId,
      type: eventType,
      bookingRef: bookingId,
      pnr: 'ABC12D',
      statusResult: targetStatus,
      amount: '$10,350.00',
      sigStatus: 'HMAC-SHA256: VALIDATED 🟢',
      timestamp: timestamp
    };
    setWebhookLogs(prev => [newLog, ...prev]);

    showAlert(`⚡ Payment Provider Webhook Event Received! [${eventType}] -> Updated Status to "${targetStatus}" (Signed & Validated)`, 'success');
  };

  // Helper render for 10 Payment Status Badges with Provider Lock Icon
  const renderPaymentStatusChip = (status, record) => {
    const config = PAYMENT_STATUS_CONFIG[status] || { bg: '#F1F5F9', color: '#475569', borderColor: '#CBD5E1' };

    return (
      <Tooltip title="🔒 Read-Only: Payment confirmation comes from Payment Provider Webhook event signature. Click for audit details.">
        <Chip
          size="small"
          icon={<LockIcon sx={{ fontSize: '0.75rem !important', color: `${config.color} !important` }} />}
          label={status}
          onClick={() => setManualAttemptModalOpen(true)}
          sx={{
            bgcolor: config.bg,
            color: config.color,
            border: `1px solid ${config.borderColor}`,
            fontWeight: 900,
            fontSize: '0.68rem',
            height: 22,
            cursor: 'pointer',
            '&:hover': { opacity: 0.9 }
          }}
        />
      </Tooltip>
    );
  };

  // Calculate Totals for Management KPI Header
  const financialTotals = useMemo(() => {
    const totalRevenue = financialRecords.reduce((acc, r) => acc + r.customerPrice, 0);
    const totalSupplier = financialRecords.reduce((acc, r) => acc + r.supplierCost, 0);
    const totalProcessingFees = financialRecords.reduce((acc, r) => acc + r.processingFee, 0);
    const totalRefunds = financialRecords.reduce((acc, r) => acc + r.refunds, 0);
    const totalDiscounts = financialRecords.reduce((acc, r) => acc + r.discounts, 0);
    const totalGrossProfit = financialRecords.reduce((acc, r) => acc + r.grossProfit, 0);
    const avgMarginPct = totalRevenue > 0 ? ((totalGrossProfit / totalRevenue) * 100).toFixed(1) : 0;

    return {
      totalRevenue,
      totalSupplier,
      totalProcessingFees,
      totalRefunds,
      totalDiscounts,
      totalGrossProfit,
      avgMarginPct
    };
  }, [financialRecords]);

  // Filter financial records
  const filteredFinancialRecords = useMemo(() => {
    return financialRecords.filter(r => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.pnr.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.paymentStatus.toLowerCase().includes(q) ||
        r.invoice.id.toLowerCase().includes(q);

      const matchStatus = !statusFilter ? true : r.paymentStatus === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [financialRecords, searchTerm, statusFilter]);

  const handleCopyLink = (url) => {
    navigator.clipboard?.writeText(url);
    showAlert('Payment Link copied to clipboard! 📋', 'info');
  };

  // Financial Ledger Table Columns
  const financialColumns = [
    {
      id: 'id',
      label: 'Booking ID & PNR',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
            {row.id}
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: '#0F172A', fontWeight: 800 }}>
            PNR: {row.pnr}
          </Typography>
        </Box>
      )
    },
    {
      id: 'customer',
      label: 'Customer & Route',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.customerName}</Typography>
          <Typography variant="caption" color="text.secondary">✈️ {row.route}</Typography>
        </Box>
      )
    },
    {
      id: 'paymentStatus',
      label: 'Validated Payment Status',
      render: (row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3 }}>
          {renderPaymentStatusChip(row.paymentStatus, row)}
          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.62rem' }}>
            ID: {row.webhookEventId}
          </Typography>
        </Box>
      )
    },
    {
      id: 'customerPrice',
      label: 'Customer Price (+)',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 900, color: '#059669' }}>
          ${row.customerPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Typography>
      )
    },
    {
      id: 'supplierCost',
      label: 'Supplier Cost (−)',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#DC2626' }}>
            -${row.supplierCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      )
    },
    {
      id: 'grossProfit',
      label: 'Gross Profit & Margin %',
      render: (row) => (
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#15803D' }}>
            +${row.grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
          <Chip size="small" label={`${row.profitMarginPct}% Margin`} sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800 }} />
        </Box>
      )
    },
    {
      id: 'webhookSig',
      label: 'Provider Webhook Verification',
      render: (row) => (
        <Chip
          size="small"
          icon={<VerifiedIcon sx={{ fontSize: '0.75rem !important' }} />}
          label="HMAC SHA-256 Verified"
          color="success"
          variant="outlined"
          sx={{ height: 20, fontSize: '0.62rem', fontWeight: 800 }}
        />
      )
    },
    {
      id: 'actions',
      label: 'Action',
      render: (row) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<AssessmentIcon sx={{ fontSize: 13 }} />}
          sx={{ fontSize: '0.68rem', fontWeight: 800, py: 0.3 }}
          onClick={() => setSelectedRecord(row)}
        >
          View Financial Record 📊
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      {/* ─── PREMIUM PAGE HEADER ─── */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #1E40AF 100%)',
        borderRadius: 3,
        p: { xs: 2.5, sm: 3.5 },
        mb: 3,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <Box sx={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', right: 60, bottom: -50, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        {/* Top row: title + clock */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1.2 }}>
              💳 Payment & Financial Records Hub
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mt: 0.5, maxWidth: 520, fontSize: '0.8rem' }}>
              10 Exact Payment Statuses · Provider Webhook Signature Verification · Booking Profitability Ledger
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
          </Box>
        </Box>

        {/* Bottom row: action buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<LinkIcon />}
            onClick={() => setPaymentModalOpen(true)}
            sx={{
              fontWeight: 800,
              bgcolor: '#2563EB',
              '&:hover': { bgcolor: '#1D4ED8' },
              borderRadius: 2,
              px: 2.5,
              fontSize: '0.82rem',
              boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Generate Payment Link
          </Button>
          <Button
            variant="outlined"
            startIcon={<DrawIcon />}
            onClick={() => setESignModalOpen(true)}
            sx={{
              fontWeight: 800,
              borderColor: 'rgba(255,255,255,0.4)',
              color: '#fff',
              '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.08)' },
              borderRadius: 2,
              px: 2.5,
              fontSize: '0.82rem',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Create E-Sign Auth
          </Button>
        </Box>
      </Box>

      {/* ─── KPI CARDS ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        {[
          {
            label: 'TOTAL REVENUE',
            value: `$${financialTotals.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            sub: 'Invoiced & Webhooks',
            color: '#15803D', bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)',
            border: '#86EFAC',
            icon: <MonetizationOnIcon sx={{ fontSize: 28, color: '#16A34A' }} />
          },
          {
            label: 'SUPPLIER COSTS',
            value: `-$${financialTotals.totalSupplier.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            sub: 'Net Airline / Sabre Cost',
            color: '#B91C1C', bg: 'linear-gradient(135deg,#FFF0F0,#FEE2E2)',
            border: '#FCA5A5',
            icon: <CurrencyExchangeIcon sx={{ fontSize: 28, color: '#DC2626' }} />
          },
          {
            label: 'FEES & REFUNDS',
            value: `-$${(financialTotals.totalProcessingFees + financialTotals.totalRefunds + financialTotals.totalDiscounts).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            sub: 'Gateway fees & refunds',
            color: '#B45309', bg: 'linear-gradient(135deg,#FFFDF0,#FEF3C7)',
            border: '#FCD34D',
            icon: <CreditCardIcon sx={{ fontSize: 28, color: '#D97706' }} />
          },
          {
            label: 'NET GROSS PROFIT',
            value: `+$${financialTotals.totalGrossProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            sub: `Avg Margin: ${financialTotals.avgMarginPct}%`,
            color: '#1D4ED8', bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
            border: '#93C5FD',
            icon: <CalculateIcon sx={{ fontSize: 28, color: '#2563EB' }} />
          },
        ].map((card) => (
          <Paper key={card.label} elevation={0} sx={{
            p: { xs: 2, sm: 2.5 },
            border: `1.5px solid ${card.border}`,
            borderRadius: 3,
            background: card.bg,
            display: 'flex', flexDirection: 'column', gap: 0.5,
            transition: 'transform 0.15s, box-shadow 0.15s',
            '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: { xs: '0.6rem', sm: '0.68rem' }, letterSpacing: 0.5 }}>
                {card.label}
              </Typography>
              {card.icon}
            </Box>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.15rem', sm: '1.5rem' }, color: card.color, lineHeight: 1.1 }}>
              {card.value}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: card.color, opacity: 0.8, fontSize: '0.68rem' }}>
              {card.sub}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Main Tabs Area */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                fontSize: { xs: '0.75rem', sm: '0.85rem' },
                fontWeight: 900,
                textTransform: 'none',
                minHeight: 42,
              },
            }}
          >
            <Tab
              label="📊 PROFITABILITY LEDGER"
              value="PROFITABILITY"
              icon={<CalculateIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              label="⚡ WEBHOOK AUTOMATION"
              value="WEBHOOKS"
              icon={<FlashOnIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              label="💳 PAYMENT LINKS"
              value="PIPELINE"
              icon={<MonetizationOnIcon fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* ─── TAB 1: BOOKING FINANCIAL RECORDS & PROFITABILITY ─── */}
        {activeTab === 'PROFITABILITY' && (
          <Box>
            {/* Security Alert Banner */}
            <Alert severity="info" icon={<LockIcon />} sx={{ mb: 2.5, borderRadius: 2, fontWeight: 700, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              <b>🔒 Payment Confirmation Rule:</b> Payment status updates are strictly driven by signed Payment Provider Webhook events.
            </Alert>

            {/* Filter controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search Booking ID, PNR, Customer, Invoice #..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                sx={{ width: { xs: '100%', md: 360 } }}
              />
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220 } }}>
                <InputLabel>Payment Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Payment Status Filter"
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All 10 Payment Statuses</MenuItem>
                  {PAYMENT_STATUSES.map(st => (
                    <MenuItem key={st} value={st} sx={{ fontSize: '0.8rem', fontWeight: 700 }}>
                      {st}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Table */}
            <Box sx={{ overflowX: 'auto', width: '100%' }}>
              <AppTable
                columns={financialColumns}
                data={filteredFinancialRecords}
                count={filteredFinancialRecords.length}
                page={0}
                rowsPerPage={25}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                hidePagination
              />
            </Box>
          </Box>
        )}

        {/* ─── TAB 2: LIVE PAYMENT PROVIDER WEBHOOK AUTOMATION & EVENT LOG ─── */}
        {activeTab === 'WEBHOOKS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justify: 'space-between', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlashOnIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    ⚡ PAYMENT PROVIDER WEBHOOK EVENT SIMULATOR
                  </Typography>
                </Box>
                <Chip size="small" label="PROVIDER HMAC-SHA256 SIGNATURE ENFORCED" color="success" sx={{ fontWeight: 900, fontSize: '0.65rem' }} />
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click below to simulate incoming signed webhook payloads from Stripe/Telnyx/SWIFT. Notice how booking status updates automatically from validated events:
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<FlashOnIcon />}
                  onClick={() => handleSimulateWebhook('payment_intent.succeeded', 'Payment Successful', 'BK-1001')}
                  sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                  ⚡ Simulate "payment_intent.succeeded" (Payment Successful)
                </Button>

                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<FlashOnIcon />}
                  onClick={() => handleSimulateWebhook('charge.dispute.created', 'Chargeback', 'BK-1001')}
                  sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                  ⚡ Simulate "charge.dispute.created" (Chargeback)
                </Button>

                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  startIcon={<FlashOnIcon />}
                  onClick={() => handleSimulateWebhook('charge.refund.updated', 'Partially Refunded', 'BK-1001')}
                  sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                  ⚡ Simulate "charge.refund.updated" (Partially Refunded)
                </Button>

                <Button
                  variant="outlined"
                  color="warning"
                  size="small"
                  startIcon={<FlashOnIcon />}
                  onClick={() => handleSimulateWebhook('payment_intent.payment_failed', 'Payment Failed', 'BK-1001')}
                  sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                  ⚡ Simulate "payment_intent.failed" (Payment Failed)
                </Button>

                <Button
                  variant="outlined"
                  color="info"
                  size="small"
                  startIcon={<FlashOnIcon />}
                  onClick={() => handleSimulateWebhook('payment.partially_paid', 'Partially Paid', 'BK-1001')}
                  sx={{ fontWeight: 800, textTransform: 'none' }}
                >
                  ⚡ Simulate "payment.partially_paid" (Partially Paid)
                </Button>
              </Box>
            </Paper>

            {/* Webhook Event Feed Log Table */}
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              📜 LIVE PROVIDER WEBHOOK AUDIT TRAIL LOG ({webhookLogs.length} Events Received)
            </Typography>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflowX: 'auto', width: '100%' }}>
              <AppTable
                columns={[
                  { id: 'id', label: 'Event ID', render: r => <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary.main' }}>{r.id}</Typography> },
                  { id: 'type', label: 'Provider Event Type', render: r => <Chip size="small" label={r.type} sx={{ fontFamily: 'monospace', height: 18, fontSize: '0.65rem', fontWeight: 800 }} /> },
                  { id: 'bookingRef', label: 'Booking Ref', render: r => <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 800 }}>{r.bookingRef} ({r.pnr})</Typography> },
                  { id: 'statusResult', label: 'Resulting Payment Status', render: r => renderPaymentStatusChip(r.statusResult, r) },
                  { id: 'sigStatus', label: 'Signature Validation', render: r => <Chip size="small" label={r.sigStatus} color="success" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} /> },
                  { id: 'timestamp', label: 'Received Time', render: r => <Typography variant="caption" color="text.secondary">{r.timestamp}</Typography> },
                ]}
                data={webhookLogs}
                count={webhookLogs.length}
                page={0}
                rowsPerPage={20}
                onPageChange={() => {}}
                onRowsPerPageChange={() => {}}
                hidePagination
              />
            </Paper>
          </Box>
        )}

        {/* ─── TAB 3: LIVE PAYMENT PIPELINE & CHARGEBACK RADAR ─── */}
        {activeTab === 'PIPELINE' && (
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 1.5, mb: 3 }}>
              {pipelineLinks.map((item, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: item.highlight ? '2px solid #10B981' : '1px solid #E2E8F0',
                    bgcolor: item.bg,
                    boxShadow: item.highlight ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    {renderPaymentStatusChip(item.status, item)}
                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>{item.amount}</Typography>
                  </Box>

                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.customer}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px dashed rgba(0,0,0,0.1)' }}>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.68rem', color: 'text.secondary' }}>
                      {item.link.replace('https://', '')}
                    </Typography>
                    <Tooltip title="Copy Link">
                      <IconButton size="small" onClick={() => handleCopyLink(item.link)}>
                        <ContentCopyIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Box>
        )}
      </Paper>

      {/* ─── READ-ONLY PAYMENT STATUS ATTEMPT DIALOG ─── */}
      <Dialog
        open={manualAttemptModalOpen}
        onClose={() => setManualAttemptModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
          <LockIcon color="warning" />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Read-Only Payment Confirmation
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            <b>Security & Audit Compliance Rule:</b> Manual status editing by browser or agent is disabled.
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
            Payment confirmations (Payment Successful, Chargeback, Refunded, etc.) are strictly driven by signed Payment Provider Webhook events (Stripe, SWIFT, Telnyx).
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontFamily: 'monospace' }}>
            HMAC-SHA256 Signature Verified 🛡️
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button variant="contained" color="primary" onClick={() => setManualAttemptModalOpen(false)} sx={{ fontWeight: 800 }}>
            Understood
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── COMPLETE BOOKING FINANCIAL RECORD & PROFITABILITY AUDIT MODAL ─── */}
      <Dialog
        open={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        {selectedRecord && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalculateIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  Financial Record & Profitability Audit — {selectedRecord.id} ({selectedRecord.pnr})
                </Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelectedRecord(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
              {/* Formula Calculation Summary Banner */}
              <Paper elevation={0} sx={{ p: 2.5, mb: 3, bgcolor: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#166534', mb: 1 }}>
                  📐 PROFITABILITY BREAKDOWN (FORMULA RESULTS)
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(5, 1fr)' }, gap: 1, textAlign: 'center', fontSize: '0.8rem' }}>
                  <Paper elevation={0} sx={{ p: 1, bg: '#FFF', border: '1px solid #CBD5E1', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Customer Price</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#16A34A' }}>
                      +${selectedRecord.customerPrice.toLocaleString()}
                    </Typography>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 1, bg: '#FFF', border: '1px solid #CBD5E1', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Supplier Cost</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#DC2626' }}>
                      -${selectedRecord.supplierCost.toLocaleString()}
                    </Typography>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 1, bg: '#FFF', border: '1px solid #CBD5E1', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Processing Fee</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#D97706' }}>
                      -${selectedRecord.processingFee.toFixed(2)}
                    </Typography>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 1, bg: '#FFF', border: '1px solid #CBD5E1', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>Refunds/Discounts</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 900, color: '#9333EA' }}>
                      -${(selectedRecord.refunds + selectedRecord.discounts).toFixed(2)}
                    </Typography>
                  </Paper>

                  <Paper elevation={0} sx={{ p: 1, bg: '#EFF6FF', border: '2px solid #2563EB', borderRadius: 1.5 }}>
                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 900, display: 'block' }}>GROSS PROFIT</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1D4ED8' }}>
                      +${selectedRecord.grossProfit.toLocaleString()} ({selectedRecord.profitMarginPct}%)
                    </Typography>
                  </Paper>
                </Box>
              </Paper>

              {/* Verified Webhook Audit Header */}
              <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Provider Webhook Signature:</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'success.main' }}>
                      🛡️ {selectedRecord.webhookSignature} (Event ID: {selectedRecord.webhookEventId})
                    </Typography>
                  </Box>
                  {renderPaymentStatusChip(selectedRecord.paymentStatus, selectedRecord)}
                </Box>
              </Paper>

              {/* 10 Mandatory Tracking Elements Section */}
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2, color: 'primary.main' }}>
                📋 10 MANDATORY FINANCIAL TRACKING ELEMENTS
              </Typography>

              <Grid container spacing={2}>
                {/* 1. Invoice */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>1. Invoice Details</Typography>
                      {renderPaymentStatusChip(selectedRecord.invoice.status, selectedRecord)}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Invoice Ref: <b>{selectedRecord.invoice.id}</b> · Date: {selectedRecord.invoice.issueDate}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
                      Invoiced Amount: {selectedRecord.invoice.amount}
                    </Typography>
                  </Paper>
                </Grid>

                {/* 2. Payment */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>2. Payment Tracking</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Method: <b>{selectedRecord.payment.method}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>
                      Paid Amount: {selectedRecord.payment.amountPaid} (Ref: {selectedRecord.payment.txnRef})
                    </Typography>
                  </Paper>
                </Grid>

                {/* 3. Refund */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>3. Refund Tracking</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Refund Status: <b>{selectedRecord.refund.status}</b> · Reason: {selectedRecord.refund.reason}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: selectedRecord.refunds > 0 ? 'error.main' : 'text.primary', mt: 0.5 }}>
                      Refund Amount: {selectedRecord.refund.amount}
                    </Typography>
                  </Paper>
                </Grid>

                {/* 4. Chargeback */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>4. Chargeback Protection</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Dispute Status: <b>{selectedRecord.chargeback.status}</b>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <Chip size="small" label={selectedRecord.chargeback.riskLevel} sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                      {selectedRecord.chargeback.eSignSigned && (
                        <Chip size="small" label="✓ E-Sign Auth Signed" color="success" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                      )}
                    </Box>
                  </Paper>
                </Grid>

                {/* 5. Supplier Payable */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>5. Supplier Payable (BSP Cost)</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Airline/Supplier: <b>{selectedRecord.supplierPayable.supplier}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'error.main', mt: 0.5 }}>
                      Net Cost Payable: {selectedRecord.supplierPayable.netAmount} (Due: {selectedRecord.supplierPayable.dueDate})
                    </Typography>
                  </Paper>
                </Grid>

                {/* 6. Commission */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>6. Gross Commission</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Commission Rate: <b>{selectedRecord.commission.rate}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>
                      Agency Gross Commission: {selectedRecord.commission.grossCommission}
                    </Typography>
                  </Paper>
                </Grid>

                {/* 7. Agent Commission */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>7. Agent Commission Share</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Assigned Agent: <b>{selectedRecord.agentCommission.agentName}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>
                      Agent Commission Payout: {selectedRecord.agentCommission.agentShare}
                    </Typography>
                  </Paper>
                </Grid>

                {/* 8. Markup */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>8. Markup Management</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Applied Markup %: <b>{selectedRecord.markup.pct}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main', mt: 0.5 }}>
                      Agency Price Markup: {selectedRecord.markup.amount}
                    </Typography>
                  </Paper>
                </Grid>

                {/* 9. Service Fee */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>9. Service Fee</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Type: <b>{selectedRecord.serviceFee.type}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', mt: 0.5 }}>
                      Fee Collected: {selectedRecord.serviceFee.amount}
                    </Typography>
                  </Paper>
                </Grid>

                {/* 10. Tax Management */}
                <Grid item xs={12} sm={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 0.5 }}>10. Tax Management</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      Breakdown: <b>{selectedRecord.tax.breakdown}</b>
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
                      Total Tax Collected: {selectedRecord.tax.amount}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button variant="contained" onClick={() => setSelectedRecord(null)} sx={{ fontWeight: 800 }}>
                Close Financial Record
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Payment Link Modal */}
      <PaymentLinkModal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} />

      {/* E-Sign Form Modal */}
      <ESignModal open={eSignModalOpen} onClose={() => setESignModalOpen(false)} />
    </Box>
  );
};

export default SuperAdminPaymentDashboard;
