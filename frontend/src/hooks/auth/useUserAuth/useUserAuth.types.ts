export interface UserRegisterFormData {
  fullName: string;
  email: string;
  password: string;
}

export interface UserCompleteProfileData {
  contactNo: string | number;
  age: string | number;
  gender: string;
  healthGoal?: string;
}
