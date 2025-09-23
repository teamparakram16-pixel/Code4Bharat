import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userRegisterSchema from "./UserRegisterSchema";
import { useNavigate } from "react-router-dom";
import useUserAuth from "@/hooks/auth/useUserAuth/useUserAuth";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  useTheme,
  Link,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  Google as GoogleIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";
import { toast } from "react-toastify";

export const UserRegisterForm = () => {
  const { userSignUp } = useUserAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const form = useForm<z.infer<typeof userRegisterSchema>>({
    resolver: zodResolver(userRegisterSchema),
    defaultValues: {
      fullName: "",
      password: "",
      email: "",
    },
  });
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const onSubmit = async (data: z.infer<typeof userRegisterSchema>) => {
    if (!turnstileToken) {
      toast.error("Please wait for captcha verification", {
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
      const newData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        turnstileToken: turnstileToken,
      };

      const response = await userSignUp(newData);

      if (response.success && response.verificationEmailSent) {
        localStorage.setItem("emailVerification", "emailVerification");
        navigate("/email/verify");
      } else {
        localStorage.setItem("emailVerification", "sendVerification");
        navigate("/email/verify");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const googleSignUp = async () => {
    window.open(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/google/user`,
      "_self"
    );
  };

  return (
    <Stack spacing={4}>
      {/* Header */}
      <Box textAlign="center">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          Create Your Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join our community today
        </Typography>
      </Box>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* Form Fields */}

          <Box>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              error={!!form.formState.errors.fullName}
              helperText={form.formState.errors.fullName?.message}
              {...form.register("fullName")}
              placeholder="John Doe"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  "&:focus-within fieldset": {
                    borderColor: `${theme.palette.success.main} !important`,
                  },
                },
              }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              type="email"
              label="Email"
              variant="outlined"
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
              {...form.register("email")}
              placeholder="you@gmail.com"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  "&:focus-within fieldset": {
                    borderColor: `${theme.palette.success.main} !important`,
                  },
                },
              }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
              {...form.register("password")}
              placeholder="••••••••"
              InputProps={{
                sx: {
                  borderRadius: 2,
                  "&:focus-within fieldset": {
                    borderColor: `${theme.palette.success.main} !important`,
                  },
                },
              }}
            />
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
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            size="large"
            disabled={form.formState.isSubmitting}
            startIcon={
              form.formState.isSubmitting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <PersonAddIcon />
              )
            }
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: "1rem",
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Create Account
          </Button>

          {/* Divider */}
          <Divider sx={{ my: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
              OR CONTINUE WITH
            </Typography>
          </Divider>

          {/* Google Button */}
          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={googleSignUp}
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              borderWidth: 1.5,
              "&:hover": {
                borderWidth: 1.5,
              },
            }}
          >
            Sign up with Google
          </Button>

          {/* Login Link */}
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 2 }}
          >
            Already have an account?{" "}
            <Link
              href="/user/login"
              color="success.main"
              sx={{
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Stack>
      </form>
    </Stack>
  );
};