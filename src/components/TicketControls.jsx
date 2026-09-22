import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// Icons
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import RefreshIcon from '@mui/icons-material/Refresh';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import TerminalIcon from '@mui/icons-material/Terminal';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import LuggageIcon from '@mui/icons-material/Luggage';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PrintIcon from '@mui/icons-material/Print';
import ShieldIcon from '@mui/icons-material/Shield';

import { useAlert } from '../contexts/AlertContext';

export default function TicketControls({ selectedItem, onIssueTicketSuccess }) {
  const { showAlert } = useAlert();

  const [pnrCode, setPnrCode] = useState(selectedItem?.pnr || 'ABC12D');
  const [eTicketNumbers, setETicketNumbers] = useState('125-9482019384\n125-9482019385');
  const [validationError, setValidationError] = useState('');
  const [issuedSuccessState, setIssuedSuccessState] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [gdsCommandOutput, setGdsCommandOutput] = useState('');

  // Sync PNR when selectedItem changes
  useEffect(() => {
    if (selectedItem?.pnr) {
      setPnrCode(selectedItem.pnr);
      setValidationError('');
      setIssuedSuccessState(null);
      setGdsCommandOutput('');
      // Generate default 13-digit airline ticket numbers
      const prefix = selectedItem.supplier?.includes('BA') ? '125' : selectedItem.supplier?.includes('AI') ? '098' : '176';
      const num1 = `${prefix}-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const num2 = `${prefix}-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setETicketNumbers(`${num1}\n${num2}`);
    }
  }, [selectedItem]);

  // GDS Cryptic Commands Simulation
  const handleRunGdsCommand = (cmd) => {
    if (cmd === 'TTP/ET') {
      const prefix = selectedItem?.supplier?.includes('AI') ? '098' : selectedItem?.supplier?.includes('EK') ? '176' : '125';
      const num1 = `${prefix}-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const num2 = `${prefix}-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setETicketNumbers(`${num1}\n${num2}`);
      setGdsCommandOutput(`> TTP/ET\nOK ETKT ISSUED TO BSP LINK · TKT 1: ${num1} / TKT 2: ${num2}\nSTATUS: OK ETKT DIRECT STOCK PROCESSED`);
      showAlert('⚡ Executed GDS TTP/ET command! 13-Digit E-Ticket numbers allocated.', 'success');
    } else if (cmd === 'TTR') {
      setGdsCommandOutput(`> TTR\nOK TKT VOID PROCESSED · TRANSACTION CANCELLED PRIOR TO 23:59 GMT (ZERO AIRLINE PENALTY)`);
      showAlert('✓ Executed GDS TTR Void command.', 'info');
    } else if (cmd === 'W/TAX') {
      setGdsCommandOutput(`> W/TAX\nTOTAL TAX VERIFIED: $262.00 (XT 120.00IN 45.00GB 85.00UB 12.00F4) · FARE RE-FILED`);
      showAlert('✓ Recalculated GDS airport taxes and surcharge fees.', 'info');
    } else if (cmd === 'FOP') {
      setGdsCommandOutput(`> FOP CC VI 4111********1111/EXP 1228/AUTH 948201\nFORM OF PAYMENT AUTHORIZED · APPROVED BY CARD NETWORK`);
      showAlert('✓ Payment FOP verified with Merchant Gateway.', 'success');
    }
  };

  const handleSubmit = () => {
    setValidationError('');

    if (!pnrCode || !pnrCode.trim()) {
      setValidationError('Please enter or select a valid PNR code.');
      showAlert('PNR code is required for ticket issuance', 'warning');
      return;
    }

    const lines = eTicketNumbers
      .split('\n')
      .map(l => l.trim().replace(/-/g, ''))
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      setValidationError('Please enter at least one 13-digit e-ticket number.');
      showAlert('At least one e-ticket number is required', 'warning');
      return;
    }

    const invalidLines = lines.filter(line => !/^\d{13}$/.test(line));
    if (invalidLines.length > 0) {
      const err = `Invalid ticket number format: "${invalidLines[0]}". Each e-ticket number must be exactly 13 digits (e.g. 125-9482019384).`;
      setValidationError(err);
      showAlert(err, 'error');
      return;
    }

    const formattedETickets = lines.map(l => `${l.slice(0, 3)}-${l.slice(3)}`);

    const successData = {
      bookingRef: selectedItem?.bookingId || selectedItem?.id || 'BK-1001',
      customerName: selectedItem?.passenger || selectedItem?.name || 'M. Chen',
      route: selectedItem?.route || 'JFK → LHR',
      airline: selectedItem?.supplier?.includes('BA') ? 'British Airways' : selectedItem?.supplier?.includes('SQ') ? 'Singapore Airlines' : 'American Airlines',
      pnr: pnrCode,
      eTickets: formattedETickets,
      fare: selectedItem?.fare || '$1,050.00',
      taxes: selectedItem?.taxes || '$200.00',
      totalAmount: selectedItem?.amount || '$1,250.00',
      status: 'Ticketed',
      dispatchStatus: 'Dispatched via Email & WhatsApp',
      issuedAt: new Date().toLocaleString()
    };

    setIssuedSuccessState(successData);
    setShowReceiptModal(true);
    showAlert(`🎫 E-Tickets Issued & Dispatched! PNR: ${pnrCode}. Official PDF receipt generated.`, 'success');

    if (onIssueTicketSuccess) {
      onIssueTicketSuccess(successData);
    }
  };

  const handleResetForNext = () => {
    setIssuedSuccessState(null);
    setValidationError('');
    setGdsCommandOutput('');
    setETicketNumbers('125-9482019384\n125-9482019385');
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ConfirmationNumberIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
            13-DIGIT E-TICKET ISSUANCE DESK
          </Typography>
        </Box>
        <Chip size="small" label="Phase 6 Operations" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        Execute GDS issuance macros (<code>TTP/ET</code>), allocate 13-digit IATA airline ticket numbers, generate official passenger receipts, and auto-dispatch confirmations.
      </Typography>

      {/* Selected Item Alert */}
      {!selectedItem ? (
        <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
          Select a booking from the Ready Queue above to load its passenger & PNR context.
        </Alert>
      ) : (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 2, borderRadius: 2 }}>
          Active Target: <b>{selectedItem.bookingId || selectedItem.id} — {selectedItem.passenger || selectedItem.name}</b> ({selectedItem.route}) · {selectedItem.supplier}
        </Alert>
      )}

      {/* ─── GDS SHORTCUT MACROS BAR ─── */}
      <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#0F172A', borderRadius: 2, mb: 2, color: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TerminalIcon sx={{ fontSize: 16 }} /> GDS Ticketing Macros:
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontFamily: 'monospace' }}>BSP LINK: LIVE</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="contained"
            onClick={() => handleRunGdsCommand('TTP/ET')}
            sx={{ bgcolor: '#2563EB', color: '#FFFFFF', fontWeight: 900, fontSize: '0.72rem', py: 0.3, textTransform: 'none' }}
          >
            TTP/ET (Issue Electronic Ticket)
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleRunGdsCommand('W/TAX')}
            sx={{ color: '#38BDF8', borderColor: '#38BDF8', fontWeight: 800, fontSize: '0.72rem', py: 0.3, textTransform: 'none' }}
          >
            W/TAX (Recalculate Taxes)
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleRunGdsCommand('FOP')}
            sx={{ color: '#4ADE80', borderColor: '#4ADE80', fontWeight: 800, fontSize: '0.72rem', py: 0.3, textTransform: 'none' }}
          >
            FOP (Verify Payment)
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleRunGdsCommand('TTR')}
            sx={{ color: '#F87171', borderColor: '#F87171', fontWeight: 800, fontSize: '0.72rem', py: 0.3, textTransform: 'none' }}
          >
            TTR (Void Prior to TTL)
          </Button>
        </Box>

        {gdsCommandOutput && (
          <Box sx={{ mt: 1.5, p: 1, bgcolor: '#1E293B', borderRadius: 1.5, fontFamily: 'monospace', fontSize: '0.75rem', color: '#4ADE80', whiteSpace: 'pre-wrap' }}>
            {gdsCommandOutput}
          </Box>
        )}
      </Paper>

      {/* ─── SUCCESS BANNER & RECEIPT BUTTON ─── */}
      {issuedSuccessState ? (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            bgcolor: '#F0FDF4',
            border: '2px solid #86EFAC',
            borderRadius: 2,
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <VerifiedIcon color="success" fontSize="medium" />
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#166534' }}>
              E-TICKETS ISSUED & DISPATCHED
            </Typography>
            <Chip size="small" label="TICKETED 100%" color="success" sx={{ fontWeight: 900, ml: 'auto' }} />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 0.8, fontSize: '0.85rem', mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Booking / PNR:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
              {issuedSuccessState.bookingRef} · PNR #{issuedSuccessState.pnr}
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Passenger & Route:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{issuedSuccessState.customerName} ({issuedSuccessState.route})</Typography>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>13-Digit E-Tickets:</Typography>
            <Box>
              {issuedSuccessState.eTickets.map((t, i) => (
                <Chip
                  key={i}
                  size="small"
                  label={`Pax ${i + 1}: ${t}`}
                  color="success"
                  variant="outlined"
                  sx={{ fontWeight: 900, fontFamily: 'monospace', mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>Dispatch Status:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'success.main' }}>
              ✓ Email PDF & WhatsApp Ticket Link Sent Automatically
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              onClick={() => setShowReceiptModal(true)}
              sx={{ fontWeight: 800, flex: 1, textTransform: 'none' }}
            >
              View Official PDF Itinerary Receipt
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RefreshIcon />}
              onClick={handleResetForNext}
              sx={{ fontWeight: 700 }}
            >
              Next Ticket
            </Button>
          </Box>
        </Paper>
      ) : (
        /* ─── FORM INPUTS ─── */
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {validationError && (
            <Alert severity="error" onClose={() => setValidationError('')} sx={{ borderRadius: 2 }}>
              {validationError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Sabre / Amadeus PNR Code *"
                value={pnrCode}
                onChange={(e) => setPnrCode(e.target.value.toUpperCase())}
                placeholder="e.g. ABC12D"
                inputProps={{ style: { fontFamily: 'monospace', fontWeight: 900 } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                size="small"
                label="Lead Passenger"
                value={selectedItem?.passenger || selectedItem?.name || 'M. Chen'}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          {/* E-Ticket Numbers Textarea */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="13-Digit E-Ticket Numbers (1 per passenger) *"
            value={eTicketNumbers}
            onChange={(e) => setETicketNumbers(e.target.value)}
            placeholder="125-9482019384&#10;125-9482019385"
            helperText="Format: 3-digit Airline IATA prefix (e.g. 125 BA / 098 AI / 176 EK) + 10 digits"
            sx={{
              '& textarea': {
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                bgcolor: '#F8FAFC',
                p: 1.2,
                borderRadius: 1.5
              }
            }}
          />

          <Button
            variant="contained"
            color="success"
            size="large"
            fullWidth
            startIcon={<SendIcon />}
            disabled={!selectedItem}
            onClick={handleSubmit}
            sx={{ py: 1.2, fontWeight: 900, borderRadius: 2, fontSize: '0.95rem', textTransform: 'none' }}
          >
            Issue 13-Digit E-Ticket & Dispatch to Client →
          </Button>
        </Box>
      )}

      {/* ─── OFFICIAL E-TICKET PASSENGER ITINERARY / RECEIPT MODAL ─── */}
      <Dialog
        open={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ p: 2.5, bgcolor: '#0F172A', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ConfirmationNumberIcon sx={{ color: '#38BDF8' }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                Official Electronic Ticket Passenger Itinerary & Receipt
              </Typography>
              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                IATA Accredited Agency Agency Code: 91-4 9820 1 · CEOFLIGHTS Concierge
              </Typography>
            </Box>
          </Box>
          <Chip label="CONFIRMED & TICKETED" color="success" sx={{ fontWeight: 900 }} />
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {issuedSuccessState && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
              {/* Top Header Card */}
              <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>BOOKING REF / PNR:</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', fontFamily: 'monospace' }}>
                      {issuedSuccessState.pnr}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>PRIMARY PASSENGER:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                      {issuedSuccessState.customerName}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>OPERATING AIRLINE:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                      {issuedSuccessState.airline}
                    </Typography>
                  </Grid>

                  <Grid item xs={6} sm={3}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>DATE OF ISSUE:</Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>
                      {issuedSuccessState.issuedAt}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Passenger & Ticket Breakdown */}
              <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: '#1E293B' }}>
                  🎫 Electronic Ticket Allocations
                </Typography>
                {issuedSuccessState.eTickets.map((tkt, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, mb: 1, bgcolor: '#F1F5F9', borderRadius: 1.5 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>Passenger #{idx + 1}: {idx === 0 ? issuedSuccessState.customerName : 'Accompanying Pax'}</Typography>
                      <Typography variant="caption" color="text.secondary">Seat: Assigned at Check-in | Meal: Requested | 🧳 2x 32kg Included</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, display: 'block' }}>13-DIGIT E-TICKET:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'success.main' }}>{tkt}</Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>

              {/* Flight Segments Ladder */}
              <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlightTakeoffIcon color="primary" fontSize="small" /> Confirmed Flight Segments ({issuedSuccessState.route})
                </Typography>
                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 1.5, border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 900 }}>15:45 · JFK John F. Kennedy Intl → 07:30 +1 · LHR London Heathrow</Typography>
                    <Typography variant="caption" color="text.secondary">Flight BA 178 · Boeing 777-300ER · Club World Business Class (Lie-Flat)</Typography>
                  </Box>
                  <Chip label="STATUS: OK (HK1)" color="success" size="small" sx={{ fontWeight: 900 }} />
                </Box>
              </Paper>

              {/* Payment & Surcharge Ladder */}
              <Box sx={{ p: 2, bgcolor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 800, display: 'block' }}>TOTAL AMOUNT PAID & AUTHORIZED:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 900, color: '#047857' }}>{issuedSuccessState.totalAmount} USD</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShieldIcon sx={{ color: '#059669' }} />
                  <Typography variant="caption" sx={{ color: '#065F46', fontWeight: 700 }}>
                    Form of Payment: Credit Card (FOP CC) · Zero Balance Due
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #E2E8F0', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
              onClick={() => showAlert('✓ Sent official E-Ticket confirmation to client via WhatsApp!', 'success')}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              Send WhatsApp
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EmailIcon />}
              onClick={() => showAlert('✓ Dispatched official PDF ticket receipt to client email!', 'success')}
              sx={{ fontWeight: 800, textTransform: 'none' }}
            >
              Send Email PDF
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={() => showAlert('✓ Sending PDF to printer / download folder!', 'success')}
              sx={{ fontWeight: 800 }}
            >
              Print / Save PDF
            </Button>
            <Button onClick={() => setShowReceiptModal(false)} sx={{ fontWeight: 700 }}>
              Close
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
