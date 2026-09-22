import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Alert from '@mui/material/Alert';

// Icons
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import GraphicEqIcon from '@mui/icons-material/GraphicEq';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import HeadsetIcon from '@mui/icons-material/Headset';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AssessmentIcon from '@mui/icons-material/Assessment';

import PageHeader from '../../components/PageHeader';
import AppTable from '../../components/AppTable';
import AppModal from '../../components/AppModal';
import DualClock from '../../components/DualClock';
import { useAlert } from '../../contexts/AlertContext';

export const QA_AGENTS = [
  { id: 'ag-1', name: 'Maria Santos', role: 'Senior Sales Agent', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', callCount: 14, bookingCount: 9 },
  { id: 'ag-2', name: 'Omar Farouq', role: 'Ticketing Expert', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', callCount: 18, bookingCount: 12 },
  { id: 'ag-3', name: 'Karan Singh', role: 'Flight Specialist', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', callCount: 11, bookingCount: 7 },
  { id: 'ag-4', name: 'Sarah Jenkins', role: 'Consultant', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', callCount: 16, bookingCount: 10 },
];

export const DEMO_CALL_TRANSCRIPT = [
  { time: '00:05', speaker: 'Agent (Maria)', text: 'Thank you for calling Wow My Flight! My name is Maria. May I have your full name and booking reference, please?' },
  { time: '00:15', speaker: 'Customer (M. Chen)', text: 'Hi Maria, this is Michael Chen. My PNR is ABC12D. I wanted to verify my flight date for JFK to London Heathrow.' },
  { time: '00:28', speaker: 'Agent (Maria)', text: 'Thank you Mr. Chen! For verification, could you confirm your date of birth and billing zip code on file?' },
  { time: '00:40', speaker: 'Customer (M. Chen)', text: 'Sure, DOB is May 14, 1985 and zip code is 10001.' },
  { time: '00:52', speaker: 'Agent (Maria)', text: 'Perfect, verification complete! I see your booking on British Airways BA-117 departing Oct 15th in Business Class. Let me walk you through the fare rules and baggage allowance.' },
  { time: '01:20', speaker: 'Agent (Maria)', text: 'Your ticket includes 2 checked bags up to 32kg each, seat selection, and complimentary lounge access. Is there anything else I can assist with today?' },
  { time: '02:05', speaker: 'Customer (M. Chen)', text: 'That covers everything, Maria. Thank you so much for the clear explanation!' },
  { time: '02:20', speaker: 'Agent (Maria)', text: 'It was my pleasure! Have a wonderful day and thank you for choosing Wow My Flight!' }
];

export const INITIAL_CALL_AUDITS = [
  {
    id: 'CALL-8801',
    agentId: 'ag-1',
    agentName: 'Maria Santos',
    customerName: 'Michael Chen',
    pnr: 'ABC12D',
    date: '2026-08-20 10:15',
    duration: '04:35',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/office_noise.ogg',
    scores: {
      greeting: 10,
      customerVerification: 9,
      requirementUnderstanding: 10,
      productKnowledge: 9,
      fareExplanation: 9,
      accuracy: 10,
      compliance: 9,
      salesTechnique: 10,
      closing: 9,
      documentation: 10,
    },
    auditorNotes: 'Flawless call control, excellent fare explanation, full compliance adherence.',
    status: 'Audited'
  },
  {
    id: 'CALL-8802',
    agentId: 'ag-2',
    agentName: 'Omar Farouq',
    customerName: 'Amit Lee',
    pnr: 'LMN78F',
    date: '2026-08-19 14:20',
    duration: '03:10',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/office_noise.ogg',
    scores: {
      greeting: 8,
      customerVerification: 8,
      requirementUnderstanding: 8,
      productKnowledge: 8,
      fareExplanation: 8,
      accuracy: 8,
      compliance: 8,
      salesTechnique: 8,
      closing: 8,
      documentation: 8,
    },
    auditorNotes: 'Good ticket status explanation, missed explaining bag allowance details.',
    status: 'Audited'
  },
  {
    id: 'CALL-8803',
    agentId: 'ag-3',
    agentName: 'Karan Singh',
    customerName: 'Rajesh Sharma',
    pnr: 'SAB89X',
    date: '2026-08-18 16:45',
    duration: '05:20',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/office_noise.ogg',
    scores: {
      greeting: 7,
      customerVerification: 7,
      requirementUnderstanding: 7,
      productKnowledge: 7,
      fareExplanation: 7,
      accuracy: 7,
      compliance: 7,
      salesTechnique: 7,
      closing: 7,
      documentation: 6,
    },
    auditorNotes: 'Needs improvement on baggage fee explanation & passport name double-check.',
    status: 'Audited'
  },
  {
    id: 'CALL-8804',
    agentId: 'ag-4',
    agentName: 'Sarah Jenkins',
    customerName: 'H. Miller',
    pnr: 'LH441P',
    date: '2026-08-17 11:30',
    duration: '02:45',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/office_noise.ogg',
    scores: {
      greeting: 6,
      customerVerification: 6,
      requirementUnderstanding: 6,
      productKnowledge: 6,
      fareExplanation: 6,
      accuracy: 6,
      compliance: 6,
      salesTechnique: 6,
      closing: 6,
      documentation: 6,
    },
    auditorNotes: 'Critical: Forgot mandatory cardholder authorization disclosure during call.',
    status: 'Audited'
  }
];

export const INITIAL_BOOKING_AUDITS = [
  {
    id: 'BK-AUD-901',
    bookingId: 'BK-1001',
    pnr: 'ABC12D',
    agentName: 'Maria Santos',
    customerName: 'M. Chen',
    airline: 'British Airways',
    date: '2026-08-20 11:00',
    scores: {
      greeting: 10,
      customerVerification: 10,
      requirementUnderstanding: 9,
      productKnowledge: 9,
      fareExplanation: 10,
      accuracy: 10,
      compliance: 9,
      salesTechnique: 9,
      closing: 9,
      documentation: 10,
    },
    auditorNotes: 'All passenger passport numbers, e-tickets, and GDS OSI remarks verified.',
    status: 'Audited'
  },
  {
    id: 'BK-AUD-902',
    bookingId: 'BK-1002',
    pnr: 'LMN78F',
    agentName: 'Karan Singh',
    customerName: 'A. Lee',
    airline: 'Singapore Airlines',
    date: '2026-08-19 16:30',
    scores: {
      greeting: 8,
      customerVerification: 8,
      requirementUnderstanding: 8,
      productKnowledge: 8,
      fareExplanation: 8,
      accuracy: 8,
      compliance: 8,
      salesTechnique: 8,
      closing: 8,
      documentation: 8,
    },
    auditorNotes: 'Valid fare markup applied, itinerary PDF dispatches sent correctly.',
    status: 'Audited'
  }
];

// Helper to calculate total score (out of 100) & automated classification
export const calculateQAScore = (scores) => {
  const values = Object.values(scores || {});
  const total = values.reduce((sum, val) => sum + (Number(val) || 0), 0);

  let classification = 'Critical';
  let color = 'error';
  let badgeBg = '#FEE2E2';
  let textColor = '#B91C1C';
  let icon = '🚨';

  if (total >= 90) {
    classification = 'Excellent';
    color = 'success';
    badgeBg = '#DCFCE7';
    textColor = '#15803D';
    icon = '🌟';
  } else if (total >= 80) {
    classification = 'Good';
    color = 'primary';
    badgeBg = '#EFF6FF';
    textColor = '#1D4ED8';
    icon = '👍';
  } else if (total >= 70) {
    classification = 'Needs Improvement';
    color = 'warning';
    badgeBg = '#FEF3C7';
    textColor = '#B45309';
    icon = '⚠️';
  }

  return { total, classification, color, badgeBg, textColor, icon };
};

export default function QAAudits() {
  const alert = useAlert();
  const showAlert = alert?.showAlert || (() => {});

  const [activeTab, setActiveTab] = useState('CALLS'); // 'CALLS' or 'BOOKINGS'

  // Data States
  const [callAudits, setCallAudits] = useState(INITIAL_CALL_AUDITS);
  const [bookingAudits, setBookingAudits] = useState(INITIAL_BOOKING_AUDITS);
  const [searchTerm, setSearchTerm] = useState('');

  // Workflow Selection State for Calls: Agent -> Call -> Recording -> Transcript -> QA Form
  const [selectedAgentId, setSelectedAgentId] = useState('ag-1');
  const [selectedCall, setSelectedCall] = useState(INITIAL_CALL_AUDITS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // QA Scorecard Editing Form State for selected call
  const [currentScores, setCurrentScores] = useState(INITIAL_CALL_AUDITS[0].scores);
  const [currentNotes, setCurrentNotes] = useState(INITIAL_CALL_AUDITS[0].auditorNotes);

  // Modal State for New Audit
  const [newAuditModalOpen, setNewAuditModalOpen] = useState(false);

  // Sync when selected call changes
  const handleSelectCall = (call) => {
    setSelectedCall(call);
    setCurrentScores(call.scores);
    setCurrentNotes(call.auditorNotes);
    setIsPlayingAudio(false);
  };

  // Scorecard parameter change
  const handleScoreChange = (param, value) => {
    setCurrentScores(prev => ({
      ...prev,
      [param]: Math.min(10, Math.max(0, Number(value) || 0))
    }));
  };

  // Save QA Scorecard Audit
  const handleSaveAudit = () => {
    const scoreMeta = calculateQAScore(currentScores);

    setCallAudits(prev => prev.map(c => {
      if (c.id === selectedCall.id) {
        return {
          ...c,
          scores: currentScores,
          auditorNotes: currentNotes,
          status: 'Audited'
        };
      }
      return c;
    }));

    showAlert(`🎉 QA Scorecard Saved! Total Score: ${scoreMeta.total}/100 — Classification: ${scoreMeta.classification} ${scoreMeta.icon}`, 'success');
  };

  const selectedAgent = useMemo(() => {
    return QA_AGENTS.find(a => a.id === selectedAgentId) || QA_AGENTS[0];
  }, [selectedAgentId]);

  const agentCalls = useMemo(() => {
    return callAudits.filter(c => c.agentId === selectedAgentId);
  }, [callAudits, selectedAgentId]);

  // Total calculated metrics
  const calculatedMeta = useMemo(() => {
    return calculateQAScore(currentScores);
  }, [currentScores]);

  // Columns for Audits List Table
  const callAuditColumns = [
    {
      id: 'id',
      label: 'Call Audit ID',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
          {row.id}
        </Typography>
      )
    },
    {
      id: 'agent',
      label: 'Agent',
      render: (row) => (
        <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.agentName}</Typography>
      )
    },
    {
      id: 'customer',
      label: 'Customer & PNR',
      render: (row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{row.customerName}</Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>PNR: {row.pnr}</Typography>
        </Box>
      )
    },
    {
      id: 'duration',
      label: 'Duration',
      render: (row) => (
        <Chip size="small" icon={<HeadsetIcon sx={{ fontSize: '0.75rem !important' }} />} label={row.duration} sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }} />
      )
    },
    {
      id: 'score',
      label: 'Score & Classification',
      render: (row) => {
        const meta = calculateQAScore(row.scores);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: meta.textColor }}>
              {meta.total}/100
            </Typography>
            <Chip
              size="small"
              label={`${meta.icon} ${meta.classification}`}
              sx={{ bgcolor: meta.badgeBg, color: meta.textColor, fontWeight: 900, fontSize: '0.65rem', height: 20 }}
            />
          </Box>
        );
      }
    },
    {
      id: 'actions',
      label: 'Action',
      render: (row) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<RateReviewIcon sx={{ fontSize: 13 }} />}
          sx={{ fontSize: '0.68rem', fontWeight: 800, py: 0.3 }}
          onClick={() => {
            setSelectedAgentId(row.agentId);
            handleSelectCall(row);
          }}
        >
          Audit Scorecard 🎧
        </Button>
      )
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      {/* Page Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          bgcolor: 'background.paper',
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
              alignItems: 'center',
            }}
          >
            <VerifiedUserIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                QUALITY ASSURANCE & AUDIT MODULE
              </Typography>
              <Chip size="small" label="QA Scorecard 100 Pts" color="success" sx={{ fontWeight: 800, fontSize: '0.65rem', height: 20 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Dual Audit System: Sales Calls + Bookings Audit · Selection Workflow: Agent ➔ Call ➔ Recording ➔ Transcript ➔ QA Scorecard
            </Typography>
          </Box>
        </Box>

        <DualClock compact client={{ timezone: 'America/New_York', label: 'Client EST' }} />
      </Paper>

      {/* KPI Cards Header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#F0FDF4' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>EXCELLENT (90-100)</Typography>
            <StarIcon sx={{ color: '#16A34A' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#15803D' }}>
            {callAudits.filter(c => calculateQAScore(c.scores).total >= 90).length}
          </Typography>
          <Typography variant="caption" color="success.main" sx={{ fontWeight: 800 }}>🌟 Top Performing Audits</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#EFF6FF' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>GOOD (80-89)</Typography>
            <CheckCircleIcon sx={{ color: '#2563EB' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#1D4ED8' }}>
            {callAudits.filter(c => {
              const score = calculateQAScore(c.scores).total;
              return score >= 80 && score < 90;
            }).length}
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>👍 Meets Standards</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FFFBEB' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>NEEDS IMPROVEMENT (70-79)</Typography>
            <AssessmentIcon sx={{ color: '#D97706' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#B45309' }}>
            {callAudits.filter(c => {
              const score = calculateQAScore(c.scores).total;
              return score >= 70 && score < 80;
            }).length}
          </Typography>
          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 800 }}>⚠️ Coaching Required</Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#FEF2F2' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>CRITICAL (&lt;70)</Typography>
            <RateReviewIcon sx={{ color: '#DC2626' }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: '#B91C1C' }}>
            {callAudits.filter(c => calculateQAScore(c.scores).total < 70).length}
          </Typography>
          <Typography variant="caption" color="error.main" sx={{ fontWeight: 800 }}>🚨 Escalation / Retraining</Typography>
        </Paper>
      </Box>

      {/* Main Tab Navigation */}
      <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{
              '& .MuiTab-root': {
                fontSize: '0.85rem',
                fontWeight: 900,
                textTransform: 'none',
                minHeight: 42,
              },
            }}
          >
            <Tab
              label="📞 SALES CALLS AUDIT WORKFLOW"
              value="CALLS"
              icon={<PhoneInTalkIcon fontSize="small" />}
              iconPosition="start"
            />
            <Tab
              label="✈️ BOOKINGS ACCURACY AUDIT"
              value="BOOKINGS"
              icon={<BookOnlineIcon fontSize="small" />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* ─── TAB 1: SALES CALLS AUDIT WORKFLOW ─── */}
        {activeTab === 'CALLS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Step-by-Step Selection Header */}
            <Paper elevation={0} sx={{ p: 2, bg: '#F8FAFC', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: 'primary.main' }}>
                🔄 QA AUDIT STEP-BY-STEP WORKFLOW
              </Typography>
              <Stepper activeStep={4} alternativeLabel>
                <Step completed><StepLabel>1. Select Agent</StepLabel></Step>
                <Step completed><StepLabel>2. Select Call</StepLabel></Step>
                <Step completed><StepLabel>3. Audio Recording</StepLabel></Step>
                <Step completed><StepLabel>4. Transcript View</StepLabel></Step>
                <Step completed><StepLabel>5. Scorecard Form (100 Pts)</StepLabel></Step>
              </Stepper>
            </Paper>

            {/* Selection Grid: Agent Selection & Call List */}
            <Grid container spacing={2.5}>
              {/* Step 1: Agent Selection */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" /> STEP 1: SELECT AGENT
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {QA_AGENTS.map((agent) => {
                      const isSelected = selectedAgentId === agent.id;
                      return (
                        <Paper
                          key={agent.id}
                          elevation={0}
                          onClick={() => setSelectedAgentId(agent.id)}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            bgcolor: isSelected ? '#EFF6FF' : 'background.paper',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            '&:hover': { borderColor: 'primary.main', bgcolor: '#F8FAFC' }
                          }}
                        >
                          <Avatar src={agent.avatar} sx={{ width: 40, height: 40 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{agent.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{agent.role}</Typography>
                          </Box>
                          <Chip size="small" label={`${agent.callCount} Calls`} sx={{ fontWeight: 800, fontSize: '0.65rem' }} />
                        </Paper>
                      );
                    })}
                  </Box>
                </Paper>
              </Grid>

              {/* Step 2: Call Selection for Selected Agent */}
              <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PhoneInTalkIcon color="primary" /> STEP 2: SELECT CALL RECORDING ({agentCalls.length} Calls for {selectedAgent.name})
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                    {agentCalls.map((call) => {
                      const isSelected = selectedCall?.id === call.id;
                      const scoreMeta = calculateQAScore(call.scores);
                      return (
                        <Paper
                          key={call.id}
                          elevation={0}
                          onClick={() => handleSelectCall(call)}
                          sx={{
                            p: 1.8,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            bgcolor: isSelected ? '#EFF6FF' : 'background.paper',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            '&:hover': { borderColor: 'primary.main' }
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 900, fontFamily: 'monospace', color: 'primary.main' }}>
                              {call.id}
                            </Typography>
                            <Chip size="small" label={`${scoreMeta.icon} ${scoreMeta.classification}`} sx={{ bgcolor: scoreMeta.badgeBg, color: scoreMeta.textColor, fontWeight: 900, fontSize: '0.62rem', height: 18 }} />
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{call.customerName} (PNR: {call.pnr})</Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">📅 {call.date}</Typography>
                            <Typography variant="caption" sx={{ fontWeight: 800 }}>⏱️ {call.duration}</Typography>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Step 3 & 4: Audio Player & Call Transcript View */}
            {selectedCall && (
              <Grid container spacing={2.5}>
                {/* Step 3: Audio Player */}
                <Grid item xs={12} lg={6}>
                  <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, bgcolor: '#0F172A', color: '#FFF' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GraphicEqIcon /> STEP 3: PLAY AUDIO RECORDING ({selectedCall.id})
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <IconButton
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        sx={{ bgcolor: '#38BDF8', color: '#0F172A', '&:hover': { bgcolor: '#7DD3FC' }, width: 48, height: 48 }}
                      >
                        {isPlayingAudio ? <PauseIcon /> : <PlayArrowIcon />}
                      </IconButton>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          Call with {selectedCall.customerName} · Agent: {selectedCall.agentName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          Duration: {selectedCall.duration} · High Quality WAV Stream
                        </Typography>
                      </Box>
                    </Box>

                    <Slider defaultValue={35} valueLabelDisplay="auto" sx={{ color: '#38BDF8' }} />
                  </Paper>
                </Grid>

                {/* Step 4: Transcript View */}
                <Grid item xs={12} lg={6}>
                  <Paper elevation={0} sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2.5, maxHeight: 220, overflowY: 'auto' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon color="primary" /> STEP 4: SPEECH-TO-TEXT TRANSCRIPT
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, fontSize: '0.78rem' }}>
                      {DEMO_CALL_TRANSCRIPT.map((line, idx) => (
                        <Box key={idx} sx={{ p: 0.8, borderRadius: 1.5, bgcolor: line.speaker.includes('Agent') ? '#EFF6FF' : '#F8FAFC' }}>
                          <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main', display: 'block' }}>
                            [{line.time}] {line.speaker}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#334155', fontWeight: 600 }}>
                            {line.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            )}

            {/* Step 5: Interactive 10-Point Scorecard Form (Total 100) */}
            {selectedCall && (
              <Paper elevation={0} sx={{ p: 3, border: '2px solid #3B82F6', borderRadius: 3, bgcolor: '#FFFFFF' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1.5 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>
                      📝 STEP 5: QA SCORECARD FORM — {selectedCall.id} ({selectedCall.agentName})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Audit 10 parameters (10 points each = Total 100). Automated score classification.
                    </Typography>
                  </Box>

                  {/* Automated Score Badge */}
                  <Paper elevation={0} sx={{ p: 1.5, px: 2.5, bgcolor: calculatedMeta.badgeBg, border: `2px solid ${calculatedMeta.textColor}`, borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="caption" sx={{ fontWeight: 900, color: calculatedMeta.textColor, display: 'block' }}>
                      TOTAL SCORE & CLASSIFICATION
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: calculatedMeta.textColor }}>
                      {calculatedMeta.total} / 100
                    </Typography>
                    <Chip size="small" label={`${calculatedMeta.icon} ${calculatedMeta.classification}`} sx={{ bgcolor: '#FFF', color: calculatedMeta.textColor, fontWeight: 900, height: 20 }} />
                  </Paper>
                </Box>

                {/* Scorecard 10 Parameters Form Grid */}
                <Grid container spacing={2.5} sx={{ mb: 3 }}>
                  {[
                    { key: 'greeting', label: '1. Greeting (Professional Opening)' },
                    { key: 'customerVerification', label: '2. Customer Verification (DOB / Zip Check)' },
                    { key: 'requirementUnderstanding', label: '3. Requirement Understanding' },
                    { key: 'productKnowledge', label: '4. Product Knowledge (Route & Addons)' },
                    { key: 'fareExplanation', label: '5. Fare Explanation (Bag Allowance & Rules)' },
                    { key: 'accuracy', label: '6. Accuracy (Passenger Details)' },
                    { key: 'compliance', label: '7. Compliance (Card Authorization Disclosure)' },
                    { key: 'salesTechnique', label: '8. Sales Technique & Value Pitch' },
                    { key: 'closing', label: '9. Closing & Professional Wrap-up' },
                    { key: 'documentation', label: '10. Documentation & CRM Notes' },
                  ].map((param) => (
                    <Grid item xs={12} sm={6} key={param.key}>
                      <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, bgcolor: '#F8FAFC' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E293B' }}>
                            {param.label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 900, color: 'primary.main' }}>
                            {currentScores[param.key] || 0} / 10
                          </Typography>
                        </Box>

                        <Slider
                          value={currentScores[param.key] || 0}
                          min={0}
                          max={10}
                          step={1}
                          onChange={(e, val) => handleScoreChange(param.key, val)}
                          valueLabelDisplay="auto"
                          sx={{ color: 'primary.main' }}
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Auditor Notes & Save */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                    ✍️ Auditor Feedback & Coaching Notes:
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Enter audit feedback, coaching points, or compliance observations..."
                    value={currentNotes}
                    onChange={(e) => setCurrentNotes(e.target.value)}
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                  <Button variant="contained" color="primary" onClick={handleSaveAudit} sx={{ fontWeight: 900, px: 3, py: 1 }}>
                    Save QA Scorecard Audit
                  </Button>
                </Box>
              </Paper>
            )}

            {/* All Audits List Table */}
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
              📜 COMPLETED CALL AUDITS HISTORY ({callAudits.length} Audited Calls)
            </Typography>
            <AppTable
              columns={callAuditColumns}
              data={callAudits}
              count={callAudits.length}
              page={0}
              rowsPerPage={10}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              hidePagination
            />
          </Box>
        )}

        {/* ─── TAB 2: BOOKINGS ACCURACY AUDIT ─── */}
        {activeTab === 'BOOKINGS' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Alert severity="success" icon={<BookOnlineIcon />} sx={{ borderRadius: 2, fontWeight: 700 }}>
              <b>✈️ Bookings QA Audit:</b> Audits passenger name spellings, passport dates, fare markup calculations, and GDS OSI ticket issuance compliance.
            </Alert>

            <AppTable
              columns={[
                { id: 'id', label: 'Booking Audit ID', render: r => <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 900, color: 'primary.main' }}>{r.id}</Typography> },
                { id: 'bookingId', label: 'Booking Ref & PNR', render: r => <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>{r.bookingId} ({r.pnr})</Typography> },
                { id: 'agent', label: 'Issuing Agent', render: r => <Typography variant="body2" sx={{ fontWeight: 700 }}>{r.agentName}</Typography> },
                { id: 'customer', label: 'Customer', render: r => <Typography variant="caption" sx={{ fontWeight: 700 }}>{r.customerName}</Typography> },
                { id: 'score', label: 'QA Score', render: r => {
                  const meta = calculateQAScore(r.scores);
                  return (
                    <Chip size="small" label={`${meta.icon} ${meta.total}/100 (${meta.classification})`} sx={{ bgcolor: meta.badgeBg, color: meta.textColor, fontWeight: 900 }} />
                  );
                }},
                { id: 'notes', label: 'Audit Notes', render: r => <Typography variant="caption" color="text.secondary">{r.auditorNotes}</Typography> },
              ]}
              data={bookingAudits}
              count={bookingAudits.length}
              page={0}
              rowsPerPage={10}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              hidePagination
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
