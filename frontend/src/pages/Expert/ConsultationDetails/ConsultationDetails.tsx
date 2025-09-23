import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,

  Container,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  AccessTime,
  Phone,


  Check,
  Close,


  MedicalServices,

  LocalHospital,
  Person,
  Warning,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  allergies: string[];
  medicalHistory: string[];
  avatar?: string;
}

interface Consultation {
  id: string;
  patient: Patient;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  urgency: 'low' | 'medium' | 'high';
  symptoms: string[];
  notes: string;
  diagnosis?: string;
  prescription?: string;
  doctorNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockConsultation: Consultation = {
  id: '1',
  patient: {
    id: 'p1',
    name: 'Raj Patel',
    age: 35,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'raj.patel@email.com',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Shellfish'],
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
  },
  date: '2024-03-20',
  time: '10:00 AM',
  status: 'pending',
  urgency: 'high',
  symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue', 'Dizziness'],
  notes: 'Patient experiencing severe chest pain since morning. Pain radiates to left arm. History of heart disease in family. Currently taking medications for hypertension and diabetes.',
  createdAt: '2024-03-19T15:30:00Z',
  updatedAt: '2024-03-19T15:30:00Z',
};

const ConsultationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  useEffect(() => {
    // Simulate API call to fetch consultation details
    setConsultation(mockConsultation);
  }, [id]);

  const handleAccept = () => {
    if (consultation) {
      setConsultation({
        ...consultation,
        status: 'accepted',
        doctorNotes,
        updatedAt: new Date().toISOString(),
      });
      setAcceptDialogOpen(false);
      // Here you would make an API call to update the consultation
    }
  };

  const handleReject = () => {
    if (consultation) {
      setConsultation({
        ...consultation,
        status: 'rejected',
        doctorNotes,
        updatedAt: new Date().toISOString(),
      });
      setRejectDialogOpen(false);
      // Here you would make an API call to update the consultation
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
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

  if (!consultation) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h6">Loading consultation details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/appointments')} 
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Consultation Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review patient information and manage consultation
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Patient Information Card */}
          <Box sx={{ flex: { md: '0 0 35%' } }}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card sx={{ mb: 3, position: 'sticky', top: 20 }}>
                <CardContent>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        mx: 'auto', 
                        mb: 2,
                        bgcolor: 'primary.main',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {consultation.patient.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {consultation.patient.name}
                    </Typography>
                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                      <Chip 
                        label={consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                        color={getStatusColor(consultation.status) as any}
                        size="small"
                      />
                      <Chip 
                        label={`${consultation.urgency.charAt(0).toUpperCase() + consultation.urgency.slice(1)} Priority`}
                        color={getUrgencyColor(consultation.urgency) as any}
                        size="small"
                      />
                    </Stack>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Basic Information */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      Basic Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Age:</Typography>
                        <Typography variant="body2" fontWeight="medium">{consultation.patient.age} years</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Gender:</Typography>
                        <Typography variant="body2" fontWeight="medium">{consultation.patient.gender}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Blood Group:</Typography>
                        <Typography variant="body2" fontWeight="medium">{consultation.patient.bloodGroup}</Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* Contact Information */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" />
                      Contact Information
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Phone:</Typography>
                        <Typography variant="body2" fontWeight="medium">{consultation.patient.phone}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Email:</Typography>
                        <Typography variant="body2" fontWeight="medium" sx={{ wordBreak: 'break-word' }}>
                          {consultation.patient.email}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>Address:</Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {consultation.patient.address}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Medical Information */}
                  {(consultation.patient.allergies.length > 0 || consultation.patient.medicalHistory.length > 0) && (
                    <>
                      <Divider sx={{ mb: 3 }} />
                      <Box>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MedicalServices fontSize="small" />
                          Medical Information
                        </Typography>
                        
                        {consultation.patient.allergies.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Warning fontSize="small" color="error" />
                              Allergies:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {consultation.patient.allergies.map((allergy, index) => (
                                <Chip 
                                  key={index} 
                                  label={allergy} 
                                  size="small" 
                                  color="error" 
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}

                        {consultation.patient.medicalHistory.length > 0 && (
                          <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Info fontSize="small" color="info" />
                              Medical History:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {consultation.patient.medicalHistory.map((condition, index) => (
                                <Chip 
                                  key={index} 
                                  label={condition} 
                                  size="small" 
                                  color="info" 
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Consultation Details */}
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalHospital fontSize="small" />
                    Consultation Information
                  </Typography>
                  
                  <Stack spacing={3}>
                    {/* Appointment Details */}
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Date:</strong> {dayjs(consultation.date).format('MMMM DD, YYYY')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Time:</strong> {consultation.time}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Symptoms */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Reported Symptoms
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {consultation.symptoms.map((symptom, index) => (
                          <Chip 
                            key={index} 
                            label={symptom} 
                            color="warning" 
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>

                    {/* Patient Notes */}
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        Patient Description
                      </Typography>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2">
                          {consultation.notes}
                        </Typography>
                      </Paper>
                    </Box>

                    {/* Doctor's Section */}
                    {consultation.status !== 'pending' && (
                      <>
                        {consultation.diagnosis && (
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Diagnosis
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: 'success.50' }}>
                              <Typography variant="body2">
                                {consultation.diagnosis}
                              </Typography>
                            </Paper>
                          </Box>
                        )}

                        {consultation.prescription && (
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Prescription
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
                              <Typography variant="body2">
                                {consultation.prescription}
                              </Typography>
                            </Paper>
                          </Box>
                        )}

                        {consultation.doctorNotes && (
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              Doctor's Notes
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                              <Typography variant="body2">
                                {consultation.doctorNotes}
                              </Typography>
                            </Paper>
                          </Box>
                        )}
                      </>
                    )}

                    {/* Action Buttons */}
                    {consultation.status === 'pending' && (
                      <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<Check />}
                          onClick={() => setAcceptDialogOpen(true)}
                          size="large"
                        >
                          Accept Consultation
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<Close />}
                          onClick={() => setRejectDialogOpen(true)}
                          size="large"
                        >
                          Reject Consultation
                        </Button>
                      </Box>
                    )}

                    {consultation.status === 'accepted' && (
                      <Alert severity="success" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Consultation Accepted</strong><br />
                          Last updated: {dayjs(consultation.updatedAt).format('MMMM DD, YYYY [at] h:mm A')}
                        </Typography>
                      </Alert>
                    )}

                    {consultation.status === 'rejected' && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Consultation Rejected</strong><br />
                          Last updated: {dayjs(consultation.updatedAt).format('MMMM DD, YYYY [at] h:mm A')}
                        </Typography>
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>

        {/* Accept Dialog */}
        <Dialog open={acceptDialogOpen} onClose={() => setAcceptDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Check color="success" />
            Accept Consultation
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You are about to accept this consultation appointment. You can add diagnosis, prescription, and notes.
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                label="Diagnosis"
                multiline
                rows={2}
                fullWidth
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter your diagnosis..."
              />
              
              <TextField
                label="Prescription"
                multiline
                rows={3}
                fullWidth
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription details..."
              />
              
              <TextField
                label="Doctor's Notes"
                multiline
                rows={2}
                fullWidth
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder="Add any additional notes..."
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAcceptDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAccept} 
              variant="contained" 
              color="success"
              startIcon={<Check />}
            >
              Accept Consultation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Close color="error" />
            Reject Consultation
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Please provide a reason for rejecting this consultation. This will help the patient understand your decision.
            </Typography>
            
            <TextField
              label="Reason for Rejection"
              multiline
              rows={4}
              fullWidth
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Please explain why you cannot accept this consultation..."
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleReject} 
              variant="contained" 
              color="error"
              startIcon={<Close />}
              disabled={!doctorNotes.trim()}
            >
              Reject Consultation
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default ConsultationDetails;
