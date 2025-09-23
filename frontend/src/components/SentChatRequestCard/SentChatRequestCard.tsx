import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  Chip,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  Badge,
  Stack
} from "@mui/material";
import { Group, Person, Schedule, CheckCircle, Cancel, Pending } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ReceivedChatRequestCardProps } from "../ReceivedChatRequestCard/ReceivedChatRequestCard.types";

interface SentChatRequestCardProps extends ReceivedChatRequestCardProps {
  setGroupDialogOpen: (open: boolean, request: any) => void;
}

const SentChatRequestCard: React.FC<SentChatRequestCardProps> = ({
  request,
  formatTimestamp,
  setGroupDialogOpen,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Helper to get status for each user (for group requests)
  const getUserStatus = (userObj: any) => {
    if (!userObj || !userObj.status) return "pending";
    return userObj.status;
  };

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
        opacity: request.users?.some((u: any) => u.status !== "pending") ? 0.85 : 1,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.light,
          opacity: 1
        }
      }}
    >
      <CardContent sx={{ 
        flex: 1,
        pb: 1,
        position: 'relative'
      }}>
        {/* Type and Status Badges */}
        <Box sx={{ 
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
          mb: 2,
          alignItems: 'center'
        }}>
          <Chip
            icon={request.chatType === "group" ? <Group fontSize="small" /> : <Person fontSize="small" />}
            label={
              request.chatType === "group" ? "Group Request" : "Private Request"
            }
            color={request.chatType === "group" ? "primary" : "secondary"}
            size="small"
            sx={{
              fontWeight: 600,
              '& .MuiChip-icon': { ml: 0.5 }
            }}
          />

          {request.chatType === "private" && (
            <Chip
              icon={statusIcon(getUserStatus(request.users?.[0]))}
              label={getUserStatus(request.users?.[0]).toUpperCase()}
              color={statusColor(getUserStatus(request.users?.[0]))}
              size="small"
              sx={{
                fontWeight: 500,
                '& .MuiChip-icon': { ml: 0.5 }
              }}
            />
          )}
        </Box>

        {/* Private Request Content */}
        {request.chatType === "private" && (
          <>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Sent to:
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
                    backgroundColor: theme.palette[statusColor(getUserStatus(request.users?.[0]))].main,
                    color: theme.palette[statusColor(getUserStatus(request.users?.[0]))].contrastText,
                    borderRadius: '50%',
                    width: 16,
                    height: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${theme.palette.background.paper}`
                  }}>
                    {statusIcon(getUserStatus(request.users?.[0]))}
                  </Box>
                }
              >
                <Avatar
                  src={request.users?.[0].user.profile?.profileImage || ""}
                  sx={{ 
                    width: 48, 
                    height: 48,
                    boxShadow: theme.shadows[2]
                  }}
                />
              </Badge>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {request.users?.[0].user.profile?.fullName || "Unknown User"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.chatReason?.similarPrakrithi && 
                    `Prakrithi Match: ${request.users?.[0].similarPrakrithiPercenatge}%`}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {/* Group Request Content */}
        {request.chatType === "group" && (
          <>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              {request.groupName}
            </Typography>
            
            <Box sx={{ 
              mb: 2,
              p: 1.5,
              backgroundColor: theme.palette.action.hover,
              borderRadius: 1
            }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                {request.chatReason?.otherReason ||
                  (request.chatReason?.similarPrakrithi &&
                    `Group created based on Similar Prakrithi`)}
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                sx={{ 
                  mt: 1.5,
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                {request.users?.map((u: any) => (
                  <Chip
                    key={u.user._id}
                    icon={statusIcon(getUserStatus(u))}
                    label={`${u.user.profile?.fullName || "Member"}`}
                    color={statusColor(getUserStatus(u))}
                    size="small"
                    sx={{
                      maxWidth: '100%',
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }
                    }}
                  />
                ))}
              </Stack>
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
            Sent {formatTimestamp(request.createdAt)}
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
              }
            }}
          >
            View Members
          </Button>
        )}
        {((request.chatType === "private" &&
          request.users?.[0]?.status === "accepted" &&
          request.chat) ||
          (request.chatType === "group" &&
            request.users?.some((u: any) => u.status === "accepted") &&
            request.chat)) && (
          <Button
            variant="contained"
            size={isMobile ? "small" : "medium"}
            onClick={() => navigate(`/chats/${request.chat}`)}
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
      </CardActions>
    </Card>
  );
};

export default SentChatRequestCard;