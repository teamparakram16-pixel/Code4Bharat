import React from "react";
import { Card, Avatar, Box, Typography, Button } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { PrivateChatCardProps } from "./PrivateChatCard.types";

const PrivateChatCard: React.FC<PrivateChatCardProps> = ({
  chat,
  currUser,
  isMobile,
}) => {
  const navigate = useNavigate();
  const other = chat.participants.find((p) => p.user._id !== currUser);
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
      <Avatar
        src={other?.user.profile?.profileImage || ""}
        sx={{ width: 56, height: 56, mr: 2 }}
      >
        <PersonIcon />
      </Avatar>
      <Box flex={1} minWidth={0}>
        <Typography variant="h6" noWrap>
          {other?.user.profile?.fullName || "User"}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          Reason:{" "}
          {chat.chatRequest?.chatReason?.otherReason ||
          chat.chatRequest?.chatReason?.similarPrakrithi
            ? `Similar Prakrithi Match : ${chat.chatRequest?.users[0].similarPrakrithiPercenatge}%`
            : "-"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(chat.updatedAt).toLocaleString()}
        </Typography>
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

export default PrivateChatCard;
