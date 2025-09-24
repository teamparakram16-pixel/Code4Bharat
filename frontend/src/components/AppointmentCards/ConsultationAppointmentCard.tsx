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
import { ConsultationAppointment } from "@/types/UserAppointments.types";

interface ConsultationAppointmentCardProps {
  appointment: ConsultationAppointment;
  onCancel: (appointmentId: string) => void;
  onReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
  onJoinMeeting?: (meetingLink: string) => void;
}

const ConsultationAppointmentCard: React.FC<ConsultationAppointmentCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
  onJoinMeeting,
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
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
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "scheduled":
        return "Scheduled";
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
    onCancel(appointment.id);
    handleMenuClose();
  };

  const handleJoinMeeting = () => {
    if (appointment.meetingLink && onJoinMeeting) {
      onJoinMeeting(appointment.meetingLink);
    }
    handleMenuClose();
  };

  const isUpcoming = () => {
    const appointmentDateTime = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`);
    return appointmentDateTime > new Date() && appointment.status !== 'cancelled';
  };

  const canJoinMeeting = () => {
    if (!appointment.meetingLink) return false;
    const appointmentDateTime = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    // Allow joining 15 minutes before appointment time
    return minutesDiff <= 15 && minutesDiff >= -60; // Can join 15 min before and up to 60 min after
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
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={appointment.doctorInfo.profileImage}
                alt={appointment.doctorInfo.fullName}
                sx={{ width: 50, height: 50 }}
              >
                <Person />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Dr. {appointment.doctorInfo.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {appointment.doctorInfo.specialization}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <Star sx={{ fontSize: 16, color: "gold" }} />
                  <Typography variant="caption">
                    {appointment.doctorInfo.rating}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • {appointment.doctorInfo.experience} years exp.
                  </Typography>
                </Box>
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
              <CalendarToday sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              <Typography variant="body2">
                {format(new Date(appointment.appointmentDate), "MMM dd, yyyy")}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <AccessTime sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              <Typography variant="body2">{appointment.appointmentTime}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalHospital sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              <Typography variant="body2">Consultation</Typography>
            </Box>
          </Box>

          {appointment.reason && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Reason for Visit:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.reason}
              </Typography>
            </Box>
          )}

          {appointment.symptoms && appointment.symptoms.length > 0 && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Symptoms:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {appointment.symptoms.map((symptom, index) => (
                  <Chip key={index} label={symptom} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Fee: ₹{appointment.consultationFee}
          </Typography>
          {canJoinMeeting() && appointment.status === 'confirmed' && (
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
            <MenuItem onClick={() => onReschedule(appointment.id, appointment.appointmentDate, appointment.appointmentTime)}>
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
          {appointment.meetingLink && canJoinMeeting() && (
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