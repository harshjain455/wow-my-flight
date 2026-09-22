/**
 * src/components/IncomingCallModal.jsx
 * 
 * Full-screen incoming call notification popup.
 * Shown when a customer calls any of the Telnyx numbers.
 * Auto-dismissed after 30 seconds if agent doesn't respond.
 */

import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, Avatar, Chip, Paper, Slide,
  CircularProgress,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import VoicemailIcon from '@mui/icons-material/Voicemail';
import PersonIcon from '@mui/icons-material/Person';
import { formatPhoneDisplay } from '../services/telnyxService';
import { useTelnyx } from '../contexts/TelnyxContext';

// Ringing animation keyframes
const ringAnimation = `
  @keyframes ringPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
    50% { box-shadow: 0 0 0 20px rgba(34, 197, 94, 0); }
  }
  @keyframes ringShake {
    0%, 100% { transform: rotate(0deg); }
    15% { transform: rotate(-12deg); }
    30% { transform: rotate(12deg); }
    45% { transform: rotate(-8deg); }
    60% { transform: rotate(8deg); }
    75% { transform: rotate(-4deg); }
  }
`;

const RING_TIMEOUT = 30; // seconds before auto-dismiss

export default function IncomingCallModal() {
  const { incomingCall, answerCall, rejectCall } = useTelnyx();
  const [timeLeft, setTimeLeft] = useState(RING_TIMEOUT);
  const [visible, setVisible] = useState(false);

  // Inject ring animation CSS once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = ringAnimation;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Show/hide modal and run countdown
  useEffect(() => {
    if (incomingCall) {
      setVisible(true);
      setTimeLeft(RING_TIMEOUT);
      const countdown = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(countdown);
            rejectCall(); // Auto-reject after timeout
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setVisible(false);
    }
  }, [incomingCall]);

  if (!incomingCall) return null;

  const fromFormatted = formatPhoneDisplay(incomingCall.from || '');
  const toFormatted = formatPhoneDisplay(incomingCall.to || '');

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Slide direction="down" in={visible} timeout={400}>
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            width: 360,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          }}
        >
          {/* Incoming Call Label */}
          <Chip
            label="📞 INCOMING CALL"
            size="small"
            sx={{
              bgcolor: 'rgba(34, 197, 94, 0.15)',
              color: '#22c55e',
              fontWeight: 800,
              fontSize: '0.65rem',
              letterSpacing: 1.5,
              mb: 3,
              border: '1px solid rgba(34, 197, 94, 0.3)',
            }}
          />

          {/* Caller Avatar — pulsing ring animation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: '#22c55e',
                fontSize: '2.5rem',
                animation: 'ringPulse 1.5s ease-in-out infinite',
              }}
            >
              <PersonIcon sx={{ fontSize: 48, color: 'white' }} />
            </Avatar>
          </Box>

          {/* Caller Number */}
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: 'white', letterSpacing: 0.5, mb: 0.5 }}
          >
            {fromFormatted || 'Unknown Caller'}
          </Typography>

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 0.5 }}>
            Calling: <span style={{ color: 'rgba(255,255,255,0.8)' }}>{toFormatted}</span>
          </Typography>

          {/* Countdown */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              my: 2.5,
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={(timeLeft / RING_TIMEOUT) * 100}
                size={36}
                thickness={5}
                sx={{ color: '#22c55e' }}
              />
              <Box
                sx={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 900, color: 'white' }}>
                  {timeLeft}s
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
              Auto-reject in {timeLeft}s
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {/* Voicemail */}
            <Button
              fullWidth
              variant="outlined"
              startIcon={<VoicemailIcon />}
              onClick={rejectCall}
              sx={{
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.6)',
                borderRadius: 2.5,
                py: 1.2,
                fontSize: '0.75rem',
                fontWeight: 700,
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.5)',
                  bgcolor: 'rgba(255,255,255,0.05)',
                },
              }}
            >
              Voicemail
            </Button>

            {/* Reject */}
            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<PhoneDisabledIcon />}
              onClick={rejectCall}
              sx={{
                borderRadius: 2.5,
                py: 1.2,
                fontSize: '0.75rem',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(239,68,68,0.35)',
              }}
            >
              Decline
            </Button>

            {/* Answer */}
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<PhoneIcon />}
              onClick={answerCall}
              sx={{
                borderRadius: 2.5,
                py: 1.2,
                fontSize: '0.75rem',
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(34,197,94,0.35)',
                animation: 'ringPulse 1.5s ease-in-out infinite',
              }}
            >
              Answer
            </Button>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
}
