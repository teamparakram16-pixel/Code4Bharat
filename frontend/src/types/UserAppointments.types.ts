// User Appointments Types
export interface DoctorInfo {
  id: string;
  fullName: string;
  profileImage?: string;
  specialization: string;
  experience: number;
  rating: number;
}

export interface AppointmentBase {
  id: string;
  doctorInfo: DoctorInfo;
  appointmentDate: string;
  appointmentTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'confirmed';
  appointmentType: 'consultation' | 'routine';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationAppointment extends AppointmentBase {
  appointmentType: 'consultation';
  reason: string;
  symptoms?: string[];
  duration: number; // in minutes
  consultationFee: number;
  meetingLink?: string;
  prescription?: string;
}

export interface RoutineAppointment extends AppointmentBase {
  appointmentType: 'routine';
  routineType: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  description: string;
  instructions?: string;
  nextFollowUp?: string;
}

export type UserAppointment = ConsultationAppointment | RoutineAppointment;

export interface AppointmentsResponse {
  success: boolean;
  data: {
    consultations: ConsultationAppointment[];
    routines: RoutineAppointment[];
    total: number;
  };
  message?: string;
}

export interface AppointmentFilters {
  status?: 'all' | 'scheduled' | 'completed' | 'cancelled';
  dateRange?: {
    from: string;
    to: string;
  };
  doctorId?: string;
}