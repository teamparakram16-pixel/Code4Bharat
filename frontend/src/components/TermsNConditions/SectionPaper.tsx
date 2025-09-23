import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '12px',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  },
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

interface SectionPaperProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const SectionPaper: React.FC<SectionPaperProps> = ({ id, title, children }) => {
  return (
    <StyledPaper elevation={3} id={id}>
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          {title}
        </Typography>
        {children}
      </Box>
    </StyledPaper>
  );
};

export default SectionPaper;