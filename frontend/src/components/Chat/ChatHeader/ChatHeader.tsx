import React from "react";
import { AppBar, Box } from "@mui/material";
import ChatHeaderUserInfo from "../ChatHeaderUserInfo/ChatHeaderUserInfo";
import { ChatHeaderProps } from "./ChatHeader.types";

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  users,
  groupName,
  owner,
}) => {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
        }}
      >
        <ChatHeaderUserInfo users={users} groupName={groupName} owner={owner} />
        {/* <ChatActions /> */}
      </Box>
    </AppBar>
  );
};
