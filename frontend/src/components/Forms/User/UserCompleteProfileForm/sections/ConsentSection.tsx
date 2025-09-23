import React from "react";
import { useFormContext } from "react-hook-form";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";

export const ConsentSection: React.FC = () => {
  const { register, formState, watch } = useFormContext();

  return (
    <Box sx={{ mb: 4 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={watch("consent")}
            {...register("consent")}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            I agree to the{" "}
            <Typography
              component="a"
              href="/terms-and-conditions"
              color="primary"
              sx={{ textDecoration: "underline" }}
            >
              Terms of Service
            </Typography>{" "}
            and{" "}
            <Typography
              component="a"
              href="/privacy-policy"
              color="primary"
              sx={{ textDecoration: "underline" }}
            >
              Privacy Policy
            </Typography>
            , and confirm that all information provided is accurate.
          </Typography>
        }
      />
      {formState.errors.consent && (
        <Typography color="error" variant="body2">
          {formState.errors.consent.message?.toString()}
        </Typography>
      )}
    </Box>
  );
};