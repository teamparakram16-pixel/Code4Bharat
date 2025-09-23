import { useAuth } from "@/context/AuthContext"; // ✅ use your global auth context
import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import { ExpertRegisterFormData } from "./useExpertAuth.types";
import { ExpertFormData } from "@/pages/Expert/ExpertCompleteProfile/ExpertCompleteProfile.types";

const useExpertAuth = () => {
  const { post, patch, get } = useApi();
  const { setIsLoggedIn, setRole, setUser } = useAuth(); // ✅ include these

  // 🚀 Expert Login
  const expertLogin = async (email: string, password: string) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/expert/login`,
        {
          email,
          password,
          role: "expert",
        }
      );

      if (response.success && response.expert) {
        // ✅ Save expert in context + localStorage
        setUser(response.expert);
        setIsLoggedIn(true);
        setRole("expert");
        localStorage.setItem("user", JSON.stringify(response.expert));

        toast.success("Logged in successfully");
      }

      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // 📝 Expert Signup
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

  // 📋 Complete Expert Profile
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

      if (response.success && response.expert) {
        // ✅ Update expert in context + localStorage
        setUser(response.expert);
        localStorage.setItem("user", JSON.stringify(response.expert));

        toast.success("Profile completed successfully");
      }

      return response;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // 👤 Load Expert Profile
  const loadExpertProfile = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/experts/profile`
      );
      if (response.success && response.expert) {
        // ✅ Save expert in context + localStorage
        setUser(response.expert);
        setIsLoggedIn(true);
        setRole("expert");
        localStorage.setItem("user", JSON.stringify(response.expert));

        return response.expert;
      }
      return null;
    } catch (error) {
      toast.error("Failed to load profile.");
      handleAxiosError(error);
      return null;
    }
  };

  return {
    expertLogin,
    expertSignUp,
    expertCompleteProfile,
    loadExpertProfile,
  };
};

export default useExpertAuth;
