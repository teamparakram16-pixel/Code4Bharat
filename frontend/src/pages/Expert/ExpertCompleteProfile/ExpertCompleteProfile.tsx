import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  // CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

import ExpertCompleteProfileForm from "@/components/Forms/Expert/ExpertCompleteProfileForm/ExpertCompleteProfileForm";
import {
  ExpertFormData,
  expertProfileSchema,
} from "./ExpertCompleteProfile.types";
import { steps } from "@/constants/expertCompleteProfile";
import useExpertAuth from "@/hooks/auth/useExpertAuth/useExpertAuth";

const ExpertCompleteProfile: React.FC = () => {
  const { expertCompleteProfile } = useExpertAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = React.useState(0);

  const methods = useForm<ExpertFormData>({
    resolver: zodResolver(expertProfileSchema),
    defaultValues: {
      expertType: "ayurvedic",
      dateOfBirth: new Date(1990, 0, 1),
      gender: "",
      mobileNumber: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
      ayushRegistrationNumber: "",
      registrationCouncil: "",
      yearOfRegistration: "",
      yearsOfExperience: 0,
      qualifications: [{ year: "", degree: "", college: "" }],
      specializations: [],
      languages: [],
      identityProof: undefined,
      degreeCertificate: undefined,
      registrationProof: undefined,
      practiceProof: undefined,
      bio: "",
    },
  });

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = methods;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: ExpertFormData) => {
    try {
      setIsSubmitting(true);

      // Validate that all required files are present
      if (
        !data.identityProof ||
        !data.degreeCertificate ||
        !data.registrationProof ||
        !data.practiceProof
      ) {
        toast.error("Please upload all required documents");
        return;
      }

      const response = await expertCompleteProfile(data);

      if (response?.success) {
        // Redirect to expert dashboard or posts page
        navigate("/gposts");
      }
    } catch (error) {
      console.error("Profile completion error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleNext = async () => {
    let isValid = false;

    switch (activeStep) {
      case 0:
        isValid = await trigger([
          "dateOfBirth",
          "gender",
          "mobileNumber",
          "street",
          "city",
          "state",
          "pinCode",
        ]);
        break;
      case 1:
        isValid = await trigger([
          "ayushRegistrationNumber",
          "registrationCouncil",
          "yearOfRegistration",
          "yearsOfExperience",
          "specializations",
          "languages",
        ]);
        break;
      case 2:
        isValid = await trigger(["qualifications"]);
        break;
      case 3:
        isValid = await trigger([
          "identityProof",
          "degreeCertificate",
          "registrationProof",
          "practiceProof",
        ]);
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          py: isMobile ? 2 : 6,
          px: isMobile ? 1 : 2,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            width: "100%",
            px: isMobile ? 1 : 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: isMobile ? 2 : 4,
              borderRadius: 4,
              width: "100%",
              boxShadow: theme.shadows[10],
            }}
          >
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant={isMobile ? "h5" : "h4"}
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  mb: 1,
                }}
              >
                Complete Your Practitioner Profile
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  mx: "auto",
                  fontSize: isMobile ? "0.875rem" : "1rem",
                }}
              >
                Help us verify your credentials and showcase your expertise to
                potential clients
              </Typography>
            </Box>

            {/* Progress Stepper */}
            <Box
              sx={{
                width: "100%",
                mb: 4,
                overflowX: "auto",
                "& .MuiStepLabel-label": {
                  fontSize: isMobile ? "0.7rem" : "0.875rem",
                },
              }}
            >
              <Stepper
                activeStep={activeStep}
                alternativeLabel
                sx={{
                  minWidth: isMobile ? "600px" : "auto",
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Form Content */}
            <ExpertCompleteProfileForm
              trigger={trigger}
              activeStep={activeStep}
              control={control}
              watch={watch}
              errors={errors}
              setValue={setValue}
            />

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                flexDirection: isMobile ? "column-reverse" : "row",
                gap: isMobile ? 2 : 0,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{
                  px: 4,
                  py: 1.5,
                  width: isMobile ? "100%" : "auto",
                }}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit(onSubmit)}
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting}
                  sx={{
                    px: 6,
                    py: 1.5,
                    fontSize: "1rem",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Complete Profile"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  size="large"
                  sx={{
                    px: 6,
                    py: 1.5,
                    fontSize: "1rem",
                    width: isMobile ? "100%" : "auto",
                  }}
                  endIcon={<ArrowForwardIcon />}
                >
                  Next
                </Button>
              )}
            </Box>

            {/* Progress Indicator */}
            <Box
              sx={{
                mt: 3,
                textAlign: "center",
                display: isMobile ? "none" : "block",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Step {activeStep + 1} of {steps.length}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default ExpertCompleteProfile;
