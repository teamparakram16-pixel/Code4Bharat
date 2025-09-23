import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  useTheme,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import BadgeIcon from "@mui/icons-material/Badge";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import { Control,FieldErrors } from "react-hook-form";
import { useState } from "react";

interface ExpertProfileDocumentsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  isEditing: boolean;
}


export const ExpertProfileDocuments = ({ control }: ExpertProfileDocumentsProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  const documentCards = [
    {
      name: "verificationDetails.documents.identityProof",
      title: "Identity Proof",
      description: "(Aadhaar/Passport/Driving License/PAN)",
    },
    {
      name: "verificationDetails.documents.degreeCertificate",
      title: "Degree Certificate",
      description: "(BAMS/MD)",
    },
    {
      name: "verificationDetails.documents.registrationProof",
      title: "AYUSH Registration Certificate",
      description: "",
    },
    {
      name: "verificationDetails.documents.practiceProof",
      title: "Practice Proof (Optional)",
      description: "",
    },
  ];

  const getValueByPath = (obj: any, path: string) =>
    path.split(".").reduce((acc, part) => acc?.[part], obj);

  const handleView = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPreviewUrl(null);
  };

  const isPDF = (url: string) => url?.toLowerCase().endsWith(".pdf");

  return (
    <>
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600, color: theme.palette.text.primary }}>
          <BadgeIcon sx={{ mr: 1 }} /> Documents
        </Typography>
        <Stack spacing={3}>
          {documentCards.map((doc) => {
            const uploadedFileUrl = getValueByPath(control._formValues, doc.name);

            return (
              <Card
                key={doc.name}
                variant="outlined"
                sx={{ borderRadius: 3, borderColor: theme.palette.divider }}
              >
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                    {doc.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {doc.description}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    {uploadedFileUrl ? (
                      <>
                        <CheckCircleIcon sx={{ color: "green" }} />
                        <Tooltip title="View Document">
                          <IconButton
                            onClick={() => handleView(uploadedFileUrl, doc.title)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <CloseIcon sx={{ color: "red" }} />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{previewTitle}</DialogTitle>
        <DialogContent dividers sx={{ height: "70vh" }}>
          {previewUrl && isPDF(previewUrl) ? (
            <iframe
              src={previewUrl}
              title={previewTitle}
              width="100%"
              height="100%"
              style={{ border: "none" }}
            />
          ) : (
            <Box
              component="img"
              src={previewUrl || ""}
              alt={previewTitle}
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
