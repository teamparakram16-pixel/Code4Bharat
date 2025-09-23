import React from 'react';
import { Card, CardContent, Avatar, Typography, Stack, Box } from '@mui/material';
import { Phone, Email, Person } from '@mui/icons-material';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  avatar?: string;
}

interface PatientInfoCardProps {
  patient: Patient;
  compact?: boolean;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ 
  patient, 
  compact = false 
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar 
          sx={{ 
            width: 40, 
            height: 40,
            bgcolor: 'primary.main',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          {getInitials(patient.name)}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="bold">
            {patient.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {patient.age} years, {patient.gender}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}
          >
            {getInitials(patient.name)}
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {patient.name}
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2">
              {patient.age} years, {patient.gender}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Phone fontSize="small" color="action" />
            <Typography variant="body2">
              {patient.phone}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Email fontSize="small" color="action" />
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {patient.email}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PatientInfoCard;