import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  IconButton,
  InputAdornment,
  Paper
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Lock, 
  Visibility, 
  VisibilityOff,
  Spa,
  Favorite,
  CurrencyRupee
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useChangePassword } from "@/hooks/useChangePassword/useChangePassword";

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  minHeight: 600,
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',
  boxShadow: theme.shadows[10],
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : 16,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    minHeight: 'auto',
    maxWidth: '95%'
  },
  [theme.breakpoints.down('sm')]: {
    maxWidth: '98%'
  }
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  width: '40%',
  padding: theme.spacing(6),
  background: 'linear-gradient(135deg, #d97706 0%, #92400e 100%)',
  color: theme.palette.common.white,
  position: 'relative',
  [theme.breakpoints.down('lg')]: {
    width: '45%',
    padding: theme.spacing(4)
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(3),
    minHeight: 200
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    minHeight: 150
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==")',
    opacity: 0.1
  }
}));

const RightPanel = styled(Box)(({ theme }) => ({
  width: '60%',
  padding: theme.spacing(6),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.down('lg')]: {
    width: '55%',
    padding: theme.spacing(4)
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: theme.spacing(3)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2)
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1.5)
  },
  '& .MuiSvgIcon-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    padding: theme.spacing(1),
    fontSize: '1.5rem',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(0.75),
      fontSize: '1.25rem'
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5),
      fontSize: '1rem'
    }
  }
}));

const ExpertChangePassword: React.FC = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {
    loading,
    error,
    success,
    changePassword,
    setError,
    setSuccess
  } = useChangePassword({ endpoint: `${import.meta.env.VITE_SERVER_URL}/api/experts/change-password` });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleClickShowPassword = (field: keyof typeof showPassword) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    await changePassword(oldPassword, newPassword);
    if (success) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fef9c3 100%)',
        p: { xs: 1, sm: 2 },
        minHeight: '100vh'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper>
          <LeftPanel>
            <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, md: 4 } }}>
                <Spa sx={{ fontSize: { xs: 24, md: 32 }, mr: 1 }} />
                <Typography 
                  variant="h5" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.5rem' }
                  }}
                >
                  ArogyaPath
                </Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: { xs: 1, md: 2 },
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                  }}
                >
                  Secure Your Expert Account
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: { xs: 2, md: 4 }, 
                    opacity: 0.9,
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    display: { xs: 'none', md: 'block' }
                  }}
                >
                  Update your password to keep your expert profile protected
                </Typography>
                
                <Box sx={{ mt: { xs: 2, md: 4 }, display: { xs: 'none', md: 'block' } }}>
                  <FeatureItem>
                    <Favorite />
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { md: '1rem', lg: '1.125rem' }
                        }}
                      >
                        Account Security
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { md: '0.875rem', lg: '0.875rem' }
                        }}
                      >
                        Protect your expert profile and patient data
                      </Typography>
                    </Box>
                  </FeatureItem>
                  
                  <FeatureItem>
                    <CurrencyRupee />
                    <Box>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 600,
                          fontSize: { md: '1rem', lg: '1.125rem' }
                        }}
                      >
                        Best Practices
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          opacity: 0.9,
                          fontSize: { md: '0.875rem', lg: '0.875rem' }
                        }}
                      >
                        Use a strong, unique password for your expert account
                      </Typography>
                    </Box>
                  </FeatureItem>
                </Box>
              </Box>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8, 
                  mt: 'auto', 
                  pt: 2, 
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  fontSize: { xs: '0.75rem', md: '0.875rem' },
                  display: { xs: 'none', md: 'block' }
                }}
              >
                &copy; {new Date().getFullYear()} ArogyaPath - Ancient Wisdom, Modern Security
              </Typography>
            </Box>
          </LeftPanel>
          
          <RightPanel>
            <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400 } }}>
              <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 4 } }}>
                <Lock sx={{ 
                  fontSize: { xs: 36, md: 48 }, 
                  color: 'primary.main', 
                  mb: { xs: 1, md: 2 } 
                }} />
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
                  }}
                >
                  Change Password
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Enter your current and new password
                </Typography>
              </Box>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: { xs: 2, md: 3 } }}>
                <TextField
                  label="Current Password"
                  type={showPassword.old ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('old')}
                          edge="end"
                        >
                          {showPassword.old ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <TextField
                  label="New Password"
                  type={showPassword.new ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('new')}
                          edge="end"
                        >
                          {showPassword.new ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                <TextField
                  label="Confirm New Password"
                  type={showPassword.confirm ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => handleClickShowPassword('confirm')}
                          edge="end"
                        >
                          {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                
                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}
                
                {success && (
                  <Alert severity="success" sx={{ mt: 2, color: 'green', fontWeight: 700 }}>
                    {success}
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ 
                    mt: { xs: 2, md: 3 }, 
                    py: { xs: 1.2, md: 1.5 }, 
                    fontWeight: 600,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </Box>
            </Box>
          </RightPanel>
        </StyledPaper>
      </motion.div>
    </Box>
  );
};

export default ExpertChangePassword;