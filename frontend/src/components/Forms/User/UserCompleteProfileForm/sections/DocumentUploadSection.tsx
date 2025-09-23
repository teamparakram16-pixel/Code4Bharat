import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Box,
  Button,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FormSectionHeader } from "./FormSectionHeader";

export const DocumentUploadSection: React.FC = () => {
  const { watch, formState, setValue } = useFormContext();
  const theme = useTheme();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("governmentId", file, { shouldValidate: true });
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <FormSectionHeader
        title="Document Verification"
      />

      <Box sx={{ mb: 3 }}>
        <Button
          component="label"
          htmlFor="government-id-upload"
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{
            py: 2,
            borderStyle: "dashed",
            borderWidth: 2,
            borderColor: formState.errors.governmentId
              ? theme.palette.error.main
              : theme.palette.grey[400],
          }}
        >
          Upload Government ID (Aadhaar/Voter ID/Driving License)
          <input
            id="government-id-upload"
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        {formState.errors.governmentId && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {formState.errors.governmentId.message ? String(formState.errors.governmentId.message) : ''}
          </Typography>
        )}
        {watch("governmentId") && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Selected file: {watch("governmentId").name}
          </Typography>
        )}
      </Box>
    </Box>
  );
};