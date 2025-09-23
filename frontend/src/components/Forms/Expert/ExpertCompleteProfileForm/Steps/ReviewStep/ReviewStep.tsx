import React, { useMemo } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import ArticleIcon from "@mui/icons-material/Article";
import InfoCard from "./InfoCard/InfoCard";
import DocumentItem from "./DocumentItem/DocumentItem";
import { ReviewStepProps } from "./ReviewStep.types";

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  const theme = useTheme();

  const formatDate = useMemo(
    () => (date: Date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    []
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: theme.palette.primary.main }}
      >
        Review Your Information
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {/* Personal Information */}
        <Box sx={{ flexBasis: { xs: "100%", md: "calc(50% - 12px)" } }}>
          <InfoCard
            title="Personal Information"
            icon={<PersonIcon color="primary" sx={{ mr: 1 }} />}
          >
            <List dense>
              {" "}
              <ListItem>
                <ListItemText
                  primary="Expert Type"
                  secondary={
                    formData.expertType === "ayurvedic"
                      ? "Ayurvedic"
                      : "Naturopathy"
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Date of Birth"
                  secondary={formatDate(formData.dateOfBirth)}
                />
              </ListItem>
              <ListItem>
                <ListItemText primary="Gender" secondary={formData.gender} />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Mobile Number"
                  secondary={formData.mobileNumber}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={`${formData.street}, ${formData.city}, ${formData.state} - ${formData.pinCode}`}
                />
              </ListItem>
            </List>
          </InfoCard>
        </Box>
        {/* Professional Details */}
        <Box sx={{ flexBasis: { xs: "100%", md: "calc(50% - 12px)" } }}>
          <InfoCard
            title="Professional Details"
            icon={<WorkIcon color="primary" sx={{ mr: 1 }} />}
          >
            <List dense>
              <ListItem>
                <ListItemText
                  primary="AYUSH Registration"
                  secondary={formData.ayushRegistrationNumber}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Registration Council"
                  secondary={formData.registrationCouncil}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Experience"
                  secondary={`${formData.yearsOfExperience} years`}
                />
              </ListItem>
              <ListItem>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Specializations
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {formData.specializations.map((spec) => (
                      <Chip key={spec} label={spec} size="small" />
                    ))}
                  </Box>
                </Box>
              </ListItem>
              <ListItem>
                <Box sx={{ width: "100%" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Languages
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {formData.languages.map((lang) => (
                      <Chip key={lang} label={lang} size="small" />
                    ))}
                  </Box>
                </Box>
              </ListItem>
            </List>
          </InfoCard>
        </Box>
        {/* Educational Qualifications */}
        <Box sx={{ flexBasis: { xs: "100%", md: "calc(50% - 12px)" } }}>
          <InfoCard
            title="Educational Qualifications"
            icon={<SchoolIcon color="primary" sx={{ mr: 1 }} />}
          >
            <List dense>
              {formData.qualifications.map((qual, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemText
                      primary={`Qualification ${index + 1}`}
                      secondary={qual.degree}
                      secondaryTypographyProps={{
                        component: "div",
                        sx: { fontWeight: "medium" },
                      }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Institution"
                      secondary={qual.college}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Year" secondary={qual.year} />
                  </ListItem>
                  {index < formData.qualifications.length - 1 && (
                    <Divider sx={{ my: 1 }} />
                  )}
                </React.Fragment>
              ))}
            </List>
          </InfoCard>
        </Box>{" "}
        {/* Documents */}
        <Box sx={{ flexBasis: { xs: "100%", md: "calc(50% - 12px)" } }}>
          <InfoCard
            title="Uploaded Documents"
            icon={<ArticleIcon color="primary" sx={{ mr: 1 }} />}
          >
            <List dense>
              <DocumentItem
                title="Identity Proof"
                file={formData.identityProof}
              />
              <DocumentItem
                title="Degree Certificate"
                file={formData.degreeCertificate}
              />
              <DocumentItem
                title="Registration Proof"
                file={formData.registrationProof}
              />
              <DocumentItem
                title="Practice Proof"
                file={formData.practiceProof}
              />
            </List>
          </InfoCard>
        </Box>
        {/* Bio Section */}
        {formData.bio && (
          <Box sx={{ flexBasis: "100%", mt: 3 }}>
            <InfoCard
              title="Professional Bio"
              icon={<PersonIcon color="primary" sx={{ mr: 1 }} />}
            >
              <Box
                sx={{ p: 2, bgcolor: "background.default", borderRadius: 1 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    color: "text.primary",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  "{formData.bio}"
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
                    mt: 1,
                    color: "text.secondary",
                  }}
                >
                  {formData.bio.length} / 500 characters
                </Typography>
              </Box>
            </InfoCard>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ReviewStep;
