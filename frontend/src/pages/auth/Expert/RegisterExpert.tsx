import { FC, useState } from "react";
import { Heart, UserPlus } from "lucide-react";
import AuthLayoutExpert from "@/components/AuthLayoutExpert/AuthLayoutExpert";
import GoogleIcon from "@mui/icons-material/Google";
import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import ExpertRegisterForm from "@/components/Forms/Expert/ExpertRegisterFrom/ExpertRegisterForm";

const userTypeOptions = [
  { type: "ayurvedic", label: "Ayurvedic Doctor", icon: Heart },
  { type: "naturopathy", label: "Naturopathy Doctor", icon: Heart },
];

const RegisterExpert: FC = () => {
  const theme = useTheme();
  const [userType, setUserType] = useState<"ayurvedic" | "naturopathy" | null>(
    null
  );

  const googleRegister = () => {
    window.open(
      `${import.meta.env.VITE_SERVER_URL}/api/auth/google/expert`,
      "_self"
    );
  };

  return (
    <AuthLayoutExpert
      title="Create an Account"
      subtitle="Join our community and make a difference."
    >
      {!userType ? (
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Select your role
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {userTypeOptions.map(({ type, label, icon: Icon }) => (
              <Box sx={{ width: '50%' }}>
                <Card
                  onClick={() =>
                    setUserType(type as "ayurvedic" | "naturopathy")
                  }
                  aria-label={`Select ${label}`}
                  sx={{
                    p: 3,
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor:
                      userType === type
                        ? theme.palette.primary.main
                        : "transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      backgroundColor: (theme.palette.primary as any).lighter,
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      bgcolor: theme.palette.primary.light,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    <Icon
                      style={{
                        width: 28,
                        height: 28,
                        color: theme.palette.primary.main,
                      }}
                    />
                  </Box>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {label}
                  </Typography>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                mx: "auto",
                width: 80,
                height: 80,
                bgcolor: "warning.light",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <UserPlus
                style={{
                  width: 36,
                  height: 36,
                  color: theme.palette.warning.main,
                }}
              />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Expert Registration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join ArogyaPath as a certified{" "}
              {userType === "ayurvedic" ? "Ayurvedic" : "Naturopathy"}{" "}
              practitioner
            </Typography>
          </Box>

          <ExpertRegisterForm userType={userType} />

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Button
            variant="outlined"
            size="large"
            onClick={googleRegister}
            startIcon={<GoogleIcon sx={{ color: "#EA4335" }} />}
            sx={{
              py: 1.5,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            Register with Google
          </Button>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems="center"
            mt={4}
          >
            <Button
              onClick={() => setUserType(null)}
              sx={{
                color: "primary.main",
                textTransform: "none",
                fontWeight: 500,
              }}
            >
              Change role
            </Button>

            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Button
                href="/expert/login"
                sx={{
                  color: "warning.main",
                  textTransform: "none",
                  fontWeight: 600,
                  p: 0,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Sign in
              </Button>
            </Typography>
          </Stack>
        </Box>
      )}
    </AuthLayoutExpert>
  );
};

export default RegisterExpert;