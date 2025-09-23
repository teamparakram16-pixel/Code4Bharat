import { useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "@/hooks/useApi/useApi";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  CssBaseline,
  Container,
  Link,
  CircularProgress,
} from "@mui/material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

export function ForgotPasswordPage() {
  const { role } = useParams<{
    role: "user" | "expert";
  }>();
  const { post } = useApi();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/forgot-password`,
        { email, role }
      );
      if (res.success) {
        toast.success("Reset link sent to your email.");
        setMessage("Password reset link has been sent to your email address.");
      }
    } catch (err: any) {
      setMessage(err.response?.data?.error || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pb: 8, // Added extra bottom padding
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockResetOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Forgot Password
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>
          
          <Paper
            elevation={3}
            sx={{
              p: 3,
              width: "100%",
              borderRadius: 2,
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              
              {message && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    backgroundColor: message.includes("Failed") ? "error.light" : "success.light",
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    color={message.includes("Failed") ? "error.main" : "success.main"}
                    align="center"
                  >
                    {message}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link href="/auth" variant="body2" color="primary">
                  Back to Sign In
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}