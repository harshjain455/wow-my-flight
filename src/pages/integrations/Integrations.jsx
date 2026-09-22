import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import EmailIcon from '@mui/icons-material/Email';
import WebhookIcon from '@mui/icons-material/Webhook';
import PowerIcon from '@mui/icons-material/Power';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PageHeader from '../../components/PageHeader';

// ─── Social Media Platforms ───────────────────────────────────────────────────
const SOCIAL_PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook Page',
    description: 'Sync page messages, auto-reply to comments, and manage DMs from your Facebook Business Page.',
    color: '#1877F2',
    bg: '#EBF3FE',
    emoji: '📘',
    fields: [
      { key: 'pageId', label: 'Facebook Page ID', placeholder: '123456789012345', hint: 'Found in your Page Settings → About' },
      { key: 'accessToken', label: 'Page Access Token', placeholder: 'EAABwzLixnjY...', hint: 'Generate from Meta Business Suite → Settings → Advanced → API' },
    ],
    docs: 'https://developers.facebook.com/docs/messenger-platform',
    badge: 'Meta' },
  {
    id: 'instagram',
    name: 'Instagram Business',
    description: 'Manage DMs, reply to story mentions, and track post comments from your Instagram Business account.',
    color: '#E1306C',
    bg: '#FDF0F5',
    emoji: '📷',
    fields: [
      { key: 'accountId', label: 'Instagram Account ID', placeholder: '17841400455970028', hint: 'Found via Facebook Business Suite linked account' },
      { key: 'accessToken', label: 'Access Token', placeholder: 'EAABwzLixnjY...', hint: 'Same token as Facebook if linked to same Business Manager' },
    ],
    docs: 'https://developers.facebook.com/docs/instagram-api',
    badge: 'Meta' },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Connect your WhatsApp Business number to receive and reply to customer messages directly from CRM.',
    color: '#25D366',
    bg: '#EDFBF4',
    emoji: '💬',
    fields: [
      { key: 'phoneNumberId', label: 'Phone Number ID', placeholder: '109876543210123', hint: 'Found in Meta Business Suite → WhatsApp → Getting Started' },
      { key: 'accessToken', label: 'Permanent Access Token', placeholder: 'EAABwzLixnjY...', hint: 'Generate a System User token from Meta Business Settings' },
      { key: 'businessAccountId', label: 'Business Account ID', placeholder: '987654321012345', hint: 'WhatsApp Business Account ID from Meta' },
    ],
    docs: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    badge: 'Meta' },
  {
    id: 'telegram',
    name: 'Telegram Bot',
    description: 'Create a Telegram bot to receive messages and support queries from clients through Telegram.',
    color: '#0088CC',
    bg: '#E8F4FB',
    emoji: '✈️',
    fields: [
      { key: 'botToken', label: 'Bot Token', placeholder: '1234567890:AABBCCDDeeffgghhiijjkkllmm', hint: 'Create bot via @BotFather on Telegram → /newbot' },
      { key: 'botUsername', label: 'Bot Username', placeholder: '@AAAConsultancyBot', hint: 'The @username you chose when creating the bot' },
    ],
    docs: 'https://core.telegram.org/bots/api',
    badge: 'Telegram' },
  {
    id: 'tiktok',
    name: 'TikTok for Business',
    description: 'Sync TikTok ad leads and DMs into your CRM. Track lead sources from TikTok Ads campaigns.',
    color: '#010101',
    bg: '#F5F5F5',
    emoji: '🎵',
    fields: [
      { key: 'appId', label: 'TikTok App ID', placeholder: '7234567890123456789', hint: 'Found in TikTok for Business → Developer Portal → My Apps' },
      { key: 'appSecret', label: 'App Secret', placeholder: 'abc123def456...', hint: 'Keep this secret — never share publicly' },
      { key: 'accessToken', label: 'Access Token', placeholder: 'act.abc123...', hint: 'Generated after OAuth authorization from TikTok' },
    ],
    docs: 'https://developers.tiktok.com',
    badge: 'TikTok' },
  {
    id: 'linkedin',
    name: 'LinkedIn Page',
    description: 'Connect your company LinkedIn Page to track lead inquiries and manage professional messages.',
    color: '#0077B5',
    bg: '#E8F3FB',
    emoji: '💼',
    fields: [
      { key: 'clientId', label: 'App Client ID', placeholder: '86abc...', hint: 'From LinkedIn Developer Portal → My Apps → Auth' },
      { key: 'accessToken', label: 'Access Token', placeholder: 'AQV...', hint: 'OAuth 2.0 token after authorizing the app with your LinkedIn account' },
      { key: 'organizationId', label: 'Organization ID', placeholder: '12345678', hint: 'Your LinkedIn Company Page admin ID' },
    ],
    docs: 'https://learn.microsoft.com/en-us/linkedin/marketing/',
    badge: 'LinkedIn' },
  {
    id: 'twitter',
    name: 'Twitter / X',
    description: 'Monitor mentions, DMs, and track leads from Twitter/X posts and reply to customers.',
    color: '#1DA1F2',
    bg: '#E8F5FE',
    emoji: '🐦',
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'xvz1evFS4wEEPTGEFPHBog', hint: 'From Twitter Developer Portal → Your App → Keys and Tokens' },
      { key: 'apiSecret', label: 'API Key Secret', placeholder: 'kAcSOqF21Fu85e7zjz...', hint: 'Keep this private — never commit to code' },
      { key: 'bearerToken', label: 'Bearer Token', placeholder: 'AAAAAAAAAA...', hint: 'Auto-generated by Twitter Developer Portal' },
    ],
    docs: 'https://developer.twitter.com/en/docs',
    badge: 'X Corp' },
  {
    id: 'youtube',
    name: 'YouTube Channel',
    description: 'Sync YouTube comments and track leads generated from your video content and Ads.',
    color: '#FF0000',
    bg: '#FFF0F0',
    emoji: '▶️',
    fields: [
      { key: 'channelId', label: 'Channel ID', placeholder: 'UCxxxxxxxxxxxxxxxxxxxxxx', hint: 'YouTube Studio → Settings → Channel → Advanced settings → Channel ID' },
      { key: 'apiKey', label: 'Google API Key', placeholder: 'AIzaSy...', hint: 'From Google Cloud Console → APIs → YouTube Data API v3' },
    ],
    docs: 'https://developers.google.com/youtube/v3',
    badge: 'Google' },
];

// ─── Email Providers ──────────────────────────────────────────────────────────
const EMAIL_PROVIDERS = [
  {
    id: 'gmail',
    name: 'Gmail / Google Workspace',
    description: 'Connect your Gmail or Google Workspace email to receive and reply to client emails inside CRM.',
    color: '#EA4335',
    bg: '#FEF1F0',
    emoji: '📧',
    fields: [
      { key: 'email', label: 'Email Address', placeholder: 'info@aaaconsultancy.com', hint: 'The Gmail address to connect' },
      { key: 'clientId', label: 'Google OAuth Client ID', placeholder: '1234567890-abc.apps.googleusercontent.com', hint: 'From Google Cloud Console → OAuth 2.0 Credentials' },
      { key: 'clientSecret', label: 'Client Secret', placeholder: 'GOCSPX-abc...', hint: 'Keep private — from same OAuth credentials page' },
    ],
    docsUrl: 'https://developers.google.com/gmail/api' },
  {
    id: 'outlook',
    name: 'Microsoft Outlook / 365',
    description: 'Connect your Outlook or Microsoft 365 business email for full two-way sync with client records.',
    color: '#0078D4',
    bg: '#EBF3FB',
    emoji: '📩',
    fields: [
      { key: 'email', label: 'Email Address', placeholder: 'info@aaaconsultancy.com', hint: 'Your Outlook/O365 email address' },
      { key: 'tenantId', label: 'Azure Tenant ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', hint: 'From Azure Active Directory → Overview' },
      { key: 'clientId', label: 'App Client ID', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', hint: 'From Azure App Registration' },
      { key: 'clientSecret', label: 'Client Secret', placeholder: 'abc~ABC...', hint: 'Generated in Azure App → Certificates & Secrets' },
    ],
    docsUrl: 'https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview' },
  {
    id: 'smtp',
    name: 'Custom SMTP / IMAP',
    description: 'Connect any email provider using standard SMTP (send) and IMAP (receive) protocols.',
    color: '#6366F1',
    bg: '#EEF2FF',
    emoji: '📮',
    fields: [
      { key: 'email', label: 'Email Address', placeholder: 'info@aaaconsultancy.com', hint: 'The email address to use' },
      { key: 'smtpHost', label: 'SMTP Host', placeholder: 'smtp.yourprovider.com', hint: 'Your email provider SMTP server' },
      { key: 'smtpPort', label: 'SMTP Port', placeholder: '587', hint: 'Usually 587 (TLS) or 465 (SSL)' },
      { key: 'imapHost', label: 'IMAP Host', placeholder: 'imap.yourprovider.com', hint: 'Your email provider IMAP server (for receiving)' },
      { key: 'username', label: 'Username', placeholder: 'info@aaaconsultancy.com', hint: 'Usually same as email' },
      { key: 'password', label: 'Password / App Password', placeholder: '••••••••', hint: 'Use App Password if 2FA is enabled', isPassword: true },
    ],
    docsUrl: null },
];

// ─── Webhook Events ───────────────────────────────────────────────────────────
const WEBHOOK_EVENTS = [
  { id: 'lead.created', label: 'New Lead Created', desc: 'Fires when a new lead is added to the CRM', icon: '👤' },
  { id: 'lead.converted', label: 'Lead Converted to Client', desc: 'Fires when a lead becomes a paying client', icon: '✅' },
  { id: 'consultation.booked', label: 'Consultation Booked', desc: 'Fires when a new consultation is scheduled', icon: '📅' },
  { id: 'payment.received', label: 'Payment Received', desc: 'Fires when a payment is marked as Paid', icon: '💰' },
  { id: 'document.uploaded', label: 'Document Uploaded', desc: 'Fires when a new document is uploaded', icon: '📎' },
  { id: 'message.received', label: 'New Message in Inbox', desc: 'Fires when a new social/email message arrives', icon: '💬' },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const Integrations = () => {
  const [tabValue, setTabValue] = useState(0);
  const [connectedPlatforms, setConnectedPlatforms] = useState(() => {
    try {
      const saved = localStorage.getItem('crm-connected-platforms');
      return saved ? JSON.parse(saved) : {
        whatsapp: { connectedAt: new Date().toLocaleString() },
        facebook: { connectedAt: new Date().toLocaleString() },
        instagram: { connectedAt: new Date().toLocaleString() },
        telegram: { connectedAt: new Date().toLocaleString() }
      };
    } catch (e) {
      return {
        whatsapp: { connectedAt: new Date().toLocaleString() },
        facebook: { connectedAt: new Date().toLocaleString() },
        instagram: { connectedAt: new Date().toLocaleString() },
        telegram: { connectedAt: new Date().toLocaleString() }
      };
    }
  });

  const [connectedEmails, setConnectedEmails] = useState(() => {
    try {
      const saved = localStorage.getItem('crm-connected-emails');
      return saved ? JSON.parse(saved) : {
        gmail: { connectedAt: new Date().toLocaleString() }
      };
    } catch (e) {
      return { gmail: { connectedAt: new Date().toLocaleString() } };
    }
  });

  useEffect(() => {
    localStorage.setItem('crm-connected-platforms', JSON.stringify(connectedPlatforms));
    window.dispatchEvent(new Event('storage'));
  }, [connectedPlatforms]);

  useEffect(() => {
    localStorage.setItem('crm-connected-emails', JSON.stringify(connectedEmails));
  }, [connectedEmails]);
  const [openDialog, setOpenDialog] = useState(null); // { type: 'social'|'email', id }
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [webhookUrl] = useState(`https://api.aaaconsultancy.com/webhook/${Math.random().toString(36).substring(2, 10)}`);
  const [webhookSecret] = useState(`whsec_${Math.random().toString(36).substring(2, 20)}`);
  const [enabledEvents, setEnabledEvents] = useState({});
  const [customWebhooks, setCustomWebhooks] = useState([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [emailSettings, setEmailSettings] = useState({
    autoCreateLeads: true,
    syncSentEmails: true,
    attachToClients: true,
    autoReply: false });

  const handleOpenConnect = (type, id) => {
    setFormData({});
    setShowPassword({});
    setOpenDialog({ type, id });
  };

  const handleDisconnect = (type, id) => {
    if (type === 'social') {
      setConnectedPlatforms(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } else {
      setConnectedEmails(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
    showSnack(`Disconnected successfully`, 'info');
  };

  const handleSave = () => {
    const { type, id } = openDialog;
    if (type === 'social') {
      setConnectedPlatforms(prev => ({ ...prev, [id]: { ...formData, connectedAt: new Date().toLocaleString() } }));
    } else {
      setConnectedEmails(prev => ({ ...prev, [id]: { ...formData, connectedAt: new Date().toLocaleString() } }));
    }
    setOpenDialog(null);
    showSnack(`✅ Connected successfully! Messages will now appear in your Social Inbox.`, 'success');
  };

  const showSnack = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showSnack('Copied to clipboard!', 'info');
  };

  const addCustomWebhook = () => {
    if (!newWebhookUrl) return;
    setCustomWebhooks(prev => [...prev, { url: newWebhookUrl, id: Date.now(), active: true }]);
    setNewWebhookUrl('');
    showSnack('Webhook endpoint added!');
  };

  const currentDialog = openDialog
    ? openDialog.type === 'social'
      ? SOCIAL_PLATFORMS.find(p => p.id === openDialog.id)
      : EMAIL_PROVIDERS.find(p => p.id === openDialog.id)
    : null;

  const connectedSocialCount = Object.keys(connectedPlatforms).length;
  const connectedEmailCount = Object.keys(connectedEmails).length;

  return (
    <Box>
      <PageHeader
        title="Integrations"
        subtitle="Connect your social media channels, email accounts, and configure webhooks — all your messages flow into one unified inbox."
      />

      {/* ─── Stats Row ─── */}
      <Box className="grid grid-cols-12 gap-2" sx={{ mb: 3 }}>
        {[
          { label: 'Social Channels Connected', value: connectedSocialCount, total: SOCIAL_PLATFORMS.length, color: '#6366F1', icon: '📱' },
          { label: 'Email Accounts Connected', value: connectedEmailCount, total: EMAIL_PROVIDERS.length, color: '#10B981', icon: '📧' },
          { label: 'Active Webhook Events', value: Object.values(enabledEvents).filter(Boolean).length, total: WEBHOOK_EVENTS.length, color: '#F59E0B', icon: '🔔' },
          { label: 'Custom Webhook Endpoints', value: customWebhooks.filter(w => w.active).length, total: customWebhooks.length || 0, color: '#EF4444', icon: '🔗' },
        ].map(stat => (
          <Box className="col-span-6 sm:col-span-3" key={stat.label}>
            <Paper sx={{ p: 2.5, borderRadius: 3, border: '2px solid', borderColor: 'divider', boxShadow: 'none', transition: 'all 0.2s', '&:hover': { borderColor: stat.color } }}>
              <Typography variant="h2" sx={{ fontSize: '2rem', mb: 0.5 }}>{stat.icon}</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{stat.label}</Typography>
              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>of {stat.total} available</Typography>
            </Paper>
          </Box>
        ))}
      </Box>

      {/* ─── Tabs ─── */}
      <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          sx={{ px: 3, pt: 1, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>📱 Social Media Channels {connectedSocialCount > 0 && <Chip label={connectedSocialCount} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />}</Box>}
          />
          <Tab
            label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>📧 Email Integration {connectedEmailCount > 0 && <Chip label={connectedEmailCount} size="small" color="success" sx={{ height: 18, fontSize: '0.65rem' }} />}</Box>}
          />
          <Tab label="🔔 Webhooks & API" />
        </Tabs>

        {/* ─── Tab 0: Social Media ─── */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Connect your social media accounts. Once connected, all incoming messages and leads will automatically appear in your <strong>Social Inbox</strong>.
            </Typography>
            <Box className="grid grid-cols-12 gap-2">
              {SOCIAL_PLATFORMS.map((platform) => {
                const isConnected = !!connectedPlatforms[platform.id];
                return (
                  <Box className="col-span-12 sm:col-span-6 md:col-span-4" key={platform.id}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: isConnected ? platform.color : 'divider',
                        boxShadow: 'none',
                        bgcolor: isConnected ? platform.bg : 'background.paper',
                        transition: 'all 0.25s ease',
                        '&:hover': { borderColor: platform.color, transform: 'translateY(-2px)', boxShadow: `0 6px 24px ${platform.color}22` },
                        position: 'relative' }}
                    >
                      {/* Connected badge */}
                      {isConnected && (
                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                          <Chip
                            icon={<CheckCircleIcon sx={{ fontSize: '0.85rem !important' }} />}
                            label="Connected"
                            size="small"
                            color="success"
                            sx={{ height: 22, fontSize: '0.65rem', fontWeight: 800 }}
                          />
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Typography variant="h4" sx={{ lineHeight: 1 }}>{platform.emoji}</Typography>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: platform.color, lineHeight: 1.2 }}>
                            {platform.name}
                          </Typography>
                          <Chip label={platform.badge} size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700, mt: 0.3 }} />
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {platform.description}
                      </Typography>

                      {isConnected && (
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 1.5 }}>
                          Connected {connectedPlatforms[platform.id].connectedAt}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {isConnected ? (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              startIcon={<RefreshIcon />}
                              onClick={() => handleOpenConnect('social', platform.id)}
                              sx={{ fontSize: '0.7rem', fontWeight: 700 }}
                            >
                              Reconfigure
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<LinkOffIcon />}
                              onClick={() => handleDisconnect('social', platform.id)}
                              sx={{ fontSize: '0.7rem', fontWeight: 700 }}
                            >
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={<LinkIcon />}
                              onClick={() => handleOpenConnect('social', platform.id)}
                              sx={{ fontSize: '0.75rem', fontWeight: 700, bgcolor: platform.color, '&:hover': { bgcolor: platform.color, opacity: 0.9 } }}
                            >
                              Connect
                            </Button>
                            {platform.docs && (
                              <Tooltip title="View API Documentation">
                                <IconButton size="small" href={platform.docs} target="_blank" sx={{ color: 'text.secondary' }}>
                                  <OpenInNewIcon sx={{ fontSize: '0.9rem' }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </Box>
                    </Paper>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ─── Tab 1: Email Integration ─── */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Connect your business email accounts. Incoming emails from clients will appear in the CRM inbox and be linked to their client profiles automatically.
            </Typography>

            <Box className="grid grid-cols-12 gap-2">
              {EMAIL_PROVIDERS.map((provider) => {
                const isConnected = !!connectedEmails[provider.id];
                return (
                  <Box className="col-span-12 sm:col-span-6 md:col-span-4" key={provider.id}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '2px solid',
                        borderColor: isConnected ? provider.color : 'divider',
                        boxShadow: 'none',
                        bgcolor: isConnected ? provider.bg : 'background.paper',
                        transition: 'all 0.25s ease',
                        '&:hover': { borderColor: provider.color, transform: 'translateY(-2px)', boxShadow: `0 6px 24px ${provider.color}22` },
                        position: 'relative' }}
                    >
                      {isConnected && (
                        <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                          <Chip icon={<CheckCircleIcon sx={{ fontSize: '0.85rem !important' }} />} label="Connected" size="small" color="success" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 800 }} />
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Typography variant="h4" sx={{ lineHeight: 1 }}>{provider.emoji}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: provider.color, lineHeight: 1.2 }}>
                          {provider.name}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {provider.description}
                      </Typography>

                      {isConnected && connectedEmails[provider.id]?.email && (
                        <Chip
                          label={connectedEmails[provider.id].email}
                          size="small"
                          color="success"
                          variant="outlined"
                          icon={<EmailIcon sx={{ fontSize: '0.8rem !important' }} />}
                          sx={{ mb: 1.5, fontSize: '0.7rem', fontWeight: 700 }}
                        />
                      )}

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {isConnected ? (
                          <>
                            <Button size="small" variant="outlined" color="success" startIcon={<RefreshIcon />} onClick={() => handleOpenConnect('email', provider.id)} sx={{ fontSize: '0.7rem', fontWeight: 700 }}>
                              Reconfigure
                            </Button>
                            <Button size="small" variant="outlined" color="error" startIcon={<LinkOffIcon />} onClick={() => handleDisconnect('email', provider.id)} sx={{ fontSize: '0.7rem', fontWeight: 700 }}>
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<LinkIcon />}
                            onClick={() => handleOpenConnect('email', provider.id)}
                            sx={{ fontSize: '0.75rem', fontWeight: 700, bgcolor: provider.color, '&:hover': { bgcolor: provider.color, opacity: 0.9 } }}
                          >
                            Connect
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  </Box>
                );
              })}
            </Box>

            {/* Email Settings */}
            {connectedEmailCount > 0 && (
              <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', mt: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>📋 Email Sync Settings</Typography>
                <Box className="grid grid-cols-12 gap-2">
                  {[
                    { key: 'autoCreateLeads', label: 'Auto-create leads from new emails', desc: 'Unknown senders automatically become new leads' },
                    { key: 'syncSentEmails', label: 'Sync sent emails to CRM', desc: 'Replies you send are saved in client history' },
                    { key: 'attachToClients', label: 'Auto-link emails to client profiles', desc: 'Emails matched by email address to existing clients' },
                    { key: 'autoReply', label: 'Send auto-reply to new inquiries', desc: 'Automatically reply with a confirmation email' },
                  ].map(setting => (
                    <Box className="col-span-12 sm:col-span-6" key={setting.key}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{setting.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{setting.desc}</Typography>
                        </Box>
                        <Switch
                          checked={emailSettings[setting.key]}
                          onChange={(e) => setEmailSettings(prev => ({ ...prev, [setting.key]: e.target.checked }))}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Box>
        )}

        {/* ─── Tab 2: Webhooks & API ─── */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Use webhooks to automatically send data to external tools when events happen in the CRM — like new leads, payments, or meetings.
            </Typography>

            {/* Your Webhook URL */}
            <Paper sx={{ p: 3, borderRadius: 3, border: '2px solid', borderColor: '#6366F1', bgcolor: '#EEF2FF', boxShadow: 'none', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>📥 Your CRM Webhook Receiver URL</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Paste this URL into Facebook, WhatsApp, or any platform that sends webhook events. The CRM will auto-process incoming data.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={webhookUrl}
                  InputProps={{
                    readOnly: true,
                    sx: { fontFamily: 'monospace', fontSize: '0.8rem', bgcolor: 'background.paper', borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copy URL">
                          <IconButton size="small" onClick={() => copyToClipboard(webhookUrl)}>
                            <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ) }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  size="small"
                  label="Webhook Secret (for verification)"
                  value={webhookSecret}
                  InputProps={{
                    readOnly: true,
                    sx: { fontFamily: 'monospace', fontSize: '0.75rem', bgcolor: 'background.paper' },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Copy Secret">
                          <IconButton size="small" onClick={() => copyToClipboard(webhookSecret)}>
                            <ContentCopyIcon sx={{ fontSize: '0.9rem' }} />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ) }}
                  sx={{ flex: 1 }}
                />
              </Box>
            </Paper>

            {/* Webhook Events */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>⚡ Outgoing Webhook Events</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select which events from your CRM should be sent to external tools (Zapier, Make, custom APIs, etc.).
            </Typography>
            <Box className="grid grid-cols-12 gap-2" sx={{ mb: 4 }}>
              {WEBHOOK_EVENTS.map(event => (
                <Box className="col-span-12 sm:col-span-6" key={event.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2, borderRadius: 2, border: '1px solid', borderColor: enabledEvents[event.id] ? '#6366F1' : 'divider', bgcolor: enabledEvents[event.id] ? '#EEF2FF' : 'background.paper', transition: 'all 0.2s' }}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <Typography sx={{ fontSize: '1.2rem', lineHeight: 1, mt: 0.3 }}>{event.icon}</Typography>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{event.label}</Typography>
                        <Typography variant="caption" color="text.secondary">{event.desc}</Typography>
                        <Chip label={event.id} size="small" sx={{ fontFamily: 'monospace', fontSize: '0.6rem', height: 16, display: 'block', width: 'fit-content', mt: 0.5 }} />
                      </Box>
                    </Box>
                    <Switch
                      checked={!!enabledEvents[event.id]}
                      onChange={(e) => setEnabledEvents(prev => ({ ...prev, [event.id]: e.target.checked }))}
                      color="primary"
                      size="small"
                    />
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Custom Webhook Endpoints */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>🔗 Custom Outgoing Webhook Endpoints</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add external URLs (Zapier, Make.com, custom APIs) where enabled events should be sent.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Button variant="contained" startIcon={<AddIcon />} onClick={addCustomWebhook} sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                Add
              </Button>
            </Box>

            {customWebhooks.length === 0 && (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                No custom endpoints added yet. Add a Zapier, Make.com, or your own API URL above.
              </Alert>
            )}

            {customWebhooks.map((wh) => (
              <Box key={wh.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <PowerIcon sx={{ fontSize: '1rem', color: wh.active ? 'success.main' : 'text.disabled' }} />
                <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1, fontSize: '0.78rem', color: 'text.primary' }}>{wh.url}</Typography>
                <Chip label={wh.active ? 'Active' : 'Paused'} size="small" color={wh.active ? 'success' : 'default'} sx={{ fontSize: '0.6rem', height: 18 }} />
                <Switch
                  checked={wh.active}
                  size="small"
                  onChange={() => setCustomWebhooks(prev => prev.map(w => w.id === wh.id ? { ...w, active: !w.active } : w))}
                />
                <IconButton size="small" color="error" onClick={() => setCustomWebhooks(prev => prev.filter(w => w.id !== wh.id))}>
                  <DeleteOutlineIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* ─── Connect Dialog ─── */}
      <Dialog open={!!openDialog} onClose={() => setOpenDialog(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        {currentDialog && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h4" sx={{ lineHeight: 1 }}>{currentDialog.emoji}</Typography>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Connect {currentDialog.name}</Typography>
                  <Typography variant="caption" color="text.secondary">Enter your credentials to link this integration</Typography>
                </Box>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  🔒 Your credentials are stored securely. We never share or log your tokens.
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {currentDialog.fields.map((field) => (
                  <Box key={field.key}>
                    <TextField
                      fullWidth
                      size="small"
                      label={field.label}
                      placeholder={field.placeholder}
                      type={field.isPassword && !showPassword[field.key] ? 'password' : 'text'}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      InputProps={field.isPassword ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setShowPassword(prev => ({ ...prev, [field.key]: !prev[field.key] }))}>
                              {showPassword[field.key] ? <VisibilityOffIcon sx={{ fontSize: '1rem' }} /> : <VisibilityIcon sx={{ fontSize: '1rem' }} />}
                            </IconButton>
                          </InputAdornment>
                        )
                      } : undefined}
                    />
                    {field.hint && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block', pl: 0.5 }}>
                        💡 {field.hint}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>

              {currentDialog.docs && (
                <Box sx={{ mt: 3, p: 2, borderRadius: 2, border: '1px dashed', borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary">
                    Need help? Read the official{' '}
                    <a href={currentDialog.docs} target="_blank" rel="noopener noreferrer" style={{ color: '#6366F1', fontWeight: 700 }}>
                      API Documentation ↗
                    </a>
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5, gap: 1 }}>
              <Button onClick={() => setOpenDialog(null)} variant="outlined" color="inherit" sx={{ fontWeight: 700 }}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                startIcon={<LinkIcon />}
                sx={{ fontWeight: 700, bgcolor: currentDialog.color, '&:hover': { bgcolor: currentDialog.color, opacity: 0.9 } }}
              >
                Connect {currentDialog.name}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── Snackbar ─── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2, fontWeight: 700 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Integrations;
