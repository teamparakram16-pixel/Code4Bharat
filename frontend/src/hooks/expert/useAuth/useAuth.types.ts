interface DoctorSignUp {
  uniqueId: number;
  education: string;
  yearsOfPractice: number;
}

export type SignInWithEmailPasswordProps = (
  email: string,
  password: string
) => Promise<void>;

export type GoogleLoginProps = () => Promise<void>;

export type GoogleSignUpProps = (
  role: "ayurvedicDoctor" | "naturopathyDoctor",
  profileData: DoctorSignUp,
  address: string,
  phoneNumber: number
) => Promise<void>;

export interface SignUpArguTypes {
  email: string;
  password: string;
  name: string;
  address: string;
  contactNo: number;
  role: "ayurvedicDoctor" | "naturopathyDoctor";
  profileData: DoctorSignUp;
}
// types/expert.types.ts

export interface DoctorProfileData {
  education: string;
  yearsOfPractice: number;
  uniqueId: number;
  [key: string]: any; // Optional: for extra profile fields
}

export interface ExpertDocuments {
  identityProof: File;
  degreeCertificate: File;
  registrationProof: File;
  practiceProof: File;
}

export interface CompleteProfileArg {
  profile: DoctorProfileData;
  verificationDetails?: any;
  documents: ExpertDocuments;
}



export type SignUpArguProps = (data: SignUpArguTypes) => Promise<void>;

export type CompleteProfile = (profileData: DoctorSignUp) => Promise<void>;