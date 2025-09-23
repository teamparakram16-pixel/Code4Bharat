import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  CalendarToday,
  LocalHospital,
  FitnessCenter,
  FilterList,
  Refresh,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import useUserAppointments from "@/hooks/useUserAppointments/useUserAppointments";
import ConsultationAppointmentCard from "@/components/AppointmentCards/ConsultationAppointmentCard";
import RoutineAppointmentCard from "@/components/AppointmentCards/RoutineAppointmentCard";
import { AppointmentFilters } from "@/types/UserAppointments.types";
import { toast } from "react-toastify";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointment-tabpanel-${index}`}
      aria-labelledby={`appointment-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `appointment-tab-${index}`,
    "aria-controls": `appointment-tabpanel-${index}`,
  };
}

const UserAppointmentsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const {
    loading,
    consultations,
    routineAppointments,
    getUpcomingAppointments,
    getPastAppointments,
    cancelAppointment,
    rescheduleAppointment,
    fetchUserAppointments,
    applyFilters,
    totalAppointments,
  } = useUserAppointments();

  const [activeTab, setActiveTab] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AppointmentFilters>({
    status: "all",
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (key: keyof AppointmentFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = { status: "all" as const };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
    setShowFilters(false);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    const appointment = [...consultations, ...routineAppointments].find(
      (apt) => apt.id === appointmentId
    );
    if (!appointment) return;

    const success = await cancelAppointment(appointmentId, appointment.appointmentType);
    if (success) {
      toast.success("Appointment cancelled successfully");
    }
  };

  const handleRescheduleAppointment = async (
    appointmentId: string,
    newDate: string,
    newTime: string
  ) => {
    const appointment = [...consultations, ...routineAppointments].find(
      (apt) => apt.id === appointmentId
    );
    if (!appointment) return;

    const success = await rescheduleAppointment(
      appointmentId,
      appointment.appointmentType,
      newDate,
      newTime
    );
    if (success) {
      toast.success("Appointment rescheduled successfully");
    }
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, "_blank");
  };

  const getTabData = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: // All Appointments
        return [...consultations, ...routineAppointments].sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateB.getTime() - dateA.getTime();
        });
      case 1: // Upcoming
        return getUpcomingAppointments();
      case 2: // Past
        return getPastAppointments();
      case 3: // Consultations
        return consultations.sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateB.getTime() - dateA.getTime();
        });
      case 4: // Routines
        return routineAppointments.sort((a, b) => {
          const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
          const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);
          return dateB.getTime() - dateA.getTime();
        });
      default:
        return [];
    }
  };

  const renderAppointmentCard = (appointment: any) => {
    if (appointment.appointmentType === "consultation") {
      return (
        <ConsultationAppointmentCard
          key={appointment.id}
          appointment={appointment}
          onCancel={handleCancelAppointment}
          onReschedule={handleRescheduleAppointment}
          onJoinMeeting={handleJoinMeeting}
        />
      );
    } else {
      return (
        <RoutineAppointmentCard
          key={appointment.id}
          appointment={appointment}
          onCancel={handleCancelAppointment}
          onReschedule={handleRescheduleAppointment}
        />
      );
    }
  };

  const tabData = getTabData(activeTab);

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              My Appointments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your consultations and routine appointments
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => fetchUserAppointments()}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Filters">
              <IconButton onClick={() => setShowFilters(!showFilters)}>
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Box display="flex" gap={3} mb={4} flexWrap="wrap">
          <Paper
            sx={{
              flex: "1",
              minWidth: 200,
              p: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: "white",
            }}
          >
            <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {totalAppointments}
            </Typography>
            <Typography variant="body2">Total Appointments</Typography>
          </Paper>
          
          <Paper
            sx={{
              flex: "1",
              minWidth: 200,
              p: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
              color: "white",
            }}
          >
            <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {getUpcomingAppointments().length}
            </Typography>
            <Typography variant="body2">Upcoming</Typography>
          </Paper>
          
          <Paper
            sx={{
              flex: "1",
              minWidth: 200,
              p: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
              color: "white",
            }}
          >
            <LocalHospital sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {consultations.length}
            </Typography>
            <Typography variant="body2">Consultations</Typography>
          </Paper>
          
          <Paper
            sx={{
              flex: "1",
              minWidth: 200,
              p: 3,
              textAlign: "center",
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
              color: "white",
            }}
          >
            <FitnessCenter sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {routineAppointments.length}
            </Typography>
            <Typography variant="body2">Routine Care</Typography>
          </Paper>
        </Box>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Filter Appointments
                </Typography>
                <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) => handleFilterChange("status", e.target.value)}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="outlined"
                    onClick={handleClearFilters}
                    size="small"
                  >
                    Clear Filters
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="All Appointments" {...a11yProps(0)} />
            <Tab label="Upcoming" {...a11yProps(1)} />
            <Tab label="Past" {...a11yProps(2)} />
            <Tab label="Consultations" {...a11yProps(3)} />
            <Tab label="Routine Care" {...a11yProps(4)} />
          </Tabs>
        </Paper>

        {/* Content */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={activeTab} index={0}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {tabData.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No appointments found. Book your first appointment to get started!
                  </Alert>
                ) : (
                  <Box>
                    {tabData.map(renderAppointmentCard)}
                  </Box>
                )}
              </motion.div>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {tabData.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No upcoming appointments. Schedule your next appointment!
                  </Alert>
                ) : (
                  <Box>
                    {tabData.map(renderAppointmentCard)}
                  </Box>
                )}
              </motion.div>
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {tabData.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No past appointments found.
                  </Alert>
                ) : (
                  <Box>
                    {tabData.map(renderAppointmentCard)}
                  </Box>
                )}
              </motion.div>
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {tabData.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No consultation appointments found.
                  </Alert>
                ) : (
                  <Box>
                    {tabData.map(renderAppointmentCard)}
                  </Box>
                )}
              </motion.div>
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {tabData.length === 0 ? (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    No routine appointments found.
                  </Alert>
                ) : (
                  <Box>
                    {tabData.map(renderAppointmentCard)}
                  </Box>
                )}
              </motion.div>
            </TabPanel>
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default UserAppointmentsPage;