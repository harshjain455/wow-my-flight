import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Icons
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// Services & Components
import { dbService } from '../../services/dbService';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import AppTable from '../../components/AppTable';
import AppModal from '../../components/AppModal';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';

const customerFormSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  country: yup.string().default('United States'),
  city: yup.string().default('New York'),
  timezone: yup.string().default('UTC-05:00 Eastern Time'),
  preferredLanguage: yup.string().default('English'),
  passportNumber: yup.string().default(''),
  passportExpiry: yup.string().default(''),
  preferredCabinClass: yup.string().default('Business Class'),
  seatPreference: yup.string().default('Aisle'),
  mealPreference: yup.string().default('Vegetarian')
});

export const SuperAdminClientList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { isAdmin, isSuperAdmin, isOperations, currentUser } = useAuth();

  const getRolePrefix = () => {
    if (!currentUser) return 'super_admin';
    if (currentUser.role === 'consultant') return 'agent';
    return currentUser.role;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch Clients
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: dbService.getClients
  });

  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: dbService.getAgents
  });

  const createCustomerMutation = useMutation({
    mutationFn: dbService.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showAlert('Passenger Customer profile created successfully!', 'success');
      setAddModalOpen(false);
      reset();
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(customerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '+1 ',
      country: 'United States',
      city: 'New York',
      timezone: 'UTC-05:00 Eastern Time',
      preferredLanguage: 'English',
      passportNumber: '',
      passportExpiry: '2031-10-15',
      preferredCabinClass: 'Business Class',
      seatPreference: 'Aisle',
      mealPreference: 'Vegetarian'
    }
  });

  const handleCreateCustomer = (data) => {
    createCustomerMutation.mutate({
      ...data,
      totalSpent: '$0',
      totalBookings: 0,
      onboardingDate: new Date().toISOString()
    });
  };

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
      const matchSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.city?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = classFilter ? (c.preferredCabinClass || 'Business Class') === classFilter : true;
      return matchSearch && matchClass;
    }).sort((a, b) => {
      let valA = a[sortColumn] || `${a.firstName} ${a.lastName}`;
      let valB = b[sortColumn] || `${b.firstName} ${b.lastName}`;
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [clients, searchTerm, classFilter, sortColumn, sortDirection]);

  const paginatedClients = filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const columns = [
    {
      id: 'name',
      label: 'Customer Name',
      sortable: true,
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 13, fontWeight: 800 }}>
            {row.firstName?.[0]}{row.lastName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.firstName} {row.lastName}</Typography>
            <Typography variant="caption" color="text.secondary">#{row.id}</Typography>
          </Box>
        </Box>
      )
    },
    {
      id: 'phone',
      label: 'Phone Number',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {row.phone}
          </Typography>
          <Tooltip title="Copy Phone">
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); navigator.clipboard?.writeText(row.phone); showAlert('Phone copied!', 'info'); }}>
              <ContentCopyIcon sx={{ fontSize: 12 }} />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    {
      id: 'email',
      label: 'Email',
      render: (row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption">{row.email}</Typography>
          <VerifiedUserIcon sx={{ fontSize: 13, color: 'success.main' }} />
        </Box>
      )
    },
    {
      id: 'location',
      label: 'City / Country',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          {row.city || 'New York'}, {row.country || 'USA'}
        </Typography>
      )
    },
    {
      id: 'cabinClass',
      label: 'Preferred Cabin',
      render: (row) => (
        <Chip
          size="small"
          label={row.preferredCabinClass || 'Business Class'}
          color={row.preferredCabinClass === 'First Class' ? 'warning' : 'primary'}
          variant="outlined"
          sx={{ fontSize: '0.68rem', fontWeight: 700 }}
        />
      )
    },
    {
      id: 'tier',
      label: 'Loyalty / VIP',
      render: () => (
        <Chip
          size="small"
          icon={<StarIcon sx={{ fontSize: '13px !important', color: '#EAB308' }} />}
          label="VIP Frequent"
          sx={{ fontSize: '0.65rem', fontWeight: 700, bgcolor: '#FEF9C3', color: '#854D0E' }}
        />
      )
    },
    {
      id: 'totalSpent',
      label: 'Lifetime Value',
      render: (row) => (
        <Typography variant="caption" sx={{ fontWeight: 900, color: 'success.main' }}>
          {row.totalSpent || '$15,525'}
        </Typography>
      )
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <Button
        startIcon={<KeyboardArrowLeftIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 1.5, color: 'text.secondary', display: 'inline-flex' }}
      >
        Back to Dashboard
      </Button>

      <PageHeader
        title="Customer Directory"
        subtitle="Manage customer profiles, passport details, frequent flyer programs & travel history."
        action={
          ((isAdmin || isSuperAdmin) || isOperations) && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              sx={{ fontWeight: 700 }}
            >
              Add New Customer
            </Button>
          )
        }
      />

      {/* Search & Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box sx={{ width: { xs: '100%', md: '340px' } }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search customer name, email, phone, city..."
          />
        </Box>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Preferred Cabin Class</InputLabel>
          <Select
            value={classFilter}
            label="Preferred Cabin Class"
            onChange={e => setClassFilter(e.target.value)}
          >
            <MenuItem value="">All Classes</MenuItem>
            <MenuItem value="Economy">Economy</MenuItem>
            <MenuItem value="Premium Economy">Premium Economy</MenuItem>
            <MenuItem value="Business Class">Business Class</MenuItem>
            <MenuItem value="First Class">First Class</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Customers Table */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2.5, overflow: 'hidden' }}>
        <AppTable
          columns={columns}
          data={paginatedClients}
          count={filteredClients.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={(col) => {
            const isAsc = sortColumn === col && sortDirection === 'asc';
            setSortDirection(isAsc ? 'desc' : 'asc');
            setSortColumn(col);
          }}
          loading={isLoading}
          onRowClick={(row) => navigate(`/${getRolePrefix()}/customers/details/${row.id}`)}
          actions={(row) => (
            <Box sx={{ display: 'flex', gap: 0.5, whiteSpace: 'nowrap' }} onClick={e => e.stopPropagation()}>
              <Tooltip title="Direct Phone Call">
                <IconButton size="small" color="success" onClick={() => showAlert(`Calling ${row.firstName} ${row.lastName} via Telnyx WebRTC…`, 'success')}>
                  <PhoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="WhatsApp Chat">
                <IconButton size="small" color="success" onClick={() => navigate('/social-inbox?channel=whatsapp')}>
                  <WhatsAppIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Full Customer Profile">
                <IconButton size="small" color="primary" onClick={() => navigate(`/${getRolePrefix()}/customers/details/${row.id}`)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        />
      </Paper>

      {/* ─── ADD NEW CUSTOMER MODAL ─── */}
      <AppModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Passenger Customer"
        maxWidth="md"
        actions={
          <>
            <Button onClick={() => setAddModalOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(handleCreateCustomer)}
              variant="contained"
              color="primary"
              disabled={createCustomerMutation.isPending}
            >
              Save Customer Profile
            </Button>
          </>
        }
      >
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Personal Info */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'primary.main' }}>
              👤 PERSONAL INFORMATION
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <TextField {...register('firstName')} label="First Name *" size="small" error={!!errors.firstName} helperText={errors.firstName?.message} />
              <TextField {...register('lastName')} label="Last Name *" size="small" error={!!errors.lastName} helperText={errors.lastName?.message} />
              <TextField {...register('email')} label="Email Address *" size="small" error={!!errors.email} helperText={errors.email?.message} />
              <TextField {...register('phone')} label="Phone Number (with Country Code) *" size="small" error={!!errors.phone} helperText={errors.phone?.message} />
              <TextField {...register('country')} label="Country" size="small" />
              <TextField {...register('city')} label="City" size="small" />
              <TextField {...register('timezone')} label="Time Zone" size="small" />
              <TextField {...register('preferredLanguage')} label="Language Preference" size="small" />
            </Box>
          </Paper>

          {/* Passport & Travel Docs */}
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#F0F9FF', borderRadius: 2, border: '1px solid #BAE6FD' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'info.main' }}>
              🛂 PASSPORT & TRAVEL PREFERENCES
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <TextField {...register('passportNumber')} label="Passport Number" size="small" placeholder="e.g. US98234109" />
              <TextField {...register('passportExpiry')} label="Passport Expiry Date" type="date" size="small" InputLabelProps={{ shrink: true }} />
              
              <FormControl size="small" fullWidth>
                <InputLabel>Preferred Cabin Class</InputLabel>
                <Select {...register('preferredCabinClass')} defaultValue="Business Class" label="Preferred Cabin Class">
                  {['Economy', 'Premium Economy', 'Business Class', 'First Class'].map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth>
                <InputLabel>Seat Preference</InputLabel>
                <Select {...register('seatPreference')} defaultValue="Aisle" label="Seat Preference">
                  {['Window', 'Aisle', 'Any / No Preference'].map(s => (
                    <MenuItem key={s} value={s}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" fullWidth sx={{ gridColumn: { sm: 'span 2' } }}>
                <InputLabel>Meal Preference</InputLabel>
                <Select {...register('mealPreference')} defaultValue="Vegetarian" label="Meal Preference">
                  {['Standard', 'Vegetarian (Asian)', 'Vegetarian (Western)', 'Halal', 'Kosher', 'Gluten Free', 'Low Sodium'].map(m => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Box>
      </AppModal>
    </Box>
  );
};

export default SuperAdminClientList;
