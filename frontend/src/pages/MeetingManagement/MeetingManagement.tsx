import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Container, 
  Avatar,
  Chip,
  Alert,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  Stack,
  Paper
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Add as AddIcon,
  Videocam as MeetingIcon,
  ContentCopy as CopyIcon,
  Launch as LaunchIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  SecurityOutlined as SecurityIcon,
  HealthAndSafety as HealthIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

interface MeetingInfo {
  id: string;
  name: string;
  created: string;
  participants?: number;
}

const MeetingManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetingId, setMeetingId] = useState('');
  const [meetingName, setMeetingName] = useState('');
  const [createdMeeting, setCreatedMeeting] = useState<MeetingInfo | null>(null);
  const [joinError, setJoinError] = useState('');
  const [createError, setCreateError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Generate a random meeting ID
  const generateMeetingId = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
      if (i === 2 || i === 5) result += '-';
    }
    return result;
  };

  // Create a new meeting
  const handleCreateMeeting = async () => {
    if (!meetingName.trim()) {
      setCreateError('Please enter a meeting name');
      return;
    }

    setIsCreating(true);
    setCreateError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMeetingId = generateMeetingId();
      const meeting: MeetingInfo = {
        id: newMeetingId,
        name: meetingName.trim(),
        created: new Date().toISOString(),
        participants: 0
      };

      setCreatedMeeting(meeting);
      setMeetingName('');
      
      // Store meeting in localStorage for persistence
      const existingMeetings = JSON.parse(localStorage.getItem('doctorMeetings') || '[]');
      existingMeetings.push(meeting);
      localStorage.setItem('doctorMeetings', JSON.stringify(existingMeetings));
      
    } catch (error) {
      setCreateError('Failed to create meeting. Please try again.');
      console.error('Create meeting error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  // Join an existing meeting
  const handleJoinMeeting = async () => {
    if (!meetingId.trim()) {
      setJoinError('Please enter a meeting ID');
      return;
    }

    // Validate meeting ID format
    const meetingIdPattern = /^[A-Z0-9]{3}-[A-Z0-9]{3}-[A-Z0-9]{4}$/;
    if (!meetingIdPattern.test(meetingId.trim())) {
      setJoinError('Please enter a valid meeting ID (format: ABC-123-DEFG)');
      return;
    }

    setIsJoining(true);
    setJoinError('');

    try {
      // Simulate validation delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Navigate to the live streaming page with the meeting ID
      navigate(`/live-streaming?meetingId=${encodeURIComponent(meetingId.trim())}&username=${encodeURIComponent(user?.name || 'Doctor')}`);
    } catch (error) {
      setJoinError('Failed to join meeting. Please try again.');
      console.error('Join meeting error:', error);
    } finally {
      setIsJoining(false);
    }
  };

  // Copy meeting ID to clipboard
  const copyMeetingId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Start the created meeting
  const startMeeting = (id: string) => {
    navigate(`/live-streaming?meetingId=${encodeURIComponent(id)}&username=${encodeURIComponent(user?.name || 'Doctor')}&host=true`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Avatar
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'primary.main',
              mr: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <VideoCallIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              ArogyaPath Live Meetings
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Create secure video consultations and join patient sessions
            </Typography>
          </Box>
        </Box>
        
        {/* Doctor Info */}
        <Chip
          avatar={
            <Avatar sx={{ bgcolor: 'success.main' }}>
              <HealthIcon fontSize="small" />
            </Avatar>
          }
          label={`Dr. ${user?.name || 'Practitioner'}`}
          variant="outlined"
          color="success"
          sx={{ fontSize: '0.9rem', py: 2 }}
        />
      </Box>

      {/* Main Content Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
        
        {/* Create Meeting Section */}
        <Grow in timeout={600}>
          <Card 
            elevation={4}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(50px, -50px)'
              }}
            />
            
            <CardContent sx={{ p: 4, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AddIcon sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Create New Meeting
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Start a new consultation session with enhanced security and HD quality
              </Typography>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Meeting Name"
                  placeholder="e.g., Patient Consultation - Morning Session"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.95)',
                      }
                    }
                  }}
                />

                {createError && (
                  <Alert severity="error" icon={<ErrorIcon />}>
                    {createError}
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCreateMeeting}
                  disabled={isCreating}
                  startIcon={isCreating ? undefined : <AddIcon />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                    }
                  }}
                >
                  {isCreating ? 'Creating Meeting...' : 'Create Meeting'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grow>

        {/* Join Meeting Section */}
        <Grow in timeout={800}>
          <Card 
            elevation={4}
            sx={{ 
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                transform: 'translate(-30px, -30px)'
              }}
            />
            
            <CardContent sx={{ p: 4, position: 'relative' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <MeetingIcon sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Join Meeting
                </Typography>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                Enter a meeting ID to join an existing consultation session
              </Typography>

              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Meeting ID"
                  placeholder="ABC-123-DEFG"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value.toUpperCase())}
                  variant="outlined"
                  inputProps={{
                    style: { textTransform: 'uppercase' },
                    maxLength: 12
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.95)',
                      }
                    }
                  }}
                />

                {joinError && (
                  <Alert severity="error" icon={<ErrorIcon />}>
                    {joinError}
                  </Alert>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleJoinMeeting}
                  disabled={isJoining}
                  startIcon={isJoining ? undefined : <LaunchIcon />}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.3)',
                    }
                  }}
                >
                  {isJoining ? 'Joining Meeting...' : 'Join Meeting'}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grow>
      </Box>

      {/* Created Meeting Details */}
      {createdMeeting && (
        <Fade in timeout={1000}>
          <Box sx={{ mt: 4 }}>
            <Paper
              elevation={8}
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Success Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              
              <Box sx={{ position: 'relative' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <CheckIcon />
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    Meeting Created Successfully!
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom color="text.primary">
                    {createdMeeting.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created on {formatDate(createdMeeting.created)}
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  mb: 3,
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.7)',
                  borderRadius: 2
                }}>
                  <SecurityIcon color="success" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                      Meeting ID: {createdMeeting.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Share this ID with participants to join
                    </Typography>
                  </Box>
                  <Tooltip title={copied ? 'Copied!' : 'Copy Meeting ID'}>
                    <IconButton 
                      onClick={() => copyMeetingId(createdMeeting.id)}
                      color={copied ? 'success' : 'primary'}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<VideoCallIcon />}
                    onClick={() => startMeeting(createdMeeting.id)}
                    sx={{
                      bgcolor: 'success.main',
                      '&:hover': { bgcolor: 'success.dark' },
                      flex: 1
                    }}
                  >
                    Start Meeting
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CopyIcon />}
                    onClick={() => copyMeetingId(createdMeeting.id)}
                    sx={{ flex: 1 }}
                  >
                    Copy Meeting ID
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Fade>
      )}

      {/* Information Section */}
      <Box sx={{ mt: 6 }}>
        <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <InfoIcon sx={{ fontSize: 32, mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Meeting Features
              </Typography>
            </Box>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">End-to-End Security</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Encrypted communications</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">HD Quality Video</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Crystal clear consultations</Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <GroupIcon sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">Screen Sharing</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Share medical reports</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default MeetingManagement;