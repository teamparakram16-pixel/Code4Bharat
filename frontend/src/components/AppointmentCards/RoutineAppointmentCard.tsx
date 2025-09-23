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
  CalendarToday,
  MoreVert,
  Cancel,
  Schedule,
  Person,
  FitnessCenter,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface RoutineAppointmentCardProps {
  appointment: any;
  onCancel: (appointmentId: string) => void;
  onReschedule: (
    appointmentId: string,
    newDate: string,
    newTime: string
  ) => void;
}

const RoutineAppointmentCard: React.FC<RoutineAppointmentCardProps> = ({
  appointment,
  onCancel,
  onReschedule,
}) => {
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

  const isUpcoming = () => {
    const appointmentDateTime = new Date(appointment.createdAt);
    return (
      appointmentDateTime > new Date() &&
      appointment.status?.toLowerCase() !== "cancelled"
    );
  };

  const handleViewDetails = () => {
    navigate(`/appointments/routines/${appointment._id}`, {
      state: { appointmentId: appointment._id },
    });
  };

  // Doctor info is just doctorId (string or object)
  const doctorInfo =
    typeof appointment.doctorId === "object"
      ? appointment.doctorId.email || appointment.doctorId._id
      : appointment.doctorId;

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
                  {doctorInfo ? `Dr. ${doctorInfo}` : "Doctor"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Routine Care
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
                {format(new Date(appointment.createdAt), "MMM dd, yyyy")}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <FitnessCenter
                sx={{ fontSize: 18, color: theme.palette.primary.main }}
              />
              <Typography variant="body2">Routine Care</Typography>
            </Box>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Profession:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {appointment.appointmentData?.profession || "-"}
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Health Concerns:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {appointment.appointmentData?.healthConcerns || "-"}
            </Typography>
          </Box>

          <Box mt={2}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Status:
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {getStatusText(appointment.status)}
            </Typography>
          </Box>

          {appointment.routineResponse?.pdfUrl && (
            <Box mt={2}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Routine PDF:
              </Typography>
              <Typography variant="body2" color="primary">
                <a
                  href={appointment.routineResponse.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download PDF
                </a>
              </Typography>
            </Box>
          )}

          <Box mt={2} display="flex" gap={1}>
            <Chip
              label={getStatusText(appointment.status)}
              color={getStatusColor(appointment.status) as any}
              size="small"
              variant="outlined"
            />
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Box flex={1} />
            <Box>
              <button
                style={{
                  padding: "6px 16px",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor: theme.palette.primary.main,
                  background: "white",
                  color: theme.palette.primary.main,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onClick={handleViewDetails}
              >
                View Details
              </button>
            </Box>
          </Box>
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
            <MenuItem
              onClick={() =>
                onReschedule(
                  appointment._id,
                  appointment.createdAt,
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
        </Menu>
      </Card>
    </motion.div>
  );
};

export default RoutineAppointmentCard;
