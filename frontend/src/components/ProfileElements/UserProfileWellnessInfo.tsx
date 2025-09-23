import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Checkbox,
  Stack,
  useTheme
} from "@mui/material";
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Controller, Control, FieldErrors } from "react-hook-form";

interface UserProfileWellnessInfoProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
}

export const UserProfileWellnessInfo = ({
  control,
  errors,
  isEditing
}: UserProfileWellnessInfoProps) => {
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
        <HealthAndSafetyIcon fontSize="medium" /> Wellness Information
      </Typography>
      <Card variant="outlined" sx={{
        mb: 3,
        borderRadius: 2,
        borderColor: theme.palette.divider
      }}>
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Controller
                name="currentCity"
                control={control}
                render={({ field }) => (
                  <TextField
                    label="Current City"
                    {...field}
                    InputProps={{
                      startAdornment: (
                        <LocationOnIcon />
                      ),
                      readOnly: !isEditing
                    }}
                    error={!!errors?.currentCity}
                    helperText={errors?.currentCity?.message?.toString()}
                    fullWidth
                  />
                )}
              />
            </Box>
            <Controller
              name="healthGoal"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Wellness Goals"
                  {...field}
                  InputProps={{ readOnly: !isEditing }}
                  error={!!errors?.wellnessGoals}
                  helperText={errors?.wellnessGoals?.message?.toString()}
                  fullWidth
                />
              )}
            />
            <Controller
              name="isSmoker"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={!!field.value} disabled={!isEditing} />}
                  label="Smoker"
                />
              )}
            />
            <Controller
              name="isAlcoholic"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={!!field.value} disabled={!isEditing} />}
                  label="Alcoholic"
                />
              )}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};