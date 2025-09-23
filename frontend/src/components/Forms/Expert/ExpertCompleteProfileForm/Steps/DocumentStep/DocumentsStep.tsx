import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormHelperText,
  FormControl,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useTheme } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DocumentsStepProps } from "./DocumentStep.types";
import { documentFields } from "@/constants/expertCompleteProfile";

const DocumentsStep: React.FC<DocumentsStepProps> = ({
  control,
  errors,
  trigger,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, color: theme.palette.primary.main }}
      >
        Required Documents
      </Typography>

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
            <ArticleIcon color="primary" sx={{ mr: 1 }} /> Verification
            Documents
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Please upload the following documents in PDF or image format (JPG,
            PNG). Each document should be clear and legible.
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {documentFields.map((field) => (
              <Box
                key={field.name}
                sx={{ flexBasis: { xs: "100%", sm: "calc(50% - 8px)" } }}
              >
                <FormControl error={!!errors[field.name]} fullWidth>
                  <Controller
                    name={field.name}
                    control={control}
                    render={({ field: { onChange, value, ...fieldProps } }) => (
                      <>
                        <Button
                          variant="outlined"
                          component="label"
                          fullWidth
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            height: "56px",
                            borderColor: errors[field.name]
                              ? theme.palette.error.main
                              : undefined,
                          }}
                        >
                          {(value as File)?.name || `Upload ${field.label}*`}
                          <input
                            type="file"
                            hidden
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              onChange(e.target.files?.[0] || null);
                              trigger(field.name);
                            }}
                            {...fieldProps}
                          />
                        </Button>
                        {errors[field.name] && (
                          <FormHelperText>
                            {errors[field.name]?.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </FormControl>
              </Box>
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            * Required documents
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DocumentsStep;
