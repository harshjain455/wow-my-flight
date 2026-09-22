import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dbService } from '../../services/dbService';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// Components
import PageHeader from '../../components/PageHeader';
import AppModal from '../../components/AppModal';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';


export const SuperAdminRefundCommissionHub = () => {
  const [tabValue, setTabValue] = useState(0);
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { currentUser } = useAuth();

  const hasPermission = (key) => {
    if (currentUser?.customPermissions?.enabled) {
      return !!currentUser.customPermissions.granular?.[key];
    }
    return true;
  };


  // Modals state
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  
  // Form states
  const [selectedClientId, setSelectedClientId] = useState('');
  const [refundCategory, setRefundCategory] = useState('Visa Rejection');
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [commissionType, setCommissionType] = useState('10%');
  const [commissionValue, setCommissionValue] = useState('10');

  // Queries
  const { data: refunds = [], isLoading: loadingRefunds } = useQuery({
    queryKey: ['refund-requests'],
    queryFn: dbService.getRefundRequests });

  const { data: commissionReport = [], isLoading: loadingCommissions } = useQuery({
    queryKey: ['commission-report'],
    queryFn: dbService.getCommissionsReport });

  const { data: commissionRates = [], isLoading: loadingRates } = useQuery({
    queryKey: ['commission-rates'],
    queryFn: dbService.getCommissionRates });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: dbService.getClients });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: dbService.getAgents });

  // Mutations
  const createRefundMutation = useMutation({
    mutationFn: dbService.createRefundRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refund-requests'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showAlert('Refund request created successfully', 'success');
      setRefundModalOpen(false);
      setSelectedClientId('');
      setRefundReason('');
      setRefundAmount('');
    }
  });

  const updateRefundStatusMutation = useMutation({
    mutationFn: ({ refundId, status }) => dbService.updateRefundStatus(refundId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refund-requests'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showAlert('Refund status updated successfully', 'success');
    }
  });

  const updateCommissionRateMutation = useMutation({
    mutationFn: ({ agentId, type, value }) => dbService.updateCommissionRate(agentId, type, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-rates'] });
      queryClient.invalidateQueries({ queryKey: ['commission-report'] });
      showAlert('Commission rate modified successfully', 'success');
      setRateModalOpen(false);
    }
  });

  // Helpers
  const handleCreateRefund = () => {
    if (!selectedClientId || !refundReason) {
      showAlert('Please select a client and provide a reason', 'warning');
      return;
    }
    createRefundMutation.mutate({
      clientId: selectedClientId,
      category: refundCategory,
      reason: refundReason,
      amount: refundCategory === 'Visa Rejection' ? undefined : Number(refundAmount)
    });
  };

  const handleUpdateRefundStatus = (id, status) => {
    updateRefundStatusMutation.mutate({ refundId: id, status });
  };

  const handleOpenRateModal = (agent) => {
    setSelectedAgentId(agent.id);
    const existingRate = commissionRates.find(r => r.agentId === agent.id);
    if (existingRate) {
      setCommissionType(existingRate.type);
      setCommissionValue(String(existingRate.value));
    } else {
      setCommissionType('10%');
      setCommissionValue('10');
    }
    setRateModalOpen(true);
  };

  const handleUpdateCommissionRate = () => {
    updateCommissionRateMutation.mutate({
      agentId: selectedAgentId,
      type: commissionType,
      value: commissionType === '5%' ? 5 : commissionType === '10%' ? 10 : Number(commissionValue)
    });
  };

  // Performance calculations
  const getAgentPerformance = () => {
    return agents.map(agent => {
      const agentReports = commissionReport.filter(r => r.agentId === agent.id);
      const packagesSold = agentReports.length;
      const totalEarned = agentReports.reduce((sum, r) => sum + r.commissionEarned, 0);
      const totalPaid = agentReports.reduce((sum, r) => sum + r.commissionPaid, 0);
      const currentRate = commissionRates.find(r => r.agentId === agent.id) || { type: '10%', value: 10 };

      return {
        ...agent,
        packagesSold,
        totalEarned,
        totalPaid,
        structure: `${currentRate.type} (${currentRate.type === 'fixed' ? '€' + currentRate.value : currentRate.value + '%'})`
      };
    });
  };

  const agentPerformance = getAgentPerformance();

  return (
    <Box>
      <PageHeader
        title="Refund & Commission Hub"
        subtitle="Manage consultant commission percentages, track payouts, request service refunds, and audit visa rejections."
      />

      <Tabs
        value={tabValue}
        onChange={(e, val) => setTabValue(val)}
        indicatorColor="primary"
        textColor="primary"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Commission Management" />
        <Tab label="Refund Management" />
      </Tabs>

      {/* Tab 1: Commission Management */}
      {tabValue === 0 && (
        <Box className="grid grid-cols-12 gap-2">
          <Box className="col-span-12">
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Agent Commission Overview
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Adjust automatic payout parameters, structure commission types (5%, 10%, Custom or Fixed), and audit agent balances.
              </Typography>

              <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
                <Table sx={{ minWidth: 850 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Agent Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Rate Structure</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Packages Sold</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total Commission Earned</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total Commission Paid</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Commission Pending</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agentPerformance.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{agent.name}</TableCell>
                        <TableCell>
                          <Chip label={agent.structure} color="primary" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{agent.packagesSold}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>€{agent.totalEarned.toLocaleString()}</TableCell>
                        <TableCell sx={{ color: 'success.main', fontWeight: 600 }}>€{agent.totalPaid.toLocaleString()}</TableCell>
                        <TableCell sx={{ color: 'warning.main', fontWeight: 700 }}>€{(agent.totalEarned - agent.totalPaid).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Button size="small" variant="contained" color="secondary" onClick={() => handleOpenRateModal(agent)}>
                            Modify Rate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>

          {/* Commissions Ledger */}
          <Box className="col-span-12">
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Paid Invoices & Calculated Commissions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Details of automatically parsed invoices, structures, and commission logs.
              </Typography>

              <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
                <Table sx={{ minWidth: 900 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Invoice ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Consultant</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Amount Paid</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Rate Structure</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Earned Commission</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {commissionReport.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{row.paymentId}</TableCell>
                        <TableCell>{row.clientName}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{row.agentName}</TableCell>
                        <TableCell>€{row.amountPaid.toLocaleString()}</TableCell>
                        <TableCell>{row.structure}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'secondary.main' }}>
                          €{row.commissionEarned.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {row.commissionPending === 0 ? (
                            <Chip label="Paid Out" color="success" size="small" sx={{ fontWeight: 700 }} />
                          ) : (
                            <Chip label="Accrued" color="warning" size="small" sx={{ fontWeight: 700 }} />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Tab 2: Refund Management */}
      {tabValue === 1 && (
        <Box className="grid grid-cols-12 gap-2">
          <Box className="col-span-12" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            {hasPermission('refundPayment') && (
              <Button variant="contained" color="primary" onClick={() => setRefundModalOpen(true)}>
                Request Refund
              </Button>
            )}
          </Box>


          <Box className="col-span-12 md:col-span-8">
            <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                Refund Requests Ledger
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Monitor refund reviews, status approvals, and audit records. Note: Visa Rejection requests calculate 50% automatically.
              </Typography>

              <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Request ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Refund Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {refunds.map((ref) => (
                      <TableRow key={ref.id}>
                        <TableCell sx={{ fontWeight: 600 }}>{ref.id}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{ref.clientName}</TableCell>
                        <TableCell>
                          <Chip label={ref.category} variant="outlined" color={ref.category === 'Visa Rejection' ? 'error' : 'default'} size="small" sx={{ fontWeight: 700 }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'error.main' }}>€{ref.amount.toLocaleString()}</TableCell>
                        <TableCell>{ref.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={ref.status}
                            color={ref.status === 'Processed' ? 'success' : ref.status === 'Approved' ? 'info' : 'warning'}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            {ref.status === 'Pending Review' && hasPermission('refundPayment') && (
                              <Button size="small" variant="outlined" color="success" onClick={() => handleUpdateRefundStatus(ref.id, 'Approved')}>
                                Approve
                              </Button>
                            )}
                            {ref.status === 'Approved' && hasPermission('refundPayment') && (
                              <Button size="small" variant="contained" color="success" onClick={() => handleUpdateRefundStatus(ref.id, 'Processed')}>
                                Process Refund
                              </Button>
                            )}
                            {ref.status === 'Pending Review' && hasPermission('refundPayment') && (
                              <Button size="small" variant="outlined" color="error" onClick={() => handleUpdateRefundStatus(ref.id, 'Cancelled')}>
                                Reject
                              </Button>
                            )}
                          </Box>
                        </TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>

          {/* Refund Review Audit Logs */}
          <Box className="col-span-12 md:col-span-4">
            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  Refund Audit Trail
                </Typography>
                <List sx={{ p: 0 }}>
                  {refunds.flatMap(r => r.auditLogs || []).map((log, index) => (
                    <ListItem key={index} alignItems="flex-start" sx={{ px: 0, py: 1, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { border: 0 } }}>
                      <ListItemText
                        primary={log.action}
                        secondary={
                          <React.Fragment>
                            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                              By: {log.user}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Time: {new Date(log.date).toLocaleString()}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {/* Modal: Request Refund */}
      <AppModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        title="Generate Refund Request"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="client-refund-select-label">Select Client</InputLabel>
            <Select
              labelId="client-refund-select-label"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              label="Select Client"
            >
              {clients.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.firstName} {c.lastName} ({c.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="category-refund-select-label">Category</InputLabel>
            <Select
              labelId="category-refund-select-label"
              value={refundCategory}
              onChange={(e) => setRefundCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="Visa Rejection">Visa Rejection (Auto 50% Refund)</MenuItem>
              <MenuItem value="Customer Discontent">Customer Discontent</MenuItem>
              <MenuItem value="Service Cancellation">Service Cancellation</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          {refundCategory !== 'Visa Rejection' && (
            <TextField
              label="Refund Amount (€)"
              type="number"
              fullWidth
              size="small"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
            />
          )}

          {refundCategory === 'Visa Rejection' && (
            <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                VISA REJECTION CLAUSE:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                The system will automatically audit the selected client's payments history and calculate exactly 50% of the total paid amount upon submission.
              </Typography>
            </Box>
          )}

          <TextField
            label="Reason for Refund"
            multiline
            rows={3}
            fullWidth
            size="small"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />

          <Button variant="contained" color="primary" onClick={handleCreateRefund}>
            Submit Request
          </Button>
        </Box>
      </AppModal>

      {/* Modal: Modify Commission Rate */}
      <AppModal
        open={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        title="Modify Consultant Commission Rate"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="rate-type-select-label">Commission Structure</InputLabel>
            <Select
              labelId="rate-type-select-label"
              value={commissionType}
              onChange={(e) => setCommissionType(e.target.value)}
              label="Commission Structure"
            >
              <MenuItem value="5%">5% Standard Tier</MenuItem>
              <MenuItem value="10%">10% Professional Tier</MenuItem>
              <MenuItem value="custom">Custom Percentage (%)</MenuItem>
              <MenuItem value="fixed">Fixed Flat Payout (€)</MenuItem>
            </Select>
          </FormControl>

          {(commissionType === 'custom' || commissionType === 'fixed') && (
            <TextField
              label={commissionType === 'custom' ? "Custom Percentage (%)" : "Fixed Amount (€)"}
              type="number"
              fullWidth
              size="small"
              value={commissionValue}
              onChange={(e) => setCommissionValue(e.target.value)}
            />
          )}

          <Button variant="contained" color="primary" onClick={handleUpdateCommissionRate}>
            Save Structure
          </Button>
        </Box>
      </AppModal>
    </Box>
  );
};

export default SuperAdminRefundCommissionHub;
