import React, { useState, useEffect } from "react";
import { useNavigate,  useParams } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Psychology,
  Assignment,
  CheckCircle,
  Warning,
  NavigateNext,
  Schedule,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import AppointmentDataForm from "../../components/Forms/User/AppointmentDataForm/AppointmentDataForm.tsx";
import useRoutineConsultation from "../../hooks/useRoutineConsultation/useRoutineConsultation";
import usePrakrithi from "@/hooks/usePrakrithi/usePrakrithi.ts";

const RoutinesAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { id: doctorId } = useParams();

  const [prakritiStatus, setPrakritiStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPrakritiDialog, setShowPrakritiDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [, setAppointmentData] = useState(null);

  const { createRoutineAppointment } = useRoutineConsultation();
  const { fetchUserPrakriti } = usePrakrithi();

  useEffect(() => {
    checkPrakritiStatus();
  }, []);

  const checkPrakritiStatus = async () => {
    setLoading(true);
    try {
      // Use the new API function
      const status = await fetchUserPrakriti();
      setPrakritiStatus(status);

      if (status === null) {
        setShowPrakritiDialog(true);
      } else {
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error checking Prakriti status:", error);
      toast.error("Failed to check Prakriti analysis status");
    } finally {
      setLoading(false);
    }
  };

  const handlePrakritiNavigation = () => {
    navigate("/prakrithi/analysis", {
      state: { fromRoutinesAppointment: true },
    });
  };

  const handleAppointmentSubmit = async (data: any) => {
    try {
      if (!doctorId) {
        toast.error(
          "Doctor ID is missing. Cannot proceed with the appointment."
        );
        return;
      }
      setLoading(true);
      // Use the hook to submit appointment data
      const response = await createRoutineAppointment(data, doctorId);
      if (response) {
        toast.success("Appointment data submitted successfully!");
        setAppointmentData(data);
        setCurrentStep(2);
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("Failed to submit appointment data");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: "Prakriti Analysis Check",
      description: "Verify completion of Prakriti analysis",
    },
    {
      label: "Appointment Information",
      description: "Provide detailed health and lifestyle information",
    },
    {
      label: "Confirmation",
      description: "Review and confirm your submission",
    },
  ];

  if (loading && !prakritiStatus) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking Prakriti Analysis Status...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: 4,
            borderRadius: 3,
            mb: 3,
          }}
        >
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Schedule sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Routines Appointment
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Personalized consultation based on your Prakriti analysis
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Progress Stepper */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stepper
              activeStep={currentStep}
              orientation="horizontal"
              alternativeLabel
            >
              {steps.map((step, index) => (
                <Step key={step.label} completed={currentStep > index}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {/* Step 0: Prakriti Analysis Check */}
          {currentStep === 0 && (
            <motion.div
              key="prakriti-check"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Box textAlign="center">
                    <Psychology
                      sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
                    />
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      Prakriti Analysis Required
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Routines appointments are based on your unique Prakriti
                      (body constitution) analysis. This personalized approach
                      helps our experts provide the most effective
                      recommendations.
                    </Typography>

                    {prakritiStatus ? (
                      <Box>
                        <Alert severity="success" sx={{ mb: 3 }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CheckCircle />
                            <Typography>
                              Great! Your Prakriti analysis is completed. You
                              can proceed with the appointment.
                            </Typography>
                          </Box>
                        </Alert>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={() => setCurrentStep(1)}
                          startIcon={<NavigateNext />}
                          sx={{ px: 4, py: 1.5 }}
                        >
                          Continue to Appointment Form
                        </Button>
                      </Box>
                    ) : (
                      <Alert severity="warning" sx={{ mb: 3 }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Warning />
                          <Typography>
                            You haven't completed your Prakriti analysis yet.
                            This is required for routines appointments.
                          </Typography>
                        </Box>
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 1: Appointment Form */}
          {currentStep === 1 && prakritiStatus && (
            <motion.div
              key="appointment-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Assignment color="primary" sx={{ fontSize: 32 }} />
                    <Typography variant="h5" fontWeight="bold">
                      Appointment Information
                    </Typography>
                  </Box>

                  <Alert severity="info" sx={{ mb: 3 }}>
                    Please provide detailed information to help our experts
                    prepare a personalized routine for you.
                  </Alert>

                  <AppointmentDataForm
                    onSubmit={handleAppointmentSubmit}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Success */}
          {currentStep === 2 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent sx={{ p: 4, textAlign: "center" }}>
                  <CheckCircle
                    sx={{ fontSize: 80, color: "success.main", mb: 2 }}
                  />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Appointment Submitted Successfully!
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Thank you for providing your detailed information. Our
                    experts will review your Prakriti analysis and the
                    information you've provided to create a personalized routine
                    plan for you.
                  </Typography>

                  <Box display="flex" gap={2} justifyContent="center" mt={3}>
                    <Button
                      variant="contained"
                      onClick={() => navigate("/u/appointments")}
                    >
                      View My Appointments
                    </Button>
                    <Button variant="outlined" onClick={() => navigate("/")}>
                      Back to Home
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prakriti Analysis Required Dialog */}
        <Dialog
          open={showPrakritiDialog}
          onClose={() => setShowPrakritiDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={2}>
              <Psychology color="primary" />
              <Typography variant="h6">Prakriti Analysis Required</Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography paragraph>
              To book a routines appointment, you must first complete your
              Prakriti analysis. This analysis helps us understand your unique
              body constitution and provide personalized recommendations.
            </Typography>
            <Alert severity="info">
              The Prakriti analysis takes about 10-15 minutes to complete and
              includes questions about your physical characteristics,
              preferences, and lifestyle.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowPrakritiDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handlePrakritiNavigation}
              startIcon={<Psychology />}
            >
              Start Prakriti Analysis
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default RoutinesAppointment;
