/**
 * src/components/CallHistory.jsx
 * Shows call logs fetched from the backend with recording player.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Chip, IconButton, Skeleton, Tooltip,
  CircularProgress,
} from '@mui/material';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';
import PhoneForwardedIcon from '@mui/icons-material/PhoneForwarded';
import RefreshIcon from '@mui/icons-material/Refresh';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { fetchCallHistory, formatCallDuration, formatPhoneDisplay, CALL_DISPOSITIONS } from '../services/telnyxService';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const DISPOSITION_COLORS = Object.fromEntries(
  CALL_DISPOSITIONS.map((d) => [d.value, d.color])
);

export default function CallHistory() {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCallHistory({ agentId: currentUser?.id, limit: 30 });
      setLogs(data || []);
    } catch (err) {
      setError('Could not load call history. Is the backend server running?');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => { load(); }, [load]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.2 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: '0.72rem' }}>
          RECENT CALLS ({logs.length})
        </Typography>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={load} disabled={loading}>
            {loading ? <CircularProgress size={14} /> : <RefreshIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error */}
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mb: 1, fontSize: '0.72rem' }}>
          ⚠️ {error}
        </Typography>
      )}

      {/* Loading skeletons */}
      {loading && logs.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      )}

      {/* Empty state */}
      {!loading && logs.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <AccessTimeIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
            No calls yet. Make your first call!
          </Typography>
        </Box>
      )}

      {/* Call Log Rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7, maxHeight: 260, overflowY: 'auto' }}>
        {logs.map((log) => {
          const isInbound = log.direction === 'inbound';
          const dispColor = DISPOSITION_COLORS[log.disposition] || 'default';
          const dispLabel = CALL_DISPOSITIONS.find((d) => d.value === log.disposition)?.label;

          return (
            <Box
              key={log.id}
              sx={{
                p: 1.2, borderRadius: 2,
                border: '1px solid', borderColor: 'divider',
                bgcolor: 'background.default',
                display: 'flex', alignItems: 'flex-start', gap: 1,
              }}
            >
              {/* Direction icon */}
              <Box
                sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: isInbound ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)',
                  flexShrink: 0,
                }}
              >
                {isInbound
                  ? <PhoneCallbackIcon sx={{ fontSize: 14, color: '#22c55e' }} />
                  : <PhoneForwardedIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
                }
              </Box>

              {/* Call info */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 800, lineHeight: 1.2 }} noWrap>
                  {formatPhoneDisplay(isInbound ? log.fromNumber : log.toNumber)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Typography sx={{ fontSize: '0.62rem', color: 'text.disabled' }}>
                    {dayjs(log.createdAt).fromNow()}
                  </Typography>
                  {log.durationSeconds > 0 && (
                    <Typography sx={{ fontSize: '0.62rem', color: 'text.disabled' }}>
                      · {formatCallDuration(log.durationSeconds)}
                    </Typography>
                  )}
                  {dispLabel && (
                    <Chip
                      label={dispLabel}
                      color={dispColor}
                      size="small"
                      sx={{ fontSize: '0.55rem', height: 16, fontWeight: 700 }}
                    />
                  )}
                </Box>
                {log.notes && (
                  <Typography sx={{ fontSize: '0.62rem', color: 'text.secondary', mt: 0.2 }} noWrap>
                    {log.notes}
                  </Typography>
                )}
              </Box>

              {/* Recording player */}
              {log.recordingUrl && (
                <Tooltip title="Play Recording">
                  <IconButton
                    size="small"
                    onClick={() => window.open(log.recordingUrl, '_blank')}
                    sx={{
                      bgcolor: 'rgba(99,102,241,0.1)', color: '#6366f1',
                      '&:hover': { bgcolor: 'rgba(99,102,241,0.2)' },
                    }}
                  >
                    <PlayArrowIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
