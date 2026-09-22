/**
 * server/index.js
 * WowMyFlight CRM — Main Backend Server
 * 
 * Responsibilities:
 *   - Express HTTP server
 *   - Socket.io real-time events (incoming calls, call status, SMS)
 *   - CORS configured for React frontend
 *   - Telnyx routes mounted at /api/telnyx
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const telnyxRoutes = require('./routes/telnyx');

const app = express();
const server = http.createServer(app);

// ─────────────────────────────────────────────────────────────────────────────
// Socket.io Setup — Real-time events to frontend
// ─────────────────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible in route handlers via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket.io] Agent connected: ${socket.id}`);

  // Agent identifies themselves after connecting
  socket.on('agent:register', ({ agentId, agentName }) => {
    socket.join(`agent:${agentId}`); // Join agent-specific room
    console.log(`[Socket.io] Agent registered: ${agentName} (${agentId})`);
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Agent disconnected: ${socket.id}`);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ],
  credentials: true,
}));

// Parse JSON — NOTE: Telnyx webhook route uses express.raw() internally
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'WowMyFlight CRM Backend',
    timestamp: new Date().toISOString(),
    telnyx: {
      configured: !!process.env.TELNYX_API_KEY,
      connectionId: process.env.TELNYX_CONNECTION_ID,
      defaultNumber: process.env.TELNYX_DEFAULT_FROM_NUMBER,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────────────────────────────────────
app.use('/api/telnyx', telnyxRoutes);

// ─────────────────────────────────────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ─────────────────────────────────────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─────────────────────────────────────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   WowMyFlight Backend Server — LIVE   ║');
  console.log(`╠════════════════════════════════════════╣`);
  console.log(`║  URL:    http://localhost:${PORT}          ║`);
  console.log(`║  Health: http://localhost:${PORT}/health   ║`);
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Telnyx API Key: ${process.env.TELNYX_API_KEY ? '✓ Loaded' : '✗ MISSING!'}           ║`);
  console.log(`║  Default Number: ${process.env.TELNYX_DEFAULT_FROM_NUMBER} ║`);
  console.log('╚════════════════════════════════════════╝\n');
});
