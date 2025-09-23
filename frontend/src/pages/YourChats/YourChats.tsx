import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Skeleton,
  useMediaQuery,
  useTheme,
  Paper,
  Chip,
} from "@mui/material";
import { People as PeopleIcon, Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useChat from "@/hooks/useChat/useChat";
import GroupChatMembersDialog from "@/components/GroupChatMembersDialog/GroupChatMembersDialog";
import PrivateChatCard from "@/components/PrivateChatCard/PrivateChatCard";
import GroupChatCard from "@/components/GroupChatCard/GroupChatCard";
import { ReceivedChatRequest } from "../ReceivedChatRequest/ReceivedChatRequest.types";
import { IChat } from "./YourChats.types";

const YourChats: React.FC = () => {
  const { getMyChats } = useChat();
  const [chats, setChats] = useState<IChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroupRequest, setSelectedGroupRequest] =
    useState<ReceivedChatRequest | null>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [currUser, setCurrUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await getMyChats();
        setChats(res?.chats || []);
        setCurrUser(res?.currUser || null);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
    // eslint-disable-next-line
  }, []);

  const handleViewMembers = (chatRequest: ReceivedChatRequest) => {
    setSelectedGroupRequest(chatRequest);
    setGroupDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setGroupDialogOpen(false);
    setSelectedGroupRequest(null);
  };

  const filteredChats = chats.filter((chat) =>
    chat.groupChat
      ? chat.groupChatName.toLowerCase().includes(searchQuery.toLowerCase())
      : chat.participants.some(
          (p) =>
            p.user.profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            p.user._id !== currUser
        )
  );

  const handleCreateNewChat = () => {
    navigate("/chats/new");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        px: { xs: 1, sm: 3, md: 6 },
        bgcolor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          p: isMobile ? 1.5 : 2,
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1200,
            mx: "auto",
            width: "100%",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              color: theme.palette.primary.main,
              fontSize: isMobile ? "1.25rem" : "1.5rem",
            }}
          >
            Your Conversations
          </Typography>
          {/* <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="New chat">
              <IconButton
                onClick={handleCreateNewChat}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box> */}
        </Box>
      </Paper>

      {/* Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 1 : 2,
          mx: "auto",
          width: "100%",
          maxWidth: 1200,
          bgcolor: "transparent",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            px: 2,
            py: 1,
            boxShadow: theme.shadows[1],
          }}
        >
          <SearchIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              background: "transparent",
              fontSize: "0.875rem",
              color: theme.palette.text.primary,
            }}
          />
        </Box>
      </Paper>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: isMobile ? 1 : 3,
          py: 2,
          mx: "auto",
          width: "100%",
          maxWidth: 1200,
        }}
      >
        {loading ? (
          <Stack spacing={2}>
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={80}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>
        ) : filteredChats.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60%",
              textAlign: "center",
            }}
          >
            <PeopleIcon
              sx={{
                fontSize: 64,
                color: theme.palette.text.disabled,
                mb: 2,
              }}
            />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              {searchQuery ? "No matching chats found" : "No chats yet"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, maxWidth: 400 }}
            >
              {searchQuery
                ? "Try a different search term"
                : "Start a new conversation by clicking the + button"}
            </Typography>
            {!searchQuery && (
              <Chip
                label="Create new chat"
                onClick={handleCreateNewChat}
                color="primary"
                icon={<AddIcon />}
                sx={{ borderRadius: 2 }}
              />
            )}
          </Box>
        ) : (
          <Stack spacing={2}>
            {filteredChats.map((chat) =>
              chat.groupChat ? (
                <GroupChatCard
                  key={chat._id}
                  chat={chat}
                  isMobile={isMobile}
                  onViewMembers={handleViewMembers}
                />
              ) : (
                currUser && (
                  <PrivateChatCard
                    key={chat._id}
                    chat={chat}
                    currUser={currUser}
                    isMobile={isMobile}
                  />
                )
              )
            )}
          </Stack>
        )}
      </Box>

      <GroupChatMembersDialog
        open={groupDialogOpen}
        onClose={handleCloseDialog}
        request={selectedGroupRequest as any}
      />
    </Box>
  );
};

export default YourChats;