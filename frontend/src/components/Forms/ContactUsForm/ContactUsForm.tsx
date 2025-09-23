import React from "react";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  useTheme,
  Typography,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { Send, Email, Person, Subject, Message } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useContactUs from "@/hooks/useContactUs/useContactUs";
import contactUsSchema from "./contactUsZodSchema";


type ContactFormState = z.infer<typeof contactUsSchema>;

const ContactUsForm: React.FC = () => {
  const theme = useTheme();
  const { contactUs } = useContactUs();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormState>({
    resolver: zodResolver(contactUsSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormState) => {
    setIsSubmitting(true);
    try {
      const response = await contactUs(data);
      if (response.success && response.message) {
        setOpen(true);
        reset();
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error sending contact us message:", err);
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        custom={0}
        variants={inputVariants}
      >
        <TextField
          label="Full Name"
          {...register("fullName")}
          required
          fullWidth
          variant="outlined"
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
            "& .MuiInputLabel-root": {
              color: "text.secondary",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: theme.palette.primary.main,
            },
          }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        custom={1}
        variants={inputVariants}
      >
        <TextField
          label="Email"
          {...register("email")}
          required
          fullWidth
          type="email"
          variant="outlined"
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
          }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        custom={2}
        variants={inputVariants}
      >
        <TextField
          label="Subject"
          {...register("subject")}
          required
          fullWidth
          variant="outlined"
          error={!!errors.subject}
          helperText={errors.subject?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Subject color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
          }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        custom={3}
        variants={inputVariants}
      >
        <TextField
          label="Message"
          {...register("message")}
          required
          fullWidth
          multiline
          minRows={5}
          variant="outlined"
          error={!!errors.message}
          helperText={errors.message?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment
                position="start"
                sx={{ alignSelf: "flex-start", mt: 1 }}
              >
                <Message color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              "& fieldset": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.primary.main,
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.primary.main,
                boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
              },
            },
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<Send />}
          disabled={isSubmitting}
          sx={{
            mt: 1,
            borderRadius: "12px",
            fontWeight: 600,
            boxShadow: `0 4px 20px ${theme.palette.primary.light}`,
            transition: "all 0.3s ease",
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: `0 6px 25px ${theme.palette.primary.light}`,
            },
            "&:active": {
              transform: "translateY(0)",
            },
            "&.Mui-disabled": {
              background: theme.palette.action.disabledBackground,
            },
          }}
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </motion.div>

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props: any) => (
          <motion.div
            {...props}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          />
        )}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            boxShadow: theme.shadows[4],
            borderRadius: "12px",
            background: `linear-gradient(45deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Message sent successfully! We'll get back to you soon.
          </Typography>
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={5000}
        onClose={() => setError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={(props: any) => (
          <motion.div
            {...props}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          />
        )}
      >
        <Alert
          onClose={() => setError(false)}
          severity="error"
          sx={{
            width: "100%",
            boxShadow: theme.shadows[4],
            borderRadius: "12px",
            background: `linear-gradient(45deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)`,
            color: "white",
            "& .MuiAlert-icon": {
              color: "white",
            },
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Failed to send message. Please try again later.
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactUsForm;
