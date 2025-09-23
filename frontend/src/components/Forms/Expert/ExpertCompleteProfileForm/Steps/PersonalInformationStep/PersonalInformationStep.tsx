import React from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  useTheme,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Person as PersonIcon,
  Home as HomeIcon,
  Phone as PhoneIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import { PersonalInformationStepProps } from "./PersonalInformationStep.types";

const PersonalInformationStep: React.FC<PersonalInformationStepProps> = ({
  control,
  errors,
  defaultDate = new Date(1990, 0, 1),
  trigger,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: theme.palette.primary.main }}
      >
        Personal Information
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Basic Details Card */}
        <Box>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              height: "100%",
            }}
          >
            <CardContent>
              {" "}
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                <PersonIcon color="primary" sx={{ mr: 1 }} /> Basic Details
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box
                  sx={{ flexBasis: { xs: "100%", md: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name="expertType"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Expert Type"
                        error={!!errors.expertType}
                        helperText={errors.expertType?.message}
                        size="small"
                        variant="outlined"
                      >
                        <MenuItem value="ayurvedic">Ayurvedic</MenuItem>
                        <MenuItem value="naturopathy">Naturopathy</MenuItem>
                      </TextField>
                    )}
                  />
                </Box>
                <Box
                  sx={{ flexBasis: { xs: "100%", md: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        label="Date of Birth"
                        value={field.value ?? defaultDate}
                        onChange={(date) => {
                          field.onChange(date);
                          trigger("dateOfBirth");
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: !!errors.dateOfBirth,
                            helperText: errors.dateOfBirth?.message,
                            size: "small",
                            variant: "outlined",
                            InputProps: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <DateRangeIcon color="primary" />
                                </InputAdornment>
                              ),
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Box
                  sx={{ flexBasis: { xs: "100%", md: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Gender"
                        error={!!errors.gender}
                        helperText={errors.gender?.message}
                        size="small"
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger("gender");
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      >
                        <MenuItem value="">Select Gender</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="prefer-not-to-say">
                          Prefer not to say
                        </MenuItem>
                      </TextField>
                    )}
                  />
                </Box>

                <Box
                  sx={{ flexBasis: { xs: "100%", md: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name="mobileNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Mobile Number"
                        type="number"
                        error={!!errors.mobileNumber}
                        helperText={errors.mobileNumber?.message}
                        size="small"
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger("mobileNumber");
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PhoneIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Address Details Card */}
        <Box>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                <HomeIcon color="primary" sx={{ mr: 1 }} /> Address Details
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flexBasis: "100%" }}>
                  <Controller
                    name="street"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Street Address"
                        error={!!errors.street}
                        helperText={errors.street?.message}
                        size="small"
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger("street");
                        }}
                      />
                    )}
                  />
                </Box>
                <Box
                  sx={{ flexBasis: { xs: "100%", md: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="City"
                        error={!!errors.city}
                        helperText={errors.city?.message}
                        size="small"
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger("city");
                        }}
                      />
                    )}
                  />
                </Box>
                <Box
                  sx={{ flexBasis: { xs: "100%", md: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="State"
                        error={!!errors.state}
                        helperText={errors.state?.message}
                        size="small"
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger("state");
                        }}
                      />
                    )}
                  />
                </Box>
                <Box
                  sx={{ flexBasis: { xs: "100%", md: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name="pinCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="PIN Code"
                        error={!!errors.pinCode}
                        helperText={errors.pinCode?.message}
                        size="small"
                        variant="outlined"
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger("pinCode");
                        }}
                      />
                    )}
                  />
                </Box>{" "}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Bio Section */}
        <Box>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                <PersonIcon color="primary" sx={{ mr: 1 }} /> Professional Bio
              </Typography>

              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={4}
                    label="Bio"
                    placeholder="Tell us about your practice, specialties, and approach to patient care..."
                    error={!!errors.bio}
                    helperText={
                      errors.bio?.message ||
                      `${field.value?.length || 0}/500 characters`
                    }
                    inputProps={{ maxLength: 500 }}
                    size="small"
                    variant="outlined"
                  />
                )}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonalInformationStep;
