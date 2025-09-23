import React from 'react';
import { Chip } from '@mui/material';

interface AppointmentStatusBadgeProps {
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'routine_shared';
  size?: 'small' | 'medium';
}

const AppointmentStatusBadge: React.FC<AppointmentStatusBadgeProps> = ({ 
  status, 
  size = 'small' 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'warning' as const };
      case 'accepted':
        return { label: 'Accepted', color: 'success' as const };
      case 'rejected':
        return { label: 'Rejected', color: 'error' as const };
      case 'completed':
        return { label: 'Completed', color: 'info' as const };
      case 'routine_shared':
        return { label: 'Routine Shared', color: 'secondary' as const };
      default:
        return { label: 'Unknown', color: 'default' as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip 
      label={config.label}
      color={config.color}
      size={size}
    />
  );
};

export default AppointmentStatusBadge;