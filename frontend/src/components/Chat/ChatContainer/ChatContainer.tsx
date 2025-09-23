import React from "react";
import { Box } from "@mui/material";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatContainerProps from "./ChatContainer.types";

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  currUser,
  searchQuery = "",
  searchResults = [],
  currentSearchIndex = -1,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
      key={"conatiner"}
    >
      {messages.map((message) => {
        const isHighlighted = searchResults.some(searchMsg => searchMsg._id === message._id);
        const isCurrentSearch = searchResults[currentSearchIndex]?._id === message._id;
        
        return (
          <ChatMessage 
            key={message._id} 
            currUser={currUser} 
            message={message}
            isHighlighted={isHighlighted}
            isCurrentSearch={isCurrentSearch}
            searchQuery={searchQuery}
          />
        );
      })}
    </Box>
  );
};

export default ChatContainer;
