import React, { useState } from "react";
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
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
  Cancel,
  Schedule,
  Person,
  Star,
  FitnessCenter,
  Repeat,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { RoutineAppointment } from "@/types/UserAppointments.types";

interface RoutineAppointmentCardProps {
  appointment: RoutineAppointment;
  onCancel: (appointmentId: string) => void;
  onReschedule: (appointmentId: string, newDate: string, newTime: string) => void;
}

const RoutineAppointmentCard: React.FC<RoutineAppointmentCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
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

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case "daily":
        return "primary";
      case "weekly":
        return "secondary";
      case "monthly":
        return "info";
      default:
        return "default";
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

  const isUpcoming = () => {
    const appointmentDateTime = new Date(`${appointment.appointmentDate} ${appointment.appointmentTime}`);
    return appointmentDateTime > new Date() && appointment.status !== 'cancelled';
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
              <FitnessCenter sx={{ fontSize: 18, color: theme.palette.primary.main }} />
              <Typography variant="body2">Routine Care</Typography>
            </Box>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Routine Type:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {appointment.routineType}
            </Typography>
          </Box>

          <Box mt={2} display="flex" alignItems="center" gap={1}>
            <Repeat sx={{ fontSize: 18, color: theme.palette.secondary.main }} />
            <Typography variant="body2" fontWeight="medium">
              Frequency:
            </Typography>
            <Chip
              label={appointment.frequency.charAt(0).toUpperCase() + appointment.frequency.slice(1)}
              color={getFrequencyColor(appointment.frequency) as any}
              size="small"
              variant="outlined"
            />
          </Box>

          {appointment.description && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Description:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.description}
              </Typography>
            </Box>
          )}

          {appointment.instructions && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Instructions:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.instructions}
              </Typography>
            </Box>
          )}

          {appointment.nextFollowUp && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Next Follow-up:
              </Typography>
              <Typography variant="body2" color="primary.main">
                {format(new Date(appointment.nextFollowUp), "MMM dd, yyyy")}
              </Typography>
            </Box>
          )}
        </CardContent>

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
        </Menu>
      </Card>
    </motion.div>
  );
};

export default RoutineAppointmentCard;