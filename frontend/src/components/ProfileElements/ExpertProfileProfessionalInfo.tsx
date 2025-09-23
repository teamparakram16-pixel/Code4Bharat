import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  useTheme
} from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';
import { Controller, Control, FieldErrors } from "react-hook-form";

interface ExpertProfileProfessionalInfoProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
}

export const ExpertProfileProfessionalInfo = ({
  control,
  errors,
  isEditing
}: ExpertProfileProfessionalInfoProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" sx={{
        mb: 4,
        fontWeight: 600,
        color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <WorkIcon fontSize="medium" /> Professional Details
      </Typography>
      <Card variant="outlined" sx={{
        mb: 3,
        borderRadius: 2,
        borderColor: theme.palette.divider
      }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{
            mb: 3,
            fontWeight: 600,
            color: theme.palette.text.primary
          }}>
            Professional Info
          </Typography>
          <Controller
            name="verificationDetails.registrationDetails.registrationCouncil"
            control={control}
            render={({ field }) => (
              <TextField
                label="Council"
                {...field}
                InputProps={{ readOnly: !isEditing }}
                error={!!errors?.council}
                helperText={errors?.council?.message?.toString()}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="profile.specialization"
            control={control}
            render={({ field }) => (
              <TextField
                label="Specializations"
                {...field}
                InputProps={{ readOnly: !isEditing }}
                error={!!errors?.specializations}
                helperText={errors?.specializations?.message?.toString()}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="profile.languagesSpoken"
            control={control}
            render={({ field }) => (
              <TextField
                label="Languages"
                {...field}
                InputProps={{ readOnly: !isEditing }}
                error={!!errors?.languages}
                helperText={errors?.languages?.message?.toString()}
                fullWidth
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="profile.experience"
            control={control}
            render={({ field }) => (
              <TextField
                label="Experience"
                {...field}
                InputProps={{ readOnly: !isEditing }}
                error={!!errors?.experience}
                helperText={errors?.experience?.message?.toString()}
                fullWidth
              />
            )}
          />
        </CardContent>
      </Card>
    </Box>
  );
};