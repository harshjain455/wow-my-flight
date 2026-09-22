import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LockIcon from '@mui/icons-material/Lock';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

import { dbService } from '../../services/dbService';
import FileUploader from '../../components/FileUploader';
import StatusBadge from '../../components/StatusBadge';
import { useAlert } from '../../contexts/AlertContext';

export const ClientPortalDocs = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const [tabValue, setTabValue] = useState(0);

  // Slot booking state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  // Fetch client details
  const { data: clients = [], isLoading: isClientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: dbService.getClients });

  const client = clients.find((c) => c.id === clientId);

  const { data: documents = [], isLoading: isDocsLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: dbService.getDocuments });

  const { data: consultations = [], isLoading: isConsultationsLoading } = useQuery({
    queryKey: ['consultations'],
    queryFn: dbService.getConsultations });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: dbService.getAgents });

  // Mutations
  const uploadDocMutation = useMutation({
    mutationFn: dbService.uploadDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      showAlert('Document uploaded successfully. It is now pending review.', 'success');
    } });

  const bookMeetingMutation = useMutation({
    mutationFn: dbService.bookClientConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showAlert('Your consultation has been booked successfully!', 'success');
      setSelectedDate('');
      setSelectedTime('');
      setMeetingNotes('');
    }
  });

  const handleDocUploaded = (docData, belongsTo) => {
    uploadDocMutation.mutate({
      ...docData,
      belongsTo
    });
  };

  const handleLogout = () => {
    showAlert('Successfully logged out.', 'info');
    navigate('/portal/login');
  };

  const handleBookConsultation = () => {
    if (!selectedDate || !selectedTime) {
      showAlert('Please select a date and a time slot.', 'warning');
      return;
    }
    bookMeetingMutation.mutate({
      clientId: client.id,
      meetingDate: selectedDate,
      meetingTime: selectedTime,
      notes: meetingNotes
    });
  };

  if (isClientsLoading || isDocsLoading || isConsultationsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!client) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Client profile not found.</Typography>
        <Button onClick={() => navigate('/portal/login')}>Go Back to Login</Button>
      </Box>
    );
  }

  // Next 5 working dates helper
  const getNextWorkingDates = () => {
    const dates = [];
    let current = new Date();
    while (dates.length < 5) {
      current.setDate(current.getDate() + 1);
      // Exclude weekends (0: Sunday, 6: Saturday)
      if (current.getDay() !== 0 && current.getDay() !== 6) {
        dates.push({
          val: current.toISOString().split('T')[0],
          label: current.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        });
      }
    }
    return dates;
  };

  const bookingDates = getNextWorkingDates();

  // Hourly slots config
  const TIME_SLOTS = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

  // Check which slots are already booked on selected date
  const getBookedSlotsForDate = (dateVal) => {
    if (!dateVal) return [];
    
    // Find consultations for the assigned agent (or unassigned/any pending agent) on this date
    const agentId = client.assignedConsultantId || 'unassigned';
    return consultations
      .filter(c => c.meetingDate === dateVal && c.assignedConsultantId === agentId && c.status !== 'Cancelled')
      .map(c => c.meetingTime);
  };

  const bookedSlots = getBookedSlotsForDate(selectedDate);

  // Client specific details
  const clientDocuments = documents.filter((d) => d.clientId === client.id);
  const clientConsultations = consultations.filter((c) => c.leadId === client.id);
  const activeConsultation = clientConsultations.find(c => c.status === 'Scheduled' || c.status === 'Pending Assignment');
  const assignedAgent = agents.find(a => a.id === client.assignedConsultantId);

  // Document categories for flight bookings
  const REQUIRED_CATEGORIES = {
    first_class: ['Passport (Copy)', 'Frequent Flyer Card / Membership', 'Travel Insurance Certificate', 'Visa / ETA (if required)'],
    business_class: ['Passport (Copy)', 'Corporate Travel Authorization Letter', 'Travel Insurance Certificate', 'Visa / Entry Permit'],
    economy: ['Passport (Copy)', 'Travel Insurance Certificate', 'Visa / ETA (if required)'],
    private_jet: ['Passport (Copy)', 'Private Charter Authorization', 'Travel Insurance', 'Security Clearance (if applicable)'],
    dnv: ['Passport (Copy)', 'Frequent Flyer Card / Membership', 'Travel Insurance Certificate', 'Visa / ETA (if required)'],
    nlv: ['Passport (Copy)', 'Corporate Travel Authorization Letter', 'Travel Insurance Certificate', 'Visa / Entry Permit'],
    study: ['Passport (Copy)', 'Travel Insurance Certificate', 'Visa / ETA (if required)'],
    property: ['Passport (Copy)', 'Private Charter Authorization', 'Travel Insurance'],
    family: ['Passport (Copy)', 'Travel Insurance Certificate', 'Visa / Entry Permit']
  };

  const getRequiredList = () => {
    return REQUIRED_CATEGORIES[client.serviceId] || ['Passport (Copy)'];
  };

  const requiredCategories = getRequiredList();

  // Generate dependent sections
  const applicantsList = [];
  applicantsList.push('Main Applicant');
  for (let i = 1; i < (client.applicantsCount || 1); i++) {
    applicantsList.push(`Dependent ${i}`);
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4, px: { xs: 2, md: 6 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, maxWidth: 950, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Welcome, {client.firstName} {client.lastName}</Typography>
            <Typography variant="caption" color="text.secondary">WOW MY FLIGHT | Booking & Travel Document Portal ({client.id})</Typography>
          </Box>
        </Box>
        <Button startIcon={<LogoutIcon />} onClick={handleLogout} color="inherit">
          Log out
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ maxWidth: 950, mx: 'auto', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="1. Schedule Travel Consultation" />
          <Tab label="2. Flight Document Center" />
        </Tabs>
      </Box>

      <Box sx={{ maxWidth: 950, mx: 'auto' }}>
        {/* Tab 0: Schedule Consultation */}
        {tabValue === 0 && (
          <Box className="grid grid-cols-12 gap-2">
            {/* If consultation is already scheduled */}
            {activeConsultation ? (
              <Box className="col-span-12">
                <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'success.main', bgcolor: '#F0FDF4', boxShadow: 'none' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" /> Consultation Confirmed!
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Your free expert flight consultation has been successfully registered with your assigned Travel Expert. Please find the details below:
                  </Typography>

                  <Box className="grid grid-cols-12 gap-2" sx={{ mb: 3 }}>
                    <Box className="col-span-12 sm:col-span-4">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>DATE & TIME</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{activeConsultation.meetingDate} at {activeConsultation.meetingTime}</Typography>
                    </Box>
                    <Box className="col-span-12 sm:col-span-4">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ASSIGNED TRAVEL EXPERT</Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{assignedAgent ? assignedAgent.name : 'Awaiting assignment'}</Typography>
                    </Box>
                    <Box className="col-span-12 sm:col-span-4">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>STATUS</Typography>
                      <Box sx={{ mt: 0.5 }}>
                        <Chip
                          label={activeConsultation.status === 'Scheduled' ? 'Confirmed & Scheduled' : 'Awaiting Assignment'}
                          color={activeConsultation.status === 'Scheduled' ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  {activeConsultation.status === 'Scheduled' && activeConsultation.meetingLink && (
                    <Box sx={{ p: 2, bgcolor: '#DCFCE7', borderRadius: 2, border: '1px dashed', borderColor: 'success.main', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <VideoCameraFrontIcon color="success" />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Your Video Consultation Link is Ready</Typography>
                          <Typography variant="caption" color="text.secondary">Use this to join the expert call at the scheduled time.</Typography>
                        </Box>
                      </Box>
                      <Button variant="contained" color="success" href={activeConsultation.meetingLink} target="_blank">
                        Join Zoom Call
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Box>
            ) : (
              // If NO consultation is booked yet
              <Box className="col-span-12">
                <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Book Free Flight Consultation</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Please select a date and an available time slot. Our system will match you with your assigned Travel Expert for a 45-minute video call.
                  </Typography>

                  {/* 1. Date selector */}
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Step 1: Choose Date</Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 4 }}>
                    {bookingDates.map((date) => (
                      <Button
                        key={date.val}
                        variant={selectedDate === date.val ? 'contained' : 'outlined'}
                        color={selectedDate === date.val ? 'secondary' : 'inherit'}
                        onClick={() => { setSelectedDate(date.val); setSelectedTime(''); }}
                        sx={{ p: 2, borderRadius: 2, textTransform: 'none', display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 100 }}
                      >
                        <CalendarMonthIcon size="small" />
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{date.label}</Typography>
                      </Button>
                    ))}
                  </Box>

                  {/* 2. Time selector */}
                  {selectedDate && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>Step 2: Choose Available Slot (Movie-Ticket Style)</Typography>
                      <Box className="grid grid-cols-12 gap-5" sx={{ maxWidth: 500 }}>
                        {TIME_SLOTS.map((slot) => {
                          const isBooked = bookedSlots.includes(slot);
                          return (
                            <Box className="col-span-4" key={slot}>
                              <Button
                                fullWidth
                                disabled={isBooked}
                                variant={selectedTime === slot ? 'contained' : 'outlined'}
                                color={selectedTime === slot ? 'primary' : 'inherit'}
                                onClick={() => setSelectedTime(slot)}
                                sx={{ py: 1.5, borderRadius: 2, fontWeight: 700 }}
                              >
                                {slot} {isBooked ? '(Booked)' : ''}
                              </Button>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  )}

                  {/* 3. Notes */}
                  {selectedDate && selectedTime && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, maxWidth: 500 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Step 3: Meeting Purpose</Typography>
                      <TextField
                        label="What would you like to discuss in the flight consultation?"
                        multiline
                        rows={2}
                        fullWidth
                        size="small"
                        value={meetingNotes}
                        onChange={(e) => setMeetingNotes(e.target.value)}
                      />
                      <Button variant="contained" color="secondary" size="large" onClick={handleBookConsultation}>
                        Confirm Consultation Booking
                      </Button>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}

            {/* Past Booked consultations */}
            <Box className="col-span-12" sx={{ mt: 2 }}>
              <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Your Consultations History</Typography>
                {clientConsultations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No consultation records found.</Typography>
                ) : (
                  <List>
                    {clientConsultations.map((c) => (
                      <Paper key={c.id} sx={{ p: 2, mb: 1.5, bgcolor: 'background.neutral', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{c.meetingDate} at {c.meetingTime} (45 mins)</Typography>
                          <Typography variant="caption" color="text.secondary">Notes: {c.notes}</Typography>
                        </Box>
                        <Chip label={c.status} color={c.status === 'Completed' ? 'default' : 'success'} size="small" sx={{ fontWeight: 700 }} />
                      </Paper>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          </Box>
        )}

        {/* Tab 1: Document Center */}
        {tabValue === 1 && (
          <Box>
            {/* If uploader is locked */}
            {!client.documentUploadAllowed ? (
              <Paper sx={{ p: 6, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', textAlign: 'center' }}>
                <LockIcon color="error" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Document Uploading Locked</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
                  Your document center is locked. To unlock, please first schedule and complete your initial flight consultation call with your Travel Expert.
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => setTabValue(0)}>
                  Go to Consultation Scheduler
                </Button>
              </Paper>
            ) : (
              // If uploader is UNLOCKED
              <Box className="grid grid-cols-12 gap-2">
                <Box className="col-span-12">
                  <Paper sx={{ p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Flight Document Submission Center</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Your portal is unlocked! Please upload your travel documents (Passport, Visa, Insurance, E-Ticket) for processing by your Travel Expert.
                    </Typography>

                    {/* Dependent wise accordions */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {applicantsList.map((person, index) => {
                        const personDocs = clientDocuments.filter(d => d.belongsTo === person || (!d.belongsTo && person === 'Main Applicant'));
                        return (
                          <Accordion key={person} defaultExpanded={index === 0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px !important', boxShadow: 'none', '&:before': { display: 'none' } }}>
                            <AccordionSummary expandMoreIcon={<ExpandMoreIcon />}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                📁 {person === 'Main Applicant' ? `${person} (${client.firstName} ${client.lastName})` : person}
                                <Chip label={`${personDocs.length} files`} size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                                Upload files specifically belonging to **{person}**. Required files include: {requiredCategories.join(', ')}.
                              </Typography>

                              <FileUploader
                                onUpload={(docData) => handleDocUploaded(docData, person)}
                                clientId={client.id}
                                clientName={`${client.firstName} ${client.lastName}`}
                              />

                              <Divider sx={{ my: 3 }} />

                              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Files uploaded for {person}:</Typography>
                              {personDocs.length === 0 ? (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', py: 2 }}>No files uploaded yet for this applicant.</Typography>
                              ) : (
                                <List disablePadding>
                                  {personDocs.map((doc) => (
                                    <Paper
                                      key={doc.id}
                                      sx={{
                                        p: 2,
                                        mb: 1.5,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        boxShadow: 'none',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        bgcolor: doc.status === 'Approved' ? '#F0FDF4' : 'background.paper'
                                      }}
                                    >
                                      <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{doc.name || doc.fileName}</Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                          Category: {doc.category} | Uploaded on: {doc.uploadedDate ? new Date(doc.uploadedDate).toLocaleDateString() : 'Recently'}
                                        </Typography>
                                        {doc.comment && (
                                          <Typography variant="body2" sx={{ mt: 0.5, color: doc.status === 'Approved' ? 'success.main' : 'error.main', fontStyle: 'italic', fontSize: '0.75rem' }}>
                                            Note: {doc.comment}
                                          </Typography>
                                        )}
                                      </Box>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <StatusBadge status={doc.status} />
                                      </Box>
                                    </Paper>
                                  ))}
                                </List>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ClientPortalDocs;
