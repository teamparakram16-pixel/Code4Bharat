import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Box, Snackbar, Alert } from '@mui/material';

const LOCAL_STORAGE_KEY = 'tnc_last_response';

const ONE_WEEK_MS = 1 * 24 * 60 * 60 * 1000; 

const AcceptanceSection: React.FC = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    const lastResponse = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (lastResponse) {
      const lastTimestamp = parseInt(lastResponse);
      const now = Date.now();
      if (now - lastTimestamp > ONE_WEEK_MS) {
        setShowSection(true);
      }
    } else {
      setShowSection(true);
    }
  }, []);

  const handleResponse = (type: 'accept' | 'reject') => {
    localStorage.setItem(LOCAL_STORAGE_KEY, Date.now().toString());
    setSnackbarMessage(
      type === 'accept'
        ? 'Thank you! You have accepted the Terms and Conditions.'
        : 'You rejected the Terms and Conditions.You should accept it by tomorrow'
    );
    setSnackbarSeverity(type === 'accept' ? 'success' : 'error');
    setSnackbarOpen(true);
    setShowSection(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {showSection && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6, mb: 4 }}>
          <Paper
            elevation={6}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              maxWidth: 420,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Do you accept these Terms and Conditions?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You must accept to continue using the website.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ minWidth: 120, fontWeight: 600 }}
                onClick={() => handleResponse('accept')}
              >
                Accept
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ minWidth: 120, fontWeight: 600 }}
                onClick={() => handleResponse('reject')}
              >
                Reject
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AcceptanceSection;
