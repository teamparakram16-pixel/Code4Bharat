import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import userLoginSchema from "./UserLoginSchema";
import {
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  InputAdornment,
  Link,
  Stack,
  Paper,
  Container,
} from "@mui/material";
import { Loader2, LogIn } from "lucide-react";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUserAuth from "@/hooks/auth/useUserAuth/useUserAuth";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "react-toastify";

const UserLoginForm = () => {
  const { userLogin } = useUserAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const [emailVerification, setEmailVerification] = useState<boolean>(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof userLoginSchema>>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
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
      const response = await userLogin(data.email, data.password);

      if (response.success) {
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate("/gposts");
        }
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
      `${import.meta.env.VITE_SERVER_URL}/api/auth/google/user`,
      "_self"
    );
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              Welcome back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Sign in to your account to continue
            </Typography>
            <Box sx={{ width: "100%" }}>
              <TextField
                {...register("email")}
                label="Email"
                placeholder="user@example.com"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  sx: {
                    "&:hover fieldset": {
                      borderColor: "success.main !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "success.main !important",
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
                      color: "primary.main",
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

            <TextField
              {...register("password")}
              label="Password"
              type="password"
              placeholder="••••••••"
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Link
                      href="/user/forgot-password"
                      color="success.main"
                      underline="hover"
                      variant="body2"
                    >
                      Forgot?
                    </Link>
                  </InputAdornment>
                ),
                sx: {
                  "&:hover fieldset": {
                    borderColor: "success.main !important",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "success.main !important",
                  },
                },
              }}
            />
            <Turnstile
              siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onSuccess={(token) => setTurnstileToken(token)}
              onError={() => setTurnstileToken(null)}
              options={{
                theme: "light",
                size: "normal",
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <Loader2 className="animate-spin" /> : <LogIn />
              }
              sx={{
                py: 1.5,
                fontWeight: 600,
                fontSize: "1rem",
                textTransform: "none",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
                },
              }}
            >
              Sign in
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Or continue with
              </Typography>
            </Divider>

            <Button
              variant="outlined"
              size="large"
              onClick={googleLogin}
              startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
              sx={{
                py: 1.5,
                fontWeight: 500,
                textTransform: "none",
                borderColor: "divider",
                "&:hover": {
                  borderColor: "action.hover",
                  backgroundColor: "action.hover",
                },
              }}
            >
              Continue with Google
            </Button>

            <Typography variant="body2" textAlign="center" mt={2}>
              Don't have an account?{" "}
              <Link
                href="/user/register"
                color="success.main"
                fontWeight="medium"
                underline="hover"
              >
                Sign up
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserLoginForm;
