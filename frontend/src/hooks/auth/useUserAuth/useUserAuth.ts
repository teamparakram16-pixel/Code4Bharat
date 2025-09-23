import { useAuth } from "@/context/AuthContext";
import useApi from "@/hooks/useApi/useApi";
import { handleAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import { UserRegisterFormData } from "./useUserAuth.types";
import { UserFormData } from "@/components/Forms/User/UserCompleteProfileForm";

const useUserAuth = () => {
  const { post, patch, get } = useApi();
  const { setIsLoggedIn, setRole, setUser } = useAuth(); 

  // 🚀 User Login
  const userLogin = async (email: string, password: string) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/user/login`,
        {
          email,
          password,
          role: "user",
        }
      );

      if (response.success && response.user) {
        
        console.log("✅ Logging in user:", response.user);

        setUser(response.user);
        setIsLoggedIn(true);
        setRole("user");

        localStorage.setItem("user", JSON.stringify(response.user));

        toast.success("Logged in successfully");
      }

      return response;
    } catch (error) {
      handleAxiosError(error);
    }
  };

  // 📝 User Signup
  const userSignUp = async (data: UserRegisterFormData) => {
    try {
      const response = await post(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/user/signup`,
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

  // 📋 Complete Profile
  const completeUserProfile = async (formData: UserFormData) => {
    try {
      const uploadData = new FormData();

      if (formData.governmentId instanceof File) {
        uploadData.append("governmentId", formData.governmentId);
      } else {
        throw new Error("Government ID file is required");
      }

      if (formData.profilePicture instanceof File) {
        uploadData.append("profilePicture", formData.profilePicture);
      }

      const userProfile = {
        fullName: formData.fullName,
        gender: formData.gender?.toLowerCase() || "",
        dateOfBirth:
          formData.dateOfBirth instanceof Date
            ? formData.dateOfBirth.toISOString()
            : formData.dateOfBirth,
        contactNo: formData.contactNo,
        email: formData.email || "",
        currentCity: formData.currentCity,
        state: formData.state,
        healthGoal: formData.healthGoal,
        consent: formData.consent,
      };

      uploadData.append("userProfile", JSON.stringify(userProfile));

      const response = await patch(
        `${import.meta.env.VITE_SERVER_URL}/api/users/complete-profile`,
        uploadData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.success && response.user) {
        // ✅ Update user in context + localStorage
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));

        toast.success("User profile completed successfully");
      }

      return response;
    } catch (err) {
      handleAxiosError(err);
    }
  };

  // 👤 Load profile (for refreshing session)
  const loadProfile = async () => {
    try {
      const response = await get(
        `${import.meta.env.VITE_SERVER_URL}/api/users/user-profile`
      );
      if (response.success && response.user) {
        setUser(response.user);
        setIsLoggedIn(true);
        setRole(response.user.role);
        localStorage.setItem("user", JSON.stringify(response.user));
        return response.user;
      }
      return null;
    } catch (err) {
      handleAxiosError(err);
      return null;
    }
  };

  return {
    userLogin,
    userSignUp,
    completeUserProfile,
    loadProfile,
  };
};

export default useUserAuth;
