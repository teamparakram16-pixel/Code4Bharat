export interface ExpertRegisterFormData {
  fullName: string;
  email: string;
  password: string;
  expertType: "ayurvedic" | "naturopathy";
}

export interface ExpertCompleteProfileData {
  contactNo: string | number;
  clinicAddress: string;
  specialization: string;
  experience: string | number;
  bio?: string;
}
