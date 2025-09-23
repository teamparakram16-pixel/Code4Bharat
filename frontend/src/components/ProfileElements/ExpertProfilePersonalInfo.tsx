import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
  useTheme,
  MenuItem,
  IconButton,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
// import DateRangeIcon from '@mui/icons-material/DateRange';
import WcIcon from '@mui/icons-material/Wc';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import { Controller, Control, FieldErrors } from "react-hook-form";

interface ExpertProfilePersonalInfoProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
}

// Editable field wrapper component
const EditableFieldWrapper = ({ children, isEditing }: { children: React.ReactNode, isEditing: boolean }) => (
  <Box sx={{ position: 'relative' }}>
    {children}
    {isEditing && (
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          right: 10,
          top: '50%',
          transform: 'translateY(-50%)',
          p: 0.5,
          zIndex: 1,
        }}
      >
        <EditIcon fontSize="small" color="primary" />
      </IconButton>
    )}
  </Box>
);

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const ExpertProfilePersonalInfo = ({
  control,
  errors,
  isEditing
}: ExpertProfilePersonalInfoProps) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: theme.palette.mode === 'dark' 
          ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
          : '0 8px 32px rgba(0, 0, 0, 0.1)',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' 
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <PersonIcon />
          Personal Information
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            gap: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {/* Full Name */}
          <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="profile.fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  error={!!(errors as any)?.profile?.fullName}
                  helperText={(errors as any)?.profile?.fullName?.message}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              )}
            />
          </EditableFieldWrapper>

          {/* Phone Number */}
          <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="profile.contactNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  error={!!(errors as any)?.profile?.contactNo}
                  helperText={(errors as any)?.profile?.contactNo?.message}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              )}
            />
          </EditableFieldWrapper>

          {/* Email - Non-editable */}
          <Controller
            name="profile.email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address"
                type="email"
                error={!!(errors as any)?.profile?.email}
                helperText={(errors as any)?.profile?.email?.message}
                disabled={true}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(0,0,0,0.03)',
                  },
                }}
              />
            )}
          />

          {/* Date of Birth */}
          {/* <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="verificationDetails.dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  error={!!(errors as any)?.verificationDetails?.dateOfBirth}
                  helperText={(errors as any)?.verificationDetails?.dateOfBirth?.message}
                  disabled={!isEditing}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRangeIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                />
              )}
            />
          </EditableFieldWrapper> */}

          {/* Gender */}
          <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="verificationDetails.gender"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Gender"
                  error={!!(errors as any)?.verificationDetails?.gender}
                  helperText={(errors as any)?.verificationDetails?.gender?.message}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <WcIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                      },
                    },
                  }}
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </EditableFieldWrapper>

          {/* Bio - Full Width */}
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
            <EditableFieldWrapper isEditing={isEditing}>
              <Controller
                name="profile.bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    error={!!(errors as any)?.profile?.bio}
                    helperText={(errors as any)?.profile?.bio?.message}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <DescriptionIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: theme.palette.primary.main,
                        },
                      },
                    }}
                  />
                )}
              />
            </EditableFieldWrapper>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};