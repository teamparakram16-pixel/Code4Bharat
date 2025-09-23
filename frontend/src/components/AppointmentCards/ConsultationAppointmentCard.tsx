import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import {
  AccessTime,
  CalendarToday,
  MoreVert,
  VideoCall,
  Cancel,
  Schedule,
  Person,
  Star,
  LocalHospital,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

// Accepts appointment data as returned from backend
interface ConsultationAppointmentCardProps {
  appointment: any;
  onCancel: (appointmentId: string) => void;
  onReschedule: (
    appointmentId: string,
    newDate: string,
    newTime: string
  ) => void;
  onJoinMeeting?: (meetingLink: string) => void;
}

const ConsultationAppointmentCard: React.FC<
  ConsultationAppointmentCardProps
> = ({ appointment, onCancel, onReschedule, onJoinMeeting }) => {
  const theme = useTheme();
  const navigate = useNavigate(); // Add this line
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "scheduled":
      case "pending":
        return "success";
      case "completed":
        return "primary";
      case "cancelled":
        return "error";
      case "rescheduled":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Confirmed";
      case "scheduled":
        return "Scheduled";
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "rescheduled":
        return "Rescheduled";
      default:
        return status;
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCancel = () => {
    onCancel(appointment._id);
    handleMenuClose();
  };

  const handleJoinMeeting = () => {
    if (appointment.link && onJoinMeeting) {
      onJoinMeeting(appointment.link);
    }
    handleMenuClose();
  };

  const handleViewDetails = () => {
    navigate(
      `/appointments/consultation/${appointment._id}`,
      { state: { appointmentId: appointment._id } }
    );
  };

  // Only appointmentDate is present, no appointmentTime
  const isUpcoming = () => {
    const appointmentDateTime = new Date(appointment.appointmentDate);
    return (
      appointmentDateTime > new Date() &&
      appointment.status?.toLowerCase() !== "cancelled"
    );
  };

  // Meeting can be joined if link exists and status is confirmed/pending
  const canJoinMeeting = () => {
    if (!appointment.link) return false;
    const appointmentDateTime = new Date(appointment.appointmentDate);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    return (
      minutesDiff <= 15 &&
      minutesDiff >= -60 &&
      appointment.status?.toLowerCase() === "pending"
    );
  };

  // Doctor info from appointment.expert
  const doctorName = appointment.expert?.email || "Doctor";
  const doctorId = appointment.expert?._id || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar>
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {doctorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Doctor ID: {doctorId}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={getStatusText(appointment.status)}
                color={getStatusColor(appointment.status) as any}
                size="small"
                variant="outlined"
              />
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" flex={1} gap={3} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
              <Typography variant="body2">
                {format(new Date(appointment.appointmentDate), "MMM dd, yyyy")}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalHospital
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
              <Typography variant="body2">Consultation</Typography>
            </Box>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Description:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appointment.description || "-"}
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Prakriti Analysis:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appointment.prakriti?.Dominant_Prakrithi || "-"}
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Recommendations:
            </Typography>
            {appointment.prakriti?.Recommendations?.Dietary_Guidelines?.length >
              0 && (
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Dietary Guidelines:
                </Typography>
                <ul>
                  {appointment.prakriti.Recommendations.Dietary_Guidelines.map(
                    (item: string, idx: number) => (
                      <li key={idx}>
                        <Typography variant="body2" color="text.secondary">
                          {item}
                        </Typography>
                      </li>
                    )
                  )}
                </ul>
              </Box>
            )}
            {appointment.prakriti?.Recommendations?.Lifestyle_Suggestions
              ?.length > 0 && (
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Lifestyle Suggestions:
                </Typography>
                <ul>
                  {appointment.prakriti.Recommendations.Lifestyle_Suggestions.map(
                    (item: string, idx: number) => (
                      <li key={idx}>
                        <Typography variant="body2" color="text.secondary">
                          {item}
                        </Typography>
                      </li>
                    )
                  )}
                </ul>
              </Box>
            )}
            {appointment.prakriti?.Recommendations?.Ayurvedic_Herbs_Remedies
              ?.length > 0 && (
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  Ayurvedic Herbs & Remedies:
                </Typography>
                <ul>
                  {appointment.prakriti.Recommendations.Ayurvedic_Herbs_Remedies.map(
                    (item: string, idx: number) => (
                      <li key={idx}>
                        <Typography variant="body2" color="text.secondary">
                          {item}
                        </Typography>
                      </li>
                    )
                  )}
                </ul>
              </Box>
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Meeting ID: {appointment.meetId}
          </Typography>
          {canJoinMeeting() && (
            <Button
              variant="contained"
              startIcon={<VideoCall />}
              onClick={handleJoinMeeting}
              size="small"
              color="primary"
            >
              Join Meeting
            </Button>
          )}
        </CardActions>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 200 },
          }}
        >
          {isUpcoming() && (
            <MenuItem
              onClick={() =>
                onReschedule(
                  appointment._id,
                  appointment.appointmentDate,
                  "" // No time field
                )
              }
            >
              <ListItemIcon>
                <Schedule />
              </ListItemIcon>
              <ListItemText>Reschedule</ListItemText>
            </MenuItem>
          )}
          {isUpcoming() && (
            <MenuItem onClick={handleCancel}>
              <ListItemIcon>
                <Cancel />
              </ListItemIcon>
              <ListItemText>Cancel</ListItemText>
            </MenuItem>
          )}
          {appointment.link && canJoinMeeting() && (
            <MenuItem onClick={handleJoinMeeting}>
              <ListItemIcon>
                <VideoCall />
              </ListItemIcon>
              <ListItemText>Join Meeting</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Card>
    </motion.div>
  );
};

export default ConsultationAppointmentCard;
