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
  Avatar,
  Chip,
  Alert,
  Grow,
  Stack
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  Launch as LaunchIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  SecurityOutlined as SecurityIcon,
  HealthAndSafety as HealthIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Videocam as MeetingIcon,
} from '@mui/icons-material';

const MeetingManagement: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [meetingId, setMeetingId] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

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
      // Navigate to the live streaming page with the meeting ID
      navigate(`/live-streaming?meetingId=${encodeURIComponent(meetingId.trim())}&username=${encodeURIComponent(user?.name || 'Doctor')}`);
    } catch (error) {
      setJoinError('Failed to join meeting. Please try again.');
      console.error('Join meeting error:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100vw',
        bgcolor: '#f5f5f5',
        overflow: 'auto'
      }}
    >
      {/* Header Section */}
      <Box 
        sx={{ 
          py: 4, 
          px: { xs: 2, sm: 4, md: 6 }, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          mb: 4
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <Avatar
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'rgba(255,255,255,0.2)',
              mr: 2,
              border: '2px solid rgba(255,255,255,0.3)'
            }}
          >
            <VideoCallIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              ArogyaPath Live Meetings
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              Join patient consultations securely
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
          sx={{ 
            fontSize: '0.9rem', 
            py: 2,
            bgcolor: 'rgba(255,255,255,0.1)',
            borderColor: 'rgba(255,255,255,0.3)',
            color: 'white'
          }}
        />
      </Box>

      <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, maxWidth: '1400px', mx: 'auto' }}>
        {/* Features List */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
            <Chip
              size="small"
              icon={<MeetingIcon fontSize="small" />}
              label="HD Video"
              variant="outlined"
              sx={{ bgcolor: 'white' }}
            />
            <Chip
              size="small"
              icon={<GroupIcon fontSize="small" />}
              label="Up to 2 Participants"
              variant="outlined"
              sx={{ bgcolor: 'white' }}
            />
            <Chip
              size="small"
              icon={<SecurityIcon fontSize="small" />}
              label="Secure Connection"
              variant="outlined"
              sx={{ bgcolor: 'white' }}
            />
            <Chip
              size="small"
              icon={<ScheduleIcon fontSize="small" />}
              label="60 Minutes"
              variant="outlined"
              sx={{ bgcolor: 'white' }}
            />
          </Stack>
        </Box>

        {/* Join Meeting Section */}
        <Box sx={{ mb: 4 }}>
          <Grow in timeout={1000}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(30,60,114,0.2)'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      Join a Meeting
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Enter the meeting ID provided to join the consultation
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    label="Meeting ID"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    placeholder="Enter meeting ID (e.g., ABC-123-DEFG)"
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                        '&.Mui-focused fieldset': { borderColor: 'white' },
                      },
                      '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                      '& .MuiInputBase-input': { 
                        color: 'white',
                        fontSize: '1.1rem',
                        padding: '16px'
                      },
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
                      py: 2,
                      fontSize: '1.1rem',
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

        {/* Information Section */}
        <Box sx={{ mb: 6 }}>
          <Card 
            elevation={0} 
            sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(240,147,251,0.2)'
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <InfoIcon sx={{ fontSize: 32, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                  Meeting Features
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, 
                gap: 4 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SecurityIcon sx={{ mr: 2, fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">End-to-End Security</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>Encrypted communications</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 2, fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">HD Quality Video</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>Crystal clear consultations</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <GroupIcon sx={{ mr: 2, fontSize: '2rem' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">Screen Sharing</Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>Share medical reports</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingManagement;