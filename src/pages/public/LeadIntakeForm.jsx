import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlightIcon from '@mui/icons-material/Flight';

// Services
import { dbService } from '../../services/dbService';
import { useAlert } from '../../contexts/AlertContext';

export const LeadIntakeForm = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [successData, setSuccessData] = useState(null);

  // Form states
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    preferredLanguage: 'English',
    serviceId: 'first_class',
    applicantsCount: 1,
    notes: ''
  });

  const createLeadMutation = useMutation({
    mutationFn: dbService.createLead,
    onSuccess: (data) => {
      setSuccessData({
        clientId: data.clientId || `CL${Math.floor(2020 + Math.random() * 100)}`,
        password: 'password123'
      });
      showAlert('Your enquiry has been submitted! Our team will contact you shortly.', 'success');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.nationality) {
      showAlert('Please fill in all required fields.', 'warning');
      return;
    }
    createLeadMutation.mutate(form);
  };

  if (successData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh', bgcolor: 'background.default', p: { xs: 1.5, sm: 3 } }}>
        <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, maxWidth: 500, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Registration Completed!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Thank you for registering with Wow My Flight Luxury Aviation. Our travel expert will reach out to you within 24 hours to confirm your booking details.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button variant="contained" color="secondary" size="large" fullWidth onClick={() => navigate('/')}
            >
              Back to Homepage
            </Button>
            <Typography variant="caption" color="text.secondary">
              Our Travel Expert will contact you on your registered email & WhatsApp number.
            </Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100dvh', bgcolor: 'background.default', p: { xs: 1.5, sm: 3 } }}>
      <Paper sx={{ p: { xs: 2.5, sm: 4, md: 5 }, borderRadius: 3, maxWidth: 650, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 2.5, sm: 4 } }}>
          {/* BRANDING LOGO */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
              WOW MY FLIGHT
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>Flight Booking & Travel Intake Form</Typography>
          <Typography variant="body2" color="text.secondary">Fill out this quick form to schedule a free expert flight consultation.</Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box className="grid grid-cols-12 gap-3 sm:gap-4">
            <Box className="col-span-12 sm:col-span-6">
              <TextField
                label="First Name"
                fullWidth
                required
                size="small"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </Box>
            <Box className="col-span-12 sm:col-span-6">
              <TextField
                label="Last Name"
                fullWidth
                required
                size="small"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </Box>
            <Box className="col-span-12 sm:col-span-6">
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                size="small"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Box>
            <Box className="col-span-12 sm:col-span-6">
              <TextField
                label="Phone Number"
                fullWidth
                required
                size="small"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Box>
            <Box className="col-span-12 sm:col-span-6">
              <TextField
                label="Nationality"
                fullWidth
                required
                size="small"
                value={form.nationality}
                onChange={(e) => setForm({ ...form, nationality: e.target.value })}
              />
            </Box>
            <Box className="col-span-12 sm:col-span-6">
              <FormControl fullWidth size="small">
                <InputLabel id="lang-select-label">Preferred Language</InputLabel>
                <Select
                  labelId="lang-select-label"
                  value={form.preferredLanguage}
                  onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value })}
                  label="Preferred Language"
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Spanish">Spanish</MenuItem>
                  <MenuItem value="Arabic">Arabic</MenuItem>
                  <MenuItem value="Russian">Russian</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="col-span-12 sm:col-span-6">
              <FormControl fullWidth size="small">
                <InputLabel id="service-select-label">Flight Program / Service of Interest</InputLabel>
                <Select
                  labelId="service-select-label"
                  value={form.serviceId}
                  onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                  label="Flight Program / Service of Interest"
                >
                  <MenuItem value="first_class">First Class Suite Booking</MenuItem>
                  <MenuItem value="private_jet">Private Jet Charter</MenuItem>
                  <MenuItem value="business_class">Business Class Flight</MenuItem>
                  <MenuItem value="holiday_pkg">Luxury Flight + Hotel Package</MenuItem>
                  <MenuItem value="group_booking">Group & Corporate Flight Charter</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="col-span-12 sm:col-span-6">
              <FormControl fullWidth size="small">
                <InputLabel id="applicants-select-label">Total Passengers (Including You)</InputLabel>
                <Select
                  labelId="applicants-select-label"
                  value={form.applicantsCount}
                  onChange={(e) => setForm({ ...form, applicantsCount: Number(e.target.value) })}
                  label="Total Passengers (Including You)"
                >
                  <MenuItem value={1}>1 (Main Passenger Only)</MenuItem>
                  <MenuItem value={2}>2 (Main + 1 Guest)</MenuItem>
                  <MenuItem value={3}>3 (Main + 2 Guests)</MenuItem>
                  <MenuItem value={4}>4 (Main + 3 Guests)</MenuItem>
                  <MenuItem value={5}>5 (Main + 4 Guests)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="col-span-12">
              <TextField
                label="Any brief notes about your flight itinerary or travel plans?"
                multiline
                rows={3}
                fullWidth
                size="small"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Box>
            <Box className="col-span-12">
              <Button type="submit" variant="contained" color="secondary" size="large" fullWidth>
                Register & Get Credentials
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LeadIntakeForm;
