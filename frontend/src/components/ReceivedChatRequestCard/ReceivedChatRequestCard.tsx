import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Divider,
  Chip,
  Avatar,
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Badge,
  CircularProgress
} from "@mui/material";
import { Group, Person, Schedule, CheckCircle, Cancel, Pending, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ReceivedChatRequestCardProps } from "./ReceivedChatRequestCard.types";

const ReceivedChatRequestCard: React.FC<ReceivedChatRequestCardProps> = ({
  request,
  myStatus,
  formatTimestamp,
  handleAccept,
  handleReject,
  handleProfileClick,
  setGroupDialogOpen,
}) => {
  const [loadingAction, setLoadingAction] = useState<"accept" | "reject" | null>(null);
  const [localStatus, setLocalStatus] = useState<"pending" | "accepted" | "rejected">(myStatus);
  const [chatId, setChatId] = useState<string | null>(request.chat || null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Accept handler with loader
  const onAccept = async () => {
    setLoadingAction("accept");
    try {
      const result: { chat?: string } = (await handleAccept(request._id)) || {};
      if (result.chat && result.chat) {
        setChatId(result.chat);
        setLocalStatus("accepted");
      } else if (request.chatType === "group") {
        setLocalStatus("accepted");
      } else {
        setLocalStatus("accepted");
      }
    } finally {
      setLoadingAction(null);
    }
  };

  // Reject handler with loader
  const onReject = async () => {
    setLoadingAction("reject");
    try {
      await handleReject(request._id);
      setLocalStatus("rejected");
    } finally {
      setLoadingAction(null);
    }
  };

  // UI logic for showing buttons
  const showAcceptReject = localStatus === "pending";
  const showGoToChat = localStatus === "accepted" && chatId;
  const showWaiting = localStatus === "accepted" && !chatId && request.chatType === "group";

  const statusColor = (status: string) => {
    switch(status) {
      case "accepted": return "success";
      case "rejected": return "error";
      default: return "warning";
    }
  };

  const statusIcon = (status: string) => {
    switch(status) {
      case "accepted": return <CheckCircle fontSize="small" />;
      case "rejected": return <Cancel fontSize="small" />;
      default: return <Pending fontSize="small" />;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1],
        opacity: localStatus !== "pending" ? 0.85 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.light,
          opacity: 1
        }
      }}
    >
      {/* Status Badge */}
      {localStatus !== "pending" && (
        <Box sx={{ 
          position: 'absolute', 
          top: 12, 
          right: 12,
          zIndex: 1
        }}>
          <Chip
            icon={statusIcon(localStatus)}
            label={localStatus.toUpperCase()}
            color={statusColor(localStatus)}
            size="small"
            sx={{
              fontWeight: 600,
              '& .MuiChip-icon': { ml: 0.5 }
            }}
          />
        </Box>
      )}

      <CardContent sx={{ 
        flex: 1,
        pb: 1,
        position: 'relative'
      }}>
        {/* Type Badge */}
        <Chip
          icon={request.chatType === "group" ? <Group fontSize="small" /> : <Person fontSize="small" />}
          label={request.chatType === "group" ? "Group Request" : "Private Request"}
          color={request.chatType === "group" ? "primary" : "secondary"}
          size="small"
          sx={{
            fontWeight: 600,
            mb: 2,
            '& .MuiChip-icon': { ml: 0.5 }
          }}
        />

        {/* Group Request Content */}
        {request.chatType === "group" && (
          <>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                pr: localStatus !== 'pending' ? 4 : 0
              }}
            >
              {request.groupName}
            </Typography>
            
            <Box 
              display="flex" 
              alignItems="center" 
              gap={2} 
              mb={2}
              sx={{
                p: 1.5,
                backgroundColor: theme.palette.action.hover,
                borderRadius: 1
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${theme.palette.background.paper}`
                  }}>
                    <Person fontSize="inherit" />
                  </Box>
                }
              >
                <Avatar
                  src={request.owner?.profile?.profileImage || ""}
                  sx={{ 
                    width: 48, 
                    height: 48,
                    boxShadow: theme.shadows[2]
                  }}
                />
              </Badge>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {request.owner?.profile?.fullName || "Group Owner"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.users?.length || 0} members
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" paragraph>
              {request.chatReason?.otherReason ||
                (request.chatReason?.similarPrakrithi &&
                  `Group created based on Similar Prakrithi`)}
            </Typography>
          </>
        )}

        {/* Private Request Content */}
        {request.chatType === "private" && (
          <>
            <Box 
              display="flex" 
              alignItems="center" 
              gap={2} 
              mb={2}
              sx={{
                p: 1.5,
                backgroundColor: theme.palette.action.hover,
                borderRadius: 1
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box sx={{ 
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${theme.palette.background.paper}`
                  }}>
                    <Person fontSize="inherit" />
                  </Box>
                }
              >
                <Avatar
                  src={request.owner?.profile?.profileImage || ""}
                  sx={{ 
                    width: 48, 
                    height: 48,
                    boxShadow: theme.shadows[2]
                  }}
                />
              </Badge>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {request.owner?.profile?.fullName || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.chatReason?.similarPrakrithi && 
                    `Prakrithi Match: ${request.users?.[0]?.similarPrakrithiPercenatge || 0}%`}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Visibility />}
                onClick={() => handleProfileClick(request.owner?._id || "")}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Profile
              </Button>
            </Box>
          </>
        )}

        {/* Timestamp */}
        <Box 
          display="flex" 
          alignItems="center" 
          gap={1} 
          sx={{
            mt: 2,
            pt: 1.5,
            borderTop: `1px dashed ${theme.palette.divider}`
          }}
        >
          <Schedule 
            fontSize="small" 
            sx={{ 
              color: theme.palette.text.secondary,
              opacity: 0.8
            }} 
          />
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            Received {formatTimestamp(request.createdAt)}
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <Divider sx={{ my: 0 }} />
      <CardActions 
        sx={{ 
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          backgroundColor: theme.palette.background.default
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: '100%' }}>
          {showAcceptReject && (
            <>
              <Button
                variant="contained"
                color="success"
                size={isMobile ? "small" : "medium"}
                onClick={onAccept}
                disabled={loadingAction === "reject"}
                startIcon={loadingAction === "accept" ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  flex: isMobile ? 1 : 'none'
                }}
              >
                {loadingAction === "accept" ? "Accepting..." : "Accept"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                size={isMobile ? "small" : "medium"}
                onClick={onReject}
                disabled={loadingAction === "accept"}
                startIcon={loadingAction === "reject" ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  flex: isMobile ? 1 : 'none',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                {loadingAction === "reject" ? "Rejecting..." : "Reject"}
              </Button>
            </>
          )}
          {showGoToChat && (
            <Button
              variant="contained"
              color="primary"
              size={isMobile ? "small" : "medium"}
              onClick={() => navigate(`/chats/${chatId}`)}
              sx={{
                borderRadius: 2,
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                ml: 'auto'
              }}
            >
              Open Chat
            </Button>
          )}
          {showWaiting && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              Waiting for others to join the group chat...
            </Typography>
          )}
          {request.chatType === "group" && (
            <Button
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              onClick={() => setGroupDialogOpen(true, request)}
              sx={{
                borderRadius: 2,
                px: 2,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2
                },
                ml: request.chatType === 'group' && !showAcceptReject ? 'auto' : 1
              }}
            >
              View Members
            </Button>
          )}
        </Box>
      </CardActions>
    </Card>
  );
};

export default ReceivedChatRequestCard;