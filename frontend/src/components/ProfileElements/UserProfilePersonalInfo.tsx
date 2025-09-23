import {
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  useTheme,
  InputAdornment,
  MenuItem,
  IconButton,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DateRangeIcon from '@mui/icons-material/DateRange';
import WcIcon from '@mui/icons-material/Wc';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import { Controller, Control, FieldErrors } from "react-hook-form";

interface UserProfilePersonalInfoProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  avatar: string | null;
  premiumInfo?: {
    premiumNo?: number;
    premiumOption?: any;
    validTill?: string;
  } | null;
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

export const UserProfilePersonalInfo = ({
  control,
  errors,
  isEditing,
  premiumInfo,
}: UserProfilePersonalInfoProps) => {
  const theme = useTheme();

  // Premium styling enhancements
  const isPremium = premiumInfo?.premiumNo && premiumInfo.premiumNo > 0;
  const premiumGlow = isPremium 
    ? {
        1: '0 0 20px rgba(30, 58, 138, 0.15)', // Dark blue
        2: '0 0 20px rgba(124, 58, 237, 0.15)', // Purple  
        3: '0 0 20px rgba(217, 119, 6, 0.15)', // Golden
      }[premiumInfo?.premiumNo || 1]
    : null;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: isPremium 
          ? `${theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)'}, ${premiumGlow}`
          : theme.palette.mode === 'dark' 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        background: isPremium
          ? theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)'
          : theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: isPremium 
          ? `2px solid ${theme.palette.primary.main}20`
          : `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': isPremium ? {
          boxShadow: `${theme.palette.mode === 'dark' 
            ? '0 12px 40px rgba(0, 0, 0, 0.4)' 
            : '0 12px 40px rgba(0, 0, 0, 0.15)'}, ${premiumGlow}`,
          transform: 'translateY(-2px)',
        } : {},
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontWeight: 600,
            color: isPremium ? theme.palette.primary.main : theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textShadow: isPremium ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          <PersonIcon sx={{ 
            color: isPremium ? theme.palette.primary.main : theme.palette.primary.main,
            filter: isPremium ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' : 'none',
          }} />
          Personal Information
          {isPremium && (
            <Box
              sx={{
                ml: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: theme.palette.primary.main,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Premium
            </Box>
          )}
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
          {/* Full Name - Editable */}
          <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  error={!!(errors as any)?.fullName}
                  helperText={(errors as any)?.fullName?.message}
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

          {/* Phone Number - Editable */}
          <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="contactNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone Number"
                  error={!!(errors as any)?.contactNo}
                  helperText={(errors as any)?.contactNo?.message}
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
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Email Address"
                type="email"
                error={!!(errors as any)?.email}
                helperText={(errors as any)?.email?.message}
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

          
          {/* Date of Birth - Editable */}
          {/* <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  error={!!(errors as any)?.dateOfBirth}
                  helperText={(errors as any)?.dateOfBirth?.message}
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


          {/* Gender - Editable */}
          <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  label="Gender"
                  error={!!(errors as any)?.gender}
                  helperText={(errors as any)?.gender?.message}
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

          {/* Age - Editable */}
          <EditableFieldWrapper isEditing={isEditing}>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  fullWidth
                  label="Age"
                  type="number"
                  error={!!(errors as any)?.age}
                  helperText={(errors as any)?.age?.message}
                  disabled={!isEditing}
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
          </EditableFieldWrapper>

          {/* Bio - Editable - Full Width */}
          <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
            <EditableFieldWrapper isEditing={isEditing}>
              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    error={!!(errors as any)?.bio}
                    helperText={(errors as any)?.bio?.message}
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