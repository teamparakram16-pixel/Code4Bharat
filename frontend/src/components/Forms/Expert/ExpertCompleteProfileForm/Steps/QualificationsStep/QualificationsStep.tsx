import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  FormHelperText,
} from "@mui/material";
import { Controller, useFieldArray } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { QualificationsStepProps } from "./QualificationsStep.types";

const QualificationsStep: React.FC<QualificationsStepProps> = ({
  control,
  errors,
  trigger,
}) => {
  const theme = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualifications",
  });

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: theme.palette.primary.main }}
      >
        Educational Qualifications
      </Typography>

      <Card
        variant="outlined"
        sx={{
          p: 2,
          borderLeft: `4px solid ${theme.palette.primary.main}`,
        }}
      >
        <CardContent>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Qualification {index + 1}
                </Typography>
                {index > 0 && (
                  <IconButton
                    color="error"
                    onClick={() => remove(index)}
                    size="small"
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Box
                  sx={{ flexBasis: { xs: "100%", sm: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name={`qualifications.${index}.degree`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Degree"
                        placeholder="e.g., BAMS, MD Ayurveda"
                        error={!!errors.qualifications?.[index]?.degree}
                        helperText={
                          errors.qualifications?.[index]?.degree?.message
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger(field.name);
                        }}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Box>

                <Box
                  sx={{ flexBasis: { xs: "100%", sm: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name={`qualifications.${index}.college`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="College/University"
                        error={!!errors.qualifications?.[index]?.college}
                        helperText={
                          errors.qualifications?.[index]?.college?.message
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger(field.name);
                        }}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Box>

                <Box
                  sx={{ flexBasis: { xs: "100%", sm: "calc(33.33% - 8px)" } }}
                >
                  <Controller
                    name={`qualifications.${index}.year`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Year of Passing"
                        error={!!errors.qualifications?.[index]?.year}
                        helperText={
                          errors.qualifications?.[index]?.year?.message
                        }
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          trigger(field.name);
                        }}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Box>
              </Box>

              {index < fields.length - 1 && <Divider sx={{ my: 2 }} />}
            </React.Fragment>
          ))}

          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => append({ degree: "", college: "", year: "" })}
            sx={{ mt: 1 }}
            size="small"
          >
            Add Another Qualification
          </Button>
          {errors.qualifications &&
            typeof errors.qualifications.message === "string" && (
              <FormHelperText error>
                {errors.qualifications.message}
              </FormHelperText>
            )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default QualificationsStep;
