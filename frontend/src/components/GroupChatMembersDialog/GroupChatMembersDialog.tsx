import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Avatar,
  Button,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { X as Close } from "lucide-react";
import { ReceivedChatRequest } from "@/pages/ReceivedChatRequest/ReceivedChatRequest.types";

interface GroupChatMembersDialogProps {
  open: boolean;
  onClose: () => void;
  request: ReceivedChatRequest;
}

const statusColor = (status: string) => {
  switch (status) {
    case "accepted":
      return "success";
    case "rejected":
      return "error";
    default:
      return "warning";
  }
};

const GroupChatMembersDialog: React.FC<GroupChatMembersDialogProps> = ({
  open,
  onClose,
  request,
}) => {
  if (!request) return null;
  const { groupName, chatReason, owner, users } = request;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pr: 1,
        }}
      >
        <Box>
          <Typography variant="h6">Group Members</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {groupName}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        {chatReason?.otherReason && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            Reason: {chatReason.otherReason}
          </Typography>
        )}
        {chatReason?.similarPrakrithi && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            Reason: Similar Prakrithi Match
          </Typography>
        )}
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Group Owner
        </Typography>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar
            src={owner?.profile?.profileImage || ""}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            {window.location.pathname.includes("/u/chat-requests/sent") ? (
              "You"
            ) : (
              <Typography variant="body1">{owner?.profile?.fullName}</Typography>
            )}

            <Chip label="Owner" color="primary" size="small" sx={{ ml: 1 }} />
          </Box>
        </Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Members
        </Typography>
        <Stack spacing={1}>
          {users.map((u) => (
            <Box key={u.user._id} display="flex" alignItems="center" gap={2}>
              <Avatar
                src={u.user.profile?.profileImage || ""}
                sx={{ width: 32, height: 32 }}
              />
              <Box flex={1}>
                <Typography variant="body2">
                  {u.user.profile?.fullName}
                </Typography>
              </Box>
              <Chip
                label={u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                color={statusColor(u.status)}
                size="small"
              />
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupChatMembersDialog;
