import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Slider from '@mui/material/Slider';
import IconButton from '@mui/material/IconButton';

// Icons
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneMissedIcon from '@mui/icons-material/PhoneMissed';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InputAdornment from '@mui/material/InputAdornment';
import BackspaceIcon from '@mui/icons-material/Backspace';
import { io } from 'socket.io-client';
import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';
import useAuth from '../../hooks/useAuth';
import { dialCall, callAction, saveCallDisposition, fetchPhoneNumbers, fetchCallStatus, toE164, formatCallDuration } from '../../services/telnyxService';

// ==========================================
// DATASETS
// ==========================================

const CALL_DISPOSITIONS = [
  'Interested', 'Follow-up Required', 'Quote Requested',
  'Payment Pending', 'Booked', 'No Answer', 'Busy',
  'Callback Requested', 'Wrong Number', 'Lost Lead'
];

const CALL_RECORDINGS = [
  { id: 'REC-991', customer: 'Ambassador Harold Vance', phone: '+1 555-234-8901', agent: 'Sarah Jenkins', time: '2026-08-20 10:02', duration: '02m 14s', status: 'Quote Dispatched', url: '#' },
  { id: 'REC-992', customer: 'Sophia Chen', phone: '+1 415-889-1200', agent: 'Alex Miller', time: '2026-08-20 11:30', duration: '04m 10s', status: 'Follow-up Required', url: '#' }
];

const MISSED_CALLS = [
  { id: 1, phone: '+1 312-555-0199', name: 'Karan Singh (Existing Customer)', time: 'Today 12:45 PM', agent: 'Sarah Jenkins', callbackStatus: 'Pending Callback' },
  { id: 2, phone: '+1 415-555-9921', name: 'Unknown Caller (New Lead)', time: 'Today 13:10 PM', agent: 'Alex Miller', callbackStatus: 'Callback Completed' }
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function CallingSoftphoneWorkspace() {
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [agentPresence, setAgentPresence] = useState('AVAILABLE');
  
  // Softphone State
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [selectedFromNumber, setSelectedFromNumber] = useState('');
  const [dialNumber, setDialNumber] = useState('');
  const [activeCall, setActiveCall] = useState(false);
  const [callPhase, setCallPhase] = useState('IDLE'); // 'IDLE' | 'RINGING' | 'ANSWERED' | 'ENDED'
  const [callControlId, setCallControlId] = useState(null);
  const [callLogId, setCallLogId] = useState(null);
  const [callSeconds, setCallSeconds] = useState(0);
  const timerRef = useRef(null);
  const micStreamRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);

  // Modals
  const [incomingPopupOpen, setIncomingPopupOpen] = useState(false);

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);

  // Real-Time Telnyx Socket.io Listeners for Live Answered / Cut status
  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const socket = io(backendUrl, { withCredentials: true });

    socket.on('telnyx:call_answered', (data) => {
      console.log('[Softphone] Call Answered Event from Telnyx:', data);
      setCallPhase('ANSWERED');
      showAlert('🟢 Saamne wale ne Call utha li hai! (Call Answered & Live)', 'success');
    });

    socket.on('telnyx:call_ended', (data) => {
      console.log('[Softphone] Call Ended / Cut Event from Telnyx:', data);
      setCallPhase('ENDED');
      if (timerRef.current) clearInterval(timerRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      setActiveCall(false);
      showAlert('🔴 Call cut ho gayi hai (Customer / Remote End Hung Up)', 'warning');
    });

    return () => {
      socket.disconnect();
    };
  }, [showAlert]);

  // Active call direct polling fallback
  useEffect(() => {
    if (!activeCall || !callControlId) return;

    const interval = setInterval(async () => {
      try {
        const statusData = await fetchCallStatus(callControlId);
        if (statusData) {
          if (statusData.is_alive && statusData.status === 'answered') {
            setCallPhase((prev) => (prev === 'RINGING' ? 'ANSWERED' : prev));
          } else if (statusData.is_alive === false && statusData.status === 'ended') {
            // Call has ended/hung up
            clearInterval(interval);
            setCallPhase('ENDED');
            if (timerRef.current) clearInterval(timerRef.current);
            if (micStreamRef.current) {
              micStreamRef.current.getTracks().forEach((track) => track.stop());
              micStreamRef.current = null;
            }
            setActiveCall(false);
            showAlert('🔴 Call cut ho gayi hai (Remote End Hung Up)', 'warning');
          }
        }
      } catch (e) {
        console.warn('Call status polling error:', e.message);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeCall, callControlId, showAlert]);

  // Load active Telnyx phone numbers
  useEffect(() => {
    fetchPhoneNumbers()
      .then((numbers) => {
        if (numbers && numbers.length > 0) {
          setPhoneNumbers(numbers);
          setSelectedFromNumber(numbers[0].number);
        }
      })
      .catch((err) => console.warn('Could not fetch numbers:', err.message));
  }, []);

  const startTimer = () => {
    setCallSeconds(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCallSeconds((s) => s + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const handleDialDigit = (digit) => {
    setDialNumber((prev) => (prev || '') + digit);
  };

  const handleBackspace = () => {
    setDialNumber((prev) => (prev ? prev.slice(0, -1) : ''));
  };

  const handleStartCall = async () => {
    const rawNumber = dialNumber || '+18503329681';
    const cleanNumber = toE164(rawNumber) || rawNumber;
    const fromLine = selectedFromNumber || phoneNumbers[0]?.number || '+18503329681';
    setDialNumber(cleanNumber);
    setActiveCall(true);
    setCallPhase('RINGING');
    startTimer();

    // Request and activate browser microphone for live voice
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
      }
    } catch (micErr) {
      console.warn('Microphone permission not granted or unavailable:', micErr.message);
    }

    try {
      showAlert(`📞 Dialing ${cleanNumber}... (Waiting for answer)`, 'info');
      const response = await dialCall({
        to: cleanNumber,
        from: fromLine,
        agentId: currentUser?.id || 'agent-1',
        agentName: currentUser?.name || 'Agent',
      });

      if (response?.callControlId) {
        setCallControlId(response.callControlId);
        setCallLogId(response.callLogId);
      }
    } catch (err) {
      console.warn('[CallingWorkspace] Outbound call API:', err.message);
    }
  };

  const handleEndCall = async () => {
    stopTimer();
    setCallPhase('ENDED');
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (callControlId) {
      try {
        await callAction({ callControlId, action: 'hangup' });
      } catch (err) {
        console.warn('Hangup action error:', err.message);
      }
    }
    setActiveCall(false);
  };

  return (
    <Box sx={{ pb: 6, minHeight: '100vh' }}>
      
      {/* Top Executive Header */}
      <Paper elevation={0} sx={{ p: 2.5, px: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, bgcolor: '#FFFFFF' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#3F51B5', width: 48, height: 48, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)' }}>
            🎙️
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Outfit, sans-serif' }}>
                Built-In Calling & WebRTC Softphone Workspace
              </Typography>
              <Chip label="OTA SOFTPHONE ACTIVE" size="small" sx={{ fontWeight: 900, fontSize: '0.68rem', bgcolor: '#059669', color: '#FFF' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mt: 0.2 }}>
              Make, receive, transfer, and log calls directly with auto-customer lookup and recording player
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* AGENT PRESENCE TOGGLE */}
          <TextField
            select
            size="small"
            label="Agent Status"
            value={agentPresence}
            onChange={(e) => setAgentPresence(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="AVAILABLE">🟢 Available</MenuItem>
            <MenuItem value="BUSY">🟡 Busy</MenuItem>
            <MenuItem value="ON CALL">🔵 On Call</MenuItem>
            <MenuItem value="BREAK">🟠 On Break</MenuItem>
            <MenuItem value="OFFLINE">🔴 Offline</MenuItem>
          </TextField>

          <Button variant="contained" color="warning" startIcon={<PhoneInTalkIcon />} onClick={() => setIncomingPopupOpen(true)} sx={{ fontWeight: 800 }}>
            Simulate Incoming Call
          </Button>

          <DualClock client={{ timezone: 'America/New_York', label: 'Telecom EST' }} />
        </Box>
      </Paper>

      {/* 8 CALLING ANALYTICS KPI CARDS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', lg: 'repeat(8, 1fr)' }, gap: 1.2, mb: 3 }}>
        {[
          { label: 'Total Calls', val: '1,840', color: '#3F51B5' },
          { label: 'Inbound Calls', val: '890', color: '#059669' },
          { label: 'Outbound Calls', val: '950', color: '#0284C7' },
          { label: 'Missed Calls', val: '42', color: '#DC2626' },
          { label: 'Avg Talk Time', val: '4m 15s', color: '#7C3AED' },
          { label: 'Answer Rate %', val: '97.8%', color: '#059669' },
          { label: 'Callback Rate %', val: '95.2%', color: '#C59B27' },
          { label: 'Queue Wait Time', val: '18s', color: '#D97706' }
        ].map((kpi, i) => (
          <Paper key={i} elevation={0} sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden', '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', backgroundColor: kpi.color } }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.62rem', display: 'block' }}>{kpi.label}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: 'text.primary', mt: 0.1 }}>{kpi.val}</Typography>
          </Paper>
        ))}
      </Box>

      {/* MAIN LAYOUT: SOFTPHONE DIALER & WORKSPACE TABS */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '320px 1fr' }, gap: 3 }}>
        
        {/* FLOATING WEBRTC SOFTPHONE WIDGET */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#0F172A', color: '#FFFFFF' }}>
          {/* OUTGOING LINE SELECTOR */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', mb: 0.5 }}>
              OUTGOING CALLER ID LINE
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={selectedFromNumber || (phoneNumbers[0]?.number || '+18503329681')}
              onChange={(e) => setSelectedFromNumber(e.target.value)}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#1E293B !important',
                  color: '#38BDF8 !important',
                  borderRadius: 2,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                },
                '& .MuiSvgIcon-root': { color: '#38BDF8' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#334155 !important' }
              }}
            >
              {phoneNumbers.map((p) => (
                <MenuItem key={p.id || p.number} value={p.number} sx={{ fontSize: '0.85rem', fontWeight: 700 }}>
                  📞 {p.number} {p.type ? `(${p.type.replace('_', ' ').toUpperCase()})` : ''}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <TextField
            fullWidth
            size="small"
            placeholder="Enter Phone Number..."
            value={dialNumber}
            onChange={(e) => setDialNumber(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStartCall();
            }}
            slotProps={{
              input: {
                endAdornment: dialNumber ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleBackspace}
                      sx={{ color: '#94A3B8', '&:hover': { color: '#F8FAFC' } }}
                    >
                      <BackspaceIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }
            }}
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                bgcolor: '#1E293B !important',
                borderRadius: 2,
              },
              '& .MuiInputBase-input': {
                color: '#FFFFFF !important',
                WebkitTextFillColor: '#FFFFFF !important',
                fontWeight: 800,
                fontSize: '1.2rem',
                textAlign: 'center',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                py: 1.5,
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#334155 !important',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#38BDF8 !important',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#38BDF8 !important',
              },
            }}
          />

          {/* KEYPAD GRID */}
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.2, mb: 2.5 }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
              <Button
                key={digit}
                variant="outlined"
                onClick={() => handleDialDigit(digit)}
                sx={{
                  py: 1.5,
                  fontWeight: 900,
                  fontSize: '1.2rem',
                  color: '#F8FAFC',
                  borderColor: '#334155',
                  borderRadius: 2,
                  bgcolor: '#1E293B',
                  '&:hover': { bgcolor: '#334155', borderColor: '#38BDF8' }
                }}
              >
                {digit}
              </Button>
            ))}
          </Box>

          {/* CALL ACTION CONTROLS */}
          {activeCall ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#1E293B',
                  borderColor: callPhase === 'ANSWERED' ? '#22C55E' : '#FACC15',
                  textAlign: 'center',
                  boxShadow: callPhase === 'ANSWERED' ? '0 0 15px rgba(34, 197, 94, 0.2)' : 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                {callPhase === 'RINGING' && (
                  <Chip
                    icon={<PhoneForwardedIcon sx={{ color: '#000 !important' }} />}
                    label="🔔 RINGING... (Waiting for answer)"
                    size="small"
                    sx={{ bgcolor: '#FACC15', color: '#000', fontWeight: 900, mb: 1, fontSize: '0.72rem' }}
                  />
                )}
                {callPhase === 'ANSWERED' && (
                  <Chip
                    icon={<CheckCircleIcon sx={{ color: '#FFF !important' }} />}
                    label="🟢 CALL ANSWERED & CONNECTED"
                    size="small"
                    sx={{ bgcolor: '#22C55E', color: '#FFF', fontWeight: 900, mb: 1, fontSize: '0.72rem' }}
                  />
                )}
                {callPhase === 'ENDED' && (
                  <Chip
                    label="🔴 CALL ENDED / CUT"
                    size="small"
                    sx={{ bgcolor: '#EF4444', color: '#FFF', fontWeight: 900, mb: 1, fontSize: '0.72rem' }}
                  />
                )}
                <Typography variant="caption" sx={{ color: '#EF4444', fontWeight: 900, display: 'block' }}>🔴 RECORDING ACTIVE</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: callPhase === 'ANSWERED' ? '#22C55E' : '#FACC15', my: 0.5 }}>
                  {formatCallDuration(callSeconds)}
                </Typography>
              </Paper>
              <Button variant="contained" color="error" fullWidth startIcon={<CallEndIcon />} onClick={handleEndCall} sx={{ fontWeight: 900, py: 1.2 }}>
                End Call & Disposition
              </Button>
            </Box>
          ) : (
            <Button variant="contained" color="success" fullWidth startIcon={<PhoneInTalkIcon />} onClick={handleStartCall} sx={{ fontWeight: 900, py: 1.2 }}>
              Start WebRTC Call
            </Button>
          )}
        </Paper>

        {/* WORKSPACE TABS: RECORDINGS, MISSED CALLS, HISTORY */}
        <Box>
          <Paper elevation={0} sx={{ mb: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFFFF' }}>
            <Tabs value={currentTab} onChange={(e, val) => setCurrentTab(val)} sx={{ px: 2, '& .MuiTab-root': { fontWeight: 800, fontSize: '0.78rem' } }}>
              <Tab label="🎙️ Call Recordings & Audio Player" />
              <Tab label="📵 Missed Calls Queue" />
            </Tabs>
          </Paper>

          {/* TAB 1: CALL RECORDINGS PLAYER */}
          {currentTab === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CALL_RECORDINGS.map((rec) => (
                <Paper key={rec.id} elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: '#FFFFFF' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>{rec.customer} ({rec.phone})</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        Rep: <b>{rec.agent}</b> • Time: <b>{rec.time}</b> • Duration: <b>{rec.duration}</b>
                      </Typography>
                    </Box>
                    <Chip label={rec.status} size="small" color="primary" sx={{ fontWeight: 800 }} />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* BUILT-IN AUDIO PLAYER CONTROLS */}
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton color="primary" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                    </IconButton>
                    <Slider size="small" defaultValue={35} sx={{ flexGrow: 1, color: '#3F51B5' }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>00:48 / {rec.duration}</Typography>
                    <IconButton size="small" color="primary" onClick={() => showAlert(`Downloading recording ${rec.id}.mp3`, 'info')}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Paper>
                </Paper>
              ))}
            </Box>
          )}

          {/* TAB 2: MISSED CALLS QUEUE */}
          {currentTab === 1 && (
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Customer / Number</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Missed Time</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Assigned Agent</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Callback Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800 }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {MISSED_CALLS.map((m) => (
                      <TableRow key={m.id} hover>
                        <TableCell sx={{ fontWeight: 900 }}>{m.name} ({m.phone})</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{m.time}</TableCell>
                        <TableCell sx={{ fontWeight: 800 }}>{m.agent}</TableCell>
                        <TableCell><Chip label={m.callbackStatus} size="small" color={m.callbackStatus.includes('Pending') ? 'error' : 'success'} sx={{ fontWeight: 800 }} /></TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="contained" color="primary" startIcon={<PhoneInTalkIcon />} onClick={handleStartCall} sx={{ fontWeight: 800, fontSize: '0.72rem' }}>
                            Call Back
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </Box>
      </Box>

      {/* REAL-TIME INCOMING CALL CUSTOMER POPUP SIMULATOR */}
      <Dialog open={incomingPopupOpen} onClose={() => setIncomingPopupOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, color: '#3F51B5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📞 Incoming Call Identified: +1 555-234-8901</span>
          <Chip label="Tier 1 Black Diamond" size="small" color="secondary" sx={{ fontWeight: 900 }} />
        </DialogTitle>
        <DialogContent dividers>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: '#EFF6FF', borderColor: '#BFDBFE', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 900, color: '#2563EB' }}>Ambassador Harold Vance</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
              Lead ID: <b>LD-99120</b> • Booking ID: <b>BK-10231</b> • Agent: <b>Sarah Jenkins</b>
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
              Route: <b>DEL ➔ LHR ➔ JFK</b> • Travel Date: <b>2026-09-15</b> • Outstanding: <b>$0 Paid</b>
            </Typography>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button variant="outlined" color="primary" onClick={() => { setIncomingPopupOpen(false); showAlert('Opened Customer 360 profile', 'info'); }}>
            Open Customer 360
          </Button>
          <Button variant="contained" color="success" onClick={() => { setIncomingPopupOpen(false); handleStartCall(); }} sx={{ fontWeight: 900 }}>
            Answer & Connect WebRTC
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
