import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import useEmailVerification from "@/hooks/auth/useEmailVerification";

const VerifyingEmailPage: React.FC = () => {
  const { userId, token } = useParams();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") as "User" | "Expert") || "User";
  const { verifyEmail } = useEmailVerification();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!userId || !token) {
        localStorage.setItem("emailVerification", "failedVerification");
        navigate("/email/verify");
        return;
      }

      try {
        const response = await verifyEmail({
          id: userId,
          token,
          type,
        });

        if (response?.success) {
          localStorage.setItem("emailVerification", "verified");
        } else {
          localStorage.setItem("emailVerification", "failedVerification");
        }
      } catch (err: any) {
        localStorage.setItem("emailVerification", "failedVerification");
      } finally {
        navigate("/email/verify");
      }
    };

    verify();
  }, [userId, token, type, navigate, verifyEmail]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      bgcolor="#f9f9f9"
      padding={2}
    >
      <CircularProgress />
      <Typography variant="h6" marginTop={2} textAlign="center">
        Verifying your email address...
      </Typography>
    </Box>
  );
};

export default VerifyingEmailPage;
