import useChat from "../../hooks/useChat/useChat";
import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Badge,
  Card,
  CardContent,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  InputAdornment,
  TextField,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Notifications,
  Group,
  Person,
  Message,
  Search,
  Clear,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import {
  differenceInDays,
  differenceInHours,
  isValid,
  parseISO,
} from "date-fns";
import { styled } from "@mui/material/styles";
import GroupChatMembersDialog from "../../components/GroupChatMembersDialog/GroupChatMembersDialog";
import { ReceivedChatRequest } from "./ReceivedChatRequest.types";
import ReceivedChatRequestCard from "@/components/ReceivedChatRequestCard/ReceivedChatRequestCard";
import ReceivedChatRequestCardSkeleton from "@/components/ReceivedChatRequestCardSkeleton/ReceivedChatRequestCardSkeleton ";
import countPendingRequests from "@/utils/countPendingRequests";
import countGroupRequests from "@/utils/countGroupRequests";
import countPrivateRequests from "@/utils/countPrivateRequests";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}));

const GradientHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
  color: theme.palette.common.white,
  borderRadius:
    typeof theme.shape.borderRadius === "number"
      ? theme.shape.borderRadius * 2
      : 16,
  boxShadow: theme.shadows[4],
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: "unset",
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(1),
  "&.Mui-selected": {
    backgroundColor: theme.palette.action.selected,
    color: theme.palette.primary.main,
  },
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  fontWeight: 500,
  "&.pending": {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  "&.accepted": {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  "&.rejected": {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
}));

const ReceivedChatRequestPage = () => {
  const { getReceivedChatRequests, acceptChatRequest, rejectChatRequest } =
    useChat();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Group, 2: Private
  const [requests, setRequests] = useState<ReceivedChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState<string>("");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupDialogRequest, setGroupDialogRequest] =
    useState<ReceivedChatRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);

  // Fetch chat requests on mount and when tab changes
  useEffect(() => {
    let isMounted = true;
    const fetchRequests = async () => {
      setLoading(true);
      try {
        let response;
        if (activeTab === 0) {
          response = await getReceivedChatRequests();
        } else if (activeTab === 1) {
          response = await getReceivedChatRequests("group");
        } else if (activeTab === 2) {
          response = await getReceivedChatRequests("private");
        }

        if (isMounted && response?.receivedChatRequests) {
          setRequests(response.receivedChatRequests);
          setCurrUser(response?.currUser);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchRequests();
    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  useEffect(() => {
    if (!currUser || requests.length === 0) return;

    if (activeTab === 0) {
      setPendingCount(countPendingRequests(requests, currUser));
      setGroupCount(countGroupRequests(requests, currUser));
      setPrivateCount(countPrivateRequests(requests, currUser));
    } else if (activeTab === 1) {
      setGroupCount(countGroupRequests(requests, currUser));
    } else if (activeTab === 2) {
      setPrivateCount(countPrivateRequests(requests, currUser));
    }
  }, [currUser, requests, activeTab]);

  const formatTimestamp = (timestamp: string | Date) => {
    if (!timestamp) return "";

    const date =
      typeof timestamp === "string" ? parseISO(timestamp) : timestamp;
    if (!isValid(date)) return "";

    const now = new Date();
    const diffHours = differenceInHours(now, date);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = differenceInDays(now, date);
    return `${diffDays}d ago`;
  };

  const handleAccept = async (requestId: string) => {
    try {
      const result = await acceptChatRequest(requestId);
      const chat: string = result?.chat || null;
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? {
                ...req,
                users: req.users.map((u: any) =>
                  u.user._id === currUser ? { ...u, status: "accepted" } : u
                ),
                chat: chat || null,
              }
            : req
        )
      );
      setPendingCount((prev) => prev - 1);
      return { chat };
    } catch {
      return {};
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectChatRequest(requestId);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId
            ? {
                ...req,
                users: req.users.map((u: any) =>
                  u.user._id === currUser ? { ...u, status: "rejected" } : u
                ),
                chat: null,
              }
            : req
        )
      );
      setPendingCount((prev) => prev - 1);
      return { rejected: true };
    } catch (error) {
      console.log("Error rejecting request:", error);
      return { rejected: false };
    }
  };

  const handleProfileClick = (userId: string) => {
    console.log(`Navigate to profile: ${userId}`);
  };

  const handleGroupDialogOpen = (
    open: boolean,
    request?: ReceivedChatRequest
  ) => {
    setGroupDialogOpen(open);
    setGroupDialogRequest(open && request ? request : null);
  };

  const filteredRequests = requests.filter((request) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return request.users.some(
      (u: any) =>
        u.user._id !== currUser && u.user.username.toLowerCase().includes(query)
    );
  });

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        px: { xs: 1, sm: 3, md: 6 },
        mx: 0,
        overflowX: "hidden",
        bgcolor: theme.palette.background.default,
      }}
    >
      {/* Header */}
      <GradientHeader>
        <Box
          display="flex"
          alignItems={isMobile ? "flex-start" : "center"}
          justifyContent="space-between"
          flexDirection={isMobile ? "column" : "row"}
          gap={2}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Chat Requests
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
              Review and manage your incoming connection requests
            </Typography>
          </Box>
          <StyledBadge badgeContent={pendingCount} color="error">
            <Avatar
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                width: 56,
                height: 56,
              }}
            >
              <Notifications sx={{ fontSize: 32 }} />
            </Avatar>
          </StyledBadge>
        </Box>
      </GradientHeader>

      {/* Search and Filters */}
      <Card sx={{ mb: 4, borderRadius: 2 }}>
        <CardContent>
          <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2}>
            <Box width="100%">
              <TextField
                fullWidth
                placeholder="Search requests..."
                variant="outlined"
                size="medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchQuery("")}>
                        <Clear fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                  },
                }}
              />
            </Box>
            <Box width="100%">
              <Box
                display="flex"
                justifyContent={isMobile ? "flex-start" : "flex-end"}
              >
                <Tabs
                  value={activeTab}
                  onChange={(_e, newValue) => setActiveTab(newValue)}
                  variant={isMobile ? "scrollable" : "standard"}
                  scrollButtons="auto"
                  sx={{
                    "& .MuiTabs-indicator": {
                      height: 4,
                      borderRadius: 2,
                    },
                  }}
                >
                  <StyledTab
                    label={
                      <Box display="flex" alignItems="center">
                        All Requests
                        {pendingCount > 0 && (
                          <StatusChip
                            label={pendingCount}
                            size="small"
                            className="pending"
                          />
                        )}
                      </Box>
                    }
                  />
                  <StyledTab
                    label={
                      <Box display="flex" alignItems="center">
                        <Group fontSize="small" sx={{ mr: 0.5 }} />
                        Groups
                        {groupCount > 0 && (
                          <StatusChip
                            label={groupCount}
                            size="small"
                            className="pending"
                          />
                        )}
                      </Box>
                    }
                  />
                  <StyledTab
                    label={
                      <Box display="flex" alignItems="center">
                        <Person fontSize="small" sx={{ mr: 0.5 }} />
                        Private
                        {privateCount > 0 && (
                          <StatusChip
                            label={privateCount}
                            size="small"
                            className="pending"
                          />
                        )}
                      </Box>
                    }
                  />
                </Tabs>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        gap={2}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="subtitle1" color="text.secondary">
            Showing:
          </Typography>
          <Chip
            label={`${filteredRequests.length} request${
              filteredRequests.length !== 1 ? "s" : ""
            }`}
            variant="outlined"
            size="small"
          />
        </Box>
        <Box display="flex" gap={1}>
          <Chip
            icon={<CheckCircle fontSize="small" />}
            label={`${
              requests.filter((r) =>
                r.users.some(
                  (u: any) => u.user._id === currUser && u.status === "accepted"
                )
              ).length
            } accepted`}
            variant="outlined"
            size="small"
            color="success"
          />
          <Chip
            icon={<Cancel fontSize="small" />}
            label={`${
              requests.filter((r) =>
                r.users.some(
                  (u: any) => u.user._id === currUser && u.status === "rejected"
                )
              ).length
            } rejected`}
            variant="outlined"
            size="small"
            color="error"
          />
        </Box>
      </Box>

      {/* Chat Requests List */}
      {loading ? (
        <Box display="flex" flexWrap="wrap" gap={3}>
          {Array.from({ length: 6 }).map((_, _idx) => (
            <Box key={_idx} width="100%">
              <ReceivedChatRequestCardSkeleton />
            </Box>
          ))}
        </Box>
      ) : filteredRequests.length === 0 ? (
        <Card sx={{ textAlign: "center", borderRadius: 3 }}>
          <CardContent sx={{ py: 8 }}>
            <Message
              sx={{
                fontSize: 64,
                color: "text.disabled",
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography variant="h5" gutterBottom>
              No chat requests found
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ maxWidth: 500, mx: "auto" }}
            >
              {searchQuery
                ? "No requests match your search criteria"
                : activeTab === 0
                ? "You don't have any chat requests yet"
                : activeTab === 1
                ? "No group chat requests available"
                : "No private chat requests available"}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={3}>
          {filteredRequests.map((request: any) => {
            const myUserObj = request.users?.find(
              (u: any) => u.user && u.user._id === currUser
            );
            const myStatus = myUserObj?.status || "pending";
            return (
              <Box key={request._id} width="100%">
                <ReceivedChatRequestCard
                  request={request}
                  myStatus={myStatus}
                  formatTimestamp={formatTimestamp}
                  handleAccept={handleAccept}
                  handleReject={handleReject}
                  handleProfileClick={handleProfileClick}
                  setGroupDialogOpen={handleGroupDialogOpen}
                />
              </Box>
            );
          })}
        </Box>
      )}

      <GroupChatMembersDialog
        open={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        request={groupDialogRequest as ReceivedChatRequest}
      />
    </Box>
  );
};

export default ReceivedChatRequestPage;