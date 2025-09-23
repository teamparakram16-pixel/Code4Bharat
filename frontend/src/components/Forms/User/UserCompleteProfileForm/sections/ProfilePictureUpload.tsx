import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export const ProfilePictureUpload: React.FC = () => {
  const theme = useTheme();
  const { watch, setValue, formState } = useFormContext();
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("profilePicture", file, { shouldValidate: true });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box sx={{ position: "relative", width: 120, height: 120 }}>
        <Avatar
          src={
            watch("profilePicture")
              ? URL.createObjectURL(watch("profilePicture"))
              : ""
          }
          sx={{
            width: "100%",
            height: "100%",
            fontSize: "3rem",
            bgcolor: theme.palette.grey[300],
          }}
        >
          {watch("fullName")?.[0]?.toUpperCase() || "P"}
        </Avatar>
        <IconButton
          component="label"
          htmlFor="profile-picture-upload"
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            bgcolor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              bgcolor: theme.palette.primary.dark,
            },
          }}
        >
          <PhotoCamera />
          <input
            id="profile-picture-upload"
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </IconButton>
      </Box>
      {formState.errors.profilePicture && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {formState.errors.profilePicture.message?.toString()}
        </Typography>
      )}
    </Box>
  );
};