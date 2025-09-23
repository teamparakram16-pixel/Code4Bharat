import React from "react";
import { useFormContext } from "react-hook-form";
import {
  Box,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FormSectionHeader } from "./FormSectionHeader";

export const PersonalInfoSection: React.FC = () => {
  const { register, formState, watch, setValue } = useFormContext();

  return (
    <Box sx={{ mb: 4 }}>
      <FormSectionHeader
        title="Personal Information"
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            error={!!formState.errors.fullName}
            helperText={formState.errors.fullName?.message?.toString()}
            {...register("fullName")}
            placeholder="As per your government ID"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth error={!!formState.errors.gender}>
            <InputLabel>Gender</InputLabel>
            <Select
              label="Gender"
              {...register("gender")}
              defaultValue=""
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            {formState.errors.gender && (
              <Typography color="error" variant="body2">
                {formState.errors.gender.message?.toString()}
              </Typography>
            )}
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date of Birth"
              value={watch("dateOfBirth")}
              onChange={(date) => setValue("dateOfBirth", date as Date)}
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!formState.errors.dateOfBirth,
                  helperText: formState.errors.dateOfBirth?.message?.toString(),
                },
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            type="tel"
            error={!!formState.errors.contactNo}
            helperText={formState.errors.contactNo?.message?.toString()}
            {...register("contactNo")}
            placeholder="Enter 10-digit mobile number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+91</InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Email (Optional)"
          variant="outlined"
          type="email"
          error={!!formState.errors.email}
          helperText={formState.errors.email?.message?.toString()}
          {...register("email")}
          placeholder="example@email.com"
        />
      </Box>
    </Box>
  );
};