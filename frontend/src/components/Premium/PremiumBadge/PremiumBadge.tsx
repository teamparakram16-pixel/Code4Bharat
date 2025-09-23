import { Box, Chip, Typography } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import DiamondIcon from '@mui/icons-material/Diamond';
import CrownIcon from '@mui/icons-material/EmojiEvents';
import { motion } from 'framer-motion';

interface PremiumBadgeProps {
  premiumNo?: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const premiumConfig = {
  1: {
    name: 'Basic',
    color: '#1e3a8a', // Dark blue
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
    icon: StarIcon,
    glow: '0 0 20px rgba(30, 58, 138, 0.4)',
  },
  2: {
    name: 'Standard',
    color: '#7c3aed', // Purple
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    icon: DiamondIcon,
    glow: '0 0 20px rgba(124, 58, 237, 0.4)',
  },
  3: {
    name: 'Pro',
    color: '#d97706', // Golden
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
    icon: CrownIcon,
    glow: '0 0 20px rgba(217, 119, 6, 0.4)',
  },
};

export const PremiumBadge = ({ 
  premiumNo, 
  size = 'medium', 
  showLabel = true 
}: PremiumBadgeProps) => {
  
  // If no premium info, don't show badge
  if (!premiumNo || !(premiumNo in premiumConfig)) {
    return null;
  }

  const config = premiumConfig[premiumNo as keyof typeof premiumConfig];
  const IconComponent = config.icon;

  const sizeConfig = {
    small: {
      chipHeight: 24,
      iconSize: 16,
      fontSize: '0.75rem',
      padding: '4px 8px',
    },
    medium: {
      chipHeight: 32,
      iconSize: 20,
      fontSize: '0.875rem',
      padding: '6px 12px',
    },
    large: {
      chipHeight: 40,
      iconSize: 24,
      fontSize: '1rem',
      padding: '8px 16px',
    },
  };

  const currentSize = sizeConfig[size];

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      whileHover={{ scale: 1.05 }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        {/* Glow effect */}
        <Box
          sx={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: '20px',
            background: config.gradient,
            filter: 'blur(8px)',
            opacity: 0.3,
            zIndex: 0,
          }}
        />
        
        {/* Main badge */}
        <Chip
          icon={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: currentSize.iconSize,
                height: currentSize.iconSize,
              }}
            >
              <IconComponent 
                sx={{ 
                  fontSize: currentSize.iconSize,
                  color: 'white',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                }} 
              />
            </Box>
          }
          label={
            showLabel ? (
              <Typography
                variant="body2"
                sx={{
                  fontSize: currentSize.fontSize,
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  letterSpacing: 0.5,
                }}
              >
                {config.name}
              </Typography>
            ) : null
          }
          sx={{
            height: currentSize.chipHeight,
            background: config.gradient,
            border: '2px solid rgba(255,255,255,0.2)',
            boxShadow: config.glow,
            color: 'white',
            position: 'relative',
            zIndex: 1,
            '& .MuiChip-icon': {
              color: 'white',
              marginLeft: showLabel ? '8px' : '0px',
              marginRight: showLabel ? '4px' : '0px',
            },
            '& .MuiChip-label': {
              paddingLeft: showLabel ? '4px' : '0px',
              paddingRight: showLabel ? '12px' : '0px',
            },
            '&:hover': {
              boxShadow: `${config.glow}, 0 4px 12px rgba(0,0,0,0.15)`,
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        />
        
        {/* Sparkle effects for Pro tier */}
        {premiumNo === 3 && (
          <>
            <Box
              component={motion.div}
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                width: 12,
                height: 12,
                background: config.gradient,
                borderRadius: '50%',
                zIndex: 2,
              }}
            />
            <Box
              component={motion.div}
              animate={{
                rotate: -360,
                scale: [1, 1.3, 1],
              }}
              transition={{
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
              }}
              sx={{
                position: 'absolute',
                bottom: -6,
                left: -6,
                width: 8,
                height: 8,
                background: config.gradient,
                borderRadius: '50%',
                zIndex: 2,
              }}
            />
          </>
        )}
      </Box>
    </motion.div>
  );
};

// Premium Circle Badge - for avatar overlay
export const PremiumCircleBadge = ({ 
  premiumNo, 
  size = 'medium' 
}: { 
  premiumNo?: number; 
  size?: 'small' | 'medium' | 'large';
}) => {
  if (!premiumNo || !(premiumNo in premiumConfig)) {
    return null;
  }

  const config = premiumConfig[premiumNo as keyof typeof premiumConfig];
  const IconComponent = config.icon;

  const sizeConfig = {
    small: { diameter: 32, iconSize: 18 },
    medium: { diameter: 40, iconSize: 22 },
    large: { diameter: 48, iconSize: 26 },
  };

  const currentSize = sizeConfig[size];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <Box
        sx={{
          width: currentSize.diameter,
          height: currentSize.diameter,
          borderRadius: '50%',
          background: config.gradient,
          border: '3px solid rgba(255,255,255,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `${config.glow}, 0 4px 12px rgba(0,0,0,0.15)`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
            borderRadius: '50%',
          },
        }}
      >
        <IconComponent
          sx={{
            fontSize: currentSize.iconSize,
            color: 'white',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            zIndex: 1,
          }}
        />
      </Box>
    </motion.div>
  );
};
