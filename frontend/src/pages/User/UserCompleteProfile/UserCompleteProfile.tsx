import React from "react";
import { useNavigate } from "react-router-dom";
import useUserAuth from "@/hooks/auth/useUserAuth/useUserAuth";
import { UserCompleteProfileForm } from "@/components/Forms/User/UserCompleteProfileForm";
import { UserFormData } from "@/components/Forms/User/UserCompleteProfileForm/validation.ts";

const UserCompleteProfile: React.FC = () => {
  const { completeUserProfile } = useUserAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: UserFormData) => {
    // Calculate age from dateOfBirth
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const profileData = {
      ...data,
      age: age.toString(),
    };
    
    const response = await completeUserProfile(profileData);
    if (response.success) {
      navigate("/gposts");
    }
  };

  return <UserCompleteProfileForm onSubmit={onSubmit} />;
};

export default UserCompleteProfile;