import React from 'react';
import { Button, Stack } from '@mui/material';
import { Check, Close, Visibility, Share } from '@mui/icons-material';

interface AppointmentActionButtonsProps {
  appointmentId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'routine_shared';
  type: 'consultation' | 'routines';
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onView?: (id: string) => void;
  onShare?: (id: string) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
}

const AppointmentActionButtons: React.FC<AppointmentActionButtonsProps> = ({
  appointmentId,
  status,
  type,
  onAccept,
  onReject,
  onView,
  onShare,
  size = 'small',
  variant = 'outlined',
}) => {
  const renderPendingActions = () => {
    if (type === 'consultation') {
      return (
        <>
          {onAccept && (
            <Button
              size={size}
              variant="contained"
              color="success"
              startIcon={<Check />}
              onClick={() => onAccept(appointmentId)}
            >
              Accept
            </Button>
          )}
          {onReject && (
            <Button
              size={size}
              variant={variant}
              color="error"
              startIcon={<Close />}
              onClick={() => onReject(appointmentId)}
            >
              Reject
            </Button>
          )}
        </>
      );
    } else if (type === 'routines') {
      return (
        <>
          {onShare && (
            <Button
              size={size}
              variant="contained"
              color="secondary"
              startIcon={<Share />}
              onClick={() => onShare(appointmentId)}
            >
              Share Routine
            </Button>
          )}
        </>
      );
    }
    return null;
  };

  const renderViewButton = () => {
    if (onView) {
      return (
        <Button
          size={size}
          variant={variant}
          startIcon={<Visibility />}
          onClick={() => onView(appointmentId)}
        >
          View Details
        </Button>
      );
    }
    return null;
  };

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
      {status === 'pending' && renderPendingActions()}
      {renderViewButton()}
    </Stack>
  );
};

export default AppointmentActionButtons;