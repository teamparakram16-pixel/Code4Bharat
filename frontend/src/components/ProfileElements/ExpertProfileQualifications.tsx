import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  Divider,
  IconButton,
  Button,
  useTheme
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SchoolIcon from '@mui/icons-material/School';
import { Controller, useFieldArray, Control, FieldErrors } from "react-hook-form";

interface ExpertProfileQualificationsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
}

export const ExpertProfileQualifications = ({
  control,
  isEditing
}: ExpertProfileQualificationsProps) => {
  const theme = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "profile.qualifications"
  });

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
        <SchoolIcon fontSize="medium" /> Qualifications
      </Typography>
      <Card variant="outlined" sx={{ borderRadius: 2, borderColor: theme.palette.divider }}>
        <CardContent>
          {fields.map((q, idx) => (
            <Box key={q.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Qualification {idx + 1}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Controller
                  name={`profile.qualifications.${idx}.degree`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Degree"
                      {...field}
                      InputProps={{ readOnly: !isEditing }}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name={`profile.qualifications.${idx}.college`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="College"
                      {...field}
                      InputProps={{ readOnly: !isEditing }}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name={`profile.qualifications.${idx}.year`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Year"
                      {...field}
                      InputProps={{ readOnly: !isEditing }}
                      fullWidth
                    />
                  )}
                />
                {isEditing && (
                  <IconButton onClick={() => remove(idx)} color="error">
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          ))}
          {isEditing && (
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => append({ degree: "", college: "", year: "" })}
              sx={{ mt: 2 }}
            >
              Add Qualification
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};