export interface Doctor {
  _id: string;
  username: string;
  email: string;
  profile: {
    fullName: string;
    contactNo: number;
    expertType: string;
    profileImage: string;
    experience: number;
    qualifications: {
      degree: string;
      college: string;
      year: string;
      _id?: string; // Optional _id from qualifications array
    }[];
    specialization: string[];
    bio: string;
    languagesSpoken: string[];
    address: { 
      country: string;
      city: string;
      state: string;
      pincode: string;
      clinicAddress: string;
    };
  };
  verificationDetails?: {
    registrationDetails?: {
      registrationNumber: string;
      registrationCouncil: string;
      yearOfRegistration: number;
    };
    documents?: {
      identityProof?: string;
      degreeCertificate?: string;
      registrationProof?: string;
      practiceProof?: string;
    };
    dateOfBirth?: string;
    gender?: string;
  };
  verifications?: {
    email?: boolean;
    contactNo?: boolean;
    completeProfile?: boolean;
    isDoctor?: boolean;
  };
  posts: string[];
  routinePosts: string[];
  taggedPosts: string[];
  savedPosts: string[];
  followers: number;
  following: number;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}
