import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Box
} from "@mui/material";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useExpertAuth from "@/hooks/auth/useExpertAuth/useExpertAuth";
import {
  ExpertRegisterFormProps,
  RegisterFormData,
  registerSchema,
} from "./ExpertRegisterForm.types";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "react-toastify";

const ExpertRegisterForm: FC<ExpertRegisterFormProps> = ({ userType }) => {
  const navigate = useNavigate();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { expertSignUp } = useExpertAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      expertType: userType || "",
    },
  });

  const onRegisterSubmit = async (data: RegisterFormData) => {
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
      const response = await expertSignUp(data);
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

  return (
    <form onSubmit={handleSubmit(onRegisterSubmit)}>
      <input type="hidden" value={userType} {...register("expertType")} />
      <FormControl fullWidth variant="outlined" error={!!errors.fullName}>
        <InputLabel htmlFor="fullName">Full Name</InputLabel>
        <OutlinedInput
          id="fullName"
          label="Full Name"
          {...register("fullName")}
          placeholder="Vaidya Name"
        />
        {errors.fullName && (
          <FormHelperText>{errors.fullName.message as string}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        variant="outlined"
        error={!!errors.email}
        sx={{ mt: 3 }}
      >
        <InputLabel htmlFor="email">Email</InputLabel>
        <OutlinedInput
          id="email"
          label="Email"
          {...register("email")}
          placeholder="vaidya@example.com"
        />
        {errors.email && (
          <FormHelperText>{errors.email.message as string}</FormHelperText>
        )}
      </FormControl>

      <FormControl
        fullWidth
        variant="outlined"
        error={!!errors.password}
        sx={{ mt: 3 }}
      >
        <InputLabel htmlFor="password">Password</InputLabel>
        <OutlinedInput
          id="password"
          type="password"
          label="Password"
          {...register("password")}
          placeholder="••••••••"
        />
        {errors.password && (
          <FormHelperText>{errors.password.message as string}</FormHelperText>
        )}
      </FormControl>
      <Box sx={{ mt: 3 }}>
        <Turnstile
          siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setTurnstileToken(null)}
          options={{
            theme: "light",
            size: "normal",
          }}
        />
      </Box>
      <LoadingButton
        type="submit"
        variant="contained"
        color="warning"
        size="large"
        loading={isSubmitting}
        loadingPosition="start"
        startIcon={<UserPlus style={{ width: 20, height: 20 }} />}
        sx={{
          py: 1.5,
          fontWeight: 600,
          textTransform: "none",
          fontSize: "1rem",
          mt: 4,
        }}
      >
        Register
      </LoadingButton>
    </form>
  );
};

export default ExpertRegisterForm;
