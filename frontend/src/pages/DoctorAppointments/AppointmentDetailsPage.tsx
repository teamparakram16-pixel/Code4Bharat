import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useAppointmentsHooks } from "../../hooks/useAppointmentHooks/useAppointmentHook";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAppointmentByMeetId, updateAppointmentStatus } =
    useAppointmentsHooks();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      if (!id) return;
      try {
        const data = await getAppointmentByMeetId(id); // { appointment, linkExpired }
        if (!data || !data.appointment) {
          toast.error("Appointment not found");
          setAppointment(null);
          return;
        }
        setAppointment(data.appointment);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch appointment details");
        setAppointment(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointment();
  }, [id]);

  const handleStatus = async (status: "Accepted" | "Rejected") => {
    if (!appointment) return;
    setUpdating(true);

    try {
      const updatedAppointment = await updateAppointmentStatus(
        appointment._id,
        status
      );
      setAppointment(updatedAppointment); 
    } catch (err) {
      console.error(err);
      toast.error("Error updating appointment status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <CircularProgress />;

  if (!appointment)
    return <Typography sx={{ mt: 4 }}>No appointment found</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Appointment Details
        </Typography>
        <Typography>
          <strong>Patient:</strong> {appointment.user?.name || "N/A"}
        </Typography>
        <Typography>
          <strong>Email:</strong> {appointment.user?.email || "N/A"}
        </Typography>
        <Typography>
          <strong>Date & Time:</strong>{" "}
          {new Date(appointment.appointmentDate).toLocaleString()}
        </Typography>
        <Typography>
          <strong>Description:</strong> {appointment.description || "-"}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Status:</strong>{" "}
          <span
            style={{
              color:
                appointment.status === "Accepted"
                  ? "green"
                  : appointment.status === "Rejected"
                  ? "red"
                  : "orange",
            }}
          >
            {appointment.status || "Pending"}
          </span>
        </Typography>

        {appointment.status === "Pending" && (
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="success"
              disabled={updating}
              onClick={() => handleStatus("Accepted")}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={updating}
              onClick={() => handleStatus("Rejected")}
            >
              Reject
            </Button>
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default AppointmentDetailsPage;
