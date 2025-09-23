import {
  Card,
  CardContent,
  Typography,
  Button,
  FormHelperText,
  Stack,
  useTheme
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ProfileDocumentsProps {
  isEditing: boolean;
  fieldName: string;
  label: string;
  description?: string;
  accept?: string;
}

export const ProfileDocuments = ({
  isEditing,
  label,
  description,
  accept = ".pdf,.jpg,.jpeg,.png"
}: ProfileDocumentsProps) => {
  const theme = useTheme();

  // Mock uploaded file name
  const uploadedFile = "document.pdf";
  const error = false;

  return (
    <Card variant="outlined" sx={{
      mb: 3,
      borderRadius: 2,
      borderColor: theme.palette.divider,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: theme.shadows[2]
      }
    }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1" sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <DescriptionIcon fontSize="small" /> {label}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              disabled={!isEditing}
            >
              Upload
              <input type="file" hidden accept={accept} />
            </Button>
            <CheckCircleIcon color="success" />
            <Typography variant="body2">{uploadedFile}</Typography>
          </Stack>
          {error && (
            <FormHelperText error>Document required</FormHelperText>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};