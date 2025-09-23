import React, { useEffect } from "react";
import { Box, Typography, Paper, useTheme, useMediaQuery } from "@mui/material";
import ContactUsForm from "../../components/Forms/ContactUsForm/ContactUsForm.tsx";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import ContactIllustration from "../../assets/contact-illustration.svg";
import { MapEmbed } from "./MapEmbedding.tsx";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth.tsx";
import Loader from "@/components/Loader/Loader.tsx";

const FloatingShapes = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  & > div {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    backdrop-filter: blur(5px);
  }
`;

const StyledIllustration = styled.div`
  width: 100%;
  max-width: 500px;
  height: auto;
  margin: 0 auto;
`;

const StyledImg = styled("img")({
  width: "100%",
  maxWidth: 500,
  height: "auto",
  margin: "0 auto",
  display: "block",
});

const ContactUs: React.FC = () => {
  const { checkAuthStatus, loading } = useCheckAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        py: 8,
        px: 2,
      }}
    >
      {/* Animated background shapes */}
      <FloatingShapes>
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: "300px",
            height: "300px",
            top: "10%",
            left: "5%",
            opacity: 0.3,
          }}
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: "200px",
            height: "200px",
            bottom: "15%",
            right: "5%",
            opacity: 0.2,
          }}
        />
        <motion.div
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "150px",
            height: "150px",
            top: "60%",
            left: "70%",
            opacity: 0.15,
            borderRadius: "30%",
          }}
        />
      </FloatingShapes>

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          maxWidth: "1200px",
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          py: 4,
        }}
      >
        {/* Left side - Illustration and contact info */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <StyledIllustration>
            <StyledImg src={ContactIllustration} alt="Contact Illustration" />
          </StyledIllustration>

          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              mt: 4,
              width: "100%",
              maxWidth: "400px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              mb={2}
              textAlign="center"
              color="primary"
            >
              Contact Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  ✉️
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    teamparakram16@gmail.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  📞
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    +91-8904156468
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  📍
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    Sahyadri College of Engineering & Management, Mangalore
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        {/* Right side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            flex: 1,
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <Paper
            elevation={isMobile ? 0 : 6}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: isMobile ? "none" : undefined,
            }}
          >
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
              sx={{
                background:
                  theme &&
                  theme.palette &&
                  theme.palette.primary &&
                  theme.palette.primary.main &&
                  theme.palette.secondary &&
                  theme.palette.secondary.main
                    ? `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                    : "linear-gradient(90deg, #1976d2 0%, #9c27b0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              mb={4}
              sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}
            >
              Have questions, suggestions, or looking to collaborate? Reach out
              to us directly and we'll get back to you as soon as possible.
            </Typography>
            <ContactUsForm />
          </Paper>
        </motion.div>
      </Box>
      <Box mt={6} display="flex" justifyContent="center">
        <MapEmbed />
      </Box>
    </Box>
  );
};

export default ContactUs;
