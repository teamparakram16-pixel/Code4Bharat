import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { motion } from "framer-motion";
import dayjs, { Dayjs } from "dayjs";
import { CalendarMonth, Person, CheckCircle } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useAppointmentsHooks } from "@/hooks/useAppointmentHooks/useAppointmentHook";

const Appointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createAppointment } = useAppointmentsHooks();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock doctor data - replace with actual API call
  const doctorInfo = {
    id: id,
    name: "Dr. Rajesh Kumar",
    specialization: "Ayurveda Specialist",
    experience: "15+ years",
    rating: 4.8,
    avatar: "/api/placeholder/150/150",
    consultationFee: 500,
    availability: "Mon-Sat 10:00 AM - 6:00 PM",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!id) {
      toast.error("Invalid doctor ID");
      return;
    }
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time for your appointment");
      return;
    }

    if (selectedDate.isBefore(dayjs(), "day")) {
      setError("Please select a future date for your appointment");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createAppointment({
        expertId: id, // send the param to backend
        appointmentDate: selectedDate.format("YYYY-MM-DD"),
        appointmentTime: selectedTime.format("HH:mm"),
        description: notes.trim(),
      });
      toast.success("Appointment booked successfully!");
      navigate("/u/appointments");
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Failed to book appointment");
      toast.error(error.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const minDate = dayjs().add(1, "day"); // Minimum date is tomorrow
  const maxDate = dayjs().add(30, "day"); // Maximum 30 days ahead

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Book Appointment
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Schedule your consultation with our expert
          </Typography>
        </Paper>

        <Box display="flex" gap={3} flexDirection={{ xs: "column", md: "row" }}>
          {/* Doctor Information Card */}
          <Card sx={{ flex: 1, height: "fit-content" }}>
            <CardContent sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar src={doctorInfo.avatar} sx={{ width: 80, height: 80 }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {doctorInfo.name}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {doctorInfo.specialization}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={`${doctorInfo.experience}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={`★ ${doctorInfo.rating}`}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Box>
                </Box>
              </Box>

              <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 2, mb: 2 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Consultation Details
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Fee:</strong> ₹{doctorInfo.consultationFee}
                </Typography>
                <Typography variant="body2">
                  <strong>Available:</strong> {doctorInfo.availability}
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Please arrive 10 minutes early for your appointment.
                  Cancellations must be made at least 2 hours in advance.
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Appointment Booking Form */}
          <Card sx={{ flex: 1.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CalendarMonth color="primary" />
                Select Date & Time
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3}>
                  {/* Date Selection */}
                  <DatePicker
                    label="Select Date"
                    value={selectedDate}
                    onChange={(newValue) =>
                      setSelectedDate(newValue ? dayjs(newValue) : null)
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        helperText: "Choose a date within the next 30 days",
                      },
                    }}
                  />

                  {/* Time Selection */}
                  <TimePicker
                    label="Select Time"
                    value={selectedTime}
                    onChange={(newValue) =>
                      setSelectedTime(newValue ? dayjs(newValue) : null)
                    }
                    minTime={dayjs().hour(10).minute(0)}
                    maxTime={dayjs().hour(17).minute(0)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        helperText: "Available: 10:00 AM - 5:00 PM",
                      },
                    }}
                  />

                  {/* Additional Notes */}
                  <TextField
                    label="Additional Notes (Optional)"
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your symptoms or specific concerns..."
                    fullWidth
                    inputProps={{ maxLength: 500 }}
                    helperText={`${notes.length}/500 characters`}
                  />

                  {/* Summary */}
                  {selectedDate && selectedTime && (
                    <Box sx={{ bgcolor: "primary.50", p: 2, borderRadius: 2 }}>
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        gutterBottom
                      >
                        Appointment Summary
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Date:</strong>{" "}
                        {selectedDate.format("MMMM DD, YYYY (dddd)")}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Time:</strong> {selectedTime.format("hh:mm A")}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Doctor:</strong> {doctorInfo.name}
                      </Typography>
                    </Box>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading || !selectedDate || !selectedTime}
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <CheckCircle />
                    }
                    sx={{
                      py: 1.5,
                      background:
                        "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)",
                      },
                    }}
                  >
                    {loading ? "Booking Appointment..." : "Book Appointment"}
                  </Button>

                  {/* Cancel Button */}
                  <Button
                    variant="outlined"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Appointment;
