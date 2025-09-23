import React from "react";
import { Box, IconButton } from "@mui/material";
import { Phone, Video, MoreVertical } from "lucide-react";

export const ChatActions: React.FC = () => {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton size="small">
        <Phone size={20} />
      </IconButton>
      <IconButton size="small">
        <Video size={20} />
      </IconButton>
      <IconButton size="small">
        <MoreVertical size={20} />
      </IconButton>
    </Box>
  );
};
