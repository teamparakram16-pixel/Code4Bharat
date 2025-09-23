import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  useTheme,
  Fade,
  Zoom,
  Slide,
  CircularProgress,
} from "@mui/material";
import {
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import useOtp from "@/hooks/auth/useOtp/useOtp";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export default function MobileVerify() {
  const theme = useTheme();
  const { sendOtpForContactVerification, verifyPhoneNumber } = useOtp();

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [_mobileNumber, setMobileNumber] = useState("");
  const [showEditMobile, _setShowEditMobile] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [otpSent, setOtpSent] = useState(false); // New state to track if OTP has been sent

  useEffect(() => {
    if (resendDisabled && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(30);
    }
  }, [countdown, resendDisabled]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    const response = await sendOtpForContactVerification();
    if (!response) {
      setVerificationStatus("error");
    } else {
      setVerificationStatus("idle");
      setOtp(["", "", "", "", "", ""]);
      setResendDisabled(true);
      setCountdown(30);
      setMobileNumber(response.contactNo);
      setOtpSent(true); // Set OTP sent to true after successful send
    }
    setIsLoading(false);
  };

  const handleVerify = async () => {
    try {
      const enteredOtp = otp.join("");
      if (enteredOtp.length < 6) return;
      setIsLoading(true);
      const response = await verifyPhoneNumber(enteredOtp);
      if (response?.success) {
        setVerificationStatus("success");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setVerificationStatus("error");
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (!resendDisabled) {
      handleSendOtp();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light} 100%)`,
        p: 2,
        animation: `${fadeIn} 0.5s ease-out`,
      }}
    >
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Card
          sx={{
            width: "100%",
            maxWidth: 480,
            borderRadius: 4,
            boxShadow: theme.shadows[10],
            overflow: "visible",
            position: "relative",
            "&:before": {
              content: '""',
              position: "absolute",
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              borderRadius: 8,
              zIndex: -1,
              opacity: 0.7,
              animation: `${pulse} 4s infinite ease-in-out`,
            },
          }}
        >
          {verificationStatus === "idle" && !showEditMobile && (
            <Box
              sx={{
                position: "absolute",
                top: -40,
                left: "50%",
                transform: "translateX(-50%)",
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: theme.shadows[4],
                border: `4px solid ${theme.palette.primary.main}`,
              }}
            >
              <PhoneIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
          )}

          <CardHeader
            title={
              <Typography
                variant="h4"
                component="h1"
                align="center"
                sx={{
                  fontWeight: 700,
                  mt: verificationStatus === "idle" && !showEditMobile ? 2 : 0,
                  color:
                    theme.palette.mode === "dark"
                      ? "text.primary"
                      : "primary.main",
                }}
              >
                {verificationStatus === "success"
                  ? "Mobile Verified!"
                  : verificationStatus === "error"
                  ? "Verification Failed"
                  : "Verify Your Mobile"}
              </Typography>
            }
            subheader={
              verificationStatus === "idle" && !showEditMobile ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    {otpSent
                      ? "We've sent a 6-digit OTP"
                      : "Get a verification code"}
                  </Typography>
                </Box>
              ) : verificationStatus === "idle" && showEditMobile ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Enter your mobile number to receive a new OTP
                </Typography>
              ) : null
            }
            sx={{
              pt: verificationStatus === "idle" && !showEditMobile ? 6 : 4,
            }}
          />

          <CardContent>
            {verificationStatus === "success" ? (
              <Fade in={true}>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      borderRadius: "50%",
                      p: 2,
                      bgcolor: "success.light",
                      mb: 3,
                      animation: `${pulse} 2s infinite`,
                    }}
                  >
                    <CheckCircleIcon
                      sx={{
                        fontSize: 60,
                        color: "success.main",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Mobile Verified Successfully!
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Your mobile number has been verified. You can now access all
                    features.
                  </Typography>
                  <Button
                    component={Link}
                    to="/"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ mt: 2, py: 1.5 }}
                  >
                    Explore
                  </Button>
                </Box>
              </Fade>
            ) : verificationStatus === "error" ? (
              <Fade in={true}>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      borderRadius: "50%",
                      p: 2,
                      bgcolor: "error.light",
                      mb: 3,
                    }}
                  >
                    <ErrorIcon
                      sx={{
                        fontSize: 60,
                        color: "error.main",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Verification Failed
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    The OTP you entered is incorrect. Please try again.
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => {
                        setVerificationStatus("idle");
                        setOtp(["", "", "", "", "", ""]);
                      }}
                      sx={{ py: 1.5 }}
                    >
                      Try Again
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      fullWidth
                      onClick={handleResend}
                      disabled={isLoading || resendDisabled}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <SendIcon />
                        )
                      }
                      sx={{ py: 1.5 }}
                    >
                      {resendDisabled ? `Resend (${countdown})` : "Resend OTP"}
                    </Button>
                  </Box>
                </Box>
              </Fade>
            ) : !otpSent ? (
              <Zoom in={true}>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    startIcon={
                      isLoading ? <CircularProgress size={20} /> : <SendIcon />
                    }
                    sx={{ py: 1.5, mb: 2 }}
                  >
                    {isLoading ? "Sending..." : "Send Verification Code"}
                  </Button>
                </Box>
              </Zoom>
            ) : (
              <Zoom in={true}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Enter the 6-digit verification code
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      mb: 3,
                    }}
                  >
                    {otp.map((digit, index) => (
                      <TextField
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputProps={{
                          maxLength: 1,
                          style: { textAlign: "center", fontSize: "1.5rem" },
                        }}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        variant="outlined"
                        sx={{
                          width: 56,
                          "& .MuiOutlinedInput-root": {
                            height: 56,
                          },
                        }}
                      />
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleVerify}
                    disabled={isLoading || otp.some((d) => d === "")}
                    startIcon={
                      isLoading ? <CircularProgress size={20} /> : null
                    }
                    sx={{ py: 1.5, mb: 2 }}
                  >
                    {isLoading ? "Verifying..." : "Verify Mobile"}
                  </Button>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Button
                      onClick={handleResend}
                      disabled={isLoading || resendDisabled}
                      color="secondary"
                      startIcon={<SendIcon />}
                      sx={{ textTransform: "none" }}
                    >
                      {isLoading
                        ? "Sending..."
                        : resendDisabled
                        ? `Resend OTP in ${countdown}s`
                        : "Resend Verification Code"}
                    </Button>
                  </Box>
                </Box>
              </Zoom>
            )}
          </CardContent>
        </Card>
      </Slide>
    </Box>
  );
}
