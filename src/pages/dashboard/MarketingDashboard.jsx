import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import CampaignIcon from '@mui/icons-material/Campaign';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';
import LinkIcon from '@mui/icons-material/Link';
import LaunchIcon from '@mui/icons-material/Launch';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

// Recharts
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

// ==========================================
// MOCK DATASETS
// ==========================================

const INITIAL_MARKETING_KPIS = [
  { id: 'campaigns', title: 'Total Campaigns', value: '18 Active', change: '+4 this month', isUp: true, color: '#3F51B5', border: '#3F51B5', icon: <CampaignIcon /> },
  { id: 'leads', title: 'Total Leads', value: '3,450', change: '+18.4% MoM', isUp: true, color: '#2563EB', border: '#2563EB', icon: <PeopleAltIcon /> },
  { id: 'qualified', title: 'Qualified Leads', value: '2,180', change: '63.2% qual rate', isUp: true, color: '#0284C7', border: '#0284C7', icon: <CheckCircleIcon /> },
  { id: 'quotes', title: 'Quotes Sent', value: '1,420', change: '65.1% quote rate', isUp: true, color: '#7C3AED', border: '#7C3AED', icon: <RequestQuoteIcon /> },
  { id: 'bookings', title: 'Confirmed Bookings', value: '680', change: '47.8% close rate', isUp: true, color: '#059669', border: '#059669', icon: <AirplaneTicketIcon /> },
  { id: 'revenue', title: 'Revenue Generated', value: '$842,500', change: 'Avg $1,238/bkg', isUp: true, color: '#059669', border: '#059669', icon: <MonetizationOnIcon /> },
  { id: 'profit', title: 'Gross Profit', value: '$146,800', change: '17.4% margin', isUp: true, color: '#C59B27', border: '#C59B27', icon: <AccountBalanceWalletIcon /> },
  { id: 'roi', title: 'ROI Percentage', value: '384.5%', change: '$3.84 return / $1 spent', isUp: true, color: '#059669', border: '#059669', icon: <TrendingUpIcon /> },
  { id: 'cpl', title: 'Cost Per Lead (CPL)', value: '$14.20', change: '-8.2% cost drop', isUp: false, color: '#D97706', border: '#D97706', icon: <PriceCheckIcon /> },
  { id: 'cpb', title: 'Cost Per Booking (CPB)', value: '$72.05', change: 'Profitable target < $90', isUp: false, color: '#059669', border: '#059669', icon: <PriceCheckIcon /> }
];

const JOURNEY_FUNNEL_STAGES = [
  { stage: '1. Campaign Impressions', count: '124,500 Clicks', conv: '100%', rev: '$0', profit: '$0', drop: '97.2% drop to lead', color: '#3F51B5' },
  { stage: '2. Total Leads Generated', count: '3,450 Leads', conv: '2.78%', rev: '$0', profit: '$0', drop: '36.8% drop to qual', color: '#2563EB' },
  { stage: '3. Qualified Leads', count: '2,180 Qual', conv: '63.2%', rev: '$0', profit: '$0', drop: '34.9% drop to quote', color: '#0284C7' },
  { stage: '4. Quotes Issued', count: '1,420 Quotes', conv: '65.1%', rev: '$1,760,000 Potential', profit: '$308,000 Potential', drop: '52.2% drop to bkg', color: '#7C3AED' },
  { stage: '5. Confirmed Bookings', count: '680 Bookings', conv: '47.8%', rev: '$842,500', profit: '$146,800', drop: 'Final Converters', color: '#059669' },
  { stage: '6. Net Profit & ROI', count: 'ROI 384.5%', conv: '17.4% Margin', rev: '$842,500 Revenue', profit: '$146,800 Gross Profit', drop: 'Profit / Bkg: $215.88', color: '#C59B27' }
];

const INITIAL_CAMPAIGNS = [
  { id: 'CMP-001', name: 'Summer Europe Business Class Flight Sale', platform: 'Google Ads', status: 'Active', budget: 15000, spend: 12400, leads: 840, qualLeads: 580, bookings: 195, revenue: 268000, grossProfit: 48500, roi: 391.1, cpl: 14.76, cpb: 63.59, profitPerBkg: 248.71, utmSource: 'google', utmMedium: 'cpc', utmCampaign: 'summer_europe_sale_2026', landingPage: '/flights/europe-summer-sale' },
  { id: 'CMP-002', name: 'Dubai Luxury First Class Concierge Promo', platform: 'Meta (FB/IG)', status: 'Active', budget: 12000, spend: 9800, leads: 620, qualLeads: 410, bookings: 140, revenue: 215000, grossProfit: 38200, roi: 389.7, cpl: 15.80, cpb: 70.00, profitPerBkg: 272.85, utmSource: 'facebook', utmMedium: 'paid_social', utmCampaign: 'dubai_luxury_first_class', landingPage: '/luxury-first-class' },
  { id: 'CMP-003', name: 'Manila & Asia Balikbayan Family Specials', platform: 'WhatsApp Ads', status: 'Active', budget: 8000, spend: 6400, leads: 590, qualLeads: 420, bookings: 160, revenue: 148000, grossProfit: 24600, roi: 384.3, cpl: 10.84, cpb: 40.00, profitPerBkg: 153.75, utmSource: 'whatsapp_api', utmMedium: 'direct_msg', utmCampaign: 'balikbayan_special_2026', landingPage: '/flights/asia-balikbayan' },
  { id: 'CMP-004', name: 'London Heathrow Flash Discount Code', platform: 'Instagram', status: 'Active', budget: 6000, spend: 5200, leads: 480, qualLeads: 290, bookings: 85, revenue: 94000, grossProfit: 15800, roi: 303.8, cpl: 10.83, cpb: 61.17, profitPerBkg: 185.88, utmSource: 'instagram', utmMedium: 'paid_social', utmCampaign: 'lhr_flash_discount', landingPage: '/flights/london-heathrow' },
  { id: 'CMP-005', name: 'TikTok Travel Influencer Deal Blast', platform: 'TikTok Ads', status: 'Paused', budget: 5000, spend: 4100, leads: 390, qualLeads: 180, bookings: 40, revenue: 42000, grossProfit: 6800, roi: 165.8, cpl: 10.51, cpb: 102.50, profitPerBkg: 170.00, utmSource: 'tiktok', utmMedium: 'influencer_video', utmCampaign: 'tiktok_travel_hacks', landingPage: '/flights/tiktok-deals' }
];

const LANDING_PAGES_DATA = [
  { url: '/flights/europe-summer-sale', visitors: 42500, leads: 840, conv: '1.98%', bookings: 195, revenue: '$268,000', grossProfit: '$48,500', roi: '391%' },
  { url: '/luxury-first-class', visitors: 28400, leads: 620, conv: '2.18%', bookings: 140, revenue: '$215,000', grossProfit: '$38,200', roi: '389%' },
  { url: '/flights/asia-balikbayan', visitors: 31200, leads: 590, conv: '1.89%', bookings: 160, revenue: '$148,000', grossProfit: '$24,600', roi: '384%' },
  { url: '/flights/london-heathrow', visitors: 19800, leads: 480, conv: '2.42%', bookings: 85, revenue: '$94,000', grossProfit: '$15,800', roi: '303%' }
];

const REFERRAL_SOURCES_DATA = [
  { channel: 'Google Ads Search', leads: 840, bookings: 195, revenue: '$268,000', profit: '$48,500', convRate: '23.2%' },
  { channel: 'Facebook & Instagram Paid', leads: 1100, bookings: 225, revenue: '$309,000', profit: '$54,000', convRate: '20.4%' },
  { channel: 'WhatsApp Marketing API', leads: 590, bookings: 160, revenue: '$148,000', profit: '$24,600', convRate: '27.1%' },
  { channel: 'Organic Google Search (SEO)', leads: 410, bookings: 55, revenue: '$68,500', profit: '$12,400', convRate: '13.4%' },
  { channel: 'Direct / Bookmark Traffic', leads: 320, bookings: 45, revenue: '$45,000', profit: '$7,300', convRate: '14.0%' }
];

const INITIAL_AUTOMATION_WORKFLOWS = [
  { id: 'WF-101', name: 'Instant Lead Assignment & WhatsApp Welcome', trigger: 'New Flight Inquiry Created', condition: 'Lead Score >= 50', action: 'Assign Agent + Send WhatsApp Template + Create Follow-up Task', delay: 'Immediate (0m)', status: true, executedCount: 1420 },
  { id: 'WF-102', name: 'Quote Expiry & 24h Price Re-Check Alert', trigger: 'Quote Issued > 24 Hours Unpaid', condition: 'Flight Departure < 14 Days', action: 'Send Price Hold Reminder SMS & WhatsApp Discount Coupon', delay: '24 Hours', status: true, executedCount: 890 },
  { id: 'WF-103', name: 'Pre-Departure Flight Itinerary & Gate Alert', trigger: 'Flight Departure in 48 Hours', condition: 'Ticket Issued == TRUE', action: 'Send Web Check-in Link + E-ticket PDF + Weather Briefing', delay: '48 Hours Before Flight', status: true, executedCount: 650 },
  { id: 'WF-104', name: 'Post-Travel Feedback & Google Review Request', trigger: 'Return Flight Arrival + 24 Hours', condition: 'Booking Status == COMPLETED', action: 'Send NPS Survey Email + $50 Voucher for Next Booking', delay: '24 Hours Post Return', status: true, executedCount: 420 },
  { id: 'WF-105', name: 'Abandoned Cart / Unfinished Flight Search Recovery', trigger: 'Search Form Completed without Quote', condition: 'Email Captured == TRUE', action: 'Send Retargeting Email with Live Airline Price Comparison', delay: '2 Hours', status: false, executedCount: 210 }
];

const INITIAL_AUTOMATION_LOGS = [
  { id: 'LOG-801', workflowName: 'Instant Lead Assignment & WhatsApp Welcome', triggerTime: '2026-08-20 13:45:12', customer: 'Dr. Harrison Wells', action: 'WhatsApp Welcome Template & Agent Reassigned to Sarah J.', status: 'Success' },
  { id: 'LOG-802', workflowName: 'Quote Expiry & 24h Price Re-Check Alert', triggerTime: '2026-08-20 13:20:04', customer: 'Amelia Earhart', action: 'SMS Reminder Sent: Quote Q-9918 expires in 4 hours', status: 'Success' },
  { id: 'LOG-803', workflowName: 'Pre-Departure Flight Itinerary & Gate Alert', triggerTime: '2026-08-20 12:10:33', customer: 'Marcus Vance', action: 'E-Ticket PDF & Boarding Pass link sent via Email', status: 'Success' },
  { id: 'LOG-804', workflowName: 'Abandoned Cart Recovery', triggerTime: '2026-08-20 11:05:00', customer: 'David Blaine', action: 'Failed to send WhatsApp (Invalid Phone Number)', status: 'Failed' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function MarketingDashboard() {
  const { showAlert } = useAlert();
  const [currentTab, setCurrentTab] = useState(0);

  // States
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [workflows, setWorkflows] = useState(INITIAL_AUTOMATION_WORKFLOWS);
  const [automationLogs, setAutomationLogs] = useState(INITIAL_AUTOMATION_LOGS);

  // Filters
  const [searchCampaign, setSearchCampaign] = useState('');
  const [platformFilter, setPlatformFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [utmModalOpen, setUtmModalOpen] = useState(false);
  const [selectedUtmCampaign, setSelectedUtmCampaign] = useState(null);

  const [newWorkflowModalOpen, setNewWorkflowModalOpen] = useState(false);
  const [workflowForm, setWorkflowForm] = useState({
    name: '',
    trigger: 'New Flight Inquiry Created',
    condition: 'All Leads',
    action: 'Send WhatsApp + Send Email',
    delay: 'Immediate (0m)'
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleInspectUTM = (campaign) => {
    setSelectedUtmCampaign(campaign);
    setUtmModalOpen(true);
  };

  const handleToggleWorkflow = (id) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, status: !w.status } : w));
    const target = workflows.find(w => w.id === id);
    showAlert(`Workflow "${target.name}" status updated to ${!target.status ? 'ACTIVE' : 'PAUSED'}`, 'info');
  };

  const handleCreateWorkflow = () => {
    if (!workflowForm.name) {
      showAlert('Please enter a workflow name', 'warning');
      return;
    }
    const newWf = {
      id: `WF-${Math.floor(100 + Math.random() * 900)}`,
      name: workflowForm.name,
      trigger: workflowForm.trigger,
      condition: workflowForm.condition,
      action: workflowForm.action,
      delay: workflowForm.delay,
      status: true,
      executedCount: 0
    };
    setWorkflows([newWf, ...workflows]);
    setNewWorkflowModalOpen(false);
    showAlert(`✓ Marketing Automation Workflow "${workflowForm.name}" created successfully!`, 'success');
  };

  const handleRetryLog = (logId) => {
    setAutomationLogs(prev => prev.map(l => l.id === logId ? { ...l, status: 'Success', action: 'Retried manually: WhatsApp resent successfully' } : l));
    showAlert(`✓ Workflow execution ${logId} retried and completed successfully!`, 'success');
  };

  const handleExportCSV = () => {
    try {
      let csvContent = "data:text/csv;charset=utf-8,Campaign Name,Platform,Status,Budget,Spend,Leads,Qualified,Bookings,Revenue,Gross Profit,ROI %\n";
      campaigns.forEach(c => {
        csvContent += `"${c.name}","${c.platform}","${c.status}",${c.budget},${c.spend},${c.leads},${c.qualLeads},${c.bookings},${c.revenue},${c.grossProfit},${c.roi}%\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `marketing_roi_report_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showAlert("✓ Comprehensive Marketing ROI & Profit Report exported to CSV!", "success");
    } catch (e) {
      showAlert("Failed to export report", "error");
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchCampaign.toLowerCase()) || c.platform.toLowerCase().includes(searchCampaign.toLowerCase());
      const matchesPlatform = platformFilter === 'ALL' || c.platform.toLowerCase().includes(platformFilter.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [campaigns, searchCampaign, platformFilter, statusFilter]);

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Marketing Header */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.5 }, px: { xs: 2, sm: 3 }, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1.5, flexWrap: 'wrap', minWidth: 0, width: '100%' }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 }, fontWeight: 900, fontSize: { xs: '0.9rem', sm: '1.1rem' }, boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            MKT
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif', fontSize: { xs: '1.05rem', sm: '1.35rem' }, lineHeight: 1.2 }}>
                Marketing ROI & Automation Command Center
              </Typography>
              <Chip label="ROLE: MARKETING MANAGER" size="small" sx={{ fontWeight: 900, fontSize: '0.65rem', bgcolor: '#3F51B5', color: '#FFF', height: 22 }} />
              <Chip label="ATTRIBUTION & PROFIT ANALYTICS" size="small" variant="outlined" color="secondary" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 22 }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              End-to-End Customer Journey Attribution: From Campaign Ad Click to Gross Profit & ROI
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <Button variant="contained" color="secondary" startIcon={<FileDownloadIcon />} onClick={handleExportCSV} sx={{ fontWeight: 800, width: { xs: '100%', sm: 'auto' } }}>
            Export Marketing ROI CSV
          </Button>
          <DualClock client={{ timezone: 'America/New_York', label: 'Campaign Time (EST)' }} />
        </Box>
      </Paper>

      {/* 10 MARKETING KPI CARDS */}
      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)', xl: 'repeat(5, 1fr)' }, gap: 1.5 }}>
          {INITIAL_MARKETING_KPIS.map((kpi) => (
            <Paper
              key={kpi.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.palette.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.06)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: kpi.border
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem' }}>
                  {kpi.title}
                </Typography>
                <Box sx={{ p: 0.6, borderRadius: 1.5, bgcolor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                  {kpi.value}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: kpi.border, fontSize: '0.65rem' }}>
                  {kpi.change}
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* FULL CUSTOMER JOURNEY CONVERSION FUNNEL */}
      <Paper elevation={0} sx={{ p: 3, mb: 3.5, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon color="primary" />
              Full Customer Journey Conversion Funnel (Ad Click → Gross Profit)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time funnel conversion metrics showing volume drop-offs, quote transitions, and actual net profitability
            </Typography>
          </Box>
          <Chip label="Net Marketing ROI: 384.5%" color="success" sx={{ fontWeight: 900 }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 1.5 }}>
          {JOURNEY_FUNNEL_STAGES.map((stg, index) => (
            <Paper key={stg.stage} variant="outlined" sx={{ p: 2, borderRadius: 2.5, bgcolor: '#F8FAFC', borderTop: `4px solid ${stg.color}` }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.5, fontSize: '0.68rem' }}>
                {stg.stage}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                {stg.count}
              </Typography>
              <Box sx={{ my: 1, py: 0.5, px: 1, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: stg.color, display: 'block' }}>
                  Stage Conv: {stg.conv}
                </Typography>
                {stg.rev !== '$0' && (
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', display: 'block' }}>
                    Rev: {stg.rev}
                  </Typography>
                )}
                {stg.profit !== '$0' && (
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#C59B27', display: 'block' }}>
                    Profit: {stg.profit}
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontSize: '0.62rem' }}>
                📉 {stg.drop}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* DASHBOARD MODULE TABS */}
      <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              fontWeight: 800,
              fontSize: '0.78rem',
              py: 1.8,
              minHeight: 48,
              textTransform: 'none'
            }
          }}
        >
          <Tab label={`1. Campaign Tracking & ROI (${filteredCampaigns.length})`} icon={<CampaignIcon fontSize="small" />} iconPosition="start" />
          <Tab label="2. Mandatory UTM Attribution Ledger" icon={<LinkIcon fontSize="small" />} iconPosition="start" />
          <Tab label="3. Revenue & Profit Analytics" icon={<MonetizationOnIcon fontSize="small" />} iconPosition="start" />
          <Tab label="4. Landing Page Performance" icon={<LaunchIcon fontSize="small" />} iconPosition="start" />
          <Tab label="5. Referral Channel Tracking" icon={<FilterAltIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`6. Automation Workflows (${workflows.filter(w => w.status).length} Active)`} icon={<AutoFixHighIcon fontSize="small" />} iconPosition="start" />
          <Tab label={`7. Automation Logs (${automationLogs.length})`} icon={<HistoryIcon fontSize="small" />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* ========================================================= */}
      {/* TAB 1: CAMPAIGN TRACKING & MANAGEMENT LEDGER */}
      {/* ========================================================= */}
      {currentTab === 0 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5' }}>
                Campaign ROI & Profit Performance Ledger
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track exact ad spend, leads generated, confirmed bookings, gross profit, and profit per booking
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search campaign or platform..."
                value={searchCampaign}
                onChange={e => setSearchCampaign(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                sx={{ width: 260 }}
              />

              <FormControl size="small" sx={{ width: 140 }}>
                <InputLabel>Platform</InputLabel>
                <Select value={platformFilter} label="Platform" onChange={e => setPlatformFilter(e.target.value)}>
                  <MenuItem value="ALL">All Platforms</MenuItem>
                  <MenuItem value="Google">Google Ads</MenuItem>
                  <MenuItem value="Meta">Meta (FB/IG)</MenuItem>
                  <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                  <MenuItem value="TikTok">TikTok</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ width: 130 }}>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={e => setStatusFilter(e.target.value)}>
                  <MenuItem value="ALL">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Paused">Paused</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Campaign Name & ID</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Platform</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Ad Spend</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Leads / Qual</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Bookings</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Revenue</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Gross Profit</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>ROI %</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Profit / Bkg</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>UTM Attribution</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCampaigns.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>{c.name}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{c.id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={c.platform} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={c.status} size="small" color={c.status === 'Active' ? 'success' : 'default'} sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>${c.spend.toLocaleString()}</Typography>
                      <Typography variant="caption" color="text.secondary">Budget: ${c.budget.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{c.leads} Total</Typography>
                      <Typography variant="caption" sx={{ color: '#0284C7', fontWeight: 700 }}>{c.qualLeads} Qual</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#059669' }}>{c.bookings}</Typography>
                      <Typography variant="caption" color="text.secondary">CPB: ${c.cpb}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#059669' }}>${c.revenue.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 900, color: '#C59B27' }}>${c.grossProfit.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={`${c.roi}%`} size="small" color="success" sx={{ fontWeight: 900, fontSize: '0.72rem' }} />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669' }}>${c.profitPerBkg}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" color="primary" onClick={() => handleInspectUTM(c)} sx={{ fontSize: '0.68rem', fontWeight: 800 }}>
                        Inspect UTM
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MANDATORY UTM ATTRIBUTION LEDGER */}
      {/* ========================================================= */}
      {currentTab === 1 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563EB', display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon color="primary" />
                Mandatory Marketing Attribution & UTM Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attribution tracking fields captured per lead and maintained permanently through ticket issuance
              </Typography>
            </Box>
            <Chip label="8 Attribution Parameters Tracked" color="primary" sx={{ fontWeight: 800 }} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 2.5 }}>
            {campaigns.map((c) => (
              <Paper key={c.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#F8FAFC' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                    {c.name} ({c.id})
                  </Typography>
                  <Chip label={c.platform} size="small" color="primary" sx={{ fontWeight: 800 }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 0.8, fontSize: 13, p: 2, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #E2E8F0', mb: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>UTM Source:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#2563EB', fontFamily: 'monospace' }}>{c.utmSource}</Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>UTM Medium:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#0284C7', fontFamily: 'monospace' }}>{c.utmMedium}</Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>UTM Campaign:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#7C3AED', fontFamily: 'monospace' }}>{c.utmCampaign}</Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>Landing Page URL:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#059669', fontFamily: 'monospace' }}>{c.landingPage}</Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>Referral Channel:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>{c.platform} Direct API</Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>Ad ID Reference:</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>AD-99481204</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Attributed Revenue: <b>${c.revenue.toLocaleString()}</b> • Gross Profit: <b>${c.grossProfit.toLocaleString()}</b>
                  </Typography>
                  <Button size="small" variant="contained" color="primary" onClick={() => handleInspectUTM(c)} sx={{ fontWeight: 800 }}>
                    View Full Attribution
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 3: REVENUE & PROFIT ANALYTICS */}
      {/* ========================================================= */}
      {currentTab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                📊 REVENUE VS GROSS PROFIT BY CAMPAIGN ($)
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={campaigns}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Line type="monotone" dataKey="grossProfit" name="Gross Profit ($)" stroke="#C59B27" strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 2 }}>
                💎 MARKETING ROI (%) BY AD PLATFORM
              </Typography>
              <Box sx={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={campaigns}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="platform" width={100} />
                    <RechartsTooltip />
                    <Bar dataKey="roi" name="ROI %" fill="#059669" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Box>
        </Box>
      )}

      {/* ========================================================= */}
      {/* TAB 4: LANDING PAGE PERFORMANCE */}
      {/* ========================================================= */}
      {currentTab === 3 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#059669', display: 'flex', alignItems: 'center', gap: 1 }}>
                <LaunchIcon color="success" />
                Landing Page Performance & Profitability
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track visitor traffic, lead conversion rates, and total revenue per landing page URL
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 850 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Landing Page URL</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Visitors</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Leads Generated</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Conversion Rate</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Bookings</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Revenue</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Gross Profit</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>ROI %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {LANDING_PAGES_DATA.map((lp) => (
                  <TableRow key={lp.url} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>
                        {lp.url}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800 }}>{lp.visitors.toLocaleString()}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800 }}>{lp.leads}</TableCell>
                    <TableCell align="center">
                      <Chip label={lp.conv} size="small" color="primary" sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, color: '#059669' }}>{lp.bookings}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: '#059669' }}>{lp.revenue}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: '#C59B27' }}>{lp.grossProfit}</TableCell>
                    <TableCell align="center">
                      <Chip label={lp.roi} size="small" color="success" sx={{ fontWeight: 900 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 5: REFERRAL CHANNEL TRACKING */}
      {/* ========================================================= */}
      {currentTab === 4 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', display: 'flex', alignItems: 'center', gap: 1 }}>
                <FilterAltIcon color="primary" />
                Referral Channel & Source Performance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Breakdown of traffic origins across Google Ads, Social, WhatsApp API, SEO, and Direct Bookings
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Referral Channel</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Leads</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Confirmed Bookings</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Lead-to-Booking Conv %</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Attributed Revenue</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800 }}>Attributed Profit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {REFERRAL_SOURCES_DATA.map((ref) => (
                  <TableRow key={ref.channel} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900 }}>{ref.channel}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800 }}>{ref.leads}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, color: '#059669' }}>{ref.bookings}</TableCell>
                    <TableCell align="center">
                      <Chip label={ref.convRate} size="small" color="primary" sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: '#059669' }}>{ref.revenue}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: '#C59B27' }}>{ref.profit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 6: MARKETING AUTOMATION WORKFLOW BUILDER */}
      {/* ========================================================= */}
      {currentTab === 5 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#7C3AED', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoFixHighIcon color="secondary" />
                Marketing Automation Workflow Center
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure automated triggers, conditions, WhatsApp/Email dispatches, and follow-up tasks
              </Typography>
            </Box>
            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setNewWorkflowModalOpen(true)} sx={{ fontWeight: 800 }}>
              Create New Workflow
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {workflows.map((wf) => (
              <Paper key={wf.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2.5, bgcolor: wf.status ? '#F0FDF4' : '#F8FAFC', borderColor: wf.status ? '#86EFAC' : '#CBD5E1' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                      {wf.name} ({wf.id})
                    </Typography>
                    <Chip label={`Executed ${wf.executedCount} times`} size="small" color="primary" sx={{ fontWeight: 800, fontSize: '0.68rem' }} />
                  </Box>
                  <FormControlLabel
                    control={<Switch checked={wf.status} onChange={() => handleToggleWorkflow(wf.id)} color="success" />}
                    label={<b>{wf.status ? 'ACTIVE' : 'PAUSED'}</b>}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 1.5, fontSize: 13, mb: 1.5 }}>
                  <Box sx={{ p: 1.2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>⚡ TRIGGER Event:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#3F51B5' }}>{wf.trigger}</Typography>
                  </Box>

                  <Box sx={{ p: 1.2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>🔍 CONDITION Filter:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{wf.condition}</Typography>
                  </Box>

                  <Box sx={{ p: 1.2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>🚀 ACTION Executed:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#059669' }}>{wf.action}</Typography>
                  </Box>

                  <Box sx={{ p: 1.2, bgcolor: '#FFFFFF', borderRadius: 1.5, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>⏱️ DELAY / Timer:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#D97706' }}>{wf.delay}</Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* TAB 7: AUTOMATION ACTIVITY LOG */}
      {/* ========================================================= */}
      {currentTab === 6 && (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: '#FFFFFF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#3F51B5', display: 'flex', alignItems: 'center', gap: 1 }}>
                <HistoryIcon color="primary" />
                Automation Execution & Audit Activity Log
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Audit real-time automated messages, email dispatches, and retry failed executions
              </Typography>
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 850 }}>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800 }}>Log ID & Timestamp</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Workflow Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Customer Name</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>Action Executed</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {automationLogs.map((log) => (
                  <TableRow key={log.id} hover sx={{ bgcolor: log.status === 'Failed' ? '#FEF2F2' : 'inherit' }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace' }}>{log.id}</Typography>
                      <Typography variant="caption" color="text.secondary">{log.triggerTime}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{log.workflowName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{log.customer}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 280 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{log.action}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={log.status} size="small" color={log.status === 'Success' ? 'success' : 'error'} sx={{ fontWeight: 800 }} />
                    </TableCell>
                    <TableCell align="center">
                      {log.status === 'Failed' && (
                        <Button size="small" variant="contained" color="error" onClick={() => handleRetryLog(log.id)} startIcon={<RefreshIcon />} sx={{ fontWeight: 800, fontSize: '0.68rem' }}>
                          Retry Execution
                        </Button>
                      )}
                      {log.status === 'Success' && (
                        <Typography variant="caption" sx={{ color: '#059669', fontWeight: 800 }}>
                          ✓ Dispatched
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}

      {/* 1. UTM ATTRIBUTION INSPECTOR MODAL */}
      <Dialog open={utmModalOpen} onClose={() => setUtmModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon /> Marketing Lead Attribution Details
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {selectedUtmCampaign && (
            <>
              <Box sx={{ p: 2, bgcolor: '#EFF6FF', borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  {selectedUtmCampaign.name} ({selectedUtmCampaign.id})
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                  Platform: <b>{selectedUtmCampaign.platform}</b> • Spend: <b>${selectedUtmCampaign.spend.toLocaleString()}</b>
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 1.2, fontSize: 13, p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>UTM Source:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#2563EB', fontFamily: 'monospace' }}>{selectedUtmCampaign.utmSource}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>UTM Medium:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#0284C7', fontFamily: 'monospace' }}>{selectedUtmCampaign.utmMedium}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>UTM Campaign:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#7C3AED', fontFamily: 'monospace' }}>{selectedUtmCampaign.utmCampaign}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>UTM Term / Keywords:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>cheap_first_class_flights_2026</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>UTM Content / Variant:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>banner_blue_v2_call_now</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>Landing Page URL:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#059669', fontFamily: 'monospace' }}>{selectedUtmCampaign.landingPage}</Typography>

                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>Ad ID Reference:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>AD-99481204</Typography>
              </Box>

              <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F0FDF4', borderColor: '#86EFAC', borderRadius: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block', mb: 0.5 }}>
                  💰 ATTRIBUTED PROFIT PERFORMANCE:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 900, color: '#059669' }}>
                  Confirmed Revenue: ${selectedUtmCampaign.revenue.toLocaleString()} | Gross Profit: ${selectedUtmCampaign.grossProfit.toLocaleString()} | ROI: {selectedUtmCampaign.roi}%
                </Typography>
              </Paper>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUtmModalOpen(false)} variant="contained" color="primary" sx={{ fontWeight: 800 }}>
            Close Inspector
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. CREATE WORKFLOW BUILDER MODAL */}
      <Dialog open={newWorkflowModalOpen} onClose={() => setNewWorkflowModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: 'secondary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoFixHighIcon /> Build Marketing Automation Workflow
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Workflow Name"
            size="small"
            placeholder="e.g. Abandoned Quote WhatsApp Retargeting"
            value={workflowForm.name}
            onChange={e => setWorkflowForm({ ...workflowForm, name: e.target.value })}
            fullWidth
          />

          <FormControl fullWidth size="small">
            <InputLabel>Trigger Event</InputLabel>
            <Select value={workflowForm.trigger} label="Trigger Event" onChange={e => setWorkflowForm({ ...workflowForm, trigger: e.target.value })}>
              <MenuItem value="New Flight Inquiry Created">New Flight Inquiry Created</MenuItem>
              <MenuItem value="Quote Issued > 24 Hours Unpaid">Quote Issued &gt; 24 Hours Unpaid</MenuItem>
              <MenuItem value="Flight Departure in 48 Hours">Flight Departure in 48 Hours</MenuItem>
              <MenuItem value="Return Flight Arrival + 24 Hours">Return Flight Arrival + 24 Hours</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Condition Filter</InputLabel>
            <Select value={workflowForm.condition} label="Condition Filter" onChange={e => setWorkflowForm({ ...workflowForm, condition: e.target.value })}>
              <MenuItem value="All Leads">All Leads</MenuItem>
              <MenuItem value="Lead Score >= 50">Lead Score &gt;= 50</MenuItem>
              <MenuItem value="Flight Departure < 14 Days">Flight Departure &lt; 14 Days</MenuItem>
              <MenuItem value="VIP Client Only">VIP Client Only</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Action Executed</InputLabel>
            <Select value={workflowForm.action} label="Action Executed" onChange={e => setWorkflowForm({ ...workflowForm, action: e.target.value })}>
              <MenuItem value="Send WhatsApp + Send Email">Send WhatsApp + Send Email</MenuItem>
              <MenuItem value="Assign Agent + Create Task">Assign Agent + Create Follow-up Task</MenuItem>
              <MenuItem value="Send SMS Price Hold Alert">Send SMS Price Hold Alert</MenuItem>
              <MenuItem value="Send NPS Review Survey">Send NPS Review Survey</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Delay / Execution Timer</InputLabel>
            <Select value={workflowForm.delay} label="Delay / Execution Timer" onChange={e => setWorkflowForm({ ...workflowForm, delay: e.target.value })}>
              <MenuItem value="Immediate (0m)">Immediate (0 minutes)</MenuItem>
              <MenuItem value="2 Hours">2 Hours</MenuItem>
              <MenuItem value="24 Hours">24 Hours</MenuItem>
              <MenuItem value="48 Hours">48 Hours</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setNewWorkflowModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleCreateWorkflow} variant="contained" color="secondary" sx={{ fontWeight: 800 }}>
            Save & Activate Workflow
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
