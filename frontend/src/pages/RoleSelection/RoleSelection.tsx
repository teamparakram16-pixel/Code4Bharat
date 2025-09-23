import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  useTheme,
  Fade,
} from "@mui/material";
import { Spa as LeafIcon, Psychology as BrainIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import googleAuthErrorMessages from "@/constants/googleAuthErrorMessages";
import { toast } from "react-toastify";

type Role = "farmer" | "expert" | null;

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}

const RoleCard = ({
  title,
  description,
  icon,
  selected,
  onClick,
}: RoleCardProps) => {
  const theme = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Paper
        elevation={selected ? 6 : 3}
        onClick={onClick}
        sx={{
          p: 4,
          borderRadius: 4,
          cursor: "pointer",
          border: selected
            ? `3px solid ${theme.palette.primary.main}`
            : "3px solid transparent",
          background: selected
            ? theme.palette.mode === "light"
              ? "rgba(46, 125, 50, 0.08)"
              : "rgba(102, 187, 106, 0.12)"
            : theme.palette.background.paper,
          transition: "all 0.3s ease",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
            color: selected
              ? theme.palette.primary.main
              : theme.palette.text.secondary,
            backgroundColor: selected
              ? theme.palette.mode === "light"
                ? "rgba(46, 125, 50, 0.1)"
                : "rgba(102, 187, 106, 0.2)"
              : theme.palette.mode === "light"
              ? "rgba(0, 0, 0, 0.04)"
              : "rgba(255, 255, 255, 0.04)",
            borderRadius: "50%",
            transition: "all 0.3s ease",
          }}
        >
          {icon}
        </Box>
        <Typography
          variant="h5"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: selected ? theme.palette.primary.main : "text.primary",
          }}
        >
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      </Paper>
    </motion.div>
  );
};

const RoleSelection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const signUpRedirect = searchParams.get("signUpRedirect");
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      // Decode and map error messages for user-friendly display
      const decoded = decodeURIComponent(error);
      const msg =
        googleAuthErrorMessages[decoded] ||
        "Authentication failed. Please try again.";
      toast.error(msg, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // Remove 'error' from the query params after showing the toast
      searchParams.delete("error");
      // Update the URL without reloading the page
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  }, [error]);

  const handleContinue = () => {
    if (selectedRole === "farmer") {
      if (redirectPath) {
        navigate(`/user/login?redirect=${encodeURIComponent(redirectPath)}`);
      } else if (signUpRedirect === "true") {
        navigate("/user/register");
      } else {
        navigate("/user/login");
      }
    } else if (selectedRole === "expert") {
      if (redirectPath) {
        navigate(`/expert/login?redirect=${encodeURIComponent(redirectPath)}`);
      } else if (signUpRedirect === "true") {
        navigate("/expert/register");
      } else {
        navigate("/expert/login");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background:
          theme.palette.mode === "light"
            ? "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)"
            : "linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            textAlign: "center",
            mb: 8,
            px: { xs: 0, sm: 4 },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              background:
                theme.palette.mode === "light"
                  ? "linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)"
                  : "linear-gradient(45deg, #81c784 30%, #a5d6a7 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
              lineHeight: 1.2,
            }}
          >
            Welcome to ArogyaPath
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              color:
                theme.palette.mode === "light"
                  ? "primary.dark"
                  : "primary.light",
              maxWidth: 600,
              mx: "auto",
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            Select your role to begin your Ayurvedic journey
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 4,
            justifyContent: "center",
            px: { xs: 0, sm: 4 },
          }}
        >
          <Box sx={{ width: { xs: "100%", sm: "50%", md: "50%" }}}>
            <RoleCard
              title="Ayurveda Seeker"
              description="Explore holistic wellness tips and routines for your well-being"
              icon={<LeafIcon fontSize="large" />}
              selected={selectedRole === "farmer"}
              onClick={() => setSelectedRole("farmer")}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "50%", md: "50%" } }}>
            <RoleCard
              title="Ayurvedic Expert"
              description="Share natural healing practices and guide others toward balance"
              icon={<BrainIcon fontSize="large" />}
              selected={selectedRole === "expert"}
              onClick={() => setSelectedRole("expert")}
            />
          </Box>
        </Box>

        <Fade in={Boolean(selectedRole)}>
          <Box
            sx={{
              mt: 6,
              textAlign: "center",
              display: selectedRole ? "block" : "none",
            }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleContinue}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  borderRadius: 4,
                  background:
                    theme.palette.mode === "light"
                      ? "linear-gradient(45deg, #2e7d32 30%, #388e3c 90%)"
                      : "linear-gradient(45deg, #81c784 30%, #a5d6a7 90%)",
                  boxShadow: theme.shadows[4],
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                    background:
                      theme.palette.mode === "light"
                        ? "linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)"
                        : "linear-gradient(45deg, #66bb6a 30%, #81c784 90%)",
                  },
                }}
              >
                Continue as{" "}
                {selectedRole === "farmer"
                  ? "Ayurveda Seeker"
                  : "Ayurvedic Expert"}
              </Button>
            </motion.div>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default RoleSelection;
