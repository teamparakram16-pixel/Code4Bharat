import { Button, IconButton, Stack, useTheme, CircularProgress } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface ProfileEditButtonProps {
  isEditing: boolean;
  isSaving?: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
}

export const ProfileEditButton = ({ 
  isEditing, 
  isSaving = false,
  onSave, 
  onCancel, 
  onEdit 
}: ProfileEditButtonProps) => {
  const theme = useTheme();

  return isEditing ? (
    <Stack direction="row" spacing={2}>
      <Button
        variant="contained"
        color="primary"
        onClick={onSave}
        disabled={isSaving}
        startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
        sx={{
          px: 3,
          py: 1,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600
        }}
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
      <Button
        variant="outlined"
        onClick={onCancel}
        disabled={isSaving}
        startIcon={<CancelIcon />}
        sx={{
          px: 3,
          py: 1,
          borderRadius: 2,
          textTransform: 'none',
          borderColor: theme.palette.divider,
          '&:hover': {
            borderColor: theme.palette.error.main,
            color: theme.palette.error.main
          }
        }}
      >
        Cancel
      </Button>
    </Stack>
  ) : (
    <IconButton 
      onClick={onEdit} 
      color="primary"
      sx={{
        borderRadius: 2,
        background: theme.palette.action.hover,
        '&:hover': {
          background: theme.palette.primary.light
        }
      }}
    >
      <EditIcon />
    </IconButton>
  );
};