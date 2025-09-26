import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useAppointmentsHooks } from "../../hooks/useAppointmentHooks/useAppointmentHook";
import { useNavigate } from "react-router-dom";

const DoctorAppointmentsPage: React.FC = () => {
  const { getExpertAppointments, loading } = useAppointmentsHooks();
  const [appointments, setAppointments] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getExpertAppointments();
        setAppointments(data.appointments);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 4 }} />;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" style={{marginTop:"7rem"}} gutterBottom>
        My Consultation Appointments
      </Typography>
      <Paper sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length > 0 ? (
              appointments.map((app) => (
                <TableRow key={app._id}>
                  <TableCell>{app.user?.name}</TableCell>
                  <TableCell>{app.user?.email}</TableCell>
                  <TableCell>{new Date(app.appointmentDate).toLocaleString()}</TableCell>
                  <TableCell>{app.status || "Pending"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/doctor/appointments/${app.meetId}`)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No appointments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default DoctorAppointmentsPage;
