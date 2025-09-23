import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useRoutineConsultation from '@/hooks/useRoutineConsultation/useRoutineConsultation';
import type { 
  PrakritiData,
  RoutineItem,
} from '@/types/RoutineConsultation.types';

interface RoutinesConsultation {
  id: string;
  date: string;
  time: string;
  patient: {
    name: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
  };
  prakritiData: PrakritiData;
  healthMetrics: {
    bmi: number;
    bloodPressure: string;
    heartRate: number;
    sleepQuality: number;
    stressLevel: number;
    energyLevel: number;
  };
  goals: string[];
  concerns: string[];
  notes: string;
  sharedRoutine?: RoutineItem[];
  doctorNotes?: string;
  status: 'pending' | 'routine_shared' | 'completed';
  updatedAt?: string;
}
import { useParams, useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack,
  CalendarToday,
  AccessTime,
  Phone,
  Share,
  Assignment,
  ExpandMore,
  FitnessCenter,
  Restaurant,
  Psychology,
  SelfImprovement,
  Spa,
  LocalHospital,
  Person,
  Warning,
  Info,
  Add,
  Delete,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const HiddenInput = styled('input')({
  display: 'none'
});

const RoutinesConsultationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<RoutinesConsultation | null>(null);
  const [responseText, setResponseText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [shareRoutineDialogOpen, setShareRoutineDialogOpen] = useState(false);
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>([]);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [newRoutineItem, setNewRoutineItem] = useState<Partial<RoutineItem>>({
    category: 'exercise',
    title: '',
    description: '',
    duration: '',
    frequency: '',
    instructions: '',
  });

  const { getRoutineAppointmentById } = useRoutineConsultation();

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const apiData = await getRoutineAppointmentById(id);
        
        // Transform API data to match our component's needs
        const transformedData: RoutinesConsultation = {
          id: apiData.id,
          date: apiData.appointmentData.date || apiData.createdAt,
          time: apiData.appointmentData.time || new Date(apiData.createdAt).toLocaleTimeString(),
          patient: {
            name: apiData.user.profile.fullName,
            age: apiData.user.profile.age,
            gender: apiData.user.profile.gender,
            phone: apiData.user.profile.contactNo,
            email: apiData.user.email
          },
          prakritiData: apiData.prakritiData,
          healthMetrics: {
            bmi: apiData.appointmentData.bmi || 0,
            bloodPressure: apiData.appointmentData.bloodPressure || 'N/A',
            heartRate: apiData.appointmentData.heartRate || 0,
            sleepQuality: apiData.appointmentData.sleepQuality || 0,
            stressLevel: apiData.appointmentData.stressLevel || 0,
            energyLevel: apiData.appointmentData.energyLevel || 0
          },
          goals: apiData.appointmentData.goals || [],
          concerns: apiData.appointmentData.concerns || [],
          notes: apiData.appointmentData.notes || '',
          status: apiData.status,
          sharedRoutine: apiData.routineResponse?.sharedRoutine,
          doctorNotes: apiData.routineResponse?.doctorNotes
        };

        setConsultation(transformedData);
        
        // Set routine items and notes if available
        if (apiData.routineResponse?.sharedRoutine) {
          setRoutineItems(apiData.routineResponse.sharedRoutine);
        }
        if (apiData.routineResponse?.doctorNotes) {
          setDoctorNotes(apiData.routineResponse.doctorNotes);
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch consultation details");
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [id, getRoutineAppointmentById]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        setSelectedFile(file);
        setError(null);
      } catch (err: any) {
        toast.error(err.message || 'Error processing PDF file');
        setError('Error processing PDF file');
        setSelectedFile(null);
      }
    } else {
      toast.error('Please select a valid PDF file');
      setError('Please select a valid PDF file');
      setSelectedFile(null);
    }
  };

  const { respondToRoutineAppointment } = useRoutineConsultation();

  const handleResponseSubmit = async () => {
    if (!consultation) {
      toast.error('Consultation details not found');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('text', responseText);
      formData.append('routineItems', JSON.stringify(routineItems));
      formData.append('doctorNotes', doctorNotes);

      const result = await respondToRoutineAppointment(consultation.id, formData);
      
      if (result) {
        setConsultation({
          ...consultation,
          status: 'completed',
          updatedAt: new Date().toISOString(),
        });
        
        toast.success('Response submitted successfully');
        setShowDialog(false);
        setResponseText('');
        setSelectedFile(null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit response');
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addRoutineItem = () => {
    if (newRoutineItem.title && newRoutineItem.description) {
      const item: RoutineItem = {
        id: Date.now().toString(),
        category: newRoutineItem.category as any,
        title: newRoutineItem.title,
        description: newRoutineItem.description,
        duration: newRoutineItem.duration || '',
        frequency: newRoutineItem.frequency || '',
        instructions: newRoutineItem.instructions || '',
      };
      setRoutineItems([...routineItems, item]);
      setNewRoutineItem({
        category: 'exercise',
        title: '',
        description: '',
        duration: '',
        frequency: '',
        instructions: '',
      });
    }
  };

  const removeRoutineItem = (itemId: string) => {
    setRoutineItems(routineItems.filter(item => item.id !== itemId));
  };

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata': return '#9C27B0';
      case 'pitta': return '#FF9800';
      case 'kapha': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'exercise': return <FitnessCenter />;
      case 'diet': return <Restaurant />;
      case 'lifestyle': return <SelfImprovement />;
      case 'meditation': return <Spa />;
      default: return <Assignment />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'exercise': return 'primary';
      case 'diet': return 'success';
      case 'lifestyle': return 'warning';
      case 'meditation': return 'secondary';
      default: return 'default';
    }
  };

  const getHealthMetricColor = (value: number, isHighGood: boolean = true) => {
    if (isHighGood) {
      return value >= 7 ? 'success' : value >= 4 ? 'warning' : 'error';
    } else {
      return value <= 3 ? 'success' : value <= 6 ? 'warning' : 'error';
    }
  };

  const [loading, setLoading] = useState(true);

  if (loading || consultation === null) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h6">Loading consultation details...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
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
              Routines Consultation Details
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ayurvedic consultation and personalized routine creation
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Patient Information Card */}
          <Box sx={{ flex: { lg: '0 0 30%' } }}>
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
                        bgcolor: 'secondary.main',
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
                        label="Routines Consultation"
                        color="secondary"
                        size="small"
                        icon={<Assignment />}
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
                    </Stack>
                  </Box>

                  {/* Prakriti Analysis */}
                  <Divider sx={{ mb: 3 }} />
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Psychology fontSize="small" />
                      Prakriti Analysis
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Dominant Dosha: <Typography 
                          component="span" 
                          fontWeight="bold" 
                          sx={{ color: getDoshaColor(consultation.prakritiData.dominantDosha) }}
                        >
                          {consultation.prakritiData.dominantDosha.charAt(0).toUpperCase() + consultation.prakritiData.dominantDosha.slice(1)}
                        </Typography>
                      </Typography>
                    </Box>

                    <Stack spacing={2}>
                      {/* Vata */}
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Vata</Typography>
                          <Typography variant="body2" fontWeight="bold">{consultation.prakritiData.vata}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={consultation.prakritiData.vata} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getDoshaColor('vata'),
                            },
                          }}
                        />
                      </Box>

                      {/* Pitta */}
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Pitta</Typography>
                          <Typography variant="body2" fontWeight="bold">{consultation.prakritiData.pitta}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={consultation.prakritiData.pitta} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getDoshaColor('pitta'),
                            },
                          }}
                        />
                      </Box>

                      {/* Kapha */}
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2">Kapha</Typography>
                          <Typography variant="body2" fontWeight="bold">{consultation.prakritiData.kapha}%</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={consultation.prakritiData.kapha} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getDoshaColor('kapha'),
                            },
                          }}
                        />
                      </Box>
                    </Stack>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Assessment Date: {dayjs(consultation.prakritiData.assessmentDate).format('MMM DD, YYYY')}
                    </Typography>
                  </Box>
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
              {/* Health Metrics */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalHospital fontSize="small" />
                    Health Metrics & Assessment
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 3 }}>
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

                  <Divider sx={{ mb: 3 }} />

                  {/* Physical Metrics */}
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 2, mb: 3 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        {consultation.healthMetrics.bmi}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">BMI</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        {consultation.healthMetrics.bloodPressure}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Blood Pressure</Typography>
                    </Paper>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" color="info.main" fontWeight="bold">
                        {consultation.healthMetrics.heartRate}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Heart Rate</Typography>
                    </Paper>
                  </Box>

                  {/* Wellness Metrics */}
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Wellness Assessment (1-10 Scale)
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Sleep Quality</Typography>
                        <Chip 
                          label={consultation.healthMetrics.sleepQuality} 
                          size="small" 
                          color={getHealthMetricColor(consultation.healthMetrics.sleepQuality) as any}
                        />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={consultation.healthMetrics.sleepQuality * 10} 
                        color={getHealthMetricColor(consultation.healthMetrics.sleepQuality) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Stress Level</Typography>
                        <Chip 
                          label={consultation.healthMetrics.stressLevel} 
                          size="small" 
                          color={getHealthMetricColor(consultation.healthMetrics.stressLevel, false) as any}
                        />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={consultation.healthMetrics.stressLevel * 10} 
                        color={getHealthMetricColor(consultation.healthMetrics.stressLevel, false) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Energy Level</Typography>
                        <Chip 
                          label={consultation.healthMetrics.energyLevel} 
                          size="small" 
                          color={getHealthMetricColor(consultation.healthMetrics.energyLevel) as any}
                        />
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={consultation.healthMetrics.energyLevel * 10} 
                        color={getHealthMetricColor(consultation.healthMetrics.energyLevel) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Goals and Concerns */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Patient Goals & Concerns
                  </Typography>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SelfImprovement fontSize="small" />
                        Health Goals ({consultation.goals.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {consultation.goals.map((goal, index) => (
                          <Chip 
                            key={index} 
                            label={goal} 
                            color="success" 
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Warning fontSize="small" />
                        Health Concerns ({consultation.concerns.length})
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {consultation.concerns.map((concern, index) => (
                          <Chip 
                            key={index} 
                            label={concern} 
                            color="warning" 
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Info fontSize="small" />
                        Patient Notes
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="body2">
                          {consultation.notes}
                        </Typography>
                      </Paper>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>

              {/* Shared Routine */}
              {consultation.sharedRoutine && consultation.sharedRoutine.length > 0 && (
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Share fontSize="small" />
                      Shared Routine
                    </Typography>
                    
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Personalized routine has been shared with the patient on {dayjs(consultation.updatedAt).format('MMMM DD, YYYY [at] h:mm A')}
                    </Alert>

                    <Stack spacing={2}>
                      {consultation.sharedRoutine.map((item) => (
                        <Card key={item.id} variant="outlined">
                          <CardContent sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Chip 
                                icon={getCategoryIcon(item.category)}
                                label={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                color={getCategoryColor(item.category) as any}
                                size="small"
                              />
                              <Typography variant="h6" fontWeight="bold">
                                {item.title}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {item.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                              <Typography variant="body2">
                                <strong>Duration:</strong> {item.duration}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Frequency:</strong> {item.frequency}
                              </Typography>
                            </Box>
                            
                            {item.instructions && (
                              <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="body2">
                                  <strong>Instructions:</strong> {item.instructions}
                                </Typography>
                              </Paper>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>

                    {consultation.doctorNotes && (
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Doctor's Notes
                        </Typography>
                        <Paper sx={{ p: 2, bgcolor: 'info.50' }}>
                          <Typography variant="body2">
                            {consultation.doctorNotes}
                          </Typography>
                        </Paper>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Action Button */}
              {consultation.status === 'pending' && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, pt: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Share />}
                    onClick={() => setShowDialog(true)}
                    sx={{ px: 4 }}
                  >
                    Send Response
                  </Button>
                </Box>
              )}
            </motion.div>
          </Box>
        </Box>

        {/* Share Routine Dialog */}
        <Dialog 
          open={shareRoutineDialogOpen} 
          onClose={() => setShareRoutineDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Share color="secondary" />
            Create & Share Personalized Routine
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a personalized Ayurvedic routine based on the patient's Prakriti analysis and health goals.
            </Typography>

            {/* Add New Routine Item */}
            <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>Add Routine Item</Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    select
                    label="Category"
                    value={newRoutineItem.category}
                    onChange={(e) => setNewRoutineItem({...newRoutineItem, category: e.target.value as any})}
                    sx={{ minWidth: 150 }}
                    SelectProps={{
                      'aria-label': 'Select routine category'
                    }}
                  >
                    <MenuItem value="exercise">Exercise</MenuItem>
                    <MenuItem value="diet">Diet</MenuItem>
                    <MenuItem value="lifestyle">Lifestyle</MenuItem>
                    <MenuItem value="meditation">Meditation</MenuItem>
                  </TextField>
                  
                  <TextField
                    label="Title"
                    value={newRoutineItem.title}
                    onChange={(e) => setNewRoutineItem({...newRoutineItem, title: e.target.value})}
                    fullWidth
                  />
                </Box>
                
                <TextField
                  label="Description"
                  multiline
                  rows={2}
                  value={newRoutineItem.description}
                  onChange={(e) => setNewRoutineItem({...newRoutineItem, description: e.target.value})}
                  fullWidth
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Duration"
                    value={newRoutineItem.duration}
                    onChange={(e) => setNewRoutineItem({...newRoutineItem, duration: e.target.value})}
                    placeholder="e.g., 30 minutes"
                    fullWidth
                  />
                  <TextField
                    label="Frequency"
                    value={newRoutineItem.frequency}
                    onChange={(e) => setNewRoutineItem({...newRoutineItem, frequency: e.target.value})}
                    placeholder="e.g., Daily, 3x per week"
                    fullWidth
                  />
                </Box>
                
                <TextField
                  label="Instructions"
                  multiline
                  rows={2}
                  value={newRoutineItem.instructions}
                  onChange={(e) => setNewRoutineItem({...newRoutineItem, instructions: e.target.value})}
                  placeholder="Detailed instructions for the patient"
                  fullWidth
                />
                
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addRoutineItem}
                  disabled={!newRoutineItem.title || !newRoutineItem.description}
                >
                  Add Item
                </Button>
              </Stack>
            </Card>

            {/* Current Routine Items */}
            {routineItems.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Routine Items ({routineItems.length})
                </Typography>
                <Stack spacing={2}>
                  {routineItems.map((item) => (
                    <Card key={item.id} variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip 
                              icon={getCategoryIcon(item.category)}
                              label={item.category}
                              color={getCategoryColor(item.category) as any}
                              size="small"
                            />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.title}
                            </Typography>
                          </Box>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => removeRoutineItem(item.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {item.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {item.duration}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Frequency:</strong> {item.frequency}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Doctor's Notes */}
            <TextField
              label="Doctor's Notes"
              multiline
              rows={3}
              fullWidth
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Add any additional notes or recommendations for the patient..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareRoutineDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (consultation) {
                  setConsultation({
                    ...consultation,
                    status: 'routine_shared',
                    sharedRoutine: routineItems,
                    doctorNotes,
                    updatedAt: new Date().toISOString(),
                  });
                  setShareRoutineDialogOpen(false);
                }
              }} 
              variant="contained" 
              color="secondary"
              startIcon={<Share />}
              disabled={routineItems.length === 0}
            >
              Share Routine
            </Button>
          </DialogActions>
        </Dialog>

        {/* Response Dialog */}
        <Dialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Send Response</DialogTitle>
          <DialogContent>
            <Box sx={{ my: 2 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box>
                <HiddenInput
                  accept="application/pdf"
                  id="upload-pdf"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-pdf">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Add />}
                  >
                    Upload PDF
                  </Button>
                </label>
                {selectedFile && (
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">{selectedFile.name}</Typography>
                    <IconButton size="small" onClick={() => setSelectedFile(null)}>
                      <Delete />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button
              onClick={handleResponseSubmit}
              variant="contained"
              disabled={isSubmitting || (!responseText && !selectedFile)}
            >
              {isSubmitting ? 'Sending...' : 'Send Response'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default RoutinesConsultationDetails;