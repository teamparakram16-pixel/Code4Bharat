// Add TypeScript types for the routine appointment response
export interface RoutineAppointmentUser {
  _id: string;
  username: string;
  email: string;
  profile: {
    fullName: string;
    profileImage: string;
    contactNo: string;
    healthGoal: string;
    gender: string;
    age: number;
    bio: string;
  };
  role: string;
  premiumUser: boolean;
  verifications: {
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RoutineAppointmentDoctor {
  _id: string;
  username: string;
  email: string;
  profile: {
    fullName: string;
    profileImage: string;
    contactNo: string;
    healthGoal: string;
    gender: string;
    age: number;
    bio: string;
  };
  specialization: string;
  experience: number;
  qualifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoutineAppointmentData {
  profession: string;
  workHours: string;
  workEnvironment: string;
  physicalActivity: string;
  wakeUpTime: string;
  sleepTime: string;
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  exerciseTime: string;
  exerciseType: string;
  currentHealthIssues: string[];
  healthConcerns: string;
  energyLevels: string;
  stressLevels: string;
  medicalHistory: string;
  surgeries: string;
  allergies: string;
  familyHistory: string;
  medications: string;
  supplements: string;
  dietType: string;
  foodPreferences: string;
  foodAvoidances: string;
  waterIntake: string;
  healthGoals: string[];
  specificConcerns: string;
  expectations: string;
  mentalHealthConcerns: string;
  lifeChanges: string;
  socialSupport: string;
  hobbies: string;
}

export interface RoutineAppointmentPrakrithiAnalysis {
  _id: string;
  user: string;
  analysisResult: string;
  details: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RoutineAppointmentResponse {
  pdfUrl: string;
  createdAt: string | null;
}

export interface RoutineAppointment {
  _id: string;
  userId: RoutineAppointmentUser;
  doctorId: RoutineAppointmentDoctor;
  appointmentData: RoutineAppointmentData;
  prakrithiAnalysis: RoutineAppointmentPrakrithiAnalysis;
  routineResponse: RoutineAppointmentResponse;
  paymentId: string | null;
  status: "pending" | "viewed" | "uploaded" | "seen";
  createdAt: string;
  updatedAt: string;
  __v: number;
}
