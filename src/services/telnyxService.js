/**
 * src/services/telnyxService.js
 * Axios-based wrapper for all Telnyx backend API calls.
 * Frontend components use these functions — never calls Telnyx directly.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${BASE_URL}/api/telnyx`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─────────────────────────────────────────────────────────────────────────────
// Token & Auth
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch a WebRTC token for the logged-in agent.
 * Returns: { token, credentialId, sipUsername, sipPassword }
 */
export const fetchWebRTCToken = async ({ agentId, agentName }) => {
  const response = await api.post('/token', { agentId, agentName });
  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Phone Numbers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get all active phone numbers on the Telnyx account
 */
export const fetchPhoneNumbers = async () => {
  const response = await api.get('/numbers');
  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Call Control
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Initiate an outbound call
 */
export const dialCall = async ({ to, from, agentId, agentName }) => {
  const response = await api.post('/calls/dial', { to, from, agentId, agentName });
  return response.data.data;
};

/**
 * Perform an in-call action: hangup | hold | unhold | mute | unmute | send_dtmf | transfer
 */
export const callAction = async ({ callControlId, action, params = {} }) => {
  const response = await api.post('/calls/action', { callControlId, action, params });
  return response.data.data;
};

/**
 * Save a mandatory call disposition after call ends
 * disposition: 'interested' | 'callback' | 'quoted' | 'booked' | 'no_answer' |
 *              'voicemail' | 'wrong_number' | 'not_interested'
 */
export const saveCallDisposition = async ({ callId, agentId, disposition, notes = '' }) => {
  const response = await api.post('/calls/disposition', { callId, agentId, disposition, notes });
  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Call History
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetch call history for an agent (or all agents)
 */
export const fetchCallHistory = async ({ agentId = null, limit = 50 } = {}) => {
  const params = { limit };
  if (agentId) params.agentId = agentId;
  const response = await api.get('/calls/history', { params });
  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// SMS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send an SMS to a customer
 */
export const sendSMS = async ({ to, from = null, text, agentId }) => {
  const response = await api.post('/sms/send', { to, from, text, agentId });
  return response.data.data;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format seconds into MM:SS display string
 */
export const formatCallDuration = (seconds) => {
  if (!seconds || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

/**
 * Format phone number for display (E.164 → +1 (XXX) XXX-XXXX)
 */
export const formatPhoneDisplay = (number) => {
  if (!number) return '';
  const cleaned = number.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    const n = cleaned.slice(1);
    return `+1 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`;
  }
  return number;
};

/**
 * Clean user input phone number to E.164 format for Telnyx
 */
export const toE164 = (input) => {
  if (!input) return '';
  const digits = input.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
};

export const CALL_DISPOSITIONS = [
  { value: 'interested',     label: '✅ Interested',       color: 'success' },
  { value: 'callback',       label: '📞 Callback Requested', color: 'primary' },
  { value: 'quoted',         label: '💼 Quote Sent',        color: 'info' },
  { value: 'booked',         label: '🎟️ Booked',            color: 'success' },
  { value: 'no_answer',      label: '📵 No Answer',         color: 'warning' },
  { value: 'voicemail',      label: '📬 Voicemail Left',    color: 'default' },
  { value: 'wrong_number',   label: '❌ Wrong Number',      color: 'error' },
  { value: 'not_interested', label: '🚫 Not Interested',    color: 'error' },
];
