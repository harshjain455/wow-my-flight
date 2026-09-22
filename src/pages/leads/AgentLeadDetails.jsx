import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

// Icons
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChatIcon from '@mui/icons-material/Chat';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import DescriptionIcon from '@mui/icons-material/Description';
import FlightIcon from '@mui/icons-material/Flight';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

// Components & Services
import { dbService } from '../../services/dbService';
import PageHeader from '../../components/PageHeader';
import { MOCK_LEADS, AGENTS } from '../../constants/mockData';

export const AgentLeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Assuming MOCK_LEADS is what we use if no backend, but let's query it
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: dbService.getLeads
  });

  const lead = leads.find((l) => l.id === id);
  const agent = AGENTS.find(a => a.id === lead?.assignedConsultantId);

  if (isLoading) {
    return <Box p={5} display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  if (!lead) {
    return <Box p={5}><Typography>Lead not found.</Typography></Box>;
  }

  return (
    <Box>
      <Button
        startIcon={<KeyboardArrowLeftIcon />}
        onClick={() => navigate('/leads')}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Back to Leads
      </Button>

      <PageHeader
        title={`${lead.firstName} ${lead.lastName}`}
        subtitle={`Lead ID: ${lead.id} | Priority: ${lead.priority || 'Medium'} | Temp: ${lead.leadTemperature || 'WARM'}`}
      />

      <Grid container spacing={3}>
        {/* LEFT / MAIN AREA */}
        <Grid item xs={12} md={8}>
          
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" /> Customer Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Full Name</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.firstName} {lead.lastName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Email Address</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Preferred Contact</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.preferredLanguage || 'Email/Phone'}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlightIcon color="secondary" /> Travel Requirement
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Origin</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.origin || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Destination</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.destination || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Trip Type</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.tripType || 'Round Trip'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Departure Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.travelDate || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Return Date</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.returnDate || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Cabin Class</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.cabinClass || 'Economy'}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Total Passengers</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.passengers || 1}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Adults</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.adults || (lead.passengers || 1)}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Children / Infants</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.children || 0} / {lead.infants || 0}</Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon color="info" /> Lead Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Lead Source</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{lead.source}</Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Priority</Typography>
                <Chip size="small" label={lead.priority || 'Medium'} color={lead.priority === 'High' ? 'error' : 'default'} sx={{ mt: 0.5, fontWeight: 600 }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Temperature</Typography>
                <Chip size="small" label={lead.leadTemperature || 'WARM'} color={lead.leadTemperature === 'HOT' || lead.leadTemperature === 'VIP' ? 'error' : 'warning'} sx={{ mt: 0.5, fontWeight: 600 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Assigned Agent</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                  <Avatar src={agent?.avatar} sx={{ width: 24, height: 24 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{agent?.name || 'Unassigned'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Current Status</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main', mt: 0.5 }}>{lead.status || 'NEW'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* RIGHT / SECONDARY AREA */}
        <Grid item xs={12} md={4}>
          
          <Paper sx={{ p: 2.5, mb: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Travel Requirement
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{lead.origin || 'DXB'}</Typography>
              <FlightIcon sx={{ transform: 'rotate(180deg)', my: 1, opacity: 0.8 }} />
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{lead.destination || 'LHR'}</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{lead.travelDate ? dayjs(lead.travelDate).format('DD MMM YYYY') : 'Flexible'}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{lead.passengers || 1} PAX</Typography>
            </Box>
            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'center', opacity: 0.9 }}>
              {lead.cabinClass || 'Economy'} • {lead.tripType || 'Round Trip'}
            </Typography>
          </Paper>

          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Actions
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" startIcon={<LocalPhoneIcon />} sx={{ justifyContent: 'flex-start' }}>Call</Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" startIcon={<EmailIcon />} sx={{ justifyContent: 'flex-start' }}>Email</Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" color="success" startIcon={<WhatsAppIcon />} sx={{ justifyContent: 'flex-start' }}>WhatsApp</Button>
              </Grid>
              <Grid item xs={6}>
                <Button fullWidth variant="outlined" color="warning" startIcon={<NoteAddIcon />} sx={{ justifyContent: 'flex-start' }}>Add Note</Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="secondary" startIcon={<EventIcon />} sx={{ mt: 1 }}>
                  Schedule Follow-up
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button fullWidth variant="contained" color="primary" startIcon={<DescriptionIcon />}>
                  Create Quote
                </Button>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Activity Timeline
            </Typography>
            <Box sx={{ position: 'relative' }}>
              {/* Vertical Line */}
              <Box sx={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', bgcolor: 'divider' }} />
              
              {(lead.timeline || []).map((t, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 3, position: 'relative' }}>
                  <Box sx={{ 
                    width: 24, height: 24, borderRadius: '50%', bgcolor: 'primary.main', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 
                  }}>
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} />
                  </Box>
                  <Box sx={{ pt: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{t.event}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {dayjs(t.date).format('DD MMM YYYY, HH:mm')} {t.user ? `• by ${t.user}` : ''}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              {(!lead.timeline || lead.timeline.length === 0) && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>No activity recorded yet.</Typography>
              )}
            </Box>
          </Paper>

        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentLeadDetails;
