import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { motion } from 'framer-motion';
import GradientText from './GradientText.tsx';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const TermsHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          maxWidth: 900,
          mx: 'auto',
          mt: { xs: 2, sm: 4, md: 6 },
          px: { xs: 2, sm: 3 },
          position: 'relative',
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="contained"
          color="primary"
          sx={{
            position: 'absolute',
            top: -40,
            left: 16,
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: 3,
            border: 'none',
            width: { xs: 80, sm: 100 },
            height: { xs: 36, sm: 42 },
            fontSize: { xs: '0.8rem', sm: '1rem' },
            '& .MuiButton-startIcon': {
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
            },
            '&:hover': {
              bgcolor: 'primary.dark',
              boxShadow: 6,
            },
          }}
          aria-label="Go back"
        >
          Back
        </Button>

        <Box sx={{ textAlign: 'center', pt: { xs: 2, sm: 4, md: 2 }, pb: 4 }}>
          <GradientText variant="h3" fontWeight="bold" gutterBottom>
            Terms and Conditions
          </GradientText>

          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            Please read these terms carefully before using ArogyaPath.
          </Typography>

          <Divider sx={{ my: 3, mx: 'auto', maxWidth: 600 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              mb: 3,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Last Updated:</strong> June 2025
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Effective From:</strong> June 2025
            </Typography>
          </Box>

          <Typography variant="body1" paragraph sx={{ maxWidth: 800, mx: 'auto' }}>
            Welcome to <strong>ArogyaPath</strong>. These Terms and Conditions govern your
            use of our website, mobile application, and any related services (collectively,
            the "Platform"). By accessing or using our Platform, you agree to be bound by these
            Terms. If you do not agree, please do not use our services.
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default TermsHeader;
