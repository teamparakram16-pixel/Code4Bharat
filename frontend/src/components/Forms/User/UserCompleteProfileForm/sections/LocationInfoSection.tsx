import React from "react";
import { useFormContext } from "react-hook-form";
import { Box, TextField } from "@mui/material";
import { FormSectionHeader } from "./FormSectionHeader";

export const LocationInfoSection: React.FC = () => {
  const { register, formState } = useFormContext();

  return (
    <Box sx={{ mb: 4 }}>
      <FormSectionHeader
        title="Location Information"
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Current City"
            variant="outlined"
            error={!!formState.errors.currentCity}
            helperText={formState.errors.currentCity?.message?.toString()}
            {...register("currentCity")}
            placeholder="Enter your current city"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="State"
            variant="outlined"
            error={!!formState.errors.state}
            helperText={formState.errors.state?.message?.toString()}
            {...register("state")}
            placeholder="Enter your state"
          />
        </Box>
      </Box>
    </Box>
  );
};