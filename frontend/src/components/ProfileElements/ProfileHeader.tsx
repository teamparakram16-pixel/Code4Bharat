import { Typography, useTheme, Box, Divider } from "@mui/material";
import { ReactNode } from "react";

interface ProfileHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export const ProfileHeader = ({ title, subtitle, children }: ProfileHeaderProps) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      textAlign: "center", 
      mb: 4,
      position: 'relative'
    }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 1,
          color: theme.palette.primary.main,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}
      >
        {title}
      </Typography>
      
      {subtitle && (
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ 
            maxWidth: 600, 
            mx: "auto",
            mb: 3
          }}
        >
          {subtitle}
        </Typography>
      )}
      
      <Divider sx={{ 
        mb: 3,
        background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
        height: 2
      }} />
      
      {children}
    </Box>
  );
};