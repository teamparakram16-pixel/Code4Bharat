import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  Paper,
  IconButton,
  useTheme,
  Link,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { motion } from "framer-motion";
import { styled } from "@mui/system";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import Loader from "@/components/Loader";

// Styled components
const GlowingPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      theme &&
      theme.palette &&
      theme.palette.primary &&
      theme.palette.primary.light
        ? `linear-gradient(45deg, transparent, ${theme.palette.primary.light}, transparent)`
        : "linear-gradient(45deg, transparent, #90caf9, transparent)",
    transform: "rotate(45deg)",
    opacity: 0,
    transition: "opacity 0.5s",
  },
  "&:hover::before": {
    opacity: 0.3,
  },
}));

const TeamCard = styled(GlowingPaper)(({ theme }) => ({
  minWidth: 280,
  maxWidth: 320,
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: theme?.shadows
      ? (theme.shadows as any)[8]
      : "0 8px 24px rgba(0,0,0,0.18)",
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  position: "relative",
  display: "inline-block",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: "translateX(-50%)",
    width: "60%",
    height: 4,
    background:
      theme &&
      theme.palette &&
      theme.palette.primary &&
      theme.palette.primary.main
        ? theme.palette.primary.main
        : "#1976d2",
    borderRadius: 2,
  },
}));

interface TeamMember {
  name: string;
  role: string;
  desc: string;
  email: string;
  github: string;
  linkedin: string;
  image: string;
}

const team: TeamMember[] = [
  {
    name: "Adhish P Acharya",
    role: "Fullstack Developer",
    desc: "Led Team Prakram and collaboratively architected the project from scratch, driving frontend, backend, database, and deployment integration.",
    email: "adhishpacharya@gmail.com",
    github: "https://github.com/Adhish1612Acharya",
    linkedin: "https://www.linkedin.com/in/adhishpacharya/",
    image:
      "https://res.cloudinary.com/daawurvug/image/upload/v1751536906/1728652882622_ponagl.jpg",
  },
  {
    name: "Pranav Pai N",
    role: "ML and Backend Developer",
    desc: "Specializes in designing and implementing intelligent machine learning systems, building robust backend APIs, and integrating advanced data-driven features to power the platform's core intelligence and automation.",
    email: "pranavpai0309@gmail.com",
    github: "https://github.com/Pranava-Pai-N",
    linkedin: "https://www.linkedin.com/in/pranav-pai-n-563106292/",
    image:
      "https://res.cloudinary.com/daawurvug/image/upload/v1751536915/Pranav_xp1y2j.jpg",
  },
  {
    name: "Vijeth Kumar",
    role: "Frontend Developer",
    desc: "Crafts engaging user experiences and ensures pixel-perfect frontend implementation, focusing on UI/UX design, interactive features, and seamless user journeys that bring the platform to life.",
    email: "vijethkumar3110@gmail.com",
    github: "https://github.com/Vijeth-Kumar-18",
    linkedin: "https://www.linkedin.com/in/vijeth--kumar/",
    image:
      "https://res.cloudinary.com/daawurvug/image/upload/v1751536915/Vijeth_wwnnum.jpg",
  },
  {
    name: "U Vivek Shenoy",
    role: "Backend Developer",
    desc: "Engineers efficient server-side logic, manages complex database schemas, and ensures the reliability and scalability of backend services, supporting the platform's performance and data integrity.",
    email: "vivekshenoy6763@gmail.com",
    github: "https://github.com/vivekshenoy",
    linkedin: "https://www.linkedin.com/in/vivek-shenoy-55b20b319/",
    image:
      "https://res.cloudinary.com/daawurvug/image/upload/v1751536916/Vivek_twfs7b.jpg",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const AboutUs: React.FC = () => {
  const { checkAuthStatus, loading } = useCheckAuth();
  const theme = useTheme();

  useEffect(() => {
    const check = async () => {
      await checkAuthStatus();
    };
    check();
  }, []);

  if (loading) return <Loader />;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        py: { xs: 4, md: 8 },
        px: { xs: 2, sm: 4, md: 8 },
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowX: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: "100%" }}
        >
          <GlowingPaper
            elevation={4}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              mb: 5,
              textAlign: "center",
              width: "100%",
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              About ArogyaPath
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.6,
                maxWidth: 800,
                mx: "auto",
              }}
            >
              ArogyaPath is a digital platform designed to bring verified
              Ayurvedic knowledge and expert-guided healing to everyone through
              personalized recommendations, AI-driven insights, and a beautiful
              user experience.
            </Typography>
          </GlowingPaper>
        </motion.div>

        {/* Team Section */}
        <Box sx={{ width: "100%", textAlign: "center", mb: 6 }}>
          <SectionHeader
            variant="h4"
            fontWeight={600}
            mb={6}
            sx={{
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            Meet Team Parakram
          </SectionHeader>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 24,
              width: "100%",
            }}
          >
            {team.map((member, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                <TeamCard
                  elevation={3}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                  }}
                >
                  <Avatar
                    src={member.image}
                    sx={{
                      width: 96,
                      height: 96,
                      mb: 3,
                      fontSize: 40,
                      border: `3px solid ${theme.palette.primary.main}`,
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    {member.name[0]}
                  </Avatar>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ textAlign: "center", mb: 0.5 }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    fontWeight={600}
                    sx={{ textAlign: "center", mb: 2 }}
                  >
                    {member.role}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", mb: 2, minHeight: 60 }}
                  >
                    {member.desc}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", mb: 3 }}
                  >
                    <Link
                      href={`mailto:${member.email}`}
                      color="inherit"
                      underline="always"
                      sx={{ cursor: "pointer" }}
                    >
                      {member.email}
                    </Link>
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      component="a"
                      href={member.github}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: "text.primary",
                        "&:hover": {
                          color: "primary.main",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.3s",
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                    <IconButton
                      component="a"
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener"
                      sx={{
                        color: "text.primary",
                        "&:hover": {
                          color: "#0A66C2",
                          transform: "scale(1.1)",
                        },
                        transition: "all 0.3s",
                      }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                    {/* Twitter button removed */}
                  </Stack>
                </TeamCard>
              </motion.div>
            ))}
          </motion.div>
        </Box>

        {/* Goal Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={{ width: "100%" }}
        >
          <GlowingPaper
            elevation={2}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              textAlign: "center",
              mt: 4,
              width: "100%",
              maxWidth: 800,
              mx: "auto",
              background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                mb: 1,
                color: theme.palette.primary.main,
                letterSpacing: 1.5,
              }}
            >
              Team Parakram
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Box
                component="img"
                src="https://res.cloudinary.com/daawurvug/image/upload/v1751538124/Team_image_aanfsy.jpg"
                alt="Team Parakram"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 220,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              />
            </Box>
            <Typography
              variant="h5"
              fontWeight={600}
              mb={3}
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block",
              }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.6,
              }}
            >
              We aim to bridge ancient Ayurvedic wisdom with modern technology
              to empower users with trustworthy, personalized wellness tools.
              Our platform combines centuries-old healing knowledge with
              cutting-edge AI to deliver customized health recommendations.
            </Typography>
          </GlowingPaper>
        </motion.div>
      </Box>
    </Box>
  );
};

export default AboutUs;
