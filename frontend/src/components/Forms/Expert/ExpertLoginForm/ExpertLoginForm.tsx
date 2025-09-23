import { FC, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,

} from "@mui/material";
import {
  Google as GoogleIcon,
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import loginSchema from "./ExpertLoginFormSchema";
import useExpertAuth from "@/hooks/auth/useExpertAuth/useExpertAuth";
import { amber } from "@mui/material/colors";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "react-toastify";

const ExpertLoginForm: FC = () => {
  // const theme = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");
  const { expertLogin } = useExpertAuth();
  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);


  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    if (!turnstileToken) {
      toast.error("Please wait for  captcha verification", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    try {
      const response = await expertLogin(data.email, data.password);
      if (response.success) {
        navigate(redirectPath || "/gposts");
      }
    } catch (err: any) {
      console.log(err);
      if (err.status === 403 && err.message === "Email verification required") {
        setEmailVerification(true);
      }
    }
  };

  const googleLogin = async () => {
    window.open(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/google/expert`,
      "_self"
    );
  };

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box textAlign="center">
        <Box
          sx={{
            width: 80,
            height: 80,
            bgcolor: amber[50],
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 40, height: 40, color: amber[600] }}
          >
            <path d="M12 2v4M6 8l-3 3M21 11l-3-3M18 22v-4M15 15l3 3M9 15l-3 3" />
          </svg>
        </Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Vaidya Login
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access your Ayurvedic practice dashboard
        </Typography>
      </Box>

      {/* Login Form */}
      <Box component="form" onSubmit={handleSubmit(onLoginSubmit)}>
        <Stack spacing={3}>
          {" "}
          {/* Email Field */}
          <Box>
            <TextField
              {...register("email")}
              label="Email"
              variant="outlined"
              placeholder="vaidya@email.com"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              InputProps={{
                sx: {
                  "&:hover fieldset": {
                    borderColor: amber[600],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: amber[600],
                  },
                },
              }}
            />
            {emailVerification && (
              <Box sx={{ mt: 1 }}>
                <Link
                  component="button"
                  type="button"
                  variant="body2"
                  onClick={() => {
                    localStorage.setItem(
                      "emailVerification",
                      "sendVerification"
                    );
                    navigate("/email/verify");
                  }}
                  sx={{
                    color: amber[700],
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Verify your email address
                </Link>
              </Box>
            )}
          </Box>
          {/* Password Field */}
          <TextField
            {...register("password")}
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            placeholder="••••••••"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                "&:hover fieldset": {
                  borderColor: amber[600],
                },
                "&.Mui-focused fieldset": {
                  borderColor: amber[600],
                },
              },
            }}
          />
          <Box textAlign="right">
            <Link
              href="/expert/forgot-password"
              color="amber.700"
              underline="hover"
              variant="body2"
            >
              Forgot password?
            </Link>
          </Box>
          <Turnstile
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            onSuccess={(token) => setTurnstileToken(token)}
            onError={() => setTurnstileToken(null)}
            options={{
              theme: "light",
              size: "normal",
            }}
          />
          {/* Submit Button */}
          <LoadingButton
            type="submit"
            variant="contained"
            color="warning"
            fullWidth
            size="large"
            loading={isSubmitting}
            loadingPosition="start"
            startIcon={<LoginIcon />}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontWeight: "medium",
              "&:hover": {
                backgroundColor: amber[700],
              },
            }}
          >
            Sign in
          </LoadingButton>
          {/* Divider */}
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          {/* Google Button */}
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={googleLogin}
            startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
            sx={{
              py: 1.5,
              textTransform: "none",
              fontWeight: "medium",
              borderColor: "grey.300",
              "&:hover": {
                borderColor: "grey.400",
                backgroundColor: "action.hover",
              },
            }}
          >
            Continue with Google
          </Button>
        </Stack>
      </Box>

      {/* Footer */}
      <Typography variant="body2" textAlign="center" color="text.secondary">
        New to ArogyaPath?{" "}
        <Link
          href="/expert/register"
          color="amber.700"
          underline="hover"
          fontWeight="medium"
        >
          Create an account
        </Link>
      </Typography>
    </Stack>
  );
};

export default ExpertLoginForm;
