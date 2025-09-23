import React from 'react';
import { Chip } from '@mui/material';
import { LocalHospital, Assignment } from '@mui/icons-material';

interface AppointmentTypeBadgeProps {
  type: 'consultation' | 'routines';
  size?: 'small' | 'medium';
}

const AppointmentTypeBadge: React.FC<AppointmentTypeBadgeProps> = ({ 
  type, 
  size = 'small' 
}) => {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'consultation':
        return { 
          label: 'Consultation', 
          color: 'primary' as const,
          icon: <LocalHospital />
        };
      case 'routines':
        return { 
          label: 'Routines Consultation', 
          color: 'secondary' as const,
          icon: <Assignment />
        };
      default:
        return { 
          label: 'Unknown', 
          color: 'default' as const,
          icon: null
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Chip 
      label={config.label}
      color={config.color}
      size={size}
      {...(config.icon && { icon: config.icon })}
    />
  );
};

export default AppointmentTypeBadge;