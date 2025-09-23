import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import { ExpertRegisterFormData } from "./useExpertAuth.types";
import { ExpertFormData } from "@/pages/Expert/ExpertCompleteProfile/ExpertCompleteProfile.types";

const useExpertAuth = () => {
  const { post, patch, get } = useApi();

  const expertLogin = async (email: string, password: string) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/expert/login`,
        {
          email,
          password,
          role: "Expert",
        }
      );
      if (response.success) {
        toast.success("Logged in successfully");
      }
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const expertSignUp = async (data: ExpertRegisterFormData) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/expert/signup`,
        data
      );
      if (response.success) {
        toast.success("Signed up successfully");
      }
      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const expertCompleteProfile = async (formData: ExpertFormData) => {
    try {
      const uploadData = new FormData();

      if (formData.identityProof)
        uploadData.append("identityProof", formData.identityProof);
      if (formData.degreeCertificate)
        uploadData.append("degreeCertificate", formData.degreeCertificate);
      if (formData.registrationProof)
        uploadData.append("registrationProof", formData.registrationProof);
      if (formData.practiceProof)
        uploadData.append("practiceProof", formData.practiceProof);

      const profileData = {
        profile: {
          contactNo: parseInt(formData.mobileNumber),
          expertType: formData.expertType,
          experience: formData.yearsOfExperience,
          qualifications: formData.qualifications.map((q) => ({
            degree: q.degree,
            college: q.college,
            year: q.year,
          })),
          address: {
            country: "Bharat",
            city: formData.city,
            state: formData.state,
            pincode: formData.pinCode,
            clinicAddress: formData.street ?? "",
          },
          specialization: formData.specializations,
          bio: formData.bio ?? "",
          languagesSpoken: formData.languages,
        },
        verificationDetails: {
          dateOfBirth: formData.dateOfBirth.toISOString(),
          gender: formData.gender.toLowerCase() as "male" | "female" | "other",
          registrationDetails: {
            registrationNumber: formData.ayushRegistrationNumber,
            registrationCouncil: formData.registrationCouncil,
            yearOfRegistration: parseInt(formData.yearOfRegistration),
          },
        },
      };

      uploadData.append("profile", JSON.stringify(profileData.profile));
      uploadData.append(
        "verificationDetails",
        JSON.stringify(profileData.verificationDetails)
      );

      const response = await patch(
        `${import.meta.env.VITE_SERVER_URL}/api/experts/complete-profile`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success) {
        toast.success("Profile completed successfully");
      }

      return response;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // ✅ NEW FUNCTION: Load Expert Profile
  const loadExpertProfile = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/experts/profile`
      );
      if (response.success) {
        return response.expert; // return only expert object
      }
    } catch (error) {
      toast.error("Failed to load profile.");
      handleAxiosError(error);
    }
  };

  return {
    expertLogin,
    expertSignUp,
    expertCompleteProfile,
    loadExpertProfile, // ⬅️ export it here
  };
};

export default useExpertAuth;
