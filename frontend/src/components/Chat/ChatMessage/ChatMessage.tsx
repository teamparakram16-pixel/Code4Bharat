import React from "react";
import { Paper, Typography, Box, Avatar, useTheme } from "@mui/material";
import { format } from "date-fns";
import { ChatMessageProps } from "./ChatMessage.types";

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  currUser, 
  isHighlighted = false,
  isCurrentSearch = false,
  searchQuery = ""
}) => {
  const isUser = message.sender._id === currUser?._id;
  const theme = useTheme();

  // Function to highlight search text
  const highlightSearchText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (regex.test(part)) {
        return (
          <Box
            key={index}
            component="span"
            sx={{
              backgroundColor: isCurrentSearch 
                ? theme.palette.warning.main 
                : theme.palette.primary.light,
              color: isCurrentSearch 
                ? theme.palette.warning.contrastText 
                : theme.palette.primary.contrastText,
              padding: "2px 4px",
              borderRadius: "4px",
              fontWeight: 600,
            }}
          >
            {part}
          </Box>
        );
      }
      return part;
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        mb: 2,
        width: "100%",
      }}
      key={message._id}
      data-message-id={message._id}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 0.5,
          flexDirection: isUser ? "row-reverse" : "row",
          gap: 1,
        }}
      >
        <Avatar
          src={message.sender.profile?.profileImage}
          sx={{ width: 28, height: 28 }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 600,
            color: isUser ? "primary.main" : "text.secondary",
          }}
        >
          {message.sender.profile.fullName}
        </Typography>
      </Box>
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: "70%",
          backgroundColor: isUser ? "primary.main" : "background.paper",
          color: isUser ? "primary.contrastText" : "text.primary",
          borderRadius: 2,
          border: isHighlighted 
            ? `2px solid ${isCurrentSearch ? theme.palette.warning.main : theme.palette.primary.light}` 
            : "none",
          boxShadow: isCurrentSearch 
            ? `0 0 10px ${theme.palette.warning.main}40` 
            : isHighlighted 
              ? `0 0 8px ${theme.palette.primary.light}30` 
              : 1,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Typography variant="body1">
          {searchQuery ? highlightSearchText(message.content, searchQuery) : message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            opacity: 0.7,
          }}
        >
          {format(message.createdAt, "HH:mm")}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;
