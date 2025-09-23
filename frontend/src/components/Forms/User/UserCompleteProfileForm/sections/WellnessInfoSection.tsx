import React from "react";
import { useFormContext } from "react-hook-form";
import { Box, TextField } from "@mui/material";
import { FormSectionHeader } from "./FormSectionHeader";

export const WellnessInfoSection: React.FC = () => {
  const { register, formState } = useFormContext();

  return (
    <Box sx={{ mb: 4 }}>
      <FormSectionHeader
        title="Wellness Information"
      />

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Primary Wellness Goal"
          variant="outlined"
          error={!!formState.errors.healthGoal}
          helperText={formState.errors.healthGoal?.message?.toString()}
          {...register("healthGoal")}
          placeholder="E.g., Better sleep, Immunity, Weight management"
        />
      </Box>
    </Box>
  );
};