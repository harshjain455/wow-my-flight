import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PhoneIcon from "@mui/icons-material/Phone";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightlightIcon from "@mui/icons-material/Nightlight";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import DualClock from "../../components/DualClock";
import ClientPanel from "../../components/ClientPanel";
import DialerPanel from "../../components/DialerPanel";
import { useAlert } from "../../contexts/AlertContext";

const leads = [
  {
    id: "LD1001",
    clientId: "463522372",
    firstName: "Karan",
    lastName: "Singh",
    phone: "+1 212 *** 78",
    fullPhone: "+1 212 555 0199",
    email: "karan@example.com",
    labels: ["Hot Lead", "VIP", "Price Sensitive"],
    isDay: true,
    country: "India",
    city: "Columbus",
    timeZone: "UTC-05:00 Eastern Time",
    timezone: "America/New_York",
    origin: "DEL (Delhi Indira Gandhi)",
    destination: "LHR (London Heathrow)",
    travelDate: "15 Oct 2026",
    returnDate: "22 Oct 2026",
    cabinClass: "Business",
    passengers: 2,
    source: "Google Ads",
    activities: [
      {
        time: "16:16:23",
        agent: "agent1",
        status: "New Dialed",
        comments: "—",
      },
      {
        time: "16:36:01",
        agent: "agent1",
        status: "Call Back",
        comments: "Interested, wants price",
      },
      {
        time: "17:02:44",
        agent: "me",
        status: "Quote Sent",
        comments: "Sent Option 1 & 2",
      },
    ],
  },
  {
    id: "LD1002",
    clientId: "463522373",
    firstName: "Ankit",
    lastName: "Sharma",
    phone: "+1 212 *** 78",
    fullPhone: "+1 212 555 0200",
    email: "ankit@example.com",
    labels: ["Hot Lead", "VIP"],
    isDay: true,
    country: "India",
    city: "New Delhi",
    timeZone: "UTC+05:30 India Standard Time",
    timezone: "Asia/Kolkata",
    origin: "DEL",
    destination: "DXB",
    travelDate: "20 Nov 2026",
    cabinClass: "Economy",
    passengers: 1,
    source: "Google Ads",
    activities: [
      {
        time: "14:20:12",
        agent: "me",
        status: "Quote Sent",
        comments: "Sent 3 options",
      },
    ],
  },
  {
    id: "LD1003",
    clientId: "463522374",
    firstName: "Michael",
    lastName: "Chen",
    phone: "+1 212 *** 01",
    fullPhone: "+1 212 555 0201",
    email: "m.chen@example.com",
    labels: ["Corporate", "Urgent"],
    isDay: false,
    country: "USA",
    city: "New York",
    timeZone: "UTC-04:00 Eastern Time",
    timezone: "America/New_York",
    origin: "JFK",
    destination: "LHR",
    travelDate: "05 Dec 2026",
    cabinClass: "First",
    passengers: 1,
    source: "Referral",
    activities: [],
  },
  {
    id: "LD1004",
    clientId: "463522375",
    firstName: "Sarah",
    lastName: "Williams",
    phone: "+44 20 *** 02",
    fullPhone: "+44 20 5555 0202",
    email: "s.williams@example.com",
    labels: ["Price Sensitive"],
    isDay: true,
    country: "UK",
    city: "London",
    timeZone: "UTC+01:00 British Summer Time",
    timezone: "Europe/London",
    origin: "LHR",
    destination: "SIN",
    travelDate: "12 Jan 2027",
    cabinClass: "Economy",
    passengers: 4,
    source: "Facebook",
    activities: [],
  },
  {
    id: "LD1005",
    clientId: "463522376",
    firstName: "Rita",
    lastName: "Verma",
    phone: "+91 98 *** 88",
    fullPhone: "+91 98765 0088",
    email: "rita@example.com",
    labels: ["VIP"],
    isDay: true,
    country: "India",
    city: "Mumbai",
    timeZone: "UTC+05:30 India Standard Time",
    timezone: "Asia/Kolkata",
    origin: "DEL",
    destination: "SIN",
    travelDate: "05 Dec 2026",
    cabinClass: "Economy",
    passengers: 2,
    source: "Google Ads",
    activities: [],
  },
];
const labelColors = {
  "Hot Lead": ["#FFEDD5", "#C2410C", "🔥"],
  VIP: ["#DBEAFE", "#1D4ED8", "🇺🇸"],
  "Price Sensitive": ["#FEF3C7", "#854D0E", "💲"],
  Corporate: ["#F3E8FF", "#7E22CE", "🏢"],
  Urgent: ["#FEE2E2", "#B91C1C", "🚨"],
};

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SendIcon from "@mui/icons-material/Send";

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [selectedId, setSelectedId] = useState(leads[0].id);
  const [activity, setActivity] = useState({});

  // Workflow Dialog States
  const [gdsDialogOpen, setGdsDialogOpen] = useState(false);
  const [gdsForm, setGdsForm] = useState({ notes: "", cabin: "Economy", priority: "Standard" });

  const [tlDialogOpen, setTlDialogOpen] = useState(false);
  const [tlForm, setTlForm] = useState({ currentPrice: 1250, requestedDiscount: 75, reason: "Client comparing with competitor price" });

  const [waDialogOpen, setWaDialogOpen] = useState(false);

  const lead = useMemo(
    () => ({
      ...leads.find((x) => x.id === selectedId),
      activities: [
        ...(activity[selectedId] || []),
        ...leads.find((x) => x.id === selectedId).activities,
      ],
    }),
    [selectedId, activity],
  );

  const addComment = (comments) => {
    setActivity((prev) => ({
      ...prev,
      [selectedId]: [
        {
          time: new Date().toLocaleTimeString(),
          agent: "me",
          status: "Comment",
          comments,
        },
        ...(prev[selectedId] || []),
      ],
    }));
    showAlert("Comment added to activity history", "success");
  };

  const handleGdsSubmit = () => {
    setActivity((prev) => ({
      ...prev,
      [selectedId]: [
        {
          time: new Date().toLocaleTimeString(),
          agent: "me",
          status: "GDS Request",
          comments: `Forwarded to GDS Desk: ${lead.origin} → ${lead.destination} (${lead.travelDate}) | Priority: ${gdsForm.priority} | Notes: ${gdsForm.notes || "Best net fare needed"}`,
        },
        ...(prev[selectedId] || []),
      ],
    }));
    setGdsDialogOpen(false);
    showAlert(`Flight request for ${lead.origin} → ${lead.destination} sent to Flight Expert queue`, "success");
  };

  const handleTlSubmit = () => {
    setActivity((prev) => ({
      ...prev,
      [selectedId]: [
        {
          time: new Date().toLocaleTimeString(),
          agent: "me",
          status: "TL Review",
          comments: `Discount Approval Req: $${tlForm.requestedDiscount} off (Final: $${tlForm.currentPrice - tlForm.requestedDiscount}) | Reason: ${tlForm.reason}`,
        },
        ...(prev[selectedId] || []),
      ],
    }));
    setTlDialogOpen(false);
    showAlert(`Discount approval of $${tlForm.requestedDiscount} submitted to Team Leader desk`, "warning");
  };

  const handleWhatsAppSend = () => {
    setActivity((prev) => ({
      ...prev,
      [selectedId]: [
        {
          time: new Date().toLocaleTimeString(),
          agent: "me",
          status: "Quote Sent",
          comments: `WhatsApp Itinerary Quote dispatched to ${lead.fullPhone}`,
        },
        ...(prev[selectedId] || []),
      ],
    }));
    setWaDialogOpen(false);
    showAlert(`WhatsApp quote sent to ${lead.firstName} (${lead.phone})`, "success");
  };

  const quickAction = (action) => {
    if (action === "flight_expert") {
      setGdsForm({ notes: "", cabin: lead.cabinClass || "Economy", priority: "Standard" });
      setGdsDialogOpen(true);
    } else if (action === "tl_approval") {
      setTlForm({ currentPrice: 1250, requestedDiscount: 75, reason: "Client comparing with competitor price" });
      setTlDialogOpen(true);
    } else if (action === "whatsapp_quote") {
      setWaDialogOpen(true);
    } else if (action === "quote") {
      navigate("/quotes");
    } else if (action === "booking") {
      navigate("/bookings");
    } else {
      showAlert(`Payment link generated: https://pay.travelagency.com/inv-${lead.id}`, "success");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", pb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1, sm: 1.5 },
          px: { xs: 1.5, sm: 2.5 },
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <DualClock
          client={{
            timezone: lead.timezone,
            label: lead.timeZone.includes("Eastern") ? "EST" : lead.city,
          }}
        />
      </Paper>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1.4fr 1.1fr 280px",
            xl: "1.6fr 1.2fr 300px",
          },
          gap: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2.5 },
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
              gap: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: { xs: "0.85rem", sm: "0.95rem" } }}>
              HIGH PRIORITY LEADS (5)
            </Typography>
            <Chip
              icon={<VerifiedUserIcon />}
              label="Verified by OTP"
              size="small"
              color="success"
              variant="outlined"
              sx={{ fontSize: "0.65rem", height: 20 }}
            />
          </Box>
          <Box sx={{ overflowX: "auto", width: "100%" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.8rem",
                minWidth: 420,
              }}
            >
            <thead>
              <tr>
                {["Time", "Client", "Labels", "Contact", "Actions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 8px",
                      color: "#64748B",
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  style={{
                    cursor: "pointer",
                    background:
                      row.id === selectedId ? "#F0F9FF" : "transparent",
                    borderTop: "1px solid #F1F5F9",
                  }}
                >
                  <td style={{ padding: "10px 8px" }}>
                    {row.isDay ? (
                      <WbSunnyIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
                    ) : (
                      <NightlightIcon sx={{ fontSize: 18, color: "#475569" }} />
                    )}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      fontWeight: 700,
                      color: "primary.main",
                    }}
                  >
                    {row.firstName} {row.lastName}
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    {row.labels.map((name) => {
                      const c = labelColors[name];
                      return (
                        <Chip
                          key={name}
                          label={`${c[2]} ${name}`}
                          size="small"
                          sx={{
                            mr: 0.5,
                            mb: 0.5,
                            bgcolor: c[0],
                            color: c[1],
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            height: 20,
                          }}
                        />
                      );
                    })}
                  </td>
                  <td style={{ padding: "10px 8px" }}>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                    >
                      {row.phone}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary", display: "block" }}
                    >
                      {row.email}
                    </Typography>
                  </td>
                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                    <Tooltip title="Call">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(row.id);
                          showAlert(`Calling ${row.firstName}…`, "success");
                        }}
                        size="small"
                      >
                        <PhoneIcon fontSize="small" color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="WhatsApp / SMS">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/social-inbox?channel=whatsapp");
                        }}
                        size="small"
                      >
                        <ChatIcon fontSize="small" color="success" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Email">
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          showAlert(
                            `Email composer opened for ${row.email}`,
                            "info",
                          );
                        }}
                        size="small"
                      >
                        <EmailIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                    <IconButton size="small">
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
        <ClientPanel
          lead={lead}
          onComment={addComment}
          onAction={quickAction}
        />
        <Box>
          <DialerPanel
            lead={lead}
            onCall={(state) =>
              showAlert(
                state === "ON CALL"
                  ? `Connected to ${lead.firstName}`
                  : "Call ended",
                "info",
              )
            }
          />
        </Box>
      </Box>

      {/* ─── MY LEAD PIPELINE STATUS SUMMARY ─── */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 0.5 }}>
          📋 My Lead Pipeline
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {[
            { label: 'New', count: 12, color: '#3B82F6', bg: '#EFF6FF' },
            { label: 'Assigned', count: 8, color: '#8B5CF6', bg: '#F5F3FF' },
            { label: 'Contacted', count: 15, color: '#06B6D4', bg: '#ECFEFF' },
            { label: 'Callback', count: 6, color: '#F59E0B', bg: '#FFFBEB' },
            { label: 'Qualified', count: 9, color: '#10B981', bg: '#ECFDF5' },
            { label: 'Quote Sent', count: 7, color: '#6366F1', bg: '#EEF2FF' },
            { label: 'Negotiation', count: 4, color: '#EC4899', bg: '#FDF2F8' },
            { label: 'Payment Pending', count: 3, color: '#F97316', bg: '#FFF7ED' },
            { label: 'Booked', count: 5, color: '#059669', bg: '#D1FAE5' },
            { label: 'Lost', count: 2, color: '#EF4444', bg: '#FEF2F2' },
            { label: 'No Response', count: 4, color: '#6B7280', bg: '#F3F4F6' },
          ].map((s) => (
            <Paper key={s.label} variant="outlined" sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: s.bg, borderColor: s.color + '33', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }, minWidth: 90, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: s.color, lineHeight: 1.2 }}>{s.count}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: s.color, fontSize: '0.65rem' }}>{s.label}</Typography>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* ─── MY TASKS + MY PERFORMANCE (Side by Side) ─── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5, mb: 2.5 }}>

        {/* MY TASKS */}
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 0.5 }}>
            📝 My Tasks — Today's Action Items
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { label: '📞 Call Now', count: 5, desc: 'New leads requiring first contact within 5 min', color: '#EF4444', bg: '#FEF2F2' },
              { label: '🔁 Callback Scheduled', count: 3, desc: 'Customers who requested callback at specific time', color: '#F59E0B', bg: '#FFFBEB' },
              { label: '📋 Follow-up Required', count: 8, desc: 'Leads needing price update, quote revision, or check-in', color: '#3B82F6', bg: '#EFF6FF' },
              { label: '💳 Payment Follow-up', count: 2, desc: 'Payment links sent, awaiting customer payment confirmation', color: '#10B981', bg: '#ECFDF5' },
              { label: '✉️ Email Follow-up', count: 4, desc: 'Itinerary emails sent, no response in 24h — resend or call', color: '#8B5CF6', bg: '#F5F3FF' },
            ].map((task) => (
              <Paper key={task.label} variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: task.bg, borderColor: task.color + '33', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'translateX(4px)', boxShadow: 1 } }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: task.color }}>{task.label}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>{task.desc}</Typography>
                </Box>
                <Chip label={task.count} size="small" sx={{ fontWeight: 900, bgcolor: task.color, color: '#fff', minWidth: 32, height: 28 }} />
              </Paper>
            ))}
          </Box>
        </Paper>

        {/* MY PERFORMANCE KPIs */}
        <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: 0.5 }}>
            📊 My Performance — Today
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            {[
              { label: 'Leads Assigned', value: '24', icon: '📋', color: '#3B82F6', bg: '#EFF6FF' },
              { label: 'Calls Made', value: '18', icon: '📞', color: '#10B981', bg: '#ECFDF5' },
              { label: 'Calls Received', value: '7', icon: '📲', color: '#06B6D4', bg: '#ECFEFF' },
              { label: 'Talk Time', value: '2h 34m', icon: '⏱️', color: '#8B5CF6', bg: '#F5F3FF' },
              { label: 'Quotes Sent', value: '9', icon: '📩', color: '#6366F1', bg: '#EEF2FF' },
              { label: 'Bookings', value: '3', icon: '✈️', color: '#059669', bg: '#D1FAE5' },
              { label: 'Revenue', value: '$4,250', icon: '💰', color: '#D97706', bg: '#FFFBEB' },
              { label: 'Conversion %', value: '12.5%', icon: '📈', color: '#EC4899', bg: '#FDF2F8' },
              { label: 'Avg Booking Value', value: '$1,417', icon: '💎', color: '#2563EB', bg: '#EFF6FF' },
              { label: 'Follow-up Compliance', value: '94%', icon: '✅', color: '#16A34A', bg: '#F0FDF4' },
            ].map((kpi) => (
              <Paper key={kpi.label} variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: kpi.bg, borderColor: kpi.color + '22', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.68rem', display: 'block', mb: 0.3 }}>{kpi.icon} {kpi.label}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: kpi.color, lineHeight: 1.2 }}>{kpi.value}</Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>


      {/* 1. GDS FLIGHT EXPERT REQUEST MODAL */}
      <Dialog open={gdsDialogOpen} onClose={() => setGdsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          ✈️ Forward to Flight Expert / GDS Desk
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#F0F9FF', borderRadius: 2, border: '1px solid #BAE6FD' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0369A1' }}>
              Passenger & Sector Summary:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {lead.firstName} {lead.lastName} ({lead.passengers} Pax) | {lead.origin} → {lead.destination}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Travel: {lead.travelDate} {lead.returnDate ? `to ${lead.returnDate}` : '(One Way)'}
            </Typography>
          </Box>

          <FormControl fullWidth size="small">
            <InputLabel>Cabin Class Preference</InputLabel>
            <Select
              value={gdsForm.cabin}
              label="Cabin Class Preference"
              onChange={(e) => setGdsForm({ ...gdsForm, cabin: e.target.value })}
            >
              <MenuItem value="Economy">Economy Class</MenuItem>
              <MenuItem value="Premium Economy">Premium Economy</MenuItem>
              <MenuItem value="Business">Business Class</MenuItem>
              <MenuItem value="First">First Class</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Request Priority</InputLabel>
            <Select
              value={gdsForm.priority}
              label="Request Priority"
              onChange={(e) => setGdsForm({ ...gdsForm, priority: e.target.value })}
            >
              <MenuItem value="Standard">Standard (Under 1 Hour)</MenuItem>
              <MenuItem value="Urgent">Urgent - Customer on Call (5 Mins)</MenuItem>
              <MenuItem value="Price Match">Competitor Price Match</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Specific Airlines / GDS Cryptic Instructions"
            multiline
            rows={3}
            fullWidth
            size="small"
            placeholder="e.g., Client prefers Emirates or Qatar with under 3h layover. Max budget $1,200."
            value={gdsForm.notes}
            onChange={(e) => setGdsForm({ ...gdsForm, notes: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setGdsDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleGdsSubmit} variant="contained" color="primary" sx={{ fontWeight: 800 }}>
            Send to GDS Queue
          </Button>
        </DialogActions>
      </Dialog>

      {/* 2. TEAM LEADER DISCOUNT / MARGIN APPROVAL MODAL */}
      <Dialog open={tlDialogOpen} onClose={() => setTlDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#D97706', display: 'flex', alignItems: 'center', gap: 1 }}>
          🛡️ Request TL Margin / Discount Approval
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#FFFBEB', borderRadius: 2, border: '1px solid #FDE68A' }}>
            <Typography variant="caption" sx={{ color: '#92400E', fontWeight: 800, display: 'block' }}>
              LEAD: {lead.firstName} {lead.lastName} (#{lead.id})
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#B45309' }}>
              Sector: {lead.origin} → {lead.destination}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            <TextField
              label="Current Quote ($)"
              type="number"
              size="small"
              value={tlForm.currentPrice}
              onChange={(e) => setTlForm({ ...tlForm, currentPrice: Number(e.target.value) })}
            />
            <TextField
              label="Requested Discount ($)"
              type="number"
              size="small"
              value={tlForm.requestedDiscount}
              onChange={(e) => setTlForm({ ...tlForm, requestedDiscount: Number(e.target.value) })}
            />
          </Box>

          <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px dashed #CBD5E1' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              Final Selling Price: <b>${tlForm.currentPrice - tlForm.requestedDiscount}</b>
            </Typography>
          </Box>

          <TextField
            label="Reason for Discount"
            multiline
            rows={2}
            fullWidth
            size="small"
            value={tlForm.reason}
            onChange={(e) => setTlForm({ ...tlForm, reason: e.target.value })}
            placeholder="e.g. Ready to pay immediately if we match OTA competitor"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTlDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleTlSubmit} variant="contained" color="warning" sx={{ fontWeight: 800 }}>
            Submit to Team Lead
          </Button>
        </DialogActions>
      </Dialog>

      {/* 3. QUICK WHATSAPP ITINERARY QUOTE MODAL */}
      <Dialog open={waDialogOpen} onClose={() => setWaDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 1 }}>
          📱 WhatsApp Travel Itinerary & Quote
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Sending personalized itinerary quote to <b>{lead.firstName} {lead.lastName}</b> ({lead.fullPhone}):
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: 2, border: '1px solid #BBF7D0', fontFamily: 'monospace', fontSize: '0.82rem' }}>
            ✈️ *FLIGHT QUOTATION — {lead.origin} to {lead.destination}*<br />
            ━━━━━━━━━━━━━━━━━━━━━<br />
            👤 *Passenger:* {lead.firstName} {lead.lastName} ({lead.passengers} Pax)<br />
            🛫 *Outbound:* {lead.travelDate} ({lead.cabinClass})<br />
            {lead.returnDate && `🛬 *Inbound:* ${lead.returnDate}<br />`}
            💼 *Baggage:* Included (Cabin 7kg + Check-in 23kg)<br />
            💵 *Total Special Fare:* $1,175 All Inclusive<br />
            ━━━━━━━━━━━━━━━━━━━━━<br />
            ⏱️ *Fare Valid For:* 4 Hours (Subject to seat availability)<br />
            💳 *Book & Pay Securely:* https://pay.travelagency.com/inv-{lead.id}
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setWaDialogOpen(false)} color="inherit">Close</Button>
          <Button 
            onClick={() => {
              navigator.clipboard?.writeText(`FLIGHT QUOTATION: ${lead.origin} to ${lead.destination} for ${lead.firstName} - $1,175. Travel Date: ${lead.travelDate}`);
              showAlert("WhatsApp quote copied to clipboard", "info");
            }} 
            variant="outlined" 
            color="success" 
            startIcon={<ContentCopyIcon />}
          >
            Copy Text
          </Button>
          <Button 
            onClick={handleWhatsAppSend} 
            variant="contained" 
            color="success" 
            startIcon={<SendIcon />}
            sx={{ fontWeight: 800 }}
          >
            Send WhatsApp Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

