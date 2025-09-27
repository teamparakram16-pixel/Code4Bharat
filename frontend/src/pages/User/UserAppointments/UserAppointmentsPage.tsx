import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useUserAppointments from "@/hooks/useUserAppointments/useUserAppointments";
import ConsultationAppointmentCard from "@/components/AppointmentCards/ConsultationAppointmentCard";
import RoutineAppointmentCard from "@/components/AppointmentCards/RoutineAppointmentCard";
import { useAuth } from "@/context/AuthContext";
import { useAppointmentsHooks } from "@/hooks/useAppointmentHooks/useAppointmentHook";

const UserAppointmentsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { role } = useAuth();
  const navigate = useNavigate();

  const {
    loading,
    consultations,
    routineAppointments,
    setConsultations,
    setRoutineAppointments,
  } = useUserAppointments();

  const { getUserAppointments, getExpertAppointments, verifyMeetLink } =
    useAppointmentsHooks();

  const [activeTab, setActiveTab] = useState(0);

  // fetch appointments based on role
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const fetchFn =
          role === "user" ? getUserAppointments : getExpertAppointments;

        const { appointments, routineAppointments } = await fetchFn();

        setConsultations(appointments || []);
        setRoutineAppointments(routineAppointments || []);
      } catch (err) {
        toast.error("Failed to fetch appointments");
      }
    };

    fetchAppointments();
  }, [role]);

  // handle tab change
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // handle join meeting
  const handleJoinMeeting = async (appointment: any) => {
    console.log("Join meeting clicked:", appointment); 

    try {
      const res = await verifyMeetLink(appointment.meetId);
      console.log("verifyMeetLink response:", res);

      if (res.message === "success") {
        navigate(`/livestreaming/${appointment.meetId}`, {
          state: { appointment },
        });
      } else {
        toast.error(res.message || "Unable to join meeting");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Meeting not available");
    }
  };  

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            My Appointments 
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Consultations" />
            <Tab label="Routine Care" />
          </Tabs>
        </Paper>

        {/* Content */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {activeTab === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {consultations.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No consultation appointments found.
                  </Alert>
                ) : (
                  <Box>
                    {consultations.map((appointment: any) => (
                      <ConsultationAppointmentCard
                        key={appointment._id || appointment.id}
                        appointment={appointment}
                        onCancel={() => {}}
                        onReschedule={() => {}}
                        onJoinMeeting={() => handleJoinMeeting(appointment)}
                      />
                    ))}
                  </Box>
                )}
              </motion.div>
            )}

            {activeTab === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {routineAppointments.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No routine appointments found.
                  </Alert>
                ) : (
                  <Box>
                    {routineAppointments.map((appointment: any) => (
                      <RoutineAppointmentCard
                        key={appointment._id || appointment.id}
                        appointment={appointment}
                        onCancel={() => {}}
                        onReschedule={() => {}}
                      />
                    ))}
                  </Box>
                )}
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default UserAppointmentsPage;
