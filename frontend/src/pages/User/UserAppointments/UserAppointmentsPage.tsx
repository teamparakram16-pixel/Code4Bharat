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
import useUserAppointments from "@/hooks/useUserAppointments/useUserAppointments";
import ConsultationAppointmentCard from "@/components/AppointmentCards/ConsultationAppointmentCard";
import RoutineAppointmentCard from "@/components/AppointmentCards/RoutineAppointmentCard";
import { useAuth } from "@/context/AuthContext";
import { useAppointmentsHooks } from "@/hooks/useAppointmentHooks/useAppointmentHook";

const UserAppointmentsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { role } = useAuth();

  const {
    loading,
    consultations,
    routineAppointments,
    setConsultations,
    setRoutineAppointments,
  } = useUserAppointments();

  console.log("Consultations:", consultations);
  console.log("Routine Appointments:", routineAppointments);

  const { getUserAppointments, getExpertAppointments } = useAppointmentsHooks();

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (role === "user") {
        const { appointments, routineAppointments } =
          await getUserAppointments();
        setConsultations(appointments || []);
        setRoutineAppointments(routineAppointments || []);
      } else {
        const { appointments, routineAppointments } =
          await getExpertAppointments();
        setConsultations(appointments || []);
        setRoutineAppointments(routineAppointments || []);
      }
    };
    fetchAppointments();
  }, [role]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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

        {/* Tabs for Consultations and Routines */}
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
                        onJoinMeeting={() => {}}
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
