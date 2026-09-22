import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

import DualClock from '../../components/DualClock';
import IssuanceQueue, { DEMO_ISSUANCE_QUEUE } from '../../components/IssuanceQueue';
import TicketControls from '../../components/TicketControls';
import PNRTracker, { DEMO_PNR_FEED } from '../../components/PNRTracker';
import { useAlert } from '../../contexts/AlertContext';

export default function TicketingIssuance() {
  const { showAlert } = useAlert();

  const [queueItems, setQueueItems] = useState(DEMO_ISSUANCE_QUEUE);
  const [selectedItem, setSelectedItem] = useState(DEMO_ISSUANCE_QUEUE[0]);
  const [pnrFeed, setPnrFeed] = useState(DEMO_PNR_FEED);

  const handleSelectForIssue = (item) => {
    setSelectedItem(item);
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    setQueueItems(prev =>
      prev.map(item =>
        item.id === bookingId || item.bookingId === bookingId
          ? {
              ...item,
              ticketStatus: newStatus,
              issueDateTime: newStatus === 'Ticketed' ? new Date().toLocaleString() : item.issueDateTime
            }
          : item
      )
    );
  };

  const handleIssueTicketSuccess = (successData) => {
    // Visually mark item as Ticketed in queue
    setQueueItems(prev =>
      prev.map(item =>
        item.id === successData.bookingRef || item.bookingId === successData.bookingRef
          ? {
              ...item,
              ticketStatus: 'Ticketed',
              ticketNumber: successData.eTickets?.join(', ') || '0172345678901',
              issueDateTime: new Date().toLocaleString()
            }
          : item
      )
    );
    setSelectedItem(null);

    // 2. Add ticketed item to PNR Auto-Tracker feed
    const newTrackerEntry = {
      pnr: successData.pnr,
      customer: successData.customerName,
      route: successData.route,
      date: 'Today',
      status: 'Ticketed & Dispatched — PDF Itinerary Sent',
      category: 'GREEN',
      tone: 'success',
      ago: 'Just now',
      original: null,
      updated: null,
      needsAction: false
    };

    setPnrFeed(prev => [newTrackerEntry, ...prev]);
  };

  return (
    <Box sx={{ pb: 4 }}>
      {/* ─── 1. TOPBAR ─── */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          px: 3,
          mb: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              p: 1.2,
              borderRadius: 2,
              bgcolor: 'success.50',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ConfirmationNumberIcon sx={{ fontSize: 28 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Ticketing Team — Issuance & Tracking
              </Typography>
              <Chip size="small" label="Ticketing Operations" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Ticketing Department Queue (PNR, Supplier, Ticket Number, Fare, Taxes, Commission, TTL, Agents) & GDS validation
            </Typography>
          </Box>
        </Box>

        {/* Dual Clock UI: Agent Local & Client Local */}
        <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
      </Paper>

      {/* ─── 2. TWO-ROW LAYOUT: Top (Full Width Queue) & Bottom (Controls & Tracker side-by-side) ─── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Top Row: Ready-for-Issuance Queue (Full Width) */}
        <Box>
          <IssuanceQueue
            items={queueItems}
            selectedId={selectedItem?.id}
            onSelectIssue={handleSelectForIssue}
            onUpdateStatus={handleUpdateStatus}
          />
        </Box>

        {/* Bottom Row: Controls & Tracker side-by-side */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.2fr 1fr' },
            gap: 3,
            alignItems: 'start'
          }}
        >
          <Box>
            <TicketControls
              selectedItem={selectedItem}
              onIssueTicketSuccess={handleIssueTicketSuccess}
            />
          </Box>

          <Box>
            <PNRTracker
              feed={pnrFeed}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
