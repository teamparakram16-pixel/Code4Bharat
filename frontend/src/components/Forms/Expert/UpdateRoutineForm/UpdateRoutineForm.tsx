import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import { Box, Card, Typography, TextField, Button, Divider, Avatar, Chip, IconButton, Alert } from "@mui/material";
import { styled } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useRoutines from "../../../../hooks/useRoutine/useRoutine.ts";
import { useNavigate, useParams } from "react-router-dom";

interface OwnerProfile {
  fullName: string;
  profileImage: string;
}

interface RoutineStep {
  time: string;
  content: string;
  _id?: string;
}

interface RoutineData {
  _id: string;
  title: string;
  description: string;
  readTime: string;
  likesCount: number;
  commentsCount: number;
  filters: string[];
  routines: RoutineStep[];
  owner: {
    profile: OwnerProfile;
    _id: string;
  };
  createdAt: string;
}

const UpdateRoutineForm: React.FC = () => {
  const theme = useTheme();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Pro color palette
  const primaryMain = theme?.palette?.primary?.main || '#388E3C';
  const primaryDark = theme?.palette?.primary?.dark || '#1B5E20';
  const accentGreen = theme?.palette?.success?.main || '#43A047';
  const backgroundSoft = theme?.palette?.background?.paper || '#F8F9FA';
  const textSecondary = theme?.palette?.text?.secondary || '#757575';

  const StyledCard = styled(Card)(() => ({
    maxWidth: 800,
    margin: "auto",
    boxShadow: "0 8px 32px 0 rgba(56, 142, 60, 0.15)",
    borderRadius: 18,
    overflow: "hidden",
    background: backgroundSoft,
    position: 'relative',
  }));

  const HeaderSection = styled(Box)(() => ({
    padding: theme.spacing(4, 3, 3, 3),
    background: `linear-gradient(90deg, ${primaryDark} 0%, ${primaryMain} 100%)`,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    position: 'relative',
    boxShadow: "0 4px 24px 0 rgba(56, 142, 60, 0.10)",
  }));

  const InfoSection = styled(Box)(() => ({
    background: accentGreen + '11',
    borderRadius: 12,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  }));

  const FormSection = styled(Box)(() => ({
    padding: theme.spacing(4),
    background: backgroundSoft,
    borderRadius: 12,
    boxShadow: "0 2px 8px 0 rgba(56, 142, 60, 0.07)",
  }));

  const SubmitButton = styled(Button)(() => ({
    marginTop: theme.spacing(3),
    padding: theme.spacing(1.5),
    fontWeight: 600,
    fontSize: 16,
    background: `linear-gradient(90deg, ${accentGreen} 0%, ${primaryMain} 100%)`,
    color: "#fff",
    boxShadow: "0 2px 8px rgba(56,142,60,0.15)",
    borderRadius: 8,
    transition: "all 0.2s",
    '&:hover': {
      background: `linear-gradient(90deg, ${primaryMain} 0%, ${accentGreen} 100%)`,
      boxShadow: "0 4px 16px rgba(56,142,60,0.25)",
    },
    '&:disabled': {
      background: '#e0e0e0',
      color: '#a5a5a5',
    },
  }));

  const AnimatedBox = motion.create(Box);
  const navigate = useNavigate();
  const { id: routineId } = useParams();
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<RoutineStep[]>([]);

  const { getRoutinesPostById, updateRoutinePost } = useRoutines();


const fetchRoutine = async () => {
  if (!routineId) return;
  try {
    const res = await getRoutinesPostById(routineId);
    const fetched = res.routine;
    setRoutine(fetched);
    setTitle(fetched.title);
    setDescription(fetched.description);
    setSteps(fetched.routines || []);
  } catch (err: any) {
    console.error("Error fetching routine:", err.message);
  }
};


  useEffect(() => {
    fetchRoutine();
  }, []);

  const handleStepChange = (
    index: number,
    field: "time" | "content",
    value: string
  ) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleAddStep = () => {
    setSteps([...steps, { time: "", content: "" }]);
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const isStepValid = steps.every(
    (step) => step.time.trim() && step.content.trim()
  );

  if (!isStepValid) {
    alert("All routine steps must be filled out.");
    return;
  }

  try {
    await updateRoutinePost(routineId!, {
      title,
      description,
      routines: steps,
    });
    navigate(`/routines/${routineId}`);
  } catch (err: any) {
    console.error("Update failed:", err.message);
  }
};


  if (!routine) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <CircularProgress size={60} style={{ color: primaryMain }} />
    </Box>
  );

  return (
    <Box sx={{ padding: { xs: 2, md: 4 }, background: backgroundSoft, minHeight: '100vh' }}>
      <StyledCard>
        <HeaderSection>
          <IconButton sx={{ position: 'absolute', left: 16, top: 16, color: 'white' }} onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <EditIcon sx={{ fontSize: 40, opacity: 0.85 }} />
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600">
              Update Routine
            </Typography>
            <Typography variant="subtitle1" mt={1}>
              Refine and enhance your ayurvedic routine
            </Typography>
          </Box>
        </HeaderSection>
        <FormSection>
          <InfoSection>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar src={routine.owner.profile.profileImage} alt="Profile" sx={{ width: 50, height: 50 }} />
              <Box>
                <Typography fontWeight={600}>{routine.owner.profile.fullName}</Typography>
                <Typography variant="body2" color={textSecondary}>Created: {new Date(routine.createdAt).toLocaleString()}</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip label={`Read Time: ${routine.readTime}`} color="success" variant="outlined" />
              <Chip label={`Likes: ${routine.likesCount}`} color="primary" variant="outlined" />
              <Chip label={`Comments: ${routine.commentsCount}`} color="primary" variant="outlined" />
              {routine.filters.map((f, i) => (
                <Chip key={i} label={f} color="success" variant="filled" />
              ))}
            </Box>
          </InfoSection>
          <form onSubmit={handleSubmit} autoComplete="off">
            <AnimatedBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
              )}
              {success && (
                <Alert severity="success" onClose={() => setSuccess(false)}>
                  Routine updated successfully!
                </Alert>
              )}
              <Box>
                <TextField
                  fullWidth
                  label="Title"
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  InputProps={{ style: { fontSize: 16 } }}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Description"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  multiline
                  minRows={5}
                  maxRows={10}
                  InputProps={{ style: { fontSize: 16 } }}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Box>
              <Box>
                <Typography fontWeight={600} mb={1}>Routine Steps</Typography>
                {steps.map((step, index) => (
                  <Box key={index} display="flex" gap={2} alignItems="center" mb={1}>
                    <TextField
                      label="Time"
                      variant="outlined"
                      value={step.time}
                      onChange={(e) => handleStepChange(index, "time", e.target.value)}
                      required
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Content"
                      variant="outlined"
                      value={step.content}
                      onChange={(e) => handleStepChange(index, "content", e.target.value)}
                      required
                      sx={{ flex: 3 }}
                    />
                    <Button type="button" color="error" variant="outlined" onClick={() => handleRemoveStep(index)}>
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button type="button" onClick={handleAddStep} color="success" variant="contained" sx={{ mt: 1 }}>
                  Add Step
                </Button>
              </Box>
              <Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="flex-end">
                  <SubmitButton type="submit" variant="contained" size="large">
                    Update Routine
                  </SubmitButton>
                </Box>
              </Box>
            </AnimatedBox>
          </form>
        </FormSection>
      </StyledCard>
    </Box>
  );
};

export default UpdateRoutineForm;