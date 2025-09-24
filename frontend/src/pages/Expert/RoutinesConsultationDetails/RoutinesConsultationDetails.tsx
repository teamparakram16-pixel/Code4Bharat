import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  Divider,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Container,
  MenuItem,
} from "@mui/material";
import {
  Share,
  Assignment,
  FitnessCenter,
  Restaurant,
  SelfImprovement,
  Spa,
  Add,
  Delete,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAppointmentsHooks } from "@/hooks/useAppointmentHooks/useAppointmentHook"; // Import your hook
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"; // Add these imports at the top
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext"; // Add this import

// interface Patient {
//   id: string;
//   name: string;
//   age: number;
//   gender: string;
//   phone: string;
//   email: string;
//   address: string;
//   avatar?: string;
// }

// interface PrakritiData {
//   vata: number;
//   pitta: number;
//   kapha: number;
//   dominantDosha: "vata" | "pitta" | "kapha";
//   assessmentDate: string;
// }

// interface HealthMetrics {
//   bmi: number;
//   bloodPressure: string;
//   heartRate: number;
//   sleepQuality: number; // 1-10 scale
//   stressLevel: number; // 1-10 scale
//   energyLevel: number; // 1-10 scale
// }

interface RoutineItem {
  id: string;
  category: "exercise" | "diet" | "lifestyle" | "meditation";
  title: string;
  description: string;
  duration: string;
  frequency: string;
  instructions: string;
}

// interface RoutinesConsultation {
//   id: string;
//   patient: Patient;
//   date: string;
//   time: string;
//   status: "pending" | "routine_shared" | "completed";
//   urgency: "low" | "medium" | "high";
//   goals: string[];
//   concerns: string[];
//   notes: string;
//   prakritiData: PrakritiData;
//   healthMetrics: HealthMetrics;
//   sharedRoutine?: RoutineItem[];
//   doctorNotes?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// Mock data
// const mockRoutinesConsultation: RoutinesConsultation = {
//   id: "2",
//   patient: {
//     id: "p2",
//     name: "Priya Sharma",
//     age: 28,
//     gender: "Female",
//     phone: "‪+91 87654 32109‬",
//     email: "priya.sharma@email.com",
//     address: "456 Brigade Road, Bangalore, Karnataka 560025",
//   },
//   date: "2024-03-20",
//   time: "11:30 AM",
//   status: "pending",
//   urgency: "medium",
//   goals: [
//     "Weight management",
//     "Stress reduction",
//     "Better sleep",
//     "Increased energy",
//   ],
//   concerns: [
//     "Irregular sleep patterns",
//     "Digestive issues",
//     "Work stress",
//     "Low energy",
//   ],
//   notes:
//     "Looking for a personalized Ayurvedic routine to improve overall health and well-being. Work schedule is demanding with irregular hours. Interested in meditation and yoga practices.",
//   prakritiData: {
//     vata: 65,
//     pitta: 70,
//     kapha: 25,
//     dominantDosha: "pitta",
//     assessmentDate: "2024-03-15",
//   },
//   healthMetrics: {
//     bmi: 22.5,
//     bloodPressure: "120/80",
//     heartRate: 72,
//     sleepQuality: 4,
//     stressLevel: 7,
//     energyLevel: 5,
//   },
//   createdAt: "2024-03-19T16:45:00Z",
//   updatedAt: "2024-03-19T16:45:00Z",
// };

const demoRoutineItems = [
  {
    id: "1",
    category: "exercise",
    title: "Morning Yoga",
    description: "Gentle yoga stretches to start the day.",
    duration: "20 minutes",
    frequency: "Daily",
    instructions: "Focus on breathing and flexibility.",
  },
  {
    id: "2",
    category: "diet",
    title: "Warm Herbal Tea",
    description: "Drink a cup of ginger-cinnamon tea after breakfast.",
    duration: "5 minutes",
    frequency: "Daily",
    instructions: "Use fresh ginger and cinnamon.",
  },
  {
    id: "3",
    category: "lifestyle",
    title: "Mindful Walking",
    description: "Take a walk in nature or a park.",
    duration: "30 minutes",
    frequency: "3x per week",
    instructions: "Walk at a comfortable pace.",
  },
  {
    id: "4",
    category: "meditation",
    title: "Evening Meditation",
    description: "Practice guided meditation before sleep.",
    duration: "15 minutes",
    frequency: "Daily",
    instructions: "Use a meditation app or audio.",
  },
  {
    id: "5",
    category: "diet",
    title: "Balanced Lunch",
    description: "Include cooked vegetables and lentils.",
    duration: "30 minutes",
    frequency: "Daily",
    instructions: "Avoid spicy and oily foods.",
  },
  {
    id: "6",
    category: "exercise",
    title: "Strength Training",
    description: "Light resistance exercises.",
    duration: "20 minutes",
    frequency: "2x per week",
    instructions: "Use bodyweight or light dumbbells.",
  },
  {
    id: "7",
    category: "lifestyle",
    title: "Sleep Hygiene",
    description: "Maintain a consistent sleep schedule.",
    duration: "8 hours",
    frequency: "Daily",
    instructions: "Avoid screens 30 minutes before bed.",
  },
  {
    id: "8",
    category: "meditation",
    title: "Breathing Exercises",
    description: "Practice deep breathing in the afternoon.",
    duration: "10 minutes",
    frequency: "Daily",
    instructions: "Inhale for 4 seconds, exhale for 6 seconds.",
  },
  {
    id: "9",
    category: "diet",
    title: "Hydration",
    description: "Drink 2 liters of water throughout the day.",
    duration: "All day",
    frequency: "Daily",
    instructions: "Sip water, avoid cold drinks.",
  },
  {
    id: "10",
    category: "lifestyle",
    title: "Social Connection",
    description: "Spend time with friends or family.",
    duration: "1 hour",
    frequency: "Weekly",
    instructions: "Engage in positive conversations.",
  },
];

const RoutinesConsultationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const {
    getRoutineAppointmentById,
    loading,
    shareRoutineAppointment,
    submit,
  } = useAppointmentsHooks();
  const { role } = useAuth(); // Get role from context

  const [consultation, setConsultation] = useState<any>(null);
  const [shareRoutineDialogOpen, setShareRoutineDialogOpen] = useState(false);
  const [routineItems, setRoutineItems] = useState<any[]>([]);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [newRoutineItem, setNewRoutineItem] = useState<Partial<any>>({
    category: "exercise",
    title: "",
    description: "",
    duration: "",
    frequency: "",
    instructions: "",
  });
  const [pdf, setPdf] = useState<Blob | null>(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!id) return;
      try {
        console.log("Fetching Routine Appointment with ID:", id);
        const data = await getRoutineAppointmentById(id);
        setConsultation(data);
        // If sharedRoutine exists, set it
        // if (data.routineAppointment.routineResponse?.sharedRoutine) {
        //   setRoutineItems(
        //     data.routineAppointment.routineResponse.sharedRoutine
        //   );
        // }
        // if (data.routineAppointment.routineResponse?.doctorNotes) {
        //   setDoctorNotes(data.routineAppointment.routineResponse.doctorNotes);
        // }
      } catch (error) {
        // Handle error (show toast or alert)
      }
    };
    fetchConsultation();
  }, [id]);

  // const handleShareRoutine = () => {
  //   if (consultation) {
  //     setConsultation({
  //       ...consultation,
  //       status: "routine_shared",
  //       sharedRoutine: routineItems,
  //       doctorNotes,
  //       updatedAt: new Date().toISOString(),
  //     });
  //     setShareRoutineDialogOpen(false);

  //     console.log("Shared Routine:", {
  //       ...consultation,
  //       status: "routine_shared",
  //       sharedRoutine: routineItems,
  //       doctorNotes,
  //       updatedAt: new Date().toISOString(),
  //     });
  //     // Here you would make an API call to update the consultation
  //   }
  // };

  const addRoutineItem = () => {
    if (newRoutineItem.title && newRoutineItem.description) {
      const item: RoutineItem = {
        id: Date.now().toString(),
        category: newRoutineItem.category as any,
        title: newRoutineItem.title,
        description: newRoutineItem.description,
        duration: newRoutineItem.duration || "",
        frequency: newRoutineItem.frequency || "",
        instructions: newRoutineItem.instructions || "",
      };
      setRoutineItems([...routineItems, item]);
      setNewRoutineItem({
        category: "exercise",
        title: "",
        description: "",
        duration: "",
        frequency: "",
        instructions: "",
      });
    }
  };

  const removeRoutineItem = (itemId: string) => {
    setRoutineItems(routineItems.filter((item) => item.id !== itemId));
  };

  // const getDoshaColor = (dosha: string) => {
  //   switch (dosha) {
  //     case "vata":
  //       return "#9C27B0";
  //     case "pitta":
  //       return "#FF9800";
  //     case "kapha":
  //       return "#4CAF50";
  //     default:
  //       return "#757575";
  //   }
  // };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "exercise":
        return <FitnessCenter />;
      case "diet":
        return <Restaurant />;
      case "lifestyle":
        return <SelfImprovement />;
      case "meditation":
        return <Spa />;
      default:
        return <Assignment />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "exercise":
        return "primary";
      case "diet":
        return "success";
      case "lifestyle":
        return "warning";
      case "meditation":
        return "secondary";
      default:
        return "default";
    }
  };

  // const getHealthMetricColor = (value: number, isHighGood: boolean = true) => {
  //   if (isHighGood) {
  //     return value >= 7 ? "success" : value >= 4 ? "warning" : "error";
  //   } else {
  //     return value <= 3 ? "success" : value <= 6 ? "warning" : "error";
  //   }
  // };

  // PDF Generation function
  const generatePDF = async (responseData: any) => {
    if (!responseData) {
      setLoadingPdf(false);
      return;
    }
    setLoadingPdf(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 12;
      let y = height - 50;

      const drawText = (text: string, bold = false, size = fontSize) => {
        page.drawText(text, {
          x: 50,
          y,
          size,
          font: bold ? font : regularFont,
          color: rgb(0, 0, 0),
        });
        y -= size + 5;
      };

      // Header
      page.drawText("Ayurvedic Prakriti Analysis", {
        x: width / 2 - 100,
        y: height - 30,
        size: 18,
        font,
        color: rgb(0.2, 0.5, 0.4),
      });
      page.drawLine({
        start: { x: 50, y: height - 60 },
        end: { x: width - 50, y: height - 60 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      y -= 60;

      // Section headers
      const drawSection = (title: string) => {
        drawText(title, true, 14);
        page.drawLine({
          start: { x: 50, y: y + 5 },
          end: { x: 150, y: y + 5 },
          thickness: 1,
          color: rgb(0.2, 0.5, 0.4),
        });
        y -= 10;
      };

      // Basic Info
      drawSection("Personal Information");
      drawText(`Name: ${responseData.Name || responseData.Name || ""}`);
      drawText(`Age: ${responseData.Age || ""}`);
      drawText(`Gender: ${responseData.Gender || ""}`);
      drawText(
        `Dominant Prakrithi: ${responseData.Dominant_Prakrithi || ""}`,
        true
      );

      y -= 15;

      // Body Constituents
      drawSection("Body Constituents");
      if (responseData.Body_Constituents) {
        Object.entries(responseData.Body_Constituents).forEach(
          ([key, value]) => {
            drawText(`• ${key.replace(/_/g, " ")}: ${value}`);
          }
        );
      }

      y -= 15;

      // Potential Health Concerns
      drawSection("Potential Health Considerations");
      if (responseData.Potential_Health_Concerns?.length === 0) {
        drawText(`{Subscribe to standard or pro plan}`);
      } else if (responseData.Potential_Health_Concerns) {
        responseData.Potential_Health_Concerns.forEach((concern: string) => {
          drawText(`• ${concern}`);
        });
      }

      y -= 15;

      // Recommendations
      drawSection("Personalized Recommendations");

      // Dietary Guidelines
      drawText("Dietary Guidelines:", true);
      if (responseData.Recommendations?.Dietary_Guidelines?.length === 0) {
        drawText(`{Subscribe to standard or pro plan}`);
      } else if (responseData.Recommendations?.Dietary_Guidelines) {
        responseData.Recommendations.Dietary_Guidelines.forEach(
          (item: string) => {
            drawText(`  - ${item}`);
          }
        );
      }

      // Lifestyle Suggestions
      drawText("Lifestyle Suggestions:", true);
      if (responseData.Recommendations?.Lifestyle_Suggestions?.length === 0) {
        drawText(`{Subscribe to standard or pro plan}`);
      } else if (responseData.Recommendations?.Lifestyle_Suggestions) {
        responseData.Recommendations.Lifestyle_Suggestions.forEach(
          (item: string) => {
            drawText(`  - ${item}`);
          }
        );
      }

      // Ayurvedic Herbs & Remedies
      drawText("Ayurvedic Herbs & Remedies:", true);
      if (
        Array.isArray(responseData.Recommendations?.Ayurvedic_Herbs_Remedies) &&
        responseData.Recommendations.Ayurvedic_Herbs_Remedies.length === 0
      ) {
        drawText(`{Subscribe to standard or pro plan}`);
      } else if (
        Array.isArray(responseData.Recommendations?.Ayurvedic_Herbs_Remedies)
      ) {
        responseData.Recommendations.Ayurvedic_Herbs_Remedies.forEach(
          (item: string) => {
            drawText(`  - ${item}`);
          }
        );
      } else if (responseData.Recommendations?.Ayurvedic_Herbs_Remedies) {
        Object.entries(
          responseData.Recommendations.Ayurvedic_Herbs_Remedies
        ).forEach(([key, values]) => {
          drawText(
            `  - ${key.replace(/_/g, " ")}: ${(values as string[]).join(", ")}`
          );
        });
      }

      // Footer
      y -= 30;
      page.drawText("Thank you for your trust in Ayurveda", {
        x: width / 2 - 120,
        y,
        size: 12,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      // Save and trigger download
      const pdfBytes: any = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setPdf(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoadingPdf(false);
    }
  };

  const generateRoutinePDF = async (
    routineItems: any[],
    doctorNotes: string,
    patientName: string
  ) => {
    setLoadingPdf(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let y = height - 50;

      const drawText = (text: string, bold = false, size = 12, indent = 0) => {
        page.drawText(text, {
          x: 50 + indent,
          y,
          size,
          font: bold ? font : regularFont,
          color: rgb(0, 0, 0),
        });
        y -= size + 5;
      };

      // Header
      page.drawText("Personalized Ayurvedic Routine", {
        x: width / 2 - 120,
        y: height - 30,
        size: 18,
        font,
        color: rgb(0.2, 0.5, 0.4),
      });
      page.drawLine({
        start: { x: 50, y: height - 60 },
        end: { x: width - 50, y: height - 60 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      y -= 60;

      drawText(`Patient: ${patientName}`, true, 14);
      y -= 10;

      // Routine Items
      drawText("Routine Items:", true, 14);
      y -= 5;
      routineItems.forEach((item, idx) => {
        drawText(`${idx + 1}. ${item.title} (${item.category})`, true, 13, 10);
        drawText(`Description: ${item.description}`, false, 12, 20);
        drawText(
          `Duration: ${item.duration} | Frequency: ${item.frequency}`,
          false,
          12,
          20
        );
        if (item.instructions) {
          drawText(`Instructions: ${item.instructions}`, false, 12, 20);
        }
        y -= 5;
      });

      y -= 10;
      drawText("Doctor's Notes:", true, 14);
      drawText(doctorNotes || "No additional notes.", false, 12, 10);

      y -= 30;
      page.drawText("Wishing you health and wellness!", {
        x: width / 2 - 120,
        y,
        size: 12,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      setPdf(blob);
      return blob;
    } catch (error) {
      console.error("Error generating routine PDF:", error);
      return null;
    } finally {
      setLoadingPdf(false);
    }
  };

  const submitRoutineResponse = async () => {
    try {
      // Generate PDF
      const pdfBlob = await generateRoutinePDF(
        routineItems,
        doctorNotes,
        patient.name
      );

      // Use the hook to send to backend
      await shareRoutineAppointment(consultation._id, pdfBlob as Blob);

      toast.success("Routine shared successfully!");
      setShareRoutineDialogOpen(false);
      // Optionally, refetch consultation data here
    } catch (error) {
      console.error("Error submitting routine response:", error);
      // Show error toast
    }
  };

  const handleDemoData = () => {
    setRoutineItems(demoRoutineItems);
    setDoctorNotes("This is a demo doctor's note for the routine.");
  };

  if (loading || consultation === null) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Typography variant="h6">Loading consultation details...</Typography>
      </Container>
    );
  }

  // Map API data to UI variables
  const patient = {
    id: consultation.user._id,
    name: consultation.user.profile.fullName,
    age: consultation.user.profile.age,
    gender: consultation.user.profile.gender,
    phone: consultation.user.profile.contactNo,
    email: consultation.user.email,
    address: consultation.user.profile.address?.clinicAddress || "",
    avatar: consultation.user.profile.profileImage,
  };

  const doctor = {
    id: consultation.doctor._id,
    name: consultation.doctor.profile.fullName,
    specialization: Array.isArray(consultation.doctor.profile.specialization)
      ? consultation.doctor.profile.specialization.join(", ")
      : consultation.doctor.profile.specialization,
    experience: consultation.doctor.profile.experience,
    profileImage: consultation.doctor.profile.profileImage,
    email: consultation.doctor.email,
  };

  const appointmentData = consultation.appointmentData;
  const prakriti = consultation.prakrithiAnalysis;
  const routineResponse = consultation.routineResponse;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Patient Information Card */}
        <Box sx={{ flex: { lg: "0 0 30%" } }}>
          <Card sx={{ mb: 3, position: "sticky", top: 20 }}>
            <CardContent>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  src={patient.avatar}
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "secondary.main",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {patient.name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {patient.name}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  sx={{ mb: 2 }}
                >
                  <Chip
                    label="Routines Consultation"
                    color="secondary"
                    size="small"
                    icon={<Assignment />}
                  />
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Age:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {patient.age} years
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Gender:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {patient.gender}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Contact Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Phone:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {patient.phone}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Email:
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {patient.email}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Address:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {patient.address}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Doctor Information Card */}
        <Box sx={{ flex: { lg: "0 0 30%" }, mb: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Avatar
                  src={doctor.profileImage}
                  sx={{
                    width: 70,
                    height: 70,
                    mx: "auto",
                    mb: 1,
                    bgcolor: "primary.main",
                  }}
                >
                  {doctor.name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  {doctor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {doctor.specialization}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Experience: {doctor.experience} years
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {doctor.email}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Appointment Data */}
        <Box sx={{ mb: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Appointment Data
              </Typography>
              <Typography variant="body2">
                Profession: {appointmentData.profession}
              </Typography>
              <Typography variant="body2">
                Health Concerns: {appointmentData.healthConcerns}
              </Typography>
              <Typography variant="body2">
                Work Hours: {appointmentData.workHours}
              </Typography>
              <Typography variant="body2">
                Physical Activity: {appointmentData.physicalActivity}
              </Typography>
              <Typography variant="body2">
                Diet Type: {appointmentData.dietType}
              </Typography>
              <Typography variant="body2">
                Food Preferences: {appointmentData.foodPreferences}
              </Typography>
              <Typography variant="body2">
                Water Intake: {appointmentData.waterIntake}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Prakriti Analysis */}
        <Box sx={{ mb: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Prakriti Analysis
              </Typography>
              <Typography variant="body2">
                Dominant Prakrithi: {prakriti.Dominant_Prakrithi}
              </Typography>
              <Typography variant="body2">
                Body Type: {prakriti.Body_Type}
              </Typography>
              <Typography variant="body2">
                Sleep Pattern: {prakriti.Sleep_Pattern}
              </Typography>
              <Typography variant="body2">
                Potential Health Concerns:
              </Typography>
              <ul>
                {prakriti.Potential_Health_Concerns?.map(
                  (concern: string, idx: number) => (
                    <li key={idx}>
                      <Typography variant="body2">{concern}</Typography>
                    </li>
                  )
                )}
              </ul>
              <Typography variant="body2">Recommendations:</Typography>
              <ul>
                {prakriti.Recommendations?.Dietary_Guidelines?.map(
                  (item: string, idx: number) => (
                    <li key={idx}>
                      <Typography variant="body2">{item}</Typography>
                    </li>
                  )
                )}
                {prakriti.Recommendations?.Lifestyle_Suggestions?.map(
                  (item: string, idx: number) => (
                    <li key={idx}>
                      <Typography variant="body2">{item}</Typography>
                    </li>
                  )
                )}
                {prakriti.Recommendations?.Ayurvedic_Herbs_Remedies?.map(
                  (item: string, idx: number) => (
                    <li key={idx}>
                      <Typography variant="body2">{item}</Typography>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </Box>

        {/* Routine PDF or Share Routine Button */}
        <Box sx={{ mb: 3 }}>
          {routineResponse.pdfUrl ? (
            <Button
              variant="contained"
              color="success"
              href={routineResponse.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Routine PDF
            </Button>
          ) : (
            role === "expert" && (
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Share />}
                onClick={() => setShareRoutineDialogOpen(true)}
              >
                Share Routine
              </Button>
            )
          )}
        </Box>

        {/* Share Routine Dialog */}
        <Dialog
          open={shareRoutineDialogOpen}
          onClose={() => setShareRoutineDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Share color="secondary" />
            Create & Share Personalized Routine
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create a personalized Ayurvedic routine based on the patient's
              Prakriti analysis and health goals.
            </Typography>

            {/* Add Demo Data Button inside the dialog */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                color="info"
                onClick={handleDemoData}
                sx={{ mr: 2 }}
              >
                Fill Demo Data
              </Button>
            </Box>

            {/* Add New Routine Item */}
            <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Add Routine Item
              </Typography>

              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    select
                    label="Category"
                    value={newRoutineItem.category}
                    onChange={(e) =>
                      setNewRoutineItem({
                        ...newRoutineItem,
                        category: e.target.value as any,
                      })
                    }
                    sx={{ minWidth: 150 }}
                    SelectProps={{
                      "aria-label": "Select routine category",
                    }}
                  >
                    <MenuItem value="exercise">Exercise</MenuItem>
                    <MenuItem value="diet">Diet</MenuItem>
                    <MenuItem value="lifestyle">Lifestyle</MenuItem>
                    <MenuItem value="meditation">Meditation</MenuItem>
                  </TextField>

                  <TextField
                    label="Title"
                    value={newRoutineItem.title}
                    onChange={(e) =>
                      setNewRoutineItem({
                        ...newRoutineItem,
                        title: e.target.value,
                      })
                    }
                    fullWidth
                  />
                </Box>

                <TextField
                  label="Description"
                  multiline
                  rows={2}
                  value={newRoutineItem.description}
                  onChange={(e) =>
                    setNewRoutineItem({
                      ...newRoutineItem,
                      description: e.target.value,
                    })
                  }
                  fullWidth
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Duration"
                    value={newRoutineItem.duration}
                    onChange={(e) =>
                      setNewRoutineItem({
                        ...newRoutineItem,
                        duration: e.target.value,
                      })
                    }
                    placeholder="e.g., 30 minutes"
                    fullWidth
                  />
                  <TextField
                    label="Frequency"
                    value={newRoutineItem.frequency}
                    onChange={(e) =>
                      setNewRoutineItem({
                        ...newRoutineItem,
                        frequency: e.target.value,
                      })
                    }
                    placeholder="e.g., Daily, 3x per week"
                    fullWidth
                  />
                </Box>

                <TextField
                  label="Instructions"
                  multiline
                  rows={2}
                  value={newRoutineItem.instructions}
                  onChange={(e) =>
                    setNewRoutineItem({
                      ...newRoutineItem,
                      instructions: e.target.value,
                    })
                  }
                  placeholder="Detailed instructions for the patient"
                  fullWidth
                />

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={addRoutineItem}
                  disabled={
                    !newRoutineItem.title || !newRoutineItem.description
                  }
                >
                  Add Item
                </Button>
              </Stack>
            </Card>

            {/* Current Routine Items */}
            {routineItems.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Routine Items ({routineItems.length})
                </Typography>
                <Stack spacing={2}>
                  {routineItems.map((item) => (
                    <Card key={item.id} variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Chip
                              icon={getCategoryIcon(item.category)}
                              label={item.category}
                              color={getCategoryColor(item.category) as any}
                              size="small"
                            />
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.title}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeRoutineItem(item.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {item.description}
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {item.duration}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Frequency:</strong> {item.frequency}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {/* Doctor's Notes */}
            <TextField
              label="Doctor's Notes"
              multiline
              rows={3}
              fullWidth
              value={doctorNotes}
              onChange={(e) => setDoctorNotes(e.target.value)}
              placeholder="Add any additional notes or recommendations for the patient..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareRoutineDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitRoutineResponse}
              variant="contained"
              color="secondary"
              startIcon={<Share />}
              disabled={routineItems.length === 0}
            >
              {!submit ? "Share Routine" : "Sharing..."}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add this button wherever you want to trigger PDF generation for prakriti analysis */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => generatePDF(consultation.prakrithiAnalysis)}
            disabled={loadingPdf}
          >
            {loadingPdf ? "Generating PDF..." : "View Prakriti Analysis PDF"}
          </Button>
          {pdf && (
            <Button
              variant="contained"
              color="success"
              sx={{ ml: 2 }}
              onClick={() => {
                const url = URL.createObjectURL(pdf);
                const link = document.createElement("a");
                link.href = url;
                link.download = "Prakriti_Analysis.pdf";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Download PDF
            </Button>
          )}
        </Box>

      </motion.div>
    </Container>
  );
};

export default RoutinesConsultationDetails;
