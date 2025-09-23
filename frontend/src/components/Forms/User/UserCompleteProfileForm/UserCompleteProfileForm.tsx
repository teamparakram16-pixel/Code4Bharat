import React from "react";
import useUserAuth from "../../../../hooks/auth/useUserAuth/useUserAuth.ts";
import { useForm, FormProvider } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { UserFormData, userSchema } from "./validation.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSectionHeader } from "./sections/FormSectionHeader";
import { ProfilePictureUpload } from "./sections/ProfilePictureUpload";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { LocationInfoSection } from "./sections/LocationInfoSection";
import { WellnessInfoSection } from "./sections/WellnessInfoSection";
import { DocumentUploadSection } from "./sections/DocumentUploadSection";
import { ConsentSection } from "./sections/ConsentSection";
import { useNavigate } from "react-router-dom";
interface UserCompleteProfileFormProps {
  onSubmit?: (data: UserFormData) => Promise<void>;
  defaultValues?: Partial<UserFormData>;
}

export const UserCompleteProfileForm: React.FC<UserCompleteProfileFormProps> = ({
  onSubmit,
  defaultValues,
}) => {
  const { completeUserProfile } = useUserAuth();
  const theme = useTheme();
    const methods = useForm<UserFormData>({
    resolver: zodResolver(userSchema),  
    defaultValues: {
      fullName: "",
      gender: "",
      dateOfBirth: new Date(new Date().getFullYear() - 18, 0, 1),
      contactNo: "",
      email: "",
      currentCity: "",
      state: "",
      healthGoal: "",
      consent: false,
      ...defaultValues,
    },
  });
  const navigate = useNavigate();
  // Custom onSubmit handler that calls the API
  const handleSubmit = async (data: UserFormData) => {
    try {
      await completeUserProfile(data);
      if (typeof onSubmit === "function") {
        await onSubmit(data);
      }
      navigate("/gposts");
    } catch (error) {
      // Optionally handle error here
      console.error("Profile completion failed:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.grey[100],
          py: 4,
        }}
      >
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 4 } }}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              width: "100%",
              maxWidth: "900px",
              mx: "auto",
              backgroundColor: "background.paper",
              boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.1)",
            }}
          >
            <FormProvider {...methods}>
              <FormSectionHeader
                title="Complete Your Profile"
                description="Help us personalize your ArogyaPath experience by providing some additional details about yourself."
              />

              <Box
                component="form"
                onSubmit={methods.handleSubmit(handleSubmit)}
                sx={{ mt: 4 }}
              >
                <ProfilePictureUpload />
                <PersonalInfoSection />
                <LocationInfoSection />
                <WellnessInfoSection />
                <DocumentUploadSection />
                <ConsentSection />

                <Box sx={{ mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    startIcon={<CheckCircleIcon />}
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      fontWeight: 600,
                      fontSize: "1rem",
                    }}
                  >
                    Complete Profile
                  </Button>
                </Box>
              </Box>
            </FormProvider>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};