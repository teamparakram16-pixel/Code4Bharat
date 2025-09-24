import React, { useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
  useTheme,
  Button,
} from "@mui/material";
import {
  CalendarToday,
  MoreVert,
  VideoCall,
  Person,
} from "@mui/icons-material";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

  const handleJoinMeeting = () => {
    navigate(`/livestreaming/${appointment.meetId}`);
  };

  const handleCancel = () => {
    onCancel(appointment._id);
  };

  const handleReschedule = () => {
    onReschedule(appointment._id, appointment.appointmentDate, "");
  };

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
                  {appointment.expert?.email || "Doctor"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Meet ID: {appointment.meetId}
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
              <IconButton size="small">
                <MoreVert />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" gap={3} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarToday
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
              <Typography variant="body2">
                {format(new Date(appointment.appointmentDate), "MMM dd, yyyy")}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <VideoCall
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
              <Typography variant="body2">
                {appointment.link ? "Online Consultation" : "Offline"}
              </Typography>
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
              Prakriti (Ayurvedic Analysis):
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dominant Prakrithi:{" "}
              {appointment.prakriti?.Dominant_Prakrithi || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Body Type: {appointment.prakriti?.Body_Type || "-"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Age: {appointment.prakriti?.Age || "-"}
            </Typography>
          </Box>
        </CardContent>

        <Box display="flex" justifyContent="flex-end" gap={1} p={2}>
          {appointment.link && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<VideoCall />}
              onClick={handleJoinMeeting}
            >
              Join Meeting
            </Button>
          )}
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleReschedule}
          >
            Reschedule
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default ConsultationAppointmentCard;
