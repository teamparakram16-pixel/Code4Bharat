import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Tab,
  Tabs,
  Avatar,
  Stack,
  Divider,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Badge,
  Container,
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Search,

  LocalHospital,
  Assignment,
  Schedule,
  Phone,
  Email,
  Visibility,
  Check,
  Close,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  avatar?: string;
}

interface Appointment {
  id: string;
  type: 'consultation' | 'routines';
  patient: Patient;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  notes?: string;
  urgency?: 'low' | 'medium' | 'high';
}

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    type: 'consultation',
    patient: {
      id: 'p1',
      name: 'Raj Patel',
      age: 35,
      gender: 'Male',
      phone: '+91 98765 43210',
      email: 'raj.patel@email.com',
    },
    date: '2024-03-20',
    time: '10:00 AM',
    status: 'pending',
    urgency: 'high',
    notes: 'Chest pain and breathing difficulty',
  },
  {
    id: '2',
    type: 'routines',
    patient: {
      id: 'p2',
      name: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      phone: '+91 87654 32109',
      email: 'priya.sharma@email.com',
    },
    date: '2024-03-20',
    time: '11:30 AM',
    status: 'pending',
    urgency: 'medium',
    notes: 'Routine health consultation and personalized routine planning',
  },
  {
    id: '3',
    type: 'consultation',
    patient: {
      id: 'p3',
      name: 'Amit Kumar',
      age: 42,
      gender: 'Male',
      phone: '+91 76543 21098',
      email: 'amit.kumar@email.com',
    },
    date: '2024-03-21',
    time: '9:30 AM',
    status: 'accepted',
    urgency: 'low',
    notes: 'Follow-up consultation',
  },
];

const DoctorAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Filter appointments based on tab, search, and filters
  const filteredAppointments = mockAppointments.filter((appointment) => {
    const matchesTab = 
      tabValue === 0 ? true :
      tabValue === 1 ? appointment.type === 'consultation' :
      appointment.type === 'routines';
    
    const matchesSearch = appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.patient.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    
    return matchesTab && matchesSearch && matchesStatus && matchesType;
  });

  // Calculate appointment counts
  const counts = {
    total: mockAppointments.length,
    consultation: mockAppointments.filter(a => a.type === 'consultation').length,
    routines: mockAppointments.filter(a => a.type === 'routines').length,
    pending: mockAppointments.filter(a => a.status === 'pending').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#2e7d32';
      default: return '#757575';
    }
  };

  const handleViewAppointment = (appointment: Appointment) => {
    if (appointment.type === 'consultation') {
      navigate(`/appointments/consultation/${appointment.id}`);
    } else {
      navigate(`/appointments/routines/${appointment.id}`);
    }
  };

  const handleQuickAction = (appointmentId: string, action: 'accept' | 'reject') => {
    // Handle quick actions here
    console.log(`${action} appointment ${appointmentId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Doctor Appointments
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your consultations and routine appointments
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {[
            { label: 'Total Appointments', count: counts.total, icon: CalendarToday, color: '#1976d2' },
            { label: 'Consultations', count: counts.consultation, icon: LocalHospital, color: '#2e7d32' },
            { label: 'Routine Consultations', count: counts.routines, icon: Assignment, color: '#7b1fa2' },
            { label: 'Pending', count: counts.pending, icon: Schedule, color: '#f57c00' },
          ].map((stat, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 45%', sm: '1 1 22%' } }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                    <stat.icon sx={{ color: stat.color, fontSize: 20 }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: stat.color }}>
                      {stat.count}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Paper>
              </motion.div>
            </Box>
          ))}
        </Box>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              fullWidth
              placeholder="Search by patient name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: { md: 400 } }}
            />
            
            <Stack direction="row" spacing={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="accepted">Accepted</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="consultation">Consultation</MenuItem>
                  <MenuItem value="routines">Routines</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label={
                <Badge badgeContent={counts.total} color="primary">
                  <Box sx={{ px: 1 }}>All Appointments</Box>
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={counts.consultation} color="success">
                  <Box sx={{ px: 1 }}>Consultations</Box>
                </Badge>
              } 
            />
            <Tab 
              label={
                <Badge badgeContent={counts.routines} color="secondary">
                  <Box sx={{ px: 1 }}>Routines Consultation</Box>
                </Badge>
              } 
            />
          </Tabs>
        </Paper>

        {/* Appointments List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  p: 3,
                  border: `1px solid ${appointment.urgency === 'high' ? '#d32f2f' : 'transparent'}`,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ p: '0 !important' }}>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                    {/* Patient Avatar */}
                    <Avatar 
                      sx={{ 
                        width: 60, 
                        height: 60,
                        bgcolor: appointment.type === 'consultation' ? 'primary.main' : 'secondary.main',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {appointment.patient.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>

                    {/* Appointment Details */}
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {appointment.patient.name}
                          </Typography>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Chip 
                              label={appointment.type === 'consultation' ? 'Consultation' : 'Routines Consultation'}
                              size="small"
                              color={appointment.type === 'consultation' ? 'primary' : 'secondary'}
                              icon={appointment.type === 'consultation' ? <LocalHospital /> : <Assignment />}
                            />
                            <Chip 
                              label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              size="small"
                              color={getStatusColor(appointment.status) as any}
                            />
                            <Box 
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: getUrgencyColor(appointment.urgency || 'low'),
                              }}
                            />
                          </Stack>
                        </Box>

                        {/* Quick Actions */}
                        <Stack direction="row" spacing={1}>
                          {appointment.status === 'pending' && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<Check />}
                                onClick={() => handleQuickAction(appointment.id, 'accept')}
                                sx={{ minWidth: 'auto' }}
                              >
                                Accept
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Close />}
                                onClick={() => handleQuickAction(appointment.id, 'reject')}
                                sx={{ minWidth: 'auto' }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => handleViewAppointment(appointment)}
                          >
                            View Details
                          </Button>
                        </Stack>
                      </Box>

                      {/* Patient Info */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarToday fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(appointment.date).format('MMM DD, YYYY')}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {appointment.time}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Phone fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {appointment.patient.phone}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {appointment.patient.email}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Notes */}
                      {appointment.notes && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Notes:</strong> {appointment.notes}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {filteredAppointments.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <CalendarToday sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No appointments found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No appointments match your current filters. Try adjusting your search criteria.
            </Typography>
          </Paper>
        )}
      </motion.div>
    </Container>
  );
};

export default DoctorAppointments;
