import { Card, CardContent, Avatar, Typography, Chip, Divider, Button, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Doctor } from "@/hooks/useDoctorSearch/useDoctor.types";
import DefaultIcon from "@/assets/Default Icon.svg";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Translate as LanguageIcon,
  MedicalServices as SpecializationIcon
} from "@mui/icons-material";

interface DoctorCardProps {
  doctor: Doctor;
  index?: number;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    username,
    email,
    profile: {
      fullName,
      contactNo,
      expertType,
      profileImage,
      experience,
      qualifications,
      specialization,
      languagesSpoken,
    },
    _id
  } = doctor;

  const handleViewProfile = () => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/doctor-profile/${_id}`);
    }, 100);
  };

  return (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      sx={{
        width: "100%",
        maxWidth: 400,
        minWidth: 300
      }}
    >
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 6,
            transform: "translateY(-4px)"
          },
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          border: "1px solid rgba(0, 0, 0, 0.1)"
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          {/* Doctor Header */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              src={profileImage || DefaultIcon}
              alt={fullName || username}
              sx={{
                width: 64,
                height: 64,
                bgcolor: "primary.light",
                border: "2px solid",
                borderColor: "primary.main"
              }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">
                {fullName || username}
              </Typography>
              <Chip
                label={`${expertType} Doctor`}
                color="primary"
                size="small"
                sx={{
                  textTransform: "capitalize",
                  mt: 0.5,
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}
              />
            </Box>
          </Box>

          {/* Doctor Details */}
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <EmailIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PhoneIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {contactNo || "N/A"}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <WorkIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {experience || 0} years experience
            </Typography>
          </Box>

          {qualifications?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                Qualifications
              </Typography>
              <Box sx={{ pl: 1 }}>
                {qualifications.map((q, i) => (
                  <Box key={i} display="flex" alignItems="center" gap={1} mb={1}>
                    <SchoolIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {q.degree} – {q.college} ({q.year})
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}

          {specialization?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                Specializations
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ pl: 1 }}>
                {specialization.map((spec, i) => (
                  <Chip
                    key={i}
                    label={spec}
                    size="small"
                    color="secondary"
                    icon={<SpecializationIcon fontSize="small" />}
                  />
                ))}
              </Box>
            </>
          )}

          {languagesSpoken?.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                Languages Spoken
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ pl: 1 }}>
                {languagesSpoken.map((lang, i) => (
                  <Chip
                    key={i}
                    label={lang}
                    size="small"
                    color="info"
                    icon={<LanguageIcon fontSize="small" />}
                  />
                ))}
              </Box>
            </>
          )}
        </CardContent>

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<VisibilityIcon />}
            onClick={handleViewProfile}
            disabled={loading}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              background: "linear-gradient(45deg, #1976d2 0%, #2196f3 100%)",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              "&:hover": {
                boxShadow: "0 6px 8px rgba(0,0,0,0.15)",
                background: "linear-gradient(45deg, #1565c0 0%, #1e88e5 100%)"
              }
            }}
          >
            {loading ? "Loading..." : "View Profile"}
          </Button>
        </Box>
      </Card>
    </Box>
  );
};