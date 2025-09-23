import React from 'react';
import { Box, Typography } from '@mui/material';

interface TocItemProps {
  active: boolean;
  onClick: () => void;
  title: string;
}

const TocItem: React.FC<TocItemProps> = ({ active, onClick, title }) => {
  return (
    <Box
      onClick={onClick}
      sx={(theme) => ({
        padding: theme.spacing(1, 2),
        borderRadius: theme.shape.borderRadius,
        cursor: 'pointer',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
        transition: 'background-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease',
        backgroundColor: active ? theme.palette.primary.main : 'transparent',
        color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
        boxShadow: active ? `0 0 8px ${theme.palette.primary.main}88` : 'none',
        fontWeight: active ? 700 : 400,

        '&:hover': {
          backgroundColor: theme.palette.primary.dark,  
          boxShadow: active
            ? `0 0 12px ${theme.palette.primary.dark}cc`
            : `0 0 8px ${theme.palette.primary.dark}cc`,
          transform: 'translateX(4px)',
          color: theme.palette.primary.contrastText,  
        },
      })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={active}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 'inherit',
          fontSize: 14,
          lineHeight: 1.4,
          userSelect: 'none',
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default TocItem;
