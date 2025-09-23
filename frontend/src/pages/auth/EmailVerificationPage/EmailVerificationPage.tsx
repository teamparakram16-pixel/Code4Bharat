import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Box,
  Stack,
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import useEmailVerification from "@/hooks/auth/useEmailVerification";

const EmailVerificationPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { sendVerificationEmail } = useEmailVerification();
  const [status, setStatus] = useState<
    "verified" | "failedVerification" | "emailVerification" | "sendVerification"
  >();
  const [loading, setLoading] = useState<boolean>(false);

  // Get verification parameters from URL if they exist
  const id = searchParams.get("id");
  const token = searchParams.get("token");
  // const type = (searchParams.get("type") as "User" | "Expert") || "User";

  useEffect(() => {
    const localStatus = localStorage.getItem("emailVerification") || "";
    setStatus(localStatus as any);
    if (localStatus) {
      localStorage.setItem("emailVerification", "");
    } else {
      setStatus("sendVerification");
    }
  }, [id, token]);

  // const handleVerifyEmail = async () => {
  //   if (!id || !token) return;

  //   const response = await verifyEmail({
  //     id,
  //     token,
  //     type,
  //   });

  //   if (response?.success) {
  //     // Redirect to a success page or home page
  //     navigate("/verification-success");
  //   }
  // };

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await sendVerificationEmail(email);

      if (response?.success) {
        setEmail(""); // Clear the email input
      }
      setStatus("emailVerification");
      localStorage.setItem("emailVerification", "emailVerification");
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "verified":
        return (
          <Stack spacing={2}>
            <Typography variant="h6" color="success.main">
              ✅ Your email has been successfully verified!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/auth")}
              fullWidth
            >
              Proceed to Login
            </Button>
          </Stack>
        );
      case "failedVerification":
        return (
          <Stack spacing={2}>
            <Typography variant="h6" color="error">
              ❌ Email verification failed. Please try again.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                localStorage.setItem("emailVerification", "sendVerification");
                setStatus("sendVerification");
              }}
              fullWidth
            >
              Resend Verification Email
            </Button>
          </Stack>
        );
      case "emailVerification":
        return (
          <Stack spacing={2}>
            <Typography variant="h6" color="primary">
              📩 Verification email sent. Please check your inbox.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                localStorage.setItem("emailVerification", "sendVerification");
                setStatus("sendVerification");
              }}
              fullWidth
              disabled={loading}
            >
              Resend Verification Email
            </Button>
          </Stack>
        );
      case "sendVerification":
      default:
        return (
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendVerification(e);
            }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !email}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                "Send Verification Email"
              )}
            </Button>
          </Box>
        );
    }
  };

  return (
    <Box
      minHeight="100vh"
      minWidth="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f0f2f5"
      padding={2}
    >
      <Card sx={{ width: "100%", maxWidth: 500, padding: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom textAlign="center">
            Email Verification
          </Typography>
          {renderContent()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmailVerificationPage;
