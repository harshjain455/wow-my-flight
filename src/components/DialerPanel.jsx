/**
 * src/components/DialerPanel.jsx
 * 
 * Real Telnyx WebRTC Softphone Panel.
 * Replaces the old mock dialer with live calling via @telnyx/webrtc.
 * 
 * Features:
 *   - SDK initialization & registration status
 *   - Caller ID selector (which Telnyx number to call from)
 *   - Click-to-call with real audio
 *   - Live call timer
 *   - Mute, Hold, DTMF Keypad
 *   - Tab switcher: Dialer | SMS | History
 */

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Chip, IconButton, Paper, Typography,
  Tooltip, Tab, Tabs, Select, MenuItem, FormControl,
  Skeleton, TextField, CircularProgress,
} from '@mui/material';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SmsIcon from '@mui/icons-material/Sms';
import HistoryIcon from '@mui/icons-material/History';
import DialpadIcon from '@mui/icons-material/Dialpad';
import { useTelnyx, CALL_STATE } from '../contexts/TelnyxContext';
import { formatCallDuration, formatPhoneDisplay, toE164 } from '../services/telnyxService';
import SmsComposer from './SmsComposer';
import CallHistory from './CallHistory';

const DTMF_KEYS = [
  ['1', ''], ['2', 'ABC'], ['3', 'DEF'],
  ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'],
  ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ'],
  ['*', ''], ['0', '+'], ['#', ''],
];

export default function DialerPanel({ lead }) {
  const {
    sdkStatus, initializeSdk, socketConnected,
    callState, activeCall, callSeconds,
    isMuted, isOnHold,
    phoneNumbers, selectedFromNumber, setSelectedFromNumber,
    makeCall, hangup, toggleMute, toggleHold, sendDTMF,
  } = useTelnyx();

  const [tab, setTab] = useState(0);              // 0=Dialer, 1=SMS, 2=History
  const [dialInput, setDialInput] = useState(''); // manual number input

  // Populate dial input from lead when lead changes
  useEffect(() => {
    if (lead?.fullPhone) {
      setDialInput(lead.fullPhone);
    }
  }, [lead]);

  // Auto-initialize SDK when panel mounts
  useEffect(() => {
    if (sdkStatus === 'idle') {
      initializeSdk();
    }
  }, [sdkStatus, initializeSdk]);

  const isOnCall = callState === CALL_STATE.ON_CALL;
  const isDialing = callState === CALL_STATE.DIALING || callState === CALL_STATE.RINGING;
  const isBusy = isOnCall || isDialing || callState === CALL_STATE.ON_HOLD;

  const handleCall = () => {
    const number = toE164(dialInput.trim());
    if (!number) return;
    makeCall({
      toNumber: number,
      toName: lead ? `${lead.firstName} ${lead.lastName}` : dialInput,
    });
  };

  const getStatusColor = () => {
    if (callState === CALL_STATE.ON_CALL) return '#22c55e';
    if (callState === CALL_STATE.ON_HOLD) return '#f59e0b';
    if (callState === CALL_STATE.DIALING || callState === CALL_STATE.RINGING) return '#3b82f6';
    if (callState === CALL_STATE.ENDED) return '#ef4444';
    return undefined;
  };

  const getStatusLabel = () => {
    switch (callState) {
      case CALL_STATE.CONNECTING: return 'Connecting...';
      case CALL_STATE.DIALING:   return 'Dialing...';
      case CALL_STATE.RINGING:   return 'Ringing...';
      case CALL_STATE.ON_CALL:   return `ON CALL — ${formatCallDuration(callSeconds)}`;
      case CALL_STATE.ON_HOLD:   return `ON HOLD — ${formatCallDuration(callSeconds)}`;
      case CALL_STATE.ENDED:     return 'Call Ended';
      default:                   return sdkStatus === 'registered' ? 'Ready' : sdkStatus === 'loading' ? 'Connecting...' : 'Softphone';
    }
  };

  const statusColor = getStatusColor();

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: statusColor ? statusColor : 'divider',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: isOnCall ? '0 10px 25px rgba(34, 197, 94, 0.12)' : '0 4px 15px rgba(0,0,0,0.03)',
        transition: 'all 0.3s ease',
      }}
    >
      {/* ─── Header ────────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          px: 2, py: 1.2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          bgcolor: isOnCall ? 'rgba(34,197,94,0.06)' : callState === CALL_STATE.ON_HOLD ? 'rgba(245,158,11,0.06)' : 'background.default',
          borderBottom: '1px solid', borderColor: 'divider',
          transition: 'background 0.3s',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          <GraphicEqIcon sx={{ color: statusColor || 'text.disabled', fontSize: 18 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 900, fontSize: '0.78rem' }}>
            TELNYX SOFTPHONE
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
          {/* Socket connectivity indicator */}
          <Tooltip title={socketConnected ? 'Server connected' : 'Server disconnected'}>
            {socketConnected
              ? <SignalWifiStatusbar4BarIcon sx={{ fontSize: 14, color: '#22c55e' }} />
              : <SignalWifiOffIcon sx={{ fontSize: 14, color: '#ef4444' }} />
            }
          </Tooltip>
          {/* Call state chip */}
          <Chip
            size="small"
            label={getStatusLabel()}
            sx={{
              fontWeight: 800,
              borderRadius: 1.5,
              fontSize: '0.65rem',
              height: 20,
              bgcolor: statusColor ? `${statusColor}22` : undefined,
              color: statusColor || undefined,
              border: statusColor ? `1px solid ${statusColor}44` : undefined,
            }}
          />
        </Box>
      </Box>

      {/* ─── Tab Navigation ─────────────────────────────────────────────────────── */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="fullWidth"
        sx={{
          minHeight: 36,
          borderBottom: '1px solid', borderColor: 'divider',
          '& .MuiTab-root': { minHeight: 36, fontSize: '0.7rem', fontWeight: 700 },
        }}
      >
        <Tab icon={<DialpadIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="DIALER" />
        <Tab icon={<SmsIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="SMS" />
        <Tab icon={<HistoryIcon sx={{ fontSize: 14 }} />} iconPosition="start" label="HISTORY" />
      </Tabs>

      <Box sx={{ p: 2 }}>
        {/* ──────────────────────────────────────────────────────────────────────── */}
        {/* TAB 0: DIALER                                                            */}
        {/* ──────────────────────────────────────────────────────────────────────── */}
        {tab === 0 && (
          <>
            {/* SDK loading skeleton */}
            {sdkStatus === 'loading' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Skeleton variant="rounded" height={36} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" height={52} sx={{ borderRadius: 2 }} />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0.8 }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={36} sx={{ borderRadius: 2 }} />
                  ))}
                </Box>
                <Skeleton variant="rounded" height={42} sx={{ borderRadius: 2 }} />
              </Box>
            )}

            {/* SDK error state */}
            {sdkStatus === 'error' && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography color="error" variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                  ⚠️ Softphone connection failed
                </Typography>
                <Button size="small" variant="outlined" onClick={initializeSdk}>
                  Retry Connection
                </Button>
              </Box>
            )}

            {/* Main Dialer UI */}
            {(sdkStatus === 'registered' || sdkStatus === 'idle') && (
              <>
                {/* Caller ID Selector */}
                <FormControl size="small" fullWidth sx={{ mb: 1.2 }}>
                  <Select
                    value={selectedFromNumber}
                    onChange={(e) => setSelectedFromNumber(e.target.value)}
                    disabled={isBusy}
                    displayEmpty
                    sx={{ borderRadius: 2, fontSize: '0.78rem' }}
                  >
                    {phoneNumbers.map((n) => (
                      <MenuItem key={n.number} value={n.number} sx={{ fontSize: '0.78rem' }}>
                        📞 {formatPhoneDisplay(n.number)}
                        {n.type === 'toll_free' ? ' (Toll-Free)' : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Dial Input / Active Call Display */}
                <Box
                  sx={{
                    my: 1.2, p: 1.2,
                    bgcolor: 'background.default',
                    borderRadius: 2.5,
                    border: '1px solid', borderColor: statusColor ? `${statusColor}44` : 'divider',
                    textAlign: 'center',
                    minHeight: 54,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}
                >
                  {isOnCall || callState === CALL_STATE.ON_HOLD ? (
                    <>
                      <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: statusColor }}>
                        {activeCall?.toName || formatPhoneDisplay(activeCall?.toNumber || '')}
                      </Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', color: statusColor, letterSpacing: 2 }}>
                        {formatCallDuration(callSeconds)}
                      </Typography>
                    </>
                  ) : (
                    <TextField
                      value={dialInput}
                      onChange={(e) => setDialInput(e.target.value)}
                      variant="standard"
                      placeholder="Enter number to call…"
                      disabled={isBusy}
                      InputProps={{
                        disableUnderline: true,
                        sx: {
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          color: 'text.primary',
                          letterSpacing: 0.5,
                          textAlign: 'center',
                        },
                      }}
                      sx={{ width: '100%', textAlign: 'center' }}
                    />
                  )}
                </Box>

                {/* In-Call Controls */}
                {isBusy && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, gap: 0.5 }}>
                    {/* Mute */}
                    <Tooltip title={isMuted ? 'Unmute' : 'Mute'}>
                      <IconButton
                        onClick={toggleMute}
                        size="small"
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: isMuted ? 'error.main' : 'divider',
                          bgcolor: isMuted ? 'error.50' : 'background.default',
                          color: isMuted ? 'error.main' : 'text.secondary',
                          flexDirection: 'column', gap: 0.2, py: 0.8,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        {isMuted ? <MicOffIcon sx={{ fontSize: 18 }} /> : <MicIcon sx={{ fontSize: 18 }} />}
                        <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
                          {isMuted ? 'UNMUTE' : 'MUTE'}
                        </Typography>
                      </IconButton>
                    </Tooltip>

                    {/* Hold */}
                    <Tooltip title={isOnHold ? 'Unhold' : 'Hold'}>
                      <IconButton
                        onClick={toggleHold}
                        size="small"
                        sx={{
                          flex: 1,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: isOnHold ? 'warning.main' : 'divider',
                          bgcolor: isOnHold ? 'warning.50' : 'background.default',
                          color: isOnHold ? 'warning.main' : 'text.secondary',
                          flexDirection: 'column', gap: 0.2, py: 0.8,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        {isOnHold ? <PlayCircleIcon sx={{ fontSize: 18 }} /> : <PauseCircleIcon sx={{ fontSize: 18 }} />}
                        <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>
                          {isOnHold ? 'UNHOLD' : 'HOLD'}
                        </Typography>
                      </IconButton>
                    </Tooltip>

                    {/* Transfer */}
                    <Tooltip title="Transfer Call">
                      <IconButton
                        size="small"
                        sx={{
                          flex: 1, borderRadius: 2,
                          border: '1px solid', borderColor: 'divider',
                          color: 'text.secondary', flexDirection: 'column', gap: 0.2, py: 0.8,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <SwapHorizIcon sx={{ fontSize: 18 }} />
                        <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>TRANSFER</Typography>
                      </IconButton>
                    </Tooltip>

                    {/* Voicemail Drop */}
                    <Tooltip title="Voicemail Drop">
                      <IconButton
                        size="small"
                        sx={{
                          flex: 1, borderRadius: 2,
                          border: '1px solid', borderColor: 'divider',
                          color: 'text.secondary', flexDirection: 'column', gap: 0.2, py: 0.8,
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <VoicemailIcon sx={{ fontSize: 18 }} />
                        <Typography sx={{ fontSize: '0.55rem', fontWeight: 700 }}>VM DROP</Typography>
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                {/* DTMF Keypad */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.7, mb: 1.5 }}>
                  {DTMF_KEYS.map(([digit, letters]) => (
                    <Button
                      key={digit}
                      onClick={() => {
                        if (isBusy) {
                          sendDTMF(digit);
                        } else {
                          setDialInput((n) => n + digit);
                        }
                      }}
                      variant="outlined"
                      color="inherit"
                      sx={{
                        py: 0.7, borderRadius: 2, borderColor: 'divider',
                        color: 'text.secondary', flexDirection: 'column',
                        lineHeight: 1, minWidth: 0, gap: 0,
                        '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary', color: 'text.primary' },
                      }}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 700 }}>{digit}</span>
                      {letters && (
                        <span style={{ fontSize: '0.45rem', fontWeight: 600, opacity: 0.6 }}>
                          {letters}
                        </span>
                      )}
                    </Button>
                  ))}
                </Box>

                {/* Call / Hangup Button */}
                <Button
                  fullWidth
                  variant="contained"
                  color={isBusy ? 'error' : 'success'}
                  onClick={isBusy ? hangup : handleCall}
                  disabled={sdkStatus === 'loading' || (!isBusy && !dialInput.trim())}
                  startIcon={
                    isDialing ? <CircularProgress size={14} color="inherit" /> :
                    isBusy ? <PhoneDisabledIcon sx={{ fontSize: 16 }} /> :
                    <PhoneIcon sx={{ fontSize: 16 }} />
                  }
                  sx={{
                    py: 1, borderRadius: 2.5, fontWeight: 900, fontSize: '0.88rem',
                    letterSpacing: 0.5,
                    boxShadow: isBusy
                      ? '0 5px 12px rgba(239,68,68,0.25)'
                      : '0 5px 12px rgba(34,197,94,0.25)',
                    transition: 'all 0.2s',
                    '&:hover:not(:disabled)': { transform: 'translateY(-1px)' },
                  }}
                >
                  {isDialing ? 'Dialing...' : isBusy ? 'END CALL' : 'CALL'}
                </Button>

                {/* SDK Status hint */}
                {sdkStatus !== 'registered' && sdkStatus !== 'loading' && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block', textAlign: 'center', mt: 1,
                      color: 'text.disabled', fontSize: '0.65rem',
                    }}
                  >
                    ⚡ Click CALL to auto-connect softphone
                  </Typography>
                )}
              </>
            )}
          </>
        )}

        {/* ──────────────────────────────────────────────────────────────────────── */}
        {/* TAB 1: SMS                                                               */}
        {/* ──────────────────────────────────────────────────────────────────────── */}
        {tab === 1 && (
          <SmsComposer defaultTo={lead?.fullPhone || ''} />
        )}

        {/* ──────────────────────────────────────────────────────────────────────── */}
        {/* TAB 2: CALL HISTORY                                                      */}
        {/* ──────────────────────────────────────────────────────────────────────── */}
        {tab === 2 && (
          <CallHistory />
        )}
      </Box>
    </Paper>
  );
}
