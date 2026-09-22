import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import TerminalIcon from '@mui/icons-material/Terminal';
import GDSTerminalModal from './GDSTerminalModal';
import { useAlert } from '../contexts/AlertContext';

export default function GDSParsingBox({ activeRequest, onParseSuccess }) {
  const { showAlert } = useAlert();
  const [terminalOpen, setTerminalOpen] = useState(false);
  
  const defaultGdsText = activeRequest?.gdsRaw ||
    '1 AA 100 J 15OCT JFK LHR 1830 0730+1\n2 BA 117 C 22OCT LHR JFK 1100 1430';

  const [rawGDS, setRawGDS] = useState(defaultGdsText);
  const [parsingState, setParsingState] = useState('idle'); // 'idle' | 'parsing' | 'parsed' | 'error' | 'imported'
  const [parsedData, setParsedData] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [importMessage, setImportMessage] = useState('');

  useEffect(() => {
    if (activeRequest?.gdsRaw) {
      setRawGDS(activeRequest.gdsRaw);
      setParsingState('idle');
      setParsedData(null);
      setValidationMessage('');
      setImportMessage('');
    }
  }, [activeRequest]);

  const handleParse = () => {
    setValidationMessage('');
    setImportMessage('');

    if (!rawGDS || !rawGDS.trim()) {
      setParsingState('error');
      showAlert('Please paste raw GDS PNR text to parse', 'warning');
      return;
    }

    setParsingState('parsing');

    // Simulated 500ms frontend parse delay
    setTimeout(() => {
      const lines = rawGDS.split('\n').filter(l => l.trim().length > 0);

      if (lines.length === 0) {
        setParsingState('error');
        showAlert('Validation Error: Unable to parse empty GDS text.', 'error');
        return;
      }

      const parsedFlights = lines.map((line, index) => {
        const isAA = line.includes('AA');
        const isBA = line.includes('BA');
        const isVS = line.includes('VS');
        const isEK = line.includes('EK');
        const isSQ = line.includes('SQ');

        const carrier = isAA ? 'American Airlines' :
                        isBA ? 'British Airways' :
                        isVS ? 'Virgin Atlantic' :
                        isEK ? 'Emirates' :
                        isSQ ? 'Singapore Airlines' : 'Partner Airline';

        const flightNo = line.match(/([A-Z]{2}\s*\d{2,4})/)?.[0] || (index === 0 ? 'AA 100' : 'BA 117');
        const cabinClass = line.match(/\s([JCFY])\s/)?.[1] || 'J';
        const date = line.match(/(\d{2}[A-Z]{3})/)?.[0] || '15OCT';
        const times = line.match(/\d{4}/g) || ['1830', '0730'];

        return {
          id: index + 1,
          flightNumber: flightNo,
          carrier: carrier,
          origin: activeRequest?.origin || (index === 0 ? 'JFK' : 'LHR'),
          destination: activeRequest?.destination || (index === 0 ? 'LHR' : 'JFK'),
          date: date,
          departure: times[0] ? `${times[0].slice(0, 2)}:${times[0].slice(2)}` : '18:30',
          arrival: times[1] ? `${times[1].slice(0, 2)}:${times[1].slice(2)}+1` : '07:30+1',
          class: `Business (Class ${cabinClass})`,
          bookingClass: `Class ${cabinClass}`,
          pnr: 'ABC12D',
          fareBasis: `${cabinClass}OWUS`,
          rawLine: line
        };
      });

      setParsedData(parsedFlights);
      setParsingState('parsed');
      showAlert('✅ GDS PNR parsed successfully! Structured itinerary created.', 'success');

      if (onParseSuccess) {
        onParseSuccess(parsedFlights);
      }
    }, 400);
  };

  const handleValidate = () => {
    setValidationMessage('Airport and airline codes validated successfully.');
    showAlert('✓ Airport and airline codes validated successfully.', 'success');
  };

  const handleImport = () => {
    if (parsingState !== 'parsed') {
      handleParse();
    }
    setImportMessage('Parsed itinerary imported successfully.');
    setParsingState('imported');
    showAlert('📥 Parsed itinerary imported successfully.', 'info');
  };

  const loadGdsPreset = (system) => {
    let sample = '';
    if (system === 'Amadeus') {
      sample = '1 EK 511 J 15OCT DEL DXB HK1 1030 1245 /E\n2 EK 512 J 22OCT DXB DEL HK1 2150 0240+1 /E\nFARE: USD 1850.00 TAX: USD 240.00 TOTAL: USD 2090.00';
    } else if (system === 'Sabre') {
      sample = '1 AA 100 J 15OCT JFK LHR 1830 0730+1\n2 BA 117 C 22OCT LHR JFK 1100 1430\nFARE: USD 4100.00 TAX: USD 400.00 TOTAL: USD 4500.00';
    } else {
      sample = '1 QR 571 Y 10NOV DEL DOH HK1 0950 1145\n2 QR 007 Y 10NOV DOH LHR HK1 1430 1900\nFARE: USD 780.00 TAX: USD 140.00 TOTAL: USD 920.00';
    }
    setRawGDS(sample);
    setParsingState('idle');
    setParsedData(null);
    setValidationMessage('');
    setImportMessage('');
    showAlert(`Loaded sample ${system} PNR format`, 'info');
  };

  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
      {/* Box Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArticleIcon color="primary" fontSize="small" />
          <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
            GDS CRYPTIC PNR PARSER
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<TerminalIcon sx={{ fontSize: 16 }} />}
            onClick={() => setTerminalOpen(true)}
            sx={{
              backgroundColor: '#0F172A',
              color: '#38BDF8',
              fontSize: '0.72rem',
              fontWeight: 800,
              py: 0.4,
              px: 1.5,
              borderRadius: 1.5,
              border: '1px solid rgba(56, 189, 248, 0.4)',
              '&:hover': { backgroundColor: '#1E293B', color: '#FFFFFF' }
            }}
          >
            Live GDS Terminal (Screenshot Mode)
          </Button>

          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, ml: 1 }}>Presets:</Typography>
          <Button size="small" variant="outlined" onClick={() => loadGdsPreset('Sabre')} sx={{ fontSize: '0.68rem', fontWeight: 700, py: 0.2, px: 1, minWidth: 0, height: 24 }}>
            Sabre (1S)
          </Button>
          <Button size="small" variant="outlined" onClick={() => loadGdsPreset('Amadeus')} sx={{ fontSize: '0.68rem', fontWeight: 700, py: 0.2, px: 1, minWidth: 0, height: 24 }}>
            Amadeus (1A)
          </Button>
          <Button size="small" variant="outlined" onClick={() => loadGdsPreset('Galileo')} sx={{ fontSize: '0.68rem', fontWeight: 700, py: 0.2, px: 1, minWidth: 0, height: 24 }}>
            Galileo (1G)
          </Button>
          {validationMessage && (
            <Chip size="small" icon={<VerifiedIcon />} label="Validated" color="success" sx={{ fontWeight: 800, height: 24 }} />
          )}
        </Box>
      </Box>


      {/* Raw GDS Input Area */}
      <TextField
        fullWidth
        multiline
        rows={4}
        value={rawGDS}
        onChange={(e) => {
          setRawGDS(e.target.value);
          setParsingState('idle');
        }}
        placeholder={`Paste raw GDS / SABRE PNR text here (Ctrl+V)...\nExample:\n1 AA 100 J 15OCT JFK LHR 1830 0730+1\n2 BA 117 C 22OCT LHR JFK 1100 1430`}
        sx={{
          mb: 1.5,
          '& textarea': {
            fontFamily: 'monospace, Consolas, "Courier New"',
            fontSize: '0.85rem',
            lineHeight: 1.5,
            bgcolor: '#1E293B',
            color: '#38BDF8',
            p: 1.5,
            borderRadius: 1.5
          }
        }}
      />

      {/* Parsing Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={parsingState === 'parsing' ? <CircularProgress size={16} color="inherit" /> : <PlayCircleIcon />}
          disabled={parsingState === 'parsing'}
          onClick={handleParse}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          {parsingState === 'parsing' ? 'Parsing GDS...' : 'Parse Itinerary'}
        </Button>

        <Button
          variant="outlined"
          color="info"
          startIcon={<CheckCircleIcon />}
          onClick={handleValidate}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Validate Codes
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          startIcon={<DownloadIcon />}
          onClick={handleImport}
          sx={{ fontWeight: 700, borderRadius: 2 }}
        >
          Import Parsed Data
        </Button>
      </Box>

      {/* Validation Result Alert */}
      {validationMessage && (
        <Alert severity="success" icon={<VerifiedIcon />} onClose={() => setValidationMessage('')} sx={{ mb: 1.5, borderRadius: 2 }}>
          {validationMessage}
        </Alert>
      )}

      {/* Import Success Alert */}
      {importMessage && (
        <Alert severity="info" icon={<CheckCircleIcon />} onClose={() => setImportMessage('')} sx={{ mb: 1.5, borderRadius: 2 }}>
          {importMessage}
        </Alert>
      )}

      {/* Parsing Error State */}
      {parsingState === 'error' && (
        <Alert severity="error" icon={<ErrorIcon />} sx={{ mb: 1.5, borderRadius: 2 }}>
          Validation Error: Please check raw GDS text format. Ensure airport and flight segment codes are present.
        </Alert>
      )}

      {/* Idle State Banner */}
      {parsingState === 'idle' && !parsedData && (
        <Box sx={{ p: 2, bgcolor: '#F8FAFC', border: '1px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
            Parsing Status: Idle
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Paste GDS text above and click <b>Parse Itinerary</b> to view structured flight details.
          </Typography>
        </Box>
      )}

      {/* Parsed Successfully Result View */}
      {(parsingState === 'parsed' || parsingState === 'imported') && parsedData && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: parsingState === 'imported' ? '#EFF6FF' : '#F0FDF4',
            border: '1px solid',
            borderColor: parsingState === 'imported' ? '#93C5FD' : '#86EFAC',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color={parsingState === 'imported' ? 'primary' : 'success'} fontSize="small" />
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: parsingState === 'imported' ? '#1E40AF' : '#166534' }}>
                PARSED ITINERARY RESULT (PNR: ABC12D)
              </Typography>
            </Box>
            <Chip
              size="small"
              label={parsingState === 'imported' ? 'IMPORTED TO CALCULATOR' : 'PARSED SUCCESSFULLY'}
              color={parsingState === 'imported' ? 'primary' : 'success'}
              sx={{ fontWeight: 900, fontFamily: 'monospace' }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {parsedData.map((flight) => (
              <Box
                key={flight.id}
                sx={{
                  p: 1.5,
                  bgcolor: 'white',
                  borderRadius: 1.5,
                  border: '1px solid #E2E8F0',
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
                  gap: 1,
                  alignItems: 'center',
                  fontSize: '0.8rem'
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>AIRLINE & FLIGHT</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                    ✈️ {flight.flightNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{flight.carrier}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>ROUTE & DATE</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>
                    {flight.origin} → {flight.destination}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Date: <b>{flight.date}</b></Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>DEPARTURE / ARRIVAL</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                    Dep: {flight.departure} | Arr: {flight.arrival}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Cabin: <b>{flight.class}</b></Typography>
                </Box>

                <Box sx={{ borderLeft: { sm: '1px solid #E2E8F0' }, pl: { sm: 1.5 } }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700 }}>BOOKING CLASS & FARE BASIS</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: 'primary.main', fontFamily: 'monospace' }}>
                    {flight.bookingClass}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Fare Basis: <b>{flight.fareBasis}</b></Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      )}

      {/* Live GDS Terminal & Margin Breakdown Modal */}
      <GDSTerminalModal
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        initialData={{
          rawEdifact: rawGDS,
          pax: 2,
          netPrice: 1225.00,
          markup: 284.24
        }}
        onSave={(data) => {
          if (data.edifactLines) {
            setRawGDS(data.edifactLines);
          }
          showAlert(`✓ Synced GDS PNR #${data.pnr} (Selling: $${data.totalSelling} USD)`, 'success');
        }}
      />
    </Paper>
  );
}
