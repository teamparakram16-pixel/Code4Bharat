import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import { Close, CheckCircle } from "@mui/icons-material";
import { UserOrExpertDetailsType } from "@/types";

export const VerifiersDialog = ({
  open,
  onClose,
  verifiers,
  postTitle,
}: {
  open: boolean;
  onClose: () => void;
  verifiers: Array<{
    expert: UserOrExpertDetailsType;
    date: Date | string;
    reason?: string;
  }>;
  postTitle: string;
}) => {


  // Determine if this is a rejection dialog (if any verifier has a reason)
  const isRejection = verifiers.length > 0 && verifiers[0].reason;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="subtitle1" color="text.secondary">
          Success Story : {postTitle}
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">
              {isRejection ? "Rejected By" : "Verified By"}
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ maxHeight: 400, overflow: "auto" }}>
          {verifiers.map((verifier) => (
            <Box
              key={verifier.expert._id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderLeft: isRejection
                  ? "4px solid #d32f2f"
                  : "4px solid #2e7d32",
                mb: 2,
                background: isRejection
                  ? "rgba(211,47,47,0.05)"
                  : "rgba(46,125,50,0.05)",
                "&:hover": {
                  backgroundColor: isRejection
                    ? "rgba(211,47,47,0.12)"
                    : "rgba(46,125,50,0.12)",
                  cursor: "pointer",
                },
              }}
              // onClick={() =>
              //   navigate(`/doctors/profile/${verifier.expert._id}`)
              // }
            >
              <Avatar
                src={verifier.expert.profile.profileImage}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box>
                <Typography variant="subtitle1">
                  Dr. {verifier.expert.profile.fullName}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {verifier.expert.profile.expertType}
                </Typography> */}
                <Typography variant="caption" color="text.secondary">
                  {verifier.date
                    ? `on ${new Date(verifier.date).toLocaleString()}`
                    : null}
                </Typography>
                {verifier.reason && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    Reason: {verifier.reason}
                  </Typography>
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              {verifier.reason ? (
                <Close color="error" />
              ) : (
                <CheckCircle color="success" />
              )}
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export const InvalidDialog = ({
  open,
  onClose,
  onConfirm,
  reason,
  setReason,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reason: string;
  setReason: (reason: string) => void;
  loading: boolean;
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Mark Post as Invalid</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Please provide a reason for marking this post as invalid:
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter reason (e.g., misleading information, inappropriate content, etc.)"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={!reason.trim() || loading}
        >
          Confirm Invalid
        </Button>
      </DialogActions>
    </Dialog>
  );
};
