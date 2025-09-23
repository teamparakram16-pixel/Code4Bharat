import {
  Box,
  Container,
  Divider,
  Paper,
  Avatar,
  useTheme,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ProfileHeader } from "@/components/ProfileElements/ProfileHeader";
import { ProfileEditButton } from "@/components/ProfileElements/ProfileEditButton";
import { UserProfilePersonalInfo } from "@/components/ProfileElements/UserProfilePersonalInfo";
// import { UserProfileWellnessInfo } from "@/components/ProfileElements/UserProfileWellnessInfo";
import { PremiumBadge, PremiumCircleBadge } from "@/components/Premium/PremiumBadge/PremiumBadge";
import { useUserProfile } from "@/hooks/useUserProfile/useUserProfile";

const UserProfilePage = () => {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    errors,
    isEditing,
    isLoading,
    isSaving,
    avatar,
    premiumInfo,
    handleEdit,
    handleCancel,
    handleSave,
    handleAvatarChange,
    showSuccess,
    setShowSuccess,
  } = useUserProfile();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth={false} disableGutters>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4, md: 6 },
            background: theme.palette.background.paper,
            width: "100vw",
            minHeight: "100vh",
          }}
        >
          {isLoading ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="50vh">
              <CircularProgress size={60} />
              <Typography variant="h6" sx={{ mt: 2 }}>
                Loading profile...
              </Typography>
            </Box>
          ) : (
            <>
              <Box display="flex" justifyContent="flex-end" mb={4}>
                <ProfileEditButton
                  isEditing={isEditing}
                  onEdit={handleEdit}
                  onSave={handleSubmit(handleSave)}
                  onCancel={handleCancel}
                  isSaving={isSaving}
                />
              </Box>

              <ProfileHeader
                title="User Profile"
                subtitle="Manage your personal information and wellness preferences"
              />

          {/* Premium Badge Section */}
          {premiumInfo?.premiumNo && (
            <Box 
              display="flex" 
              justifyContent="center" 
              mb={4}
              sx={{ 
                animation: 'fadeInUp 0.6s ease-out',
                '@keyframes fadeInUp': {
                  from: { opacity: 0, transform: 'translateY(20px)' },
                  to: { opacity: 1, transform: 'translateY(0)' },
                },
              }}
            >
              <PremiumBadge 
                premiumNo={premiumInfo.premiumNo} 
                size="large" 
                showLabel={true}
              />
            </Box>
          )}

          <Box display="flex" flexDirection="column" alignItems="center" mb={6}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={avatar || "/default-avatar.jpg"}
                sx={{
                  width: 140,
                  height: 140,
                  border: `4px solid ${theme.palette.primary.main}`,
                  mb: 3,
                }}
              />
              {/* Premium Circle Badge on Avatar */}
              {premiumInfo?.premiumNo && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: -5,
                    zIndex: 2,
                  }}
                >
                  <PremiumCircleBadge 
                    premiumNo={premiumInfo.premiumNo} 
                    size="medium"
                  />
                </Box>
              )}
            </Box>
            {isEditing && (
              <Box
                component="label"
                htmlFor="user-avatar-upload"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": { bgcolor: theme.palette.primary.dark },
                }}
              >
                Change Photo
                <input 
                  id="user-avatar-upload"
                  type="file" 
                  hidden 
                  accept="image/*"
                  onChange={handleAvatarChange} 
                />
              </Box>
            )}
          </Box>

          <UserProfilePersonalInfo
            control={control}
            errors={errors}
            isEditing={isEditing}
            onAvatarChange={handleAvatarChange}
            avatar={avatar}
            premiumInfo={premiumInfo}
          />

          <Divider sx={{ my: 6, borderColor: theme.palette.divider }} />

          {/* <UserProfileWellnessInfo
            control={control}
            errors={errors}
            isEditing={isEditing}
          /> */}

          <Snackbar
            open={showSuccess}
            autoHideDuration={3000}
            onClose={() => setShowSuccess(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
              Profile updated successfully!
            </Alert>
          </Snackbar>
            </>
          )}
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default UserProfilePage;