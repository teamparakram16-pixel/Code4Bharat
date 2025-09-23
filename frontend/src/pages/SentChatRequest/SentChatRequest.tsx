import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Badge,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Skeleton
} from "@mui/material";
import {
  Notifications,
  FilterList,
  Group,
  Person,
  Message,
  Search,
  ArrowForward
} from "@mui/icons-material";
import useChat from "@/hooks/useChat/useChat";
import SentChatRequestCard from "@/components/SentChatRequestCard/SentChatRequestCard";
import GroupChatMembersDialog from "@/components/GroupChatMembersDialog/GroupChatMembersDialog";
import { ReceivedChatRequest } from "../ReceivedChatRequest/ReceivedChatRequest.types";
import formatTimestamp from "@/utils/formatTimeStamp";
import countGroupRequests from "@/utils/countGroupRequests";
import countPrivateRequests from "@/utils/countPrivateRequests";
import countPendingRequests from "@/utils/countPendingRequests";

const SentChatRequest = () => {
  const { getSentChatRequests } = useChat();
  const [activeTab, setActiveTab] = useState(0);
  const [requests, setRequests] = useState<ReceivedChatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupDialogRequest, setGroupDialogRequest] = useState<ReceivedChatRequest | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [privateCount, setPrivateCount] = useState(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    let isMounted = true;
    const fetchRequests = async () => {
      setLoading(true);
      try {
        let response;
        if (activeTab === 0) {
          response = await getSentChatRequests();
        } else if (activeTab === 1) {
          response = await getSentChatRequests("group");
        } else if (activeTab === 2) {
          response = await getSentChatRequests("private");
        }
        if (isMounted && response?.sentChatRequests) {
          setRequests(response.sentChatRequests);
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
    if (requests.length === 0) return;

    if (activeTab === 0) {
      setPendingCount(countPendingRequests(requests));
      setGroupCount(countGroupRequests(requests));
      setPrivateCount(countPrivateRequests(requests));
    } else if (activeTab === 1) {
      setGroupCount(countGroupRequests(requests));
    } else if (activeTab === 2) {
      setPrivateCount(countPrivateRequests(requests));
    }
  }, [requests]);

  const handleGroupDialogOpen = (open: boolean, request?: ReceivedChatRequest) => {
    setGroupDialogOpen(open);
    setGroupDialogRequest(open && request ? request : null);
  };

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', px: { xs: 1, sm: 3, md: 6 }, bgcolor: theme.palette.background.default }}>
      {/* Header Section */}
      <Box sx={{ 
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: theme.shadows[4],
        background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)'
      }}>
        <Box sx={{
          p: isMobile ? 2 : 4,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white'
        }}>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1" fontWeight="600" gutterBottom>
              Sent Chat Requests
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Track and manage your outgoing chat requests
            </Typography>
          </Box>
          <Badge 
            badgeContent={requests.length} 
            color="secondary"
            sx={{ 
              mt: isMobile ? 2 : 0,
              '& .MuiBadge-badge': {
                right: -5,
                top: 15,
                fontSize: '0.8rem',
                padding: '0 4px',
                height: 24,
                minWidth: 24
              }
            }}
          >
            <Notifications sx={{ fontSize: 40, color: 'white' }} />
          </Badge>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Card sx={{ 
        mb: 4,
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        border: `1px solid ${theme.palette.divider}`
      }}>
        <CardContent sx={{ p: isMobile ? 1.5 : 3 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              width: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
              px: 2,
              py: 1,
              border: `1px solid ${theme.palette.divider}`
            }}>
              <Search color="action" />
              <Box
                component="input"
                placeholder="Search requests..."
                sx={{
                  ml: 1,
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '0.95rem',
                  '&:focus': {
                    outline: 'none'
                  }
                }}
              />
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              width: isMobile ? '100%' : 'auto'
            }}>
              <FilterList sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Tabs
                value={activeTab}
                onChange={(_e, newValue) => setActiveTab(newValue)}
                variant={isMobile ? "scrollable" : "standard"}
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                    height: 3
                  }
                }}
              >
                <Tab
                  label={
                    <Badge badgeContent={pendingCount} color="primary" max={99}>
                      <Box sx={{ px: 1 }}>All</Box>
                    </Badge>
                  }
                  sx={{ minHeight: 48 }}
                />
                <Tab
                  label={
                    <Badge badgeContent={groupCount} color="primary" max={99}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                        <Group fontSize="small" /> 
                        {!isMobile && 'Groups'}
                      </Box>
                    </Badge>
                  }
                  sx={{ minHeight: 48 }}
                />
                <Tab
                  label={
                    <Badge badgeContent={privateCount} color="primary" max={99}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                        <Person fontSize="small" /> 
                        {!isMobile && 'Private'}
                      </Box>
                    </Badge>
                  }
                  sx={{ minHeight: 48 }}
                />
              </Tabs>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Requests List Section */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: 3,
        mb: 4
      }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} sx={{ borderRadius: 2, boxShadow: theme.shadows[1] }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="30%" />
                </Box>
              </CardContent>
            </Card>
          ))
        ) : requests.length === 0 ? (
          <Box sx={{ 
            gridColumn: '1 / -1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
            textAlign: 'center'
          }}>
            <Avatar sx={{ 
              width: 80, 
              height: 80, 
              mb: 3,
              backgroundColor: theme.palette.action.hover
            }}>
              <Message sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              No Sent Requests Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
              You haven't sent any chat requests yet. Start a new conversation by sending a request.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              endIcon={<ArrowForward />}
              sx={{ borderRadius: 2, px: 4, py: 1 }}
            >
              New Request
            </Button>
          </Box>
        ) : (
          requests.map((request: any) => (
            <SentChatRequestCard
              key={request._id}
              request={request}
              formatTimestamp={(ts: string | Date) => formatTimestamp(ts)}
              setGroupDialogOpen={handleGroupDialogOpen}
              myStatus={"pending"}
              handleAccept={async () => ({})}
              handleReject={async () => ({ rejected: false })}
              handleProfileClick={() => {}}
            />
          ))
        )}
      </Box>

      {/* Pagination (optional) */}
      {requests.length > 0 && !loading && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4,
          '& > *': { mx: 0.5 }
        }}>
          <Button variant="outlined" disabled sx={{ minWidth: 32 }}>1</Button>
          <Button variant="outlined" sx={{ minWidth: 32 }}>2</Button>
          <Button variant="outlined" sx={{ minWidth: 32 }}>3</Button>
          <Button variant="outlined" endIcon={<ArrowForward />} sx={{ borderRadius: 2 }}>
            Next
          </Button>
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

export default SentChatRequest;