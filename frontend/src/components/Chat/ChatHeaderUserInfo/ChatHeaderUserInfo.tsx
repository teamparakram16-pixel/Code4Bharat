import React from "react";
import { Avatar, Box, Typography, IconButton, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { UserInfoProps } from "./ChatHeaderUserInfo.types";

const ChatHeaderUserInfo: React.FC<UserInfoProps> = ({
  users,
  groupName,
  owner,
}) => {
  const isGroup = groupName !== "" && owner && users.length >= 2; // since we are filtering out the currUser so >=2

  const allMembers = [...users];
  if (owner && !users.some((u) => u._id === owner._id)) {
    allMembers.push(owner);
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        width: "100%",
        overflowX: "auto",
      }}
    >
      <IconButton onClick={() => window.history.back()} sx={{ minWidth: 0 }}>
        <ArrowBackIcon />
      </IconButton>

      {!isGroup ? (
        <>
          <Avatar
            src={users[0]?.profile?.profileImage}
            alt={users[0]?.profile?.fullName}
            sx={{ width: 40, height: 40 }}
          />
          <Box>
            <Typography variant="subtitle1">
              {users[0]?.profile?.fullName}
            </Typography>
          </Box>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            overflowX: "auto",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 2 }}>
            {groupName}
          </Typography>
          {allMembers.map((user, idx) => {
            const isOwner = owner && user._id === owner._id;
            return (
              <Box
                key={user._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 2,
                  bgcolor: isOwner ? "primary.light" : "transparent",
                  borderRadius: 2,
                  px: 1,
                }}
              >
                <Avatar
                  src={user?.profile?.profileImage}
                  sx={{
                    width: 32,
                    height: 32,
                    mr: 1,
                    border: isOwner ? "2px solid #1976d2" : undefined,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 80,
                    fontWeight: isOwner ? 700 : 400,
                    color: isOwner ? "primary.main" : undefined,
                  }}
                >
                  {user?.profile?.fullName}
                </Typography>
                {isOwner && (
                  <Chip
                    label="Owner"
                    color="primary"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
                {idx < users.length - 1 && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mx: 1 }}
                  >
                    |
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default ChatHeaderUserInfo;
