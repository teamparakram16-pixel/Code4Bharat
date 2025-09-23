import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
} from "@mui/material";
import {
  School,
  Work,
  Language,
  Email,
  Phone,
  LocationOn,
  MedicalServices,
  Stars,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { AboutSectionProps } from "./AboutSection.types";

const AboutSection = ({ doctor }: AboutSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Professional Summary */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MedicalServices color="primary" />
                Professional Summary
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.7, color: "text.secondary" }}>
                {doctor.about}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Specializations and Languages Row */}
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          {/* Specializations */}
          {doctor.specializations && (
            <Box flex={1}>
              <motion.div variants={itemVariants}>
                <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Stars color="primary" />
                      Specializations
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {doctor.specializations.map((spec, index) => (
                        <Chip
                          key={index}
                          label={spec}
                          variant="outlined"
                          sx={{
                            borderRadius: 2,
                            "&:hover": {
                              bgcolor: "primary.main",
                              color: "white",
                              borderColor: "primary.main",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          )}

          {/* Languages */}
          <Box flex={1}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Language color="primary" />
                    Languages
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {doctor.languages.map((lang, index) => (
                      <Chip
                        key={index}
                        label={lang}
                        icon={<Language />}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "white",
                            borderColor: "primary.main",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>

        {/* Education and Experience Row */}
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          {/* Education */}
          <Box flex={1}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <School color="primary" />
                    Education
                  </Typography>
                  <List disablePadding>
                    {doctor.education.map((edu, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                            <School fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight="bold">
                              {edu.degree}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {edu.university}
                              </Typography>
                              <br />
                              <Typography component="span" variant="caption" color="text.secondary">
                                {edu.year}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Experience */}
          <Box flex={1}>
            <motion.div variants={itemVariants}>
              <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Work color="primary" />
                    Professional Experience
                  </Typography>
                  <List disablePadding>
                    {doctor.experienceList.map((exp, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "secondary.main", width: 40, height: 40 }}>
                            <Work fontSize="small" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" fontWeight="bold">
                              {exp.position}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                {exp.hospital}
                              </Typography>
                              <br />
                              <Typography component="span" variant="caption" color="text.secondary">
                                {exp.period}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>

        {/* Contact Information */}
        <motion.div variants={itemVariants}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Phone color="primary" />
                Contact Information
              </Typography>
              <List>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "success.main" }}>
                      <Email />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Email"
                    secondary={
                      <Typography
                        component="a"
                        href={`mailto:${doctor.email}`}
                        sx={{
                          color: "primary.main",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {doctor.email}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "info.main" }}>
                      <Phone />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Phone (Subscribe to view)"
                    secondary={
                      <Typography
                        component="a"
                        href={`tel:${doctor.phone.replace(/\D/g, "")}`}
                        sx={{
                          color: "primary.main",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        {doctor.phone}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "warning.main" }}>
                      <LocationOn />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="Location"
                    secondary={`${doctor.hospital}, ${doctor.location}`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </motion.div>
  );
};

export default AboutSection;
