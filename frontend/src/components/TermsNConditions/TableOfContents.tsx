import React from 'react';
import { Paper, Typography, Divider, Box } from '@mui/material';
import TocItem from './TocItem.tsx';

interface TableOfContentsProps {
  sections: Array<{ id: string; title: string }>;
  activeSection: string | null;
  scrollToSection: (id: string) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  activeSection,
  scrollToSection,
}) => {
  return (
    <Box
  sx={{
    position: 'sticky',
    top: 24, // Reduce from 80 to minimize top gap
    alignSelf: 'flex-start',
    display: { xs: 'none', md: 'block' },
    mt: 2, // optional: adjust vertical spacing if needed
  }}
>
  <Paper
    elevation={6}
    sx={{
      borderRadius: 3,
      p: 2,
      bgcolor: 'background.paper',
      width: 220,
      maxHeight: '75vh',
      overflowY: 'auto',
      boxShadow: (theme) => `0 4px 16px ${theme.palette.grey[300]}`,
    }}
  >
    <Typography
      variant="subtitle1"
      fontWeight="bold"
      mb={1}
      color="primary"
      sx={{ textAlign: 'center', fontSize: '1rem' }}
    >
      Table of Contents
    </Typography>
    <Divider sx={{ mb: 1 }} />

    {sections.map((section) => (
      <TocItem
        key={section.id}
        active={activeSection === section.id}
        onClick={() => scrollToSection(section.id)}
        title={section.title}
      />
    ))}
  </Paper>
</Box>
  );
};

export default TableOfContents;
