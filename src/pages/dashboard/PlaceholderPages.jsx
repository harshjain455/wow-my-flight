import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PlaceholderPage = ({ title, description }) => (
  <Box>
    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>{title}</Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      {description}
    </Typography>
    <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6">Work in Progress</Typography>
      <Typography sx={{ mt: 1, color: 'text.secondary' }}>
        This module will be implemented in future phases as per the CRM roadmap.
      </Typography>
    </Box>
  </Box>
);

import Quotes from '../quotes/Quotes';
import FlightExpertDesk from './FlightExpertDesk';
import FlightRequests from '../flights/FlightRequests';
import Bookings from '../bookings/Bookings';
import BookingDetails from '../bookings/BookingDetails';
import Payments from '../payments/Payments';
import PaymentDetails from '../payments/PaymentDetails';
import PNRTracking from '../flight-alerts/PNRTracking';

export const QuotesPage = () => <Quotes />;
export const BookingsPage = () => <Bookings />;
export const BookingDetailsPage = () => <BookingDetails />;
export const SuppliersPage = () => <PlaceholderPage title="Suppliers" description="Manage airline and travel suppliers." />;
export const FlightAlertsPage = () => <PNRTracking />;
export const FlightRequestsPage = () => <FlightRequests />;
export const PaymentsPage = () => <Payments />;
export const PaymentDetailsPage = () => <PaymentDetails />;
