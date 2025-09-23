export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  avatar?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  profileImage?: string;
  email: string;
}

export interface PrakritiData {
  vata: number;
  pitta: number;
  kapha: number;
  dominantDosha: "vata" | "pitta" | "kapha";
  assessmentDate: string;
  Body_Type?: string;
  Sleep_Pattern?: string;
  Dominant_Prakrithi?: string;
  Body_Constituents?: Record<string, any>;
  Potential_Health_Concerns?: string[];
  Recommendations?: {
    Dietary_Guidelines?: string[];
    Lifestyle_Suggestions?: string[];
    Ayurvedic_Herbs_Remedies?: string[] | Record<string, string[]>;
  };
}

export interface HealthMetrics {
  bmi: number;
  bloodPressure: string;
  heartRate: number;
  sleepQuality: number; // 1-10 scale
  stressLevel: number; // 1-10 scale
  energyLevel: number; // 1-10 scale
}

export interface RoutineItem {
  id: string;
  category: "exercise" | "diet" | "lifestyle" | "meditation";
  title: string;
  description: string;
  duration: string;
  frequency: string;
  instructions: string;
}

export interface AppointmentData {
  profession: string;
  healthConcerns: string;
  workHours: string;
  physicalActivity: string;
  dietType: string;
  foodPreferences: string;
  waterIntake: string;
}

export interface RoutineResponse {
  pdfUrl?: string;
  sharedRoutine?: RoutineItem[];
  doctorNotes?: string;
}

export interface RoutinesConsultation {
  id: string;
  user: {
    _id: string;
    email: string;
    profile: {
      fullName: string;
      age: number;
      gender: string;
      contactNo: string;
      address?: {
        clinicAddress: string;
      };
      profileImage?: string;
    };
  };
  doctor: {
    _id: string;
    email: string;
    profile: {
      fullName: string;
      specialization: string | string[];
      experience: number;
      profileImage?: string;
    };
  };
  appointmentData: AppointmentData;
  prakrithiAnalysis: PrakritiData;
  routineResponse: RoutineResponse;
  status: "pending" | "routine_shared" | "completed";
  createdAt: string;
  updatedAt: string;
}
