import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import {
  LocationOn,
  Work,
  Verified,
  PersonAddRounded,
  MessageRounded,
  CalendarTodayRounded,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { ProfileHeaderProps } from "./ProfileHeader.types";

const ProfileHeader = ({
  doctor,
  isFollowing,
  onFollow,
  onMessage,
  onBookAppointment,
}: ProfileHeaderProps) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          overflow: "hidden",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
        }}
      >
        {/* Cover Image Effect */}
        <Box
          sx={{
            height: { xs: 120, md: 180 },
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            position: "relative",
          }}
        />

        <CardContent sx={{ pt: 0, position: "relative" }}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems={{ xs: "center", md: "flex-start" }}
            gap={3}
            sx={{ mt: -8 }}
          >
            {/* Profile Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar
                src={doctor.avatar}
                alt={doctor.name}
                sx={{
                  width: { xs: 120, md: 150 },
                  height: { xs: 120, md: 150 },
                  border: "6px solid white",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              />
            </motion.div>

            {/* Profile Info */}
            <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
              <Box display="flex" alignItems="center" gap={1} justifyContent={{ xs: "center", md: "flex-start" }} mb={1}>
                <Typography variant="h3" component="h1" fontWeight="bold">
                  {doctor.name}
                </Typography>
                {doctor.verified && (
                  <Verified sx={{ fontSize: 32, color: "#4FC3F7" }} />
                )}
              </Box>

              <Typography
                variant="h6"
                sx={{ 
                  mb: 1, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: { xs: "center", md: "flex-start" },
                  opacity: 0.9 
                }}
              >
                <Work sx={{ mr: 1 }} /> {doctor.specialty}
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{ 
                  mb: 2, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: { xs: "center", md: "flex-start" },
                  opacity: 0.8 
                }}
              >
                <LocationOn sx={{ mr: 1 }} /> {doctor.hospital} • {doctor.location}
              </Typography>

              {/* Stats */}
              <Box
                display="flex"
                gap={{ xs: 2, md: 4 }}
                mb={3}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {doctor.posts}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Posts
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {doctor.followers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Followers
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6" fontWeight="bold">
                    {doctor.following}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Following
                  </Typography>
                </Box>
              </Box>

              {/* Bio */}
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, maxWidth: 500 }}>
                {doctor.about}
              </Typography>

              {/* Action Buttons */}
              <Box
                display="flex"
                gap={2}
                flexDirection={{ xs: "column", sm: "row" }}
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                <Button
                  variant={isFollowing ? "outlined" : "contained"}
                  startIcon={<PersonAddRounded />}
                  onClick={onFollow}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                    bgcolor: isFollowing ? "transparent" : "white",
                    color: isFollowing ? "white" : theme.palette.primary.main,
                    borderColor: "white",
                    "&:hover": {
                      bgcolor: isFollowing ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.9)",
                    },
                  }}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<MessageRounded />}
                  onClick={onMessage}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Message
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CalendarTodayRounded />}
                  onClick={onBookAppointment}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                    bgcolor: "#4FC3F7",
                    "&:hover": {
                      bgcolor: "#29B6F6",
                    },
                  }}
                >
                  Book Appointment
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileHeader;
