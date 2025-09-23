import { Box, Typography, useTheme, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { PlayCircleFilledWhite } from "@mui/icons-material";
import useCheckAuth from "@/hooks/auth/useCheckAuth/useCheckAuth";
import { useEffect } from "react";
import Loader from "@/components/Loader";

const LearnMore = () => {
  const theme = useTheme();
  const { checkAuthStatus, loading } = useCheckAuth();

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
        width: "100vw",
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)"
            : "linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 6, sm: 10 },
        px: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: "100%" }}
      >
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            p: { xs: 2, sm: 4 },
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            background:
              theme.palette.mode === "light"
                ? "#ffffff"
                : theme.palette.background.paper,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(45deg, #43a047, #2e7d32)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2rem", sm: "3rem" },
            }}
          >
            Learn More About ArogyaPath
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 800,
              mx: "auto",
              fontSize: { xs: "1rem", sm: "1.2rem" },
            }}
          >
            Discover how our platform connects Ayurveda seekers and experts
            through holistic wellness, personalized routines, and meaningful
            conversations.
          </Typography>

          <Box
            sx={{
              position: "relative",
              paddingTop: "56.25%",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: theme.shadows[4],
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/XjQUMn_a-1w"
              title="ArogyaPath Overview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            ></iframe>
          </Box>

          <Typography
            variant="body2"
            sx={{ mt: 3, color: theme.palette.text.disabled }}
          >
            <PlayCircleFilledWhite sx={{ mr: 1, verticalAlign: "middle" }} />
            Watch to explore how ArogyaPath empowers wellness with Ayurveda
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default LearnMore;
