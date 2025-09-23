import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Chip,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import WorkIcon from "@mui/icons-material/Work";
import { ProfessionalDetailsStepProps } from "./ProfessionalDetailsStep.types";

const ProfessionalDetailsStep: React.FC<ProfessionalDetailsStepProps> = ({
  control,
  errors,
  councilOptions,
  specializationsOptions,
  languageOptions,
  handleSpecializationChange,
  handleLanguageChange,
  trigger,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: theme.palette.primary.main }}
      >
        Professional Details
      </Typography>

      <Card
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
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
            <WorkIcon color="primary" sx={{ mr: 1 }} /> Registration Information
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="ayushRegistrationNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="AYUSH Registration Number"
                    placeholder="e.g., UP/A-12345"
                    error={!!errors.ayushRegistrationNumber}
                    helperText={
                      errors.ayushRegistrationNumber?.message ||
                      "Format: StateCode/A-Number"
                    }
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      trigger("ayushRegistrationNumber");
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="registrationCouncil"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Registration Council"
                    error={!!errors.registrationCouncil}
                    helperText={errors.registrationCouncil?.message}
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      trigger("registrationCouncil");
                    }}
                  >
                    {councilOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Box>

            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="yearOfRegistration"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    label="Year of Registration"
                    error={!!errors.yearOfRegistration}
                    helperText={errors.yearOfRegistration?.message}
                    variant="outlined"
                    size="small"
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      trigger("yearOfRegistration");
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="yearsOfExperience"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Years of Experience"
                    type="number"
                    error={!!errors.yearsOfExperience}
                    helperText={errors.yearsOfExperience?.message}
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value) || 0);
                      trigger("yearsOfExperience");
                    }}
                    variant="outlined"
                    size="small"
                  />
                )}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          p: 2,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
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
            <WorkIcon color="primary" sx={{ mr: 1 }} /> Professional Expertise
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {/* Specializations Multi-Select */}
            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="specializations"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.specializations}
                    variant="outlined"
                    size="small"
                  >
                    <InputLabel id="specializations-label">
                      Specializations
                    </InputLabel>
                    <Select
                      labelId="specializations-label"
                      multiple
                      value={field.value || []}
                      onChange={(event) => {
                        const {
                          target: { value },
                        } = event;
                        const updatedValue =
                          typeof value === "string" ? value.split(",") : value;
                        field.onChange(updatedValue);
                        handleSpecializationChange(event);
                        trigger("specializations");
                      }}
                      input={<OutlinedInput label="Specializations" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {(selected as string[]).map((val) => (
                            <Chip key={val} label={val} />
                          ))}
                        </Box>
                      )}
                    >
                      {specializationsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.specializations?.message && (
                      <Typography color="error" variant="caption">
                        {errors.specializations.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Languages Multi-Select */}
            <Box sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <Controller
                name="languages"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.languages}
                    variant="outlined"
                    size="small"
                  >
                    <InputLabel id="languages-label">Languages</InputLabel>
                    <Select
                      labelId="languages-label"
                      multiple
                      value={field.value || []}
                      onChange={(event) => {
                        const {
                          target: { value },
                        } = event;
                        const updatedValue =
                          typeof value === "string" ? value.split(",") : value;
                        field.onChange(updatedValue);
                        handleLanguageChange(event);
                        trigger("languages");
                      }}
                      input={<OutlinedInput label="Languages" />}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                          }}
                        >
                          {(selected as string[]).map((val) => (
                            <Chip key={val} label={val} />
                          ))}
                        </Box>
                      )}
                    >
                      {languageOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.languages?.message && (
                      <Typography color="error" variant="caption">
                        {errors.languages.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfessionalDetailsStep;
