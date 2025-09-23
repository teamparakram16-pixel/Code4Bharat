import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  styled,
} from "@mui/material";
import { Close, NavigateBefore, NavigateNext } from "@mui/icons-material";
import React from "react";
import { MediaViewerDialogProps } from "./MediaViewerDialog.types";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    maxHeight: "90vh",
    maxWidth: "90vw",
    borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : 16,
    overflow: "hidden",
    backgroundColor: theme.palette.grey[900],
  },
}));

const NavigationButton = styled(IconButton)({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  zIndex: 1,
});

const MediaContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  maxHeight: "80vh",
  overflow: "hidden",
});

// Styled components for media elements
const StyledImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  width: 'auto',
  height: 'auto',
});

const MediaViewerDialog: React.FC<MediaViewerDialogProps> = ({
  open,
  images,
  selectedImageIndex,
  onClose,
}) => {
  // Reset currentIndex when either selectedImageIndex or images changes
  const [currentIndex, setCurrentIndex] = React.useState<number>(selectedImageIndex);

  React.useEffect(() => {
    setCurrentIndex(selectedImageIndex);
  }, [selectedImageIndex, images]);

  if (!images || images.length === 0) return null;

  const currentMedia = images[currentIndex];
  // Only image support for now (as per type)

  const handleNext = () => {
    setCurrentIndex((prev: number) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev: number) => (prev - 1 + images.length) % images.length);
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "white",
          py: 1,
          px: 2,
        }}
      >
        <Typography variant="body1">
          {currentIndex + 1} / {images.length}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "black",
          p: 0,
          overflow: "hidden",
          minHeight: "50vh",
          minWidth: "50vw",
        }}
      >
        {images.length > 1 && (
          <>
            <NavigationButton
              onClick={handlePrev}
              sx={{ left: 16 }}
              aria-label="Previous media"
            >
              <NavigateBefore fontSize="large" />
            </NavigationButton>
            <NavigationButton
              onClick={handleNext}
              sx={{ right: 16 }}
              aria-label="Next media"
            >
              <NavigateNext fontSize="large" />
            </NavigationButton>
          </>
        )}

        <MediaContainer>
          <StyledImage
            src={currentMedia}
            alt={`Media ${currentIndex + 1}`}
          />
        </MediaContainer>
      </DialogContent>
    </StyledDialog>
  );
};

export default MediaViewerDialog;