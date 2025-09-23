import React from "react";
import {
  Card,
  Avatar,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { GroupChatCardProps } from "./GroupChatCard.types";

const GroupChatCard: React.FC<GroupChatCardProps> = ({
  chat,
  isMobile,
  onViewMembers,
}) => {
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: 3,
        p: 2,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        gap: 2,
      }}
    >
      <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
        <GroupIcon />
      </Avatar>
      <Box flex={1} minWidth={0}>
        <Typography variant="h6" noWrap>
          {chat.groupChatName || "Group Chat"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Reason:{" "}
          {chat.chatRequest?.chatReason?.otherReason ||
          chat.chatRequest?.chatReason?.similarPrakrithi
            ? "Similar Prakrithi Match"
            : "-"}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <Chip
            label={`Owner: ${
              chat.owner?.profile?.fullName || "-"
            }`}
            color="primary"
            size="small"
          />
          <IconButton
            color="secondary"
            onClick={() => onViewMembers(chat.chatRequest)}
            size="small"
            sx={{ ml: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          <Typography variant="caption" color="text.secondary" ml={2}>
            Created: {new Date(chat.updatedAt).toLocaleString()}
          </Typography>
        </Stack>
        {chat.latestMessage && (
          <Typography variant="body2" color="text.primary" mt={1} noWrap>
            <b>Latest:</b> {chat.latestMessage.content}
          </Typography>
        )}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/chats/${chat._id}`)}
        sx={{ mt: isMobile ? 2 : 0, minWidth: 120 }}
      >
        Chat
      </Button>
    </Card>
  );
};

export default GroupChatCard;
