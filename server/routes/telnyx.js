/**
 * routes/telnyx.js
 * All Telnyx-related API endpoints:
 *   - WebRTC Token generation
 *   - Call dial, hold, mute, transfer, hangup
 *   - Voice Webhook handler (call events)
 *   - SMS send + Messaging webhook
 *   - Call history & disposition
 *   - Phone numbers list
 */

const express = require('express');
const router = express.Router();
const Telnyx = require('telnyx');
const callStore = require('../store/callStore');

const telnyx = Telnyx(process.env.TELNYX_API_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET /api/telnyx/numbers
//    Returns all active phone numbers on the account
// ─────────────────────────────────────────────────────────────────────────────
router.get('/numbers', async (req, res) => {
  try {
    const response = await telnyx.phoneNumbers.list({ 'page[size]': 25 });
    const numbers = (response.data || []).map(n => ({
      id: n.id,
      number: n.phone_number,
      type: n.phone_number_type,
      status: n.status,
    }));
    res.json({ success: true, data: numbers });
  } catch (err) {
    console.error('[Telnyx] GET /numbers error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. POST /api/telnyx/token
//    Generates a short-lived WebRTC credential for a logged-in agent.
//    Frontend uses this token to initialize the Telnyx WebRTC SDK.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/token', async (req, res) => {
  try {
    const { agentId, agentName } = req.body;

    if (!agentId) {
      return res.status(400).json({ success: false, error: 'agentId is required' });
    }

    // Create an on-demand telephony credential linked to the connection
    const credResponse = await telnyx.telephonyCredentials.create({
      connection_id: process.env.TELNYX_CONNECTION_ID,
    });

    const credentialId = credResponse.data.id;
    const sipUsername = credResponse.data.sip_username;
    const sipPassword = credResponse.data.sip_password;

    // Generate a short-lived JWT token for WebRTC
    const tokenResponse = await telnyx.telephonyCredentials.createToken(credentialId, {});
    const token = tokenResponse.data || tokenResponse;

    console.log(`[Telnyx] WebRTC token created for agent: ${agentName} (${agentId})`);

    res.json({
      success: true,
      data: {
        token,
        credentialId,
        sipUsername,
        sipPassword,
        connectionId: process.env.TELNYX_CONNECTION_ID,
      },
    });
  } catch (err) {
    console.error('[Telnyx] POST /token error:', err.message, err.raw);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. POST /api/telnyx/calls/dial
//    Initiates an outbound call from the server side (Call Control API).
//    For WebRTC: the frontend SDK dials directly, this is for server-side
//    PSTN bridging or when agent needs to call via server control.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/calls/dial', async (req, res) => {
  try {
    const { to, from, agentId, agentName, clientName } = req.body;

    if (!to || !from) {
      return res.status(400).json({ success: false, error: 'to and from numbers are required' });
    }

    const callResponse = await telnyx.calls.create({
      connection_id: process.env.TELNYX_CONNECTION_ID,
      to,
      from,
      from_display_name: 'WowMyFlight',
      record_audio: true,
      record_audio_state: 'enabled',
    });

    const callControlId = callResponse.data?.call_control_id;
    const callLegId = callResponse.data?.call_leg_id;

    // Log the call in our store
    const log = callStore.createCallLog({
      callControlId,
      direction: 'outbound',
      fromNumber: from,
      toNumber: to,
      agentId,
      agentName,
    });

    console.log(`[Telnyx] Outbound call initiated: ${from} → ${to} (agent: ${agentName})`);

    res.json({
      success: true,
      data: {
        callControlId,
        callLegId,
        callLogId: log.id,
        status: 'dialing',
      },
    });
  } catch (err) {
    console.error('[Telnyx] POST /calls/dial error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. POST /api/telnyx/calls/action
//    In-call controls: mute, hold, unhold, transfer, hangup, send_dtmf
// ─────────────────────────────────────────────────────────────────────────────
router.post('/calls/action', async (req, res) => {
  try {
    const { callControlId, action, params = {} } = req.body;

    if (!callControlId || !action) {
      return res.status(400).json({ success: false, error: 'callControlId and action are required' });
    }

    const call = telnyx.calls(callControlId);
    let result;

    switch (action) {
      case 'hangup':
        result = await call.hangup();
        callStore.markCallEnded(callControlId);
        break;
      case 'hold':
        result = await call.hold({ audio_url: '' }); // Telnyx plays hold music
        callStore.updateCallLog(callControlId, { status: 'on_hold' });
        break;
      case 'unhold':
        result = await call.unhold();
        callStore.updateCallLog(callControlId, { status: 'answered' });
        break;
      case 'mute':
        result = await call.muteAudio({ mute: true });
        break;
      case 'unmute':
        result = await call.muteAudio({ mute: false });
        break;
      case 'send_dtmf':
        result = await call.sendDTMF({ digits: params.digits });
        break;
      case 'transfer':
        result = await call.transfer({ to: params.to });
        break;
      case 'record_start':
        result = await call.recordStart({ format: 'mp3', channels: 'dual' });
        break;
      case 'record_stop':
        result = await call.recordStop();
        break;
      default:
        return res.status(400).json({ success: false, error: `Unknown action: ${action}` });
    }

    console.log(`[Telnyx] Call action "${action}" on ${callControlId}`);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('[Telnyx] POST /calls/action error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. POST /api/telnyx/calls/disposition
//    Agent saves a mandatory call outcome after a call ends.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/calls/disposition', async (req, res) => {
  try {
    const { callId, agentId, disposition, notes } = req.body;

    if (!callId || !agentId || !disposition) {
      return res.status(400).json({
        success: false,
        error: 'callId, agentId, and disposition are required',
      });
    }

    const entry = callStore.saveDisposition({ callId, agentId, disposition, notes });
    console.log(`[Telnyx] Disposition saved: "${disposition}" for call ${callId} by agent ${agentId}`);

    res.json({ success: true, data: entry });
  } catch (err) {
    console.error('[Telnyx] POST /calls/disposition error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. GET /api/telnyx/calls/history
//    Returns call logs, optionally filtered by agent
// ─────────────────────────────────────────────────────────────────────────────
router.get('/calls/history', (req, res) => {
  try {
    const { agentId, limit } = req.query;
    const logs = callStore.getCallLogs({
      agentId: agentId || null,
      limit: parseInt(limit || 50),
    });
    res.json({ success: true, data: logs });
  } catch (err) {
    console.error('[Telnyx] GET /calls/history error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. POST /api/telnyx/sms/send
//    Sends an SMS to a customer using the messaging profile
// ─────────────────────────────────────────────────────────────────────────────
router.post('/sms/send', async (req, res) => {
  try {
    const { to, from, text, agentId } = req.body;

    if (!to || !text) {
      return res.status(400).json({ success: false, error: 'to and text are required' });
    }

    const fromNumber = from || process.env.TELNYX_DEFAULT_FROM_NUMBER;

    const msgResponse = await telnyx.messages.create({
      from: fromNumber,
      to,
      text,
      messaging_profile_id: process.env.TELNYX_MESSAGING_PROFILE_ID,
    });

    const messageId = msgResponse.data?.id;
    console.log(`[Telnyx] SMS sent: ${fromNumber} → ${to} (agent: ${agentId}), id: ${messageId}`);

    res.json({
      success: true,
      data: {
        messageId,
        from: fromNumber,
        to,
        status: msgResponse.data?.to?.[0]?.status || 'queued',
      },
    });
  } catch (err) {
    console.error('[Telnyx] POST /sms/send error:', err.message, err.raw);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. POST /api/telnyx/webhooks/voice
//    Receives all Telnyx Call Control webhook events.
//    IMPORTANT: This URL must be set in Telnyx portal under your Connection.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/webhooks/voice', express.raw({ type: 'application/json' }), (req, res) => {
  // Telnyx sends raw JSON body — already parsed by express.json() middleware
  const body = req.body;
  const event = body?.data;

  if (!event) {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }

  const eventType = event.event_type;
  const payload = event.payload || {};
  const callControlId = payload.call_control_id;

  // Get the global Socket.io instance to push real-time events to frontend
  const io = req.app.get('io');

  console.log(`[Telnyx Webhook] Event: ${eventType} | Call: ${callControlId}`);

  switch (eventType) {
    // ── Call is dialing (outbound) / incoming (inbound) ──────────────────────
    case 'call.initiated': {
      const direction = payload.direction; // 'outbound' | 'inbound'
      if (direction === 'inbound') {
        const from = payload.from;
        const to = payload.to;

        // Log the inbound call
        const log = callStore.createCallLog({
          callControlId,
          direction: 'inbound',
          fromNumber: from,
          toNumber: to,
          agentId: null,
          agentName: null,
        });

        // Push incoming call alert to ALL connected agents via Socket.io
        if (io) {
          io.emit('telnyx:incoming_call', {
            callControlId,
            callLogId: log.id,
            from,
            to,
            direction: 'inbound',
          });
        }
        console.log(`[Telnyx] Inbound call from: ${from} to ${to}`);
      }
      break;
    }

    // ── Call was answered ─────────────────────────────────────────────────────
    case 'call.answered': {
      callStore.markCallAnswered(callControlId);
      if (io) {
        io.emit('telnyx:call_answered', { callControlId });
      }
      console.log(`[Telnyx] Call answered: ${callControlId}`);
      break;
    }

    // ── Call ended / hungup ───────────────────────────────────────────────────
    case 'call.hangup': {
      const log = callStore.markCallEnded(callControlId);
      if (io) {
        io.emit('telnyx:call_ended', {
          callControlId,
          callLogId: log?.id,
          durationSeconds: log?.durationSeconds || 0,
          dispositionRequired: true,
        });
      }
      console.log(`[Telnyx] Call ended: ${callControlId} (${log?.durationSeconds}s)`);
      break;
    }

    // ── Recording is ready ────────────────────────────────────────────────────
    case 'call.recording.saved': {
      const recordingUrl = payload.recording_urls?.mp3 || payload.public_recording_urls?.mp3;
      if (recordingUrl && callControlId) {
        callStore.saveRecording(callControlId, recordingUrl);
        if (io) {
          io.emit('telnyx:recording_ready', { callControlId, recordingUrl });
        }
        console.log(`[Telnyx] Recording saved: ${recordingUrl}`);
      }
      break;
    }

    // ── Other events (log & ignore for now) ──────────────────────────────────
    default: {
      console.log(`[Telnyx Webhook] Unhandled event: ${eventType}`);
    }
  }

  // Telnyx requires a 200 response to acknowledge webhook receipt
  res.status(200).json({ received: true });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. POST /api/telnyx/webhooks/messaging
//    Receives SMS delivery status updates & inbound SMS messages
// ─────────────────────────────────────────────────────────────────────────────
router.post('/webhooks/messaging', (req, res) => {
  const body = req.body;
  const event = body?.data;
  const eventType = event?.event_type;
  const payload = event?.payload || {};
  const io = req.app.get('io');

  console.log(`[Telnyx Messaging Webhook] Event: ${eventType}`);

  if (eventType === 'message.received') {
    // Inbound SMS from a customer
    const from = payload.from?.phone_number;
    const text = payload.text;
    const to = payload.to?.[0]?.phone_number;

    if (io) {
      io.emit('telnyx:sms_received', { from, to, text, receivedAt: new Date().toISOString() });
    }
    console.log(`[Telnyx SMS] Inbound SMS from ${from}: "${text}"`);
  } else if (eventType === 'message.finalized') {
    // Delivery status update
    const messageId = payload.id;
    const status = payload.to?.[0]?.status;
    if (io) {
      io.emit('telnyx:sms_status', { messageId, status });
    }
    console.log(`[Telnyx SMS] Message ${messageId} status: ${status}`);
  }

  res.status(200).json({ received: true });
});

module.exports = router;
