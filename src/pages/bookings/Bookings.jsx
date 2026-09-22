import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

// Icons
import AddIcon from "@mui/icons-material/Add";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import PaidIcon from "@mui/icons-material/Paid";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import PageHeader from "../../components/PageHeader";
import AppTable from "../../components/AppTable";
import AppModal from "../../components/AppModal";
import PaymentLinkModal from "../../components/PaymentLinkModal";
import {
  MOCK_BOOKINGS,
  AIRLINES,
  CABIN_CLASSES,
} from "../../constants/mockData";
import { useAuth } from "../../hooks/useAuth";
import { useAlert } from "../../contexts/AlertContext";

const STATUS_STEPS = [
  "Quoted",
  "Confirmed",
  "PNR Created",
  "Payment Received",
  "Ticketed",
  "Dispatched",
  "Completed",
];

const STATUS_COLORS = {
  Quoted: { bg: "#EFF6FF", color: "#1D4ED8" },
  Confirmed: { bg: "#FEF3C7", color: "#92400E" },
  "PNR Created": { bg: "#F3E8FF", color: "#7E22CE" },
  "Payment Received": { bg: "#ECFDF5", color: "#047857" },
  Ticketed: { bg: "#D1FAE5", color: "#065F46" },
  Dispatched: { bg: "#CCFBF1", color: "#0F766E" },
  Completed: { bg: "#F0FDF4", color: "#15803D" },
  Cancelled: { bg: "#FEE2E2", color: "#B91C1C" },
  Refunded: { bg: "#FFFBEB", color: "#B45309" },
};

const TICKETING_DEMO_BOOKINGS = [
  {
    id: "BK-001",
    bookingId: "BK-001",
    customerName: "K. Singh",
    customerEmail: "ksingh@example.com",
    customerPhone: "+1 212 555 0199",
    route: "JFK → LHR",
    origin: "JFK",
    destination: "LHR",
    travelDate: "15 Oct 2026",
    dateDisplay: "15 Oct",
    cabinClass: "Business",
    passengers: 2,
    pnr: "ABC12D",
    airline: "British Airways",
    flightNumber: "BA-117",
    sellingPrice: 4500,
    amountPaid: 4500,
    paymentStatus: "Payment Received",
    ticketStatus: "Pending",
    dispatchStatus: "Not Dispatched",
    bookingStatus: "Payment Received",
    status: "Payment Received",
    eTicket: "0172345678901, 0172345678902",
    createdAt: "2026-08-12",
  },
  {
    id: "BK-002",
    bookingId: "BK-002",
    customerName: "A. Lee",
    customerEmail: "alee@example.com",
    customerPhone: "+1 415 882 1092",
    route: "DEL → SIN",
    origin: "DEL",
    destination: "SIN",
    travelDate: "20 Nov 2026",
    dateDisplay: "20 Nov",
    cabinClass: "Economy",
    passengers: 1,
    pnr: "LMN78F",
    airline: "Singapore Airlines",
    flightNumber: "SQ-407",
    sellingPrice: 1430,
    amountPaid: 1430,
    paymentStatus: "Payment Received",
    ticketStatus: "Ticketed",
    dispatchStatus: "Ready",
    bookingStatus: "Ticketed",
    status: "Ticketed",
    eTicket: "0179988776655",
    createdAt: "2026-08-12",
  },
  {
    id: "BK-003",
    bookingId: "BK-003",
    customerName: "R. Verma",
    customerEmail: "rverma@example.com",
    customerPhone: "+1 650 993 1120",
    route: "DXB → LHR",
    origin: "DXB",
    destination: "LHR",
    travelDate: "05 Dec 2026",
    dateDisplay: "05 Dec",
    cabinClass: "Business",
    passengers: 3,
    pnr: "QRS90G",
    airline: "Emirates",
    flightNumber: "EK-003",
    sellingPrice: 5800,
    amountPaid: 5800,
    paymentStatus: "Payment Received",
    ticketStatus: "Dispatched",
    dispatchStatus: "Dispatched",
    bookingStatus: "Dispatched",
    status: "Dispatched",
    eTicket: "176-5544332211, 176-5544332212, 176-5544332213",
    createdAt: "2026-08-10",
  },
];

export default function Bookings() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showAlert } = useAlert();

  const getRolePrefix = () => {
    if (!currentUser) return "super_admin";
    if (currentUser.role === "consultant") return "agent";
    return currentUser.role;
  };

  const [bookings, setBookings] = useState(() => {
    const existing = MOCK_BOOKINGS || [];
    // Ensure demo records BK-001, BK-002, BK-003 are present at top
    return [
      ...TICKETING_DEMO_BOOKINGS,
      ...existing.filter((b) => !["BK-001", "BK-002", "BK-003"].includes(b.id)),
    ];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");

  // Modals & Panels
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    cabinClass: "Economy",
    passengers: [],
    airline: "",
    flightNumber: "",
    pnr: "",
    netFare: 0,
    markup: 0,
    amountPaid: 0,
    status: "Pending",
  });

  const netFare = Number(formData.netFare) || 0;
  const markup = Number(formData.markup) || 0;
  const calcSellingPrice = netFare + (netFare * markup) / 100;
  const calcProfit = calcSellingPrice - netFare;

  // Filter Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const customer = (b.customerName || "").toLowerCase();
      const ref = (b.bookingId || b.id || "").toLowerCase();
      const pnr = (b.pnr || "").toLowerCase();
      const matchSearch =
        customer.includes(searchTerm.toLowerCase()) ||
        ref.includes(searchTerm.toLowerCase()) ||
        pnr.includes(searchTerm.toLowerCase());

      const st = b.ticketStatus || b.bookingStatus || b.status;
      const matchStatus = statusFilter
        ? st === statusFilter ||
          b.paymentStatus === statusFilter ||
          b.bookingStatus === statusFilter
        : true;
      const matchClass = classFilter ? b.cabinClass === classFilter : true;

      let matchDate = true;
      if (dateFilter === "Today") {
        matchDate =
          b.createdAt === new Date().toISOString().split("T")[0] ||
          b.travelDate?.includes("15 Oct");
      } else if (dateFilter === "This Week") {
        matchDate = true; // Show week items
      }

      return matchSearch && matchStatus && matchClass && matchDate;
    });
  }, [bookings, searchTerm, statusFilter, dateFilter, classFilter]);

  // Handle Add Passenger in Form
  const handleAddPassenger = () => {
    setFormData((prev) => ({
      ...prev,
      passengers: [
        ...prev.passengers,
        {
          name: "",
          dob: "",
          passport: "",
          expiry: "",
          nationality: "American",
          eTicket: "",
        },
      ],
    }));
  };

  const handleRemovePassenger = (index) => {
    setFormData((prev) => ({
      ...prev,
      passengers: prev.passengers.filter((_, i) => i !== index),
    }));
  };

  const handlePassengerChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.passengers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, passengers: updated };
    });
  };

  const handleSaveBooking = () => {
    const newRef = "BK-" + Math.floor(1000 + Math.random() * 9000);
    const newBookingObj = {
      id: newRef,
      bookingId: newRef,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      route: `${formData.origin} → ${formData.destination}`,
      origin: formData.origin,
      destination: formData.destination,
      travelDate: formData.departureDate
        ? formData.departureDate.split("T")[0]
        : "15 Oct 2026",
      returnDate: formData.returnDate ? formData.returnDate.split("T")[0] : "",
      cabinClass: formData.cabinClass,
      passengers: formData.passengers.length,
      pnr: formData.pnr || "SAB78K",
      sellingPrice: calcSellingPrice,
      netFare: formData.netFare,
      profit: calcProfit,
      amountPaid: formData.amountPaid,
      balanceDue: calcSellingPrice - formData.amountPaid,
      bookingStatus: formData.status,
      status: formData.status,
      paymentStatus:
        formData.amountPaid >= calcSellingPrice
          ? "PAID"
          : formData.amountPaid > 0
            ? "PARTIAL"
            : "PENDING",
      ticketStatus: formData.status === "Ticketed" ? "ISSUED" : "PENDING",
      airline: formData.airline,
      flightNumber: formData.flightNumber,
      passengerList: formData.passengers,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: currentUser?.name || "Super Admin",
    };

    setBookings([newBookingObj, ...bookings]);
    MOCK_BOOKINGS.unshift(newBookingObj);
    showAlert(
      `✈️ Booking ${newRef} created for ${formData.customerName}!`,
      "success",
    );
    setAddModalOpen(false);
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b.bookingId === bookingId
          ? { ...b, bookingStatus: newStatus, status: newStatus }
          : b,
      ),
    );
    if (
      selectedBooking &&
      (selectedBooking.id === bookingId ||
        selectedBooking.bookingId === bookingId)
    ) {
      setSelectedBooking((prev) => ({
        ...prev,
        bookingStatus: newStatus,
        status: newStatus,
      }));
    }
    showAlert(`Status updated to ${newStatus}`, "success");
  };

  const handleOpenDrawer = (booking) => {
    setSelectedBooking(booking);
    setDrawerOpen(true);
  };

  // Table Columns (Spec Compliant)
  const columns = [
    {
      id: "bookingRef",
      label: "Booking ID",
      render: (row) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 900,
            color: "primary.main",
            fontFamily: "monospace",
          }}
        >
          {row.bookingId || row.id}
        </Typography>
      ),
    },
    {
      id: "customer",
      label: "Customer",
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.customerName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.customerEmail || "karan@example.com"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "route",
      label: "Route",
      render: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <FlightTakeoffIcon sx={{ fontSize: 15, color: "primary.main" }} />
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {row.route ||
              `${row.origin || "JFK"} → ${row.destination || "LHR"}`}
          </Typography>
        </Box>
      ),
    },
    {
      id: "travelDate",
      label: "Date",
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {row.dateDisplay || row.travelDate}
        </Typography>
      ),
    },
    {
      id: "cabinClass",
      label: "Cabin",
      render: (row) => (
        <Chip
          size="small"
          label={row.cabinClass || "Business"}
          color={
            row.cabinClass === "First" || row.cabinClass === "First Class"
              ? "warning"
              : "primary"
          }
          variant="outlined"
          sx={{ fontSize: "0.68rem", fontWeight: 700 }}
        />
      ),
    },
    {
      id: "pax",
      label: "Pax",
      render: (row) => (
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, textAlign: "center" }}
        >
          👥 {row.passengers || row.passengerList?.length || 2} Pax
        </Typography>
      ),
    },
    {
      id: "paymentStatus",
      label: "Payment Status",
      render: (row) => (
        <Chip
          size="small"
          label={row.paymentStatus || "Payment Confirmed"}
          color="success"
          sx={{ fontSize: "0.65rem", fontWeight: 800, height: 22 }}
        />
      ),
    },
    {
      id: "ticketStatus",
      label: "Ticket Status",
      render: (row) => {
        const st = row.ticketStatus || row.bookingStatus || "Pending";
        const color =
          st === "Ticketed" || st === "ISSUED"
            ? "success"
            : st === "Dispatched"
              ? "info"
              : "warning";
        return (
          <Chip
            size="small"
            label={st}
            color={color}
            sx={{ fontWeight: 800, fontSize: "0.68rem", height: 22 }}
          />
        );
      },
    },
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <PageHeader
        title="Flight Bookings Management"
        subtitle="Manage confirmed bookings, payment statuses, e-ticket issuance queue & PNR tracking."
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<ConfirmationNumberIcon />}
            onClick={() => navigate("/ticketing")}
            sx={{ fontWeight: 700 }}
          >
            Open Ticketing Issuance Desk
          </Button>
        }
      />

      {/* KPI Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 1.5,
          mb: 3,
        }}
      >
        {[
          {
            label: "Total Confirmed Bookings",
            value: bookings.length,
            icon: <EventSeatIcon />,
            color: "#6366F1",
            bg: "#EEF2FF",
          },
          {
            label: "Payment Received",
            value: bookings.filter(
              (b) =>
                b.paymentStatus === "Payment Received" ||
                b.paymentStatus === "PAID",
            ).length,
            icon: <PaidIcon />,
            color: "#10B981",
            bg: "#ECFDF5",
          },
          {
            label: "Fully Ticketed",
            value: bookings.filter(
              (b) =>
                b.ticketStatus === "Ticketed" || b.ticketStatus === "ISSUED",
            ).length,
            icon: <ConfirmationNumberIcon />,
            color: "#0284C7",
            bg: "#E0F2FE",
          },
          {
            label: "Gross Volume",
            value: `$${bookings.reduce((sum, b) => sum + (Number(b.sellingPrice) || 0), 0).toLocaleString()}`,
            icon: <PaidIcon />,
            color: "#2563EB",
            bg: "#EFF6FF",
          },
        ].map((s, i) => (
          <Paper
            key={i}
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2.5,
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0F172A' : s.bg,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: (theme) => theme.palette.mode === 'dark' ? '#94A3B8' : 'text.secondary',
                }}
              >
                {s.label}
              </Typography>
              <Box sx={{ color: (theme) => theme.palette.mode === 'dark' ? s.color : s.color }}>{s.icon}</Box>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                color: (theme) => theme.palette.mode === 'dark' ? (s.color === '#2563EB' ? '#60A5FA' : s.color === '#0284C7' ? '#38BDF8' : s.color) : s.color,
              }}
            >
              {s.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Search & Filter Bar */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search booking ID, customer, PNR..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", md: 300 }, bgcolor: "background.paper" }}
        />
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Payment Received">Payment Received</MenuItem>
            <MenuItem value="Ticketed">Ticketed</MenuItem>
            <MenuItem value="Dispatched">Dispatched</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Date</InputLabel>
          <Select
            value={dateFilter}
            label="Date"
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="Today">Today</MenuItem>
            <MenuItem value="This Week">This Week</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Cabin Class</InputLabel>
          <Select
            value={classFilter}
            label="Cabin Class"
            onChange={(e) => setClassFilter(e.target.value)}
          >
            <MenuItem value="">All Classes</MenuItem>
            {["Economy", "Premium Economy", "Business", "First Class"].map(
              (c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>
      </Box>

      {/* Bookings Table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2.5,
          overflow: "hidden",
        }}
      >
        <AppTable
          columns={columns}
          data={filteredBookings}
          onRowClick={(row) => handleOpenDrawer(row)}
          actions={(row) => (
            <Box
              sx={{ display: "flex", gap: 0.8, whiteSpace: "nowrap" }}
              onClick={(e) => e.stopPropagation()}
            >
              {row.ticketStatus === "Pending" ||
              row.ticketStatus === "NOT_ISSUED" ? (
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  startIcon={<ConfirmationNumberIcon sx={{ fontSize: 13 }} />}
                  onClick={() => {
                    showAlert(
                      `Opening Ticket Issuance for ${row.bookingId || row.id}...`,
                      "info",
                    );
                    navigate("/ticketing");
                  }}
                  sx={{ py: 0.3, px: 1, fontSize: "0.72rem", fontWeight: 800 }}
                >
                  Issue Ticket
                </Button>
              ) : null}
              <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon sx={{ fontSize: 13 }} />}
                onClick={() => handleOpenDrawer(row)}
                sx={{ py: 0.3, px: 1, fontSize: "0.72rem", fontWeight: 700 }}
              >
                View
              </Button>
            </Box>
          )}
        />
      </Paper>

      {/* ─── MODAL BOOKING DETAIL & STATUS FLOW ─── */}
      <Dialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper' } }}
      >
        {selectedBooking && (
          <>
            {/* Dialog Header */}
            <DialogTitle
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                pb: 1,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  Booking {selectedBooking.bookingId || selectedBooking.id}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Customer: <b>{selectedBooking.customerName}</b> &nbsp;|&nbsp;
                  PNR: <b>{selectedBooking.pnr || "ABC12D"}</b>
                </Typography>
              </Box>
              <IconButton onClick={() => setDrawerOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, p: 3 }}>
              {/* STATUS LIFECYCLE FLOW STEPPER */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC',
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: "text.secondary",
                  display: "block",
                  mb: 1.5,
                  textTransform: "uppercase",
                }}
              >
                STATUS LIFECYCLE FLOW
              </Typography>

              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mb: 2 }}>
                {STATUS_STEPS.map((step, idx) => {
                  const currentStatus =
                    selectedBooking.bookingStatus ||
                    selectedBooking.status ||
                    "Confirmed";
                  const currentIdx = STATUS_STEPS.indexOf(currentStatus);
                  const isPassed = currentIdx >= idx;
                  const isCurrent = currentStatus === step;
                  return (
                    <Chip
                      key={step}
                      size="small"
                      label={step}
                      onClick={() =>
                        handleUpdateStatus(selectedBooking.id, step)
                      }
                      color={
                        isCurrent ? "primary" : isPassed ? "success" : "default"
                      }
                      variant={isCurrent || isPassed ? "filled" : "outlined"}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                        height: 22,
                      }}
                    />
                  );
                })}
                {["Cancelled", "Refunded"].map((ex) => (
                  <Chip
                    key={ex}
                    size="small"
                    label={ex}
                    onClick={() => handleUpdateStatus(selectedBooking.id, ex)}
                    color="error"
                    variant={
                      selectedBooking.bookingStatus === ex
                        ? "filled"
                        : "outlined"
                    }
                    sx={{
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "0.68rem",
                      height: 22,
                    }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Scrollable Details */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                pr: 0.5,
              }}
            >
              {/* Flight Details */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #BAE6FD",
                  bgcolor: "#F0F9FF",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, color: "info.main", mb: 1 }}
                >
                  ✈️ FLIGHT & ROUTE DETAILS
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    rowGap: 0.8,
                    fontSize: 13,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Airline / Flight:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>
                    {selectedBooking.airline || "British Airways"} (
                    {selectedBooking.flightNumber || "BA-117"})
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Route:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800 }}>
                    {selectedBooking.route || "DEL → LHR"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Departure Date:
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {selectedBooking.travelDate || "15 Oct 2026"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Cabin Class:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 800, color: "primary.main" }}
                  >
                    {selectedBooking.cabinClass || "Business"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Sabre PNR:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 800, fontFamily: "monospace" }}
                  >
                    {selectedBooking.pnr || "ABC12D"}
                  </Typography>
                </Box>
              </Paper>

              {/* Passengers Manifest */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                  👥 PASSENGERS & E-TICKETS
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {(
                    selectedBooking.passengerList || [
                      {
                        name: selectedBooking.customerName || "Karan Singh",
                        passport: "US98234109",
                        nationality: "American",
                        eTicket: "125-9834102941",
                      },
                      {
                        name: "Pooja Singh",
                        passport: "US77102934",
                        nationality: "American",
                        eTicket: "125-9834102942",
                      },
                    ]
                  ).map((p, i) => (
                    <Box
                      key={i}
                      sx={{
                        p: 1.2,
                        bgcolor: "#F8FAFC",
                        borderRadius: 1.5,
                        border: "1px solid #E2E8F0",
                        fontSize: 12,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="caption" sx={{ fontWeight: 800 }}>
                          {p.name}
                        </Typography>
                        <Chip
                          size="small"
                          label={p.nationality}
                          variant="outlined"
                          sx={{ fontSize: "0.62rem", height: 18 }}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        Passport: <b>{p.passport}</b> &nbsp;|&nbsp; E-Ticket:{" "}
                        <b style={{ color: "#10B981" }}>
                          {p.eTicket || "125-9834102941"}
                        </b>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>

              {/* Pricing & Profit Margin */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #BBF7D0",
                  bgcolor: "#F0FDF4",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 800, color: "success.main", mb: 1 }}
                >
                  💰 PRICING & NET PROFIT BREAKDOWN
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "140px 1fr",
                    rowGap: 0.8,
                    fontSize: 13,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Net Fare (Cost):
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    $
                    {(
                      selectedBooking.netFare ||
                      selectedBooking.sellingPrice * 0.85
                    ).toLocaleString()}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Selling Price:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 900,
                      color: "success.main",
                      fontSize: "0.85rem",
                    }}
                  >
                    $
                    {Number(selectedBooking.sellingPrice || 0).toLocaleString()}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Net Profit Margin:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 800, color: "#2563EB" }}
                  >
                    +$
                    {(
                      selectedBooking.profit ||
                      selectedBooking.sellingPrice * 0.15
                    ).toLocaleString()}{" "}
                    (15%)
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 700 }}
                  >
                    Payment Status:
                  </Typography>
                  <Chip
                    size="small"
                    label={selectedBooking.paymentStatus || "PAID"}
                    color="success"
                    sx={{
                      fontSize: "0.65rem",
                      height: 18,
                      width: "fit-content",
                    }}
                  />
                </Box>
              </Paper>
            </Box>

            {/* Quick Actions Footer */}
            </DialogContent>

            <DialogActions sx={{ p: 2, display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="info"
                size="small"
                startIcon={<ConfirmationNumberIcon sx={{ fontSize: 14 }} />}
                onClick={() =>
                  handleUpdateStatus(selectedBooking.id, "Ticketed")
                }
                sx={{ fontSize: "0.7rem", fontWeight: 700 }}
              >
                Issue E-Ticket
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                startIcon={<MonetizationOnIcon sx={{ fontSize: 14 }} />}
                onClick={() => setPaymentModalOpen(true)}
                sx={{ fontSize: "0.7rem", fontWeight: 700 }}
              >
                Payment Link
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<CurrencyExchangeIcon sx={{ fontSize: 14 }} />}
                onClick={() =>
                  handleUpdateStatus(selectedBooking.id, "Cancelled")
                }
                sx={{ fontSize: "0.7rem", fontWeight: 700 }}
              >
                Cancel / Refund
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* ─── CREATE NEW BOOKING MODAL (FULL SPEC FORM) ─── */}
      <AppModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Create New Flight Booking (Full Specification)"
        maxWidth="md"
        actions={
          <>
            <Button onClick={() => setAddModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSaveBooking}
              variant="contained"
              color="primary"
            >
              Confirm & Save Booking
            </Button>
          </>
        }
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Section 1: Booking & Customer Info */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "#F8FAFC",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "primary.main", mb: 1.5 }}
            >
              👤 1. BOOKING & PASSENGER INFO
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 1.5,
              }}
            >
              <TextField
                size="small"
                label="Customer Full Name *"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
              />
              <TextField
                size="small"
                label="Customer Email *"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
              />
              <TextField
                size="small"
                label="Customer Phone *"
                value={formData.customerPhone}
                onChange={(e) =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
              />
            </Box>
          </Paper>

          {/* Section 2: Flight Details */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "#F0F9FF",
              borderRadius: 2,
              border: "1px solid #BAE6FD",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "info.main", mb: 1.5 }}
            >
              ✈️ 2. FLIGHT & GDS DETAILS
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
                gap: 1.5,
              }}
            >
              <FormControl size="small" fullWidth>
                <InputLabel>Airline *</InputLabel>
                <Select
                  value={formData.airline}
                  label="Airline *"
                  onChange={(e) =>
                    setFormData({ ...formData, airline: e.target.value })
                  }
                >
                  {[
                    "British Airways (BA)",
                    "American Airlines (AA)",
                    "Emirates (EK)",
                    "Air India (AI)",
                    "Qatar Airways (QR)",
                    "Lufthansa (LH)",
                  ].map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Flight Number *"
                value={formData.flightNumber}
                onChange={(e) =>
                  setFormData({ ...formData, flightNumber: e.target.value })
                }
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Cabin Class *</InputLabel>
                <Select
                  value={formData.cabinClass}
                  label="Cabin Class *"
                  onChange={(e) =>
                    setFormData({ ...formData, cabinClass: e.target.value })
                  }
                >
                  {[
                    "Economy",
                    "Premium Economy",
                    "Business",
                    "First Class",
                  ].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Origin Airport *"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
              />

              <TextField
                size="small"
                label="Destination Airport *"
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
              />

              <TextField
                size="small"
                label="Sabre / GDS PNR *"
                value={formData.pnr}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pnr: e.target.value.toUpperCase(),
                  })
                }
                inputProps={{
                  style: { fontFamily: "monospace", fontWeight: 700 },
                }}
              />

              <TextField
                size="small"
                label="Departure Date & Time *"
                type="datetime-local"
                value={formData.departureDate}
                onChange={(e) =>
                  setFormData({ ...formData, departureDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                size="small"
                label="Arrival Date & Time *"
                type="datetime-local"
                value={formData.arrivalDate}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalDate: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                size="small"
                label="GDS Booking Ref"
                value={formData.gdsBookingRef}
                onChange={(e) =>
                  setFormData({ ...formData, gdsBookingRef: e.target.value })
                }
              />
            </Box>
          </Paper>

          {/* Section 3: Passengers Manifest */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                👥 3. PASSENGERS & PASSPORT MANIFEST
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddPassenger}
              >
                Add Passenger
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {formData.passengers.map((pax, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    bgcolor: "#F8FAFC",
                    borderRadius: 1.5,
                    border: "1px solid #E2E8F0",
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "2fr 1.5fr 1.5fr 1.5fr 40px",
                    },
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    label={`Pax #${idx + 1} Full Name`}
                    value={pax.name}
                    onChange={(e) =>
                      handlePassengerChange(idx, "name", e.target.value)
                    }
                  />
                  <TextField
                    size="small"
                    label="Passport No"
                    value={pax.passport}
                    onChange={(e) =>
                      handlePassengerChange(idx, "passport", e.target.value)
                    }
                  />
                  <TextField
                    size="small"
                    label="Expiry Date"
                    type="date"
                    value={pax.expiry}
                    onChange={(e) =>
                      handlePassengerChange(idx, "expiry", e.target.value)
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    size="small"
                    label="13-Digit E-Ticket"
                    value={pax.eTicket}
                    placeholder="125-9834102941"
                    onChange={(e) =>
                      handlePassengerChange(idx, "eTicket", e.target.value)
                    }
                  />
                  {formData.passengers.length > 1 && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemovePassenger(idx)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Section 4: Pricing & Margin Calculator */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "#F0FDF4",
              borderRadius: 2,
              border: "1px solid #86EFAC",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 800, color: "success.main", mb: 1.5 }}
            >
              💵 4. PRICING, MARKUP & PROFIT MARGIN
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                gap: 1.5,
                mb: 1.5,
              }}
            >
              <TextField
                size="small"
                label="Net Fare (Cost) *"
                type="number"
                value={formData.netFare}
                onChange={(e) =>
                  setFormData({ ...formData, netFare: Number(e.target.value) })
                }
              />
              <TextField
                size="small"
                label="Manual Markup %"
                type="number"
                value={formData.markupPct}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    markupPct: Number(e.target.value),
                  })
                }
              />
              <TextField
                size="small"
                label="Fixed Markup USD ($)"
                type="number"
                value={formData.fixedMarkup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fixedMarkup: Number(e.target.value),
                  })
                }
              />
              <TextField
                size="small"
                label="Amount Paid ($)"
                type="number"
                value={formData.amountPaid}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amountPaid: Number(e.target.value),
                  })
                }
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                pt: 0.5,
              }}
            >
              <Typography variant="body2">
                Selling Price:{" "}
                <b style={{ fontSize: 16, color: "#10B981" }}>
                  ${calcSellingPrice.toLocaleString()}
                </b>
              </Typography>
              <Typography variant="body2">
                Net Profit:{" "}
                <b style={{ fontSize: 16, color: "#2563EB" }}>
                  +${calcProfit.toLocaleString()}
                </b>{" "}
                ({formData.markupPct}%)
              </Typography>
              <Typography variant="body2">
                Balance Due:{" "}
                <b
                  style={{
                    fontSize: 16,
                    color:
                      calcSellingPrice - formData.amountPaid > 0
                        ? "#DC2626"
                        : "#10B981",
                  }}
                >
                  $
                  {Math.max(
                    0,
                    calcSellingPrice - formData.amountPaid,
                  ).toLocaleString()}
                </b>
              </Typography>
            </Box>
          </Paper>
        </Box>
      </AppModal>

      {/* Payment Link Modal */}
      <PaymentLinkModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={(data) => {
          setPaymentModalOpen(false);
          showAlert(
            `Payment link generated for ${data.customer} — ${data.currency} ${Number(data.amount).toLocaleString()}`,
            "success",
          );
        }}
      />
    </Box>
  );
}
