import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  useTheme,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
  Popper,
  Paper,
  ClickAwayListener,
  Fade,
  Chip,
  TextField,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  Mood as MoodIcon,
  Send as SendIcon,
  Close as CloseIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";

import ChatContainer from "@/components/Chat/ChatContainer/ChatContainer";
import VoiceToText from "@/components/VoiceToText/VoiceToText";
import useChat from "@/hooks/useChat/useChat";
import useSocket from "@/hooks/useSocket/useSocket";
import { UserOrExpertDetailsType } from "@/types";
import { Message } from "@/types/Message.types";

// Emoji data
const emojis = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩",
  "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣",
  "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬",
  "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗",
  "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯",
  "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐",
  "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈",
  "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉",
  "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
  "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️"
];

const ChatPage = () => {
  const { id } = useParams();
  const { fetchChatMessages } = useChat();
  const navigate = useNavigate();
  const theme = useTheme();

  const [chatUsers, setChatUsers] = useState<UserOrExpertDetailsType[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currUser, setCurrUser] = useState<UserOrExpertDetailsType | null>(
    null
  );
  const [groupName, setGroupName] = useState<string>("");
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState<null | HTMLElement>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { socketConnected, onNewMessage, sendMessage } = useSocket(
    id || "",
    currUser
  );

  useEffect(() => {
    const initializeChat = async () => {
      try {
        if (!id) {
          toast.error("Chat ID is missing");
          navigate("/u/chats");
          return;
        }

        const response = await fetchChatMessages(id);
     

        const participants = response.chatInfo.participants.filter(
          (participant: any) => participant.user._id !== response.currUser._id
        );
        const chatUsers = participants.map((participant: any) => ({
          _id: participant.user._id,
          profile: {
            fullName: participant.user.profile.fullName,
            profileImage: participant.user.profile.profileImage,
          },
        }));

        setGroupName(response.chatInfo.groupChatName || "");
        setChatUsers(chatUsers);
        setMessages(response.messages);
        setCurrUser(response.currUser);
      } catch (error: any) {
        if (error.status === 401) navigate("/auth");
        else if (error.status === 404) navigate("/");
        else toast.error("Failed to load chat");
      }
    };

    initializeChat();
  }, [id]);

  useEffect(() => {
    const removeListener = onNewMessage((newMessage: Message) => {

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      removeListener();
    };
  }, [onNewMessage]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when user is typing (multiline messages)
  useEffect(() => {
    if (inputMessage && inputMessage.includes('\n')) {
      scrollToBottom();
    }
  }, [inputMessage]);

  // Smooth scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
      });
    }
  };

  // Force scroll to bottom (for instant scroll)
  const forceScrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && id && currUser) {
      sendMessage(inputMessage);
      setInputMessage("");
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Auto-scroll to bottom after sending message
      setTimeout(() => forceScrollToBottom(), 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputMessage(value);
    
    // Handle typing indicator
    if (value.trim() && !isTyping) {
      setIsTyping(true);
      // Emit typing start event (you can add socket emit here)
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Emit typing stop event (you can add socket emit here)
    }, 1000);
  };

  const handleEmojiClick = (emoji: string) => {
    const newMessage = inputMessage + emoji;
    setInputMessage(newMessage);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleEmojiToggle = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchor(showEmojiPicker ? null : event.currentTarget);
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputMessage(transcript);
  };

  // Search functionality
  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      // Focus search input when opening
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      // Clear search when closing
      setSearchQuery("");
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      // Filter messages that contain the search query
      const results = messages.filter(message =>
        message.content.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  };

  const handleSearchNavigation = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex = currentSearchIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex <= 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }
    
    setCurrentSearchIndex(newIndex);
    
    // Scroll to the message
    const targetMessage = searchResults[newIndex];
    if (targetMessage && chatContainerRef.current) {
      // Find the message element and scroll to it
      const messageElement = document.querySelector(`[data-message-id="${targetMessage._id}"]`);
      if (messageElement) {
        messageElement.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      }
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        handleSearchNavigation('prev');
      } else {
        handleSearchNavigation('next');
      }
    } else if (e.key === 'Escape') {
      handleSearchToggle();
    }
  };

  // Get chat display name
  const getChatDisplayName = () => {
    if (groupName) {
      return groupName;
    }
    if (chatUsers.length === 1) {
      return chatUsers[0]?.profile.fullName;
    }
    if (chatUsers.length > 1) {
      return `${chatUsers[0]?.profile.fullName} and ${chatUsers.length - 1} others`;
    }
    return "Chat";
  };

  // Get online status
  const getOnlineStatus = () => {
    if (groupName) {
      const onlineCount = chatUsers.filter(() => socketConnected).length;
      return `${onlineCount} members online`;
    }
    return socketConnected ? "online" : "last seen recently";
  };

  // Professional Chat Interface Layout
  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#f5f7fa",
        display: "flex",
        flexDirection: "column",
        pt: "18px", // Minimal gap - exactly navbar height
        position: "relative",
        mb: 0, // No bottom margin needed as footer will flow naturally
      }}
    >
      {/* Professional Chat Header with Glass Effect */}
      <Box
        sx={{
          position: "sticky",
          top: 0, // Stick at the top of the container (which already accounts for navbar)
          zIndex: 100,
          bgcolor: theme.palette.mode === "dark" 
            ? "rgba(26, 26, 26, 0.95)" 
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderBottom: `1px solid ${
            theme.palette.mode === "dark" 
              ? "rgba(255, 255, 255, 0.1)" 
              : "rgba(0, 0, 0, 0.08)"
          }`,
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 2, sm: 2.5 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: theme.palette.mode === "dark" 
            ? "0 1px 20px rgba(0, 0, 0, 0.5)" 
            : "0 1px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          height: "72px",
        }}
      >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 2, sm: 3 }, flex: 1 }}>
            <IconButton
              onClick={() => navigate("/u/chats")}
              sx={{ 
                display: { xs: "flex", md: "none" },
                p: 1.5,
                bgcolor: "transparent",
                color: theme.palette.text.primary,
                "&:hover": {
                  bgcolor: theme.palette.mode === "dark" 
                    ? "rgba(255, 255, 255, 0.1)" 
                    : "rgba(0, 0, 0, 0.05)",
                  transform: "scale(1.08)",
                },
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: 2,
              }}
            >
              <ArrowBackIcon fontSize="medium" />
            </IconButton>

            {/* Enhanced Avatar with Status Indicator */}
            {chatUsers.length > 0 && (
              <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Avatar
                  src={chatUsers[0]?.profile.profileImage}
                  alt={chatUsers[0]?.profile.fullName}
                  sx={{ 
                    width: { xs: 44, sm: 52 }, 
                    height: { xs: 44, sm: 52 },
                    border: `3px solid ${theme.palette.primary.main}`,
                    boxShadow: theme.palette.mode === "dark" 
                      ? "0 4px 12px rgba(0, 0, 0, 0.5)" 
                      : "0 4px 12px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: theme.palette.mode === "dark" 
                        ? "0 6px 16px rgba(0, 0, 0, 0.6)" 
                        : "0 6px 16px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                />
                {/* Online Status Indicator */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 2,
                    right: 2,
                    width: 12,
                    height: 12,
                    bgcolor: socketConnected ? "#4ade80" : "#94a3b8",
                    borderRadius: "50%",
                    border: `2px solid ${theme.palette.background.paper}`,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  }}
                />
              </Box>
            )}

            <Box sx={{ flex: 1, minWidth: 0, ml: 1 }}>
              <Typography 
                variant="h6" 
                fontWeight={700}
                sx={{ 
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  color: theme.palette.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {getChatDisplayName()}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                {typingUsers.length > 0 ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.3,
                        alignItems: "center",
                      }}
                    >
                      {[1, 2, 3].map((dot) => (
                        <Box
                          key={dot}
                          sx={{
                            width: 4,
                            height: 4,
                            bgcolor: theme.palette.primary.main,
                            borderRadius: "50%",
                            animation: "pulse 1.4s ease-in-out infinite",
                            animationDelay: `${dot * 0.2}s`,
                            "@keyframes pulse": {
                              "0%, 80%, 100%": {
                                transform: "scale(0)",
                                opacity: 0.5,
                              },
                              "40%": {
                                transform: "scale(1)",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                    <Typography 
                      variant="caption" 
                      color="primary.main"
                      fontWeight={500}
                      sx={{ 
                        fontSize: { xs: "0.75rem", sm: "0.8rem" },
                        fontStyle: "italic",
                      }}
                    >
                      {`${typingUsers.join(", ")} ${typingUsers.length === 1 ? "is" : "are"} typing...`}
                    </Typography>
                  </Box>
                ) : (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    fontWeight={500}
                    sx={{ 
                      fontSize: { xs: "0.75rem", sm: "0.8rem" },
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: socketConnected ? "#4ade80" : "#94a3b8",
                        borderRadius: "50%",
                        boxShadow: socketConnected ? "0 0 6px rgba(74, 222, 128, 0.6)" : "none",
                      }}
                    />
                    {getOnlineStatus()}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Search in chat" arrow>
              <IconButton
                onClick={handleSearchToggle}
                sx={{
                  p: 1.5,
                  bgcolor: showSearch ? `${theme.palette.primary.main}15` : "transparent",
                  color: showSearch ? theme.palette.primary.main : theme.palette.text.secondary,
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.1)" 
                      : "rgba(0, 0, 0, 0.05)",
                    color: theme.palette.primary.main,
                    transform: "scale(1.08)",
                  },
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: 2,
                }}
              >
                <SearchIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Chat info" arrow>
              <IconButton
                sx={{
                  p: 1.5,
                  bgcolor: "transparent",
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.1)" 
                      : "rgba(0, 0, 0, 0.05)",
                    color: theme.palette.primary.main,
                    transform: "scale(1.08)",
                  },
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: 2,
                }}
              >
                <InfoIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
            <Tooltip title="More options" arrow>
              <IconButton
                sx={{
                  p: 1.5,
                  bgcolor: "transparent",
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    bgcolor: theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.1)" 
                      : "rgba(0, 0, 0, 0.05)",
                    color: theme.palette.primary.main,
                    transform: "scale(1.08)",
                  },
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: 2,
                }}
              >
                <MoreVertIcon fontSize="medium" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Search Bar */}
        {showSearch && (
          <Box
            sx={{
              position: "sticky",
              top: "72px", // Position below the header
              zIndex: 99,
              bgcolor: theme.palette.mode === "dark" 
                ? "rgba(26, 26, 26, 0.95)" 
                : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px) saturate(180%)",
              borderBottom: `1px solid ${
                theme.palette.mode === "dark" 
                  ? "rgba(255, 255, 255, 0.1)" 
                  : "rgba(0, 0, 0, 0.08)"
              }`,
              px: { xs: 3, sm: 4, md: 6 },
              py: 2,
              boxShadow: theme.palette.mode === "dark" 
                ? "0 1px 20px rgba(0, 0, 0, 0.5)" 
                : "0 1px 20px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  flex: 1,
                  bgcolor: theme.palette.mode === "dark" 
                    ? "rgba(45, 45, 45, 0.8)" 
                    : "rgba(248, 250, 252, 0.9)",
                  borderRadius: 2,
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  border: `2px solid ${
                    theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.1)" 
                      : "rgba(0, 0, 0, 0.08)"
                  }`,
                  "&:focus-within": {
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <SearchIcon 
                  sx={{ 
                    mr: 1, 
                    color: theme.palette.text.secondary,
                    fontSize: "1.2rem",
                  }} 
                />
                <TextField
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyPress}
                  placeholder="Search messages..."
                  variant="standard"
                  fullWidth
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      fontSize: "0.95rem",
                      color: theme.palette.text.primary,
                      "& .MuiInputBase-input": {
                        padding: "4px 0",
                        "&::placeholder": {
                          color: theme.palette.mode === "dark" 
                            ? "rgba(255, 255, 255, 0.4)" 
                            : "rgba(0, 0, 0, 0.4)",
                          opacity: 1,
                        },
                      },
                    },
                  }}
                />
              </Box>
              
              {/* Search Results Counter and Navigation */}
              {searchResults.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: theme.palette.text.secondary,
                      fontSize: "0.8rem",
                      minWidth: "60px",
                      textAlign: "center",
                    }}
                  >
                    {currentSearchIndex + 1} of {searchResults.length}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleSearchNavigation('prev')}
                    disabled={searchResults.length === 0}
                    sx={{
                      p: 0.5,
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        bgcolor: theme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.1)" 
                          : "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <ArrowUpIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleSearchNavigation('next')}
                    disabled={searchResults.length === 0}
                    sx={{
                      p: 0.5,
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        bgcolor: theme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.1)" 
                          : "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <ArrowDownIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              
              <Tooltip title="Close search" arrow>
                <IconButton
                  onClick={handleSearchToggle}
                  size="small"
                  sx={{
                    p: 1,
                    color: theme.palette.text.secondary,
                    "&:hover": {
                      bgcolor: theme.palette.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.1)" 
                        : "rgba(0, 0, 0, 0.05)",
                      color: theme.palette.error.main,
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            
            {/* Search instructions */}
            <Typography 
              variant="caption" 
              sx={{ 
                display: "block",
                mt: 1,
                color: theme.palette.text.secondary,
                fontSize: "0.75rem",
                opacity: 0.8,
              }}
            >
              Press Enter to search next • Shift+Enter for previous • Esc to close
            </Typography>
          </Box>
        )}

        {/* Professional Chat Container */}
        <Box
          ref={chatContainerRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "transparent",
            backgroundImage: theme.palette.mode === "dark"
              ? `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.05) 0%, transparent 50%)`
              : `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.05) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.05) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.03) 0%, transparent 50%)`,
            minHeight: "60vh", // Use viewport height instead of complex calculation
            maxHeight: "70vh", // Ensure it doesn't grow too large
            "&::-webkit-scrollbar": {
              width: "4px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: theme.palette.mode === "dark" 
                ? "rgba(255, 255, 255, 0.2)" 
                : "rgba(0, 0, 0, 0.2)",
              borderRadius: "8px",
              "&:hover": {
                background: theme.palette.mode === "dark" 
                  ? "rgba(255, 255, 255, 0.3)" 
                  : "rgba(0, 0, 0, 0.3)",
              },
            },
            scrollBehavior: "smooth",
          }}
        >
          <Box 
            sx={{ 
              maxWidth: "100%", // Use full width instead of limiting to 1000px
              mx: "auto", 
              width: "100%",
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 2, sm: 3 },
            }}
          >
            <ChatContainer 
              messages={messages} 
              currUser={currUser}
              searchQuery={searchQuery}
              searchResults={searchResults}
              currentSearchIndex={currentSearchIndex}
            />
            {/* Messages end marker for auto-scroll */}
            <Box ref={messagesEndRef} sx={{ height: "1px" }} />
          </Box>
        </Box>

        {/* Professional Input Area with Glass Effect */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            bgcolor: theme.palette.mode === "dark" 
              ? "rgba(26, 26, 26, 0.95)" 
              : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderTop: `1px solid ${
              theme.palette.mode === "dark" 
                ? "rgba(255, 255, 255, 0.1)" 
                : "rgba(0, 0, 0, 0.08)"
            }`,
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1.5, sm: 2 },
            boxShadow: theme.palette.mode === "dark" 
              ? "0 -1px 20px rgba(0, 0, 0, 0.5)" 
              : "0 -1px 20px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 100,
            minHeight: "90px", // Consistent with bottom spacing
            maxHeight: "150px", // Allow for larger text input
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {/* Enhanced Typing Indicator */}
          {typingUsers.length > 0 && (
            <Box sx={{ 
              maxWidth: "100%", // Use full width instead of limiting to 1000px
              mx: "auto",
              px: { xs: 1, sm: 2 }, 
              py: 0.5,
              display: "flex",
              justifyContent: "flex-start",
              position: "absolute",
              top: "-32px",
              left: 0,
              right: 0,
            }}>
              <Chip
                label={`${typingUsers.join(", ")} ${typingUsers.length === 1 ? "is" : "are"} typing...`}
                size="small"
                sx={{
                  bgcolor: theme.palette.mode === "dark" 
                    ? "rgba(99, 102, 241, 0.2)" 
                    : "rgba(99, 102, 241, 0.1)",
                  color: theme.palette.mode === "dark" 
                    ? "#a5b4fc" 
                    : "#6366f1",
                  fontSize: "0.75rem",
                  height: "24px",
                  borderRadius: "12px",
                  fontWeight: 500,
                  border: `1px solid ${
                    theme.palette.mode === "dark" 
                      ? "rgba(99, 102, 241, 0.3)" 
                      : "rgba(99, 102, 241, 0.2)"
                  }`,
                  "& .MuiChip-label": {
                    px: 1.5,
                  },
                  animation: "pulse 2s ease-in-out infinite",
                  "@keyframes pulse": {
                    "0%, 100%": {
                      opacity: 1,
                    },
                    "50%": {
                      opacity: 0.7,
                    },
                  },
                }}
              />
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2 },
              maxWidth: "100%", // Use full width instead of limiting to 1000px
              mx: "auto",
              width: "100%",
            }}
          >
            {/* Professional Message Input Container */}
            <Box
              sx={{
                flex: 1,
                bgcolor: theme.palette.mode === "dark" 
                  ? "rgba(45, 45, 45, 0.8)" 
                  : "rgba(248, 250, 252, 0.9)",
                borderRadius: { xs: 2.5, sm: 3 },
                p: { xs: 1, sm: 1.2 },
                display: "flex",
                alignItems: "center",
                border: `2px solid ${
                  showEmojiPicker 
                    ? theme.palette.primary.main 
                    : theme.palette.mode === "dark" 
                      ? "rgba(255, 255, 255, 0.1)" 
                      : "rgba(0, 0, 0, 0.08)"
                }`,
                boxShadow: theme.palette.mode === "dark" 
                  ? "0 4px 20px rgba(0, 0, 0, 0.5)" 
                  : "0 4px 20px rgba(0, 0, 0, 0.08)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                minHeight: "48px",
                maxHeight: "120px",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  boxShadow: theme.palette.mode === "dark" 
                    ? `0 6px 24px rgba(0, 0, 0, 0.6), 0 0 0 1px ${theme.palette.primary.main}30` 
                    : `0 6px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px ${theme.palette.primary.main}30`,
                },
                "&:focus-within": {
                  borderColor: theme.palette.primary.main,
                  boxShadow: theme.palette.mode === "dark" 
                    ? `0 6px 24px rgba(0, 0, 0, 0.6), 0 0 0 2px ${theme.palette.primary.main}40` 
                    : `0 6px 24px rgba(0, 0, 0, 0.12), 0 0 0 2px ${theme.palette.primary.main}40`,
                },
              }}
            >
              <Tooltip title="Add emoji" arrow>
                <IconButton 
                  onClick={handleEmojiToggle}
                  color={showEmojiPicker ? "primary" : "default"}
                  sx={{
                    p: 1,
                    mr: 1,
                    alignSelf: "center",
                    color: showEmojiPicker 
                      ? theme.palette.primary.main 
                      : theme.palette.text.secondary,
                    bgcolor: showEmojiPicker 
                      ? `${theme.palette.primary.main}15` 
                      : "transparent",
                    "&:hover": {
                      bgcolor: showEmojiPicker 
                        ? `${theme.palette.primary.main}25` 
                        : theme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.1)" 
                          : "rgba(0, 0, 0, 0.05)",
                      transform: "scale(1.1)",
                    },
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: 2,
                  }}
                >
                  <MoodIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <TextField
                ref={inputRef}
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                variant="standard"
                fullWidth
                multiline
                maxRows={3}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: "1rem",
                    lineHeight: 1.4,
                    fontWeight: 400,
                    color: theme.palette.text.primary,
                    "& .MuiInputBase-input": {
                      padding: "4px 0",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      resize: "none",
                      "&::placeholder": {
                        color: theme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.4)" 
                          : "rgba(0, 0, 0, 0.4)",
                        opacity: 1,
                        fontWeight: 400,
                      },
                      "&:focus": {
                        outline: "none",
                      },
                    },
                  },
                }}
              />

              {/* Enhanced Send Button or Voice Input */}
              <Box sx={{ 
                display: "flex", 
                alignItems: "center",
                ml: 1,
              }}>
                {inputMessage.trim() ? (
                  <Tooltip title="Send message" arrow>
                    <IconButton
                      onClick={handleSendMessage}
                      sx={{
                        p: 1,
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        width: 36,
                        height: 36,
                        "&:hover": {
                          bgcolor: theme.palette.primary.dark,
                          transform: "scale(1.05)",
                          boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                        },
                        "&:active": {
                          transform: "scale(0.95)",
                        },
                        borderRadius: "50%",
                        boxShadow: `0 2px 8px ${theme.palette.primary.main}30`,
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Box 
                    sx={{
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <VoiceToText 
                      onTranscriptChange={handleVoiceTranscript}
                      disabled={false}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Premium Emoji Picker */}
          <Popper 
            open={showEmojiPicker} 
            anchorEl={emojiAnchor}
            placement="top-start"
            transition
            sx={{ zIndex: 1400 }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={300}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 2.5 },
                    maxWidth: { xs: 300, sm: 350 },
                    maxHeight: { xs: 220, sm: 260 },
                    overflow: "auto",
                    border: `1px solid ${
                      theme.palette.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.1)" 
                        : "rgba(0, 0, 0, 0.08)"
                    }`,
                    borderRadius: { xs: 3, sm: 4 },
                    boxShadow: theme.palette.mode === "dark" 
                      ? "0 20px 40px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)" 
                      : "0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                    bgcolor: theme.palette.mode === "dark" 
                      ? "rgba(26, 26, 26, 0.95)" 
                      : "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    "&::-webkit-scrollbar": {
                      width: "4px",
                    },
                    "&::-webkit-scrollbar-track": {
                      background: "transparent",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: theme.palette.mode === "dark" 
                        ? "rgba(255, 255, 255, 0.2)" 
                        : "rgba(0, 0, 0, 0.2)",
                      borderRadius: "8px",
                      "&:hover": {
                        background: theme.palette.mode === "dark" 
                          ? "rgba(255, 255, 255, 0.3)" 
                          : "rgba(0, 0, 0, 0.3)",
                      },
                    },
                  }}
                >
                  <ClickAwayListener onClickAway={() => setShowEmojiPicker(false)}>
                    <Box>
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ 
                          display: "block", 
                          mb: 1.5, 
                          fontWeight: 600,
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Choose an emoji
                      </Typography>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: { xs: "repeat(6, 1fr)", sm: "repeat(8, 1fr)" },
                          gap: { xs: 0.8, sm: 1 },
                        }}
                      >
                        {emojis.map((emoji, index) => (
                          <IconButton
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            sx={{
                              fontSize: { xs: "1.1rem", sm: "1.3rem" },
                              width: { xs: 32, sm: 36 },
                              height: { xs: 32, sm: 36 },
                              borderRadius: 2,
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                bgcolor: theme.palette.mode === "dark" 
                                  ? "rgba(255, 255, 255, 0.1)" 
                                  : "rgba(0, 0, 0, 0.05)",
                                transform: "scale(1.2)",
                                boxShadow: theme.palette.mode === "dark" 
                                  ? "0 4px 12px rgba(0, 0, 0, 0.5)" 
                                  : "0 4px 12px rgba(0, 0, 0, 0.15)",
                              },
                              "&:active": {
                                transform: "scale(1.1)",
                              },
                            }}
                          >
                            {emoji}
                          </IconButton>
                        ))}
                      </Box>
                    </Box>
                  </ClickAwayListener>
                </Paper>
              </Fade>
            )}
          </Popper>
        </Box>
    </Box>
  );
};

export default ChatPage;
