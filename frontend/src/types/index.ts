export interface RoutineType {
  time: string;
  content: string;
}

export interface MediaUploadsType {
  images: File[] | string[];
  video: File | null | string;
  document: File | null | string;
}

export interface UserProfile {
  fullName: string;
  profileImage: string;
}

export interface ExpertProfile {
  fullName: string;
  profileImage: string;
  expertType?: "ayurvedic" | "naturopathy"; // only for experts
}

export interface UserOrExpertDetailsType {
  _id: string;
  profile: UserProfile | ExpertProfile;
}

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: "expert" | "patient";
//   profileImage?: string;
// }

// export interface Expert extends User {
//   education: string;
//   experience: string;
//   clinicLocation: string;
//   licenseNumber: string;
// }

// export interface Patient extends User {
//   medicalHistory?: string;
// }

// export interface Post {
//   id: string;
//   userId: string;
//   content: string;
//   images?: string[];
//   videos?: string[];
//   createdAt: Date;
//   type: "general" | "routine";
// }

// export interface RoutineActivity {
//   time: string;
//   activity: string;
// }

// export interface RoutinePost extends Post {
//   activities: RoutineActivity[];
// }
