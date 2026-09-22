import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import TerminalIcon from '@mui/icons-material/Terminal';
import SendIcon from '@mui/icons-material/Send';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { useAlert } from '../contexts/AlertContext';

export default function GDSTerminalModal({ open, onClose, initialData, onSave }) {
  const { showAlert } = useAlert();

  // Tab State: 0 = GDS Terminal Emulator, 1 = Itinerary Details & Pricing
  const [activeTab, setActiveTab] = useState(0);

  // Command prompt input & terminal logs
  const [commandInput, setCommandInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState([
    {
      type: 'avail',
      text: '848  J9 C9 D0 P0 I0 W0 R0 E0 Y4 B3 H3 K2 M0 L0 V0 S0 N0 Q0 O0   BOM HKG  01:40  10:10  77W'
    },
    {
      type: 'avail',
      text: '870  J9 C9 D0 P0 I0 W0 R0 E0 Y4 B3 H3 K2 M0 L0 V0 S0 N0 Q0 O0   SFO      13:25  18:55  77W'
    },
    {
      type: 'avail',
      text: '696  J1 C0 D0 P0 I0 W3 R0 E0 Y9 B9 H9 K9 M0 L0 V0 S0 N0 Q0 O0   BOM HKG  22:25  06:55+1 77W'
    },
    {
      type: 'avail',
      text: '870  J1 C0 D0 P0 I0 W3 R0 E0 Y9 B9 H9 K9 M0 L0 V0 S0 N0 Q0 O0   SFO      13:25  18:55  77W  12H 30MIN'
    }
  ]);

  // PNR Segments
  const [pnrSegments, setPnrSegments] = useState([
    {
      id: 1,
      line: '696',
      class: 'J',
      date: '25SEP FRI',
      origin: 'BOM',
      dest: 'HKG',
      action: 'SS1',
      dep: '22:25',
      arr: '06:55 +1'
    },
    {
      id: 2,
      line: '870',
      class: 'J',
      date: '26SEP SAT',
      origin: 'HKG',
      dest: 'SFO',
      action: 'SS1',
      dep: '13:25',
      arr: '18:55'
    }
  ]);

  // EDIFACT / Raw Cryptic text
  const [edifactLines, setEdifactLines] = useState(
    '1 CX 696J 25SEP F BOMHKG*SS1 1025P 655A 26SEP J /DCCX /E\n2 CX 870J 26SEP J HKGSFO*SS1 125P 1055A /DCCX /E'
  );

  // Pricing & Pricing breakdown
  const [ticketType, setTicketType] = useState('REVENUE TICKET'); // 'REVENUE TICKET' | 'MILEAGE TICKET'
  const [adultCount, setAdultCount] = useState(2);
  const [netPricePerAdult, setNetPricePerAdult] = useState(1225.00);
  const [markupPerAdult, setMarkupPerAdult] = useState(284.24);
  const [internalRemarks, setInternalRemarks] = useState('Holding J class for 2 pax on Cathay Pacific. Lie-flat guarantee.');
  const [whatsappNotify, setWhatsappNotify] = useState(true);
  const [pastedImage, setPastedImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      if (initialData.rawEdifact) setEdifactLines(initialData.rawEdifact);
      if (initialData.netPrice) setNetPricePerAdult(Number(initialData.netPrice) || 1225.00);
      if (initialData.markup) setMarkupPerAdult(Number(initialData.markup) || 284.24);
      if (initialData.pax) setAdultCount(Number(initialData.pax) || 2);
    }
  }, [initialData]);

  // Calculations
  const sellingPricePerAdult = Number((Number(netPricePerAdult) + Number(markupPerAdult)).toFixed(2));
  const totalNet = Number((netPricePerAdult * adultCount).toFixed(2));
  const totalMarkup = Number((markupPerAdult * adultCount).toFixed(2));
  const totalSelling = Number((sellingPricePerAdult * adultCount).toFixed(2));
  const marginPercentage = totalNet > 0 ? ((totalMarkup / totalNet) * 100).toFixed(1) : 0;

  // Handle Command Submit
  const handleSendCommand = (cmdToRun) => {
    const cmd = (cmdToRun || commandInput).trim().toUpperCase();
    if (!cmd) return;

    let responseMsg = '';

    if (cmd.startsWith('SS1') || cmd.startsWith('SS')) {
      responseMsg = `IG STATUS: SEGMENT ${cmd} ADDED TO PNR • SEATS CONFIRMED HK1`;
      setPnrSegments(prev => [
        ...prev,
        {
          id: prev.length + 1,
          line: '870',
          class: 'J',
          date: '26SEP',
          origin: 'HKG',
          dest: 'SFO',
          action: 'HK1',
          dep: '13:25',
          arr: '18:55'
        }
      ]);
      showAlert(`✓ Segment ${cmd} added to PNR in GDS emulator.`, 'success');
    } else if (cmd === 'RT' || cmd.startsWith('RT')) {
      responseMsg = `--- PNR RECORD DISPLAY: PNR 7KL98P ---\n1.1 SHARMA/ATUL MR 1.2 SHARMA/PRIYA MRS\n1 CX 696J 25SEP BOMHKG HK2 2225 0655\n2 CX 870J 26SEP HKGSFO HK2 1325 1855\nTK TL24SEP/BOM/CX/E-TKT`;
    } else if (cmd === 'IR' || cmd === 'IG') {
      responseMsg = `IG STATUS: SEGMENTS CONFIRMED & SYNCED TO PNR BUFFER.`;
      showAlert('✓ GDS PNR buffer synced successfully.', 'info');
    } else if (cmd.startsWith('FQD') || cmd.startsWith('FXX')) {
      responseMsg = `FQD RESULTS BOM-SFO / CX / BUSINESS (J):\nFARE BASIS: J18OWUS / NET: USD 1,225.00 / TAX: USD 284.00 / TKT DEADLINE: 48HRS`;
    } else {
      responseMsg = `GDS RESPONSE FOR [${cmd}]: COMMAND EXECUTED SUCCESSFULLY.`;
    }

    setTerminalLogs(prev => [
      ...prev,
      { type: 'command', text: `> ${cmd}` },
      { type: 'response', text: responseMsg }
    ]);

    setCommandInput('');
  };

  // Image Paste Handler (Ctrl+V)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setPastedImage(event.target.result);
          showAlert('📸 Itinerary screenshot pasted from clipboard!', 'success');
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPastedImage(event.target.result);
        showAlert('📸 Itinerary screenshot uploaded!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopyEdifact = () => {
    navigator.clipboard.writeText(edifactLines);
    showAlert('✓ EDIFACT GDS snippet copied to clipboard!', 'info');
  };

  const handleSaveAll = () => {
    const payload = {
      pnr: '7KL98P',
      ticketType,
      adultCount,
      netPricePerAdult,
      markupPerAdult,
      sellingPricePerAdult,
      totalSelling,
      totalNet,
      totalMarkup,
      marginPercentage,
      internalRemarks,
      whatsappNotify,
      edifactLines,
      pnrSegments,
      pastedImage
    };

    if (onSave) {
      onSave(payload);
    }
    showAlert('✓ GDS PNR & Pricing changes saved successfully!', 'success');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          minHeight: '82vh'
        }
      }}
      onPaste={handlePaste}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0A0F1D',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/30">
            <TerminalIcon sx={{ fontSize: 20, color: 'white' }} />
          </div>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2, fontSize: '1.05rem' }}>
              GDS Terminal Emulator & Itinerary Desk
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
              Live Sabre / Amadeus Cryptic Gateway • Segment & Margin Control
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{
              minHeight: 36,
              '& .MuiTab-root': {
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.78rem',
                fontWeight: 700,
                minHeight: 36,
                py: 0.5,
                px: 2,
                borderRadius: 2,
                textTransform: 'none',
                '&.Mui-selected': {
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#3B82F6',
                height: 3
              }
            }}
          >
            <Tab label="1. GDS Terminal & PNR Builder" />
            <Tab label="2. Itinerary Details & Net/Selling Pricing" />
          </Tabs>

          <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3, backgroundColor: '#0B1120', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {activeTab === 0 ? (
          /* TAB 0: GDS Terminal Emulator (Exact Match to Screenshot 1) */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Terminal Screen */}
            <Paper
              elevation={0}
              sx={{
                backgroundColor: '#1E1B4B', // Deep indigo GDS background
                backgroundImage: 'radial-gradient(ellipse at top, #2E1065 0%, #0F172A 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: 2.5,
                p: 2.5,
                fontFamily: 'monospace',
                color: '#E0E7FF',
                minHeight: 420,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              <Box sx={{ overflowY: 'auto', maxHeight: 360, pr: 1 }}>
                {/* Available Inventory Header */}
                <Typography variant="caption" sx={{ color: '#A5B4FC', fontWeight: 800, letterSpacing: 0.8, display: 'block', mb: 1 }}>
                  FLIGHT AVAILABILITY (BOM → HKG → SFO) • CABIN CLASS INVENTORY:
                </Typography>

                {terminalLogs.map((log, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      fontSize: '0.84rem',
                      lineHeight: 1.6,
                      color: log.type === 'command' ? '#FBBF24' : log.type === 'response' ? '#34D399' : '#C7D2FE',
                      whiteSpace: 'pre-wrap',
                      fontWeight: 600,
                      my: 0.3
                    }}
                  >
                    {log.text}
                  </Box>
                ))}

                <Divider sx={{ my: 2, borderColor: 'rgba(165, 180, 252, 0.2)' }} />

                {/* IG Status: Segments Added to PNR */}
                <Box sx={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', p: 1.5, borderRadius: 1.5, border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                  <Typography variant="caption" sx={{ color: '#34D399', fontWeight: 900, letterSpacing: 0.8, display: 'block', mb: 1 }}>
                    IG STATUS: SEGMENTS ADDED TO PNR
                  </Typography>

                  {pnrSegments.map((seg) => (
                    <Box
                      key={seg.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        fontSize: '0.82rem',
                        color: '#F1F5F9',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ color: '#38BDF8', fontWeight: 800 }}>{seg.line}</span>
                        <span style={{ color: '#F472B6', fontWeight: 700 }}>Class {seg.class}</span>
                        <span style={{ color: '#E2E8F0' }}>{seg.date}</span>
                        <span style={{ color: '#FBBF24', fontWeight: 800 }}>{seg.origin} → {seg.dest}</span>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span style={{ color: '#34D399', fontWeight: 800 }}>{seg.action}</span>
                        <span>{seg.dep} — {seg.arr}</span>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Command Prompt Box (Exact to Screenshot 1) */}
              <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(165, 180, 252, 0.2)' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="TYPE COMMAND HERE (e.g. SS1 1 J1, RT, IR, FQD BOM SFO)"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendCommand();
                      }
                    }}
                    sx={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: 1.5,
                      input: {
                        color: '#F8FAFC',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '0.88rem'
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(165, 180, 252, 0.4)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#38BDF8'
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleSendCommand()}
                    sx={{
                      backgroundColor: '#0D9488',
                      color: 'white',
                      fontWeight: 800,
                      px: 3,
                      textTransform: 'uppercase',
                      '&:hover': { backgroundColor: '#0F766E' }
                    }}
                    startIcon={<SendIcon />}
                  >
                    Send
                  </Button>
                </Box>

                {/* Quick Command Chips */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1.2 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', alignSelf: 'center', mr: 0.5, fontWeight: 700 }}>
                    Quick GDS:
                  </Typography>
                  {[
                    { label: 'SS1 (Hold 1 Seat)', cmd: 'SS1 1 J1' },
                    { label: '1 CX 696J', cmd: '1 CX 696J 25SEP BOMHKG' },
                    { label: 'RT (Display PNR)', cmd: 'RT' },
                    { label: 'IR (Ignore & Refresh)', cmd: 'IR' },
                    { label: 'FQD (Check Fares)', cmd: 'FQD BOM SFO /ACX /DJ' }
                  ].map((qc) => (
                    <Chip
                      key={qc.label}
                      label={qc.label}
                      size="small"
                      onClick={() => handleSendCommand(qc.cmd)}
                      sx={{
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        color: '#93C5FD',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        border: '1px solid rgba(147, 197, 253, 0.25)',
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#2563EB', color: 'white' }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Box>
        ) : (
          /* TAB 1: Itinerary Details & Net vs Selling Pricing (Exact Match to Screenshot 4) */
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' }, gap: 3 }}>
            {/* Left Column: EDIFACT Snippet & Screenshot Upload */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Raw EDIFACT GDS Snippet Box */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    EDIFACT GDS Cryptic Itinerary Snippet
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon sx={{ fontSize: 14 }} />}
                    onClick={handleCopyEdifact}
                    sx={{ color: '#93C5FD', fontSize: '0.72rem', py: 0 }}
                  >
                    Copy Snippet
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={edifactLines}
                  onChange={(e) => setEdifactLines(e.target.value)}
                  sx={{
                    backgroundColor: '#0F172A',
                    borderRadius: 2,
                    textarea: {
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      color: '#34D399',
                      fontWeight: 700
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(52, 211, 153, 0.3)'
                    }
                  }}
                />
              </Box>

              {/* Upload or Paste Screenshot (Ctrl+V) */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#93C5FD', display: 'block', mb: 0.8 }}>
                  Upload or Paste Itinerary Screenshot (Ctrl/Cmd + V)
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed rgba(147, 197, 253, 0.3)',
                    borderRadius: 2.5,
                    p: 2,
                    textAlign: 'center',
                    backgroundColor: 'rgba(15, 23, 42, 0.5)',
                    '&:hover': { borderColor: '#38BDF8' }
                  }}
                >
                  {pastedImage ? (
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={pastedImage}
                        alt="Pasted Itinerary"
                        style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => setPastedImage(null)}
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.7)', color: '#F87171' }}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ py: 1.5 }}>
                      <CloudUploadIcon sx={{ fontSize: 32, color: '#60A5FA', mb: 0.5 }} />
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '0.8rem' }}>
                        Drag & Drop or Press <b>Ctrl + V</b> to paste image
                      </Typography>
                      <Button component="label" size="small" variant="outlined" sx={{ mt: 1, borderColor: '#38BDF8', color: '#38BDF8', fontSize: '0.72rem' }}>
                        Choose File
                        <input type="file" hidden accept="image/*" onChange={handleFileUpload} />
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Internal Remarks & WhatsApp Toggle */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#93C5FD' }}>
                    Internal Remarks (Sales & Ops)
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={whatsappNotify}
                        onChange={(e) => setWhatsappNotify(e.target.checked)}
                        sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#22C55E' } }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.72rem', color: '#22C55E', fontWeight: 700 }}>
                        <WhatsAppIcon sx={{ fontSize: 15 }} /> Sync WhatsApp
                      </Box>
                    }
                  />
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={internalRemarks}
                  onChange={(e) => setInternalRemarks(e.target.value)}
                  placeholder="Notes on fare conditions, lie-flat guarantees, or baggage rules..."
                  sx={{
                    backgroundColor: '#0F172A',
                    borderRadius: 2,
                    textarea: { color: 'white', fontSize: '0.8rem' }
                  }}
                />
              </Box>
            </Box>

            {/* Right Column: Selling Price vs Net Price Calculator (Screenshot 4) */}
            <Paper
              elevation={0}
              sx={{
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderRadius: 2.5,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Ticket Type Toggle */}
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 0.8, textTransform: 'uppercase' }}>
                    Ticket Issuance Model
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {['REVENUE TICKET', 'MILEAGE TICKET'].map((type) => (
                      <Button
                        key={type}
                        fullWidth
                        size="small"
                        variant={ticketType === type ? 'contained' : 'outlined'}
                        onClick={() => setTicketType(type)}
                        sx={{
                          py: 0.8,
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          backgroundColor: ticketType === type ? '#2563EB' : 'transparent',
                          borderColor: ticketType === type ? '#2563EB' : 'rgba(255,255,255,0.2)',
                          color: 'white'
                        }}
                      >
                        {type}
                      </Button>
                    ))}
                  </Box>
                </Box>

                {/* Pax Count & Net Price per Adult */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                  <TextField
                    label="Adult Passengers"
                    type="number"
                    size="small"
                    value={adultCount}
                    onChange={(e) => setAdultCount(Math.max(1, parseInt(e.target.value) || 1))}
                    sx={{ backgroundColor: '#0A0F1D' }}
                  />
                  <TextField
                    label="Net Price / Pax ($)"
                    type="number"
                    size="small"
                    value={netPricePerAdult}
                    onChange={(e) => setNetPricePerAdult(parseFloat(e.target.value) || 0)}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                    sx={{ backgroundColor: '#0A0F1D' }}
                  />
                </Box>

                {/* Markup per Adult */}
                <TextField
                  label="Markup / Margin per Pax ($)"
                  type="number"
                  size="small"
                  fullWidth
                  value={markupPerAdult}
                  onChange={(e) => setMarkupPerAdult(parseFloat(e.target.value) || 0)}
                  InputProps={{ startAdornment: <InputAdornment position="start">+$</InputAdornment> }}
                  helperText={`Agency Profit Margin: +${marginPercentage}%`}
                  sx={{
                    backgroundColor: '#0A0F1D',
                    '& .MuiFormHelperText-root': { color: '#34D399', fontWeight: 800 }
                  }}
                />

                <Divider sx={{ my: 0.5, borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Summary Table */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>Net Airline Cost ({adultCount} pax):</span>
                    <span style={{ fontWeight: 800, color: '#94A3B8' }}>${totalNet.toLocaleString()}</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                    <span style={{ color: '#34D399' }}>Agency Total Margin:</span>
                    <span style={{ fontWeight: 800, color: '#34D399' }}>+${totalMarkup.toLocaleString()} ({marginPercentage}%)</span>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', pt: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <span style={{ fontWeight: 900, color: '#FBBF24' }}>Client Selling Price:</span>
                    <span style={{ fontWeight: 900, color: '#FBBF24', fontSize: '1.25rem' }}>${totalSelling.toLocaleString()} USD</span>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 2.5, p: 1.5, borderRadius: 2, backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                <Typography variant="caption" sx={{ color: '#93C5FD', fontWeight: 700, display: 'block' }}>
                  ✓ Instant Quote Sync Enabled: Selling price will automatically populate in Option #1 Email Quote Builder.
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </DialogContent>

      {/* Modal Actions */}
      <DialogActions sx={{ p: 2, px: 3, backgroundColor: '#0A0F1D', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveAll}
          sx={{
            backgroundColor: '#2563EB',
            color: 'white',
            fontWeight: 800,
            px: 3.5,
            py: 0.9,
            borderRadius: 2,
            '&:hover': { backgroundColor: '#1D4ED8' }
          }}
          startIcon={<CheckCircleIcon />}
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
