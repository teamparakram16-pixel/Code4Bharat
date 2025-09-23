import { Typography, useTheme , Box} from "@mui/material";
import React from "react";

interface FormSectionHeaderProps {
  title: string;
  description?: string;
}

export const FormSectionHeader: React.FC<FormSectionHeaderProps> = ({ 
  title, 
  description 
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: theme.palette.primary.dark,
        }}
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto" }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};