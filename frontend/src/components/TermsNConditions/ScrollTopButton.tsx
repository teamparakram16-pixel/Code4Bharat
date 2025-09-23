import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollTopButtonProps {
  onClick: () => void;
}

const fireVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 0.6, rotate: [0, 10, -10, 10, -10, 0] },
  exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
};

const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ onClick }) => {
  const [fire, setFire] = useState(false);

  const handleClick = () => {
    setFire(true);
    onClick();

    setTimeout(() => {
      setFire(false);
    }, 600);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Fire burst effect */}
      <AnimatePresence>
        {fire && (
          <motion.div
            key="fire"
            variants={fireVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'absolute',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at center, rgba(255,140,0,0.7), transparent 70%)',
              filter: 'blur(12px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <IconButton
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            boxShadow: 'none',
            border: 'none',
          }}
          size="large"
          aria-label="scroll to top"
        >
          <KeyboardArrowUp />
        </IconButton>
      </motion.div>
    </motion.div>
  );
};

export default ScrollTopButton;
