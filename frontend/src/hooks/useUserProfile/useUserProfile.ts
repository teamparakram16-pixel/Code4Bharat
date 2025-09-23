import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUserProfile } from "@/utils/fetchUserProfiles";
import useUserAuth from "@/hooks/auth/useUserAuth/useUserAuth";

// Helper function to convert date string to input format
// function toDateInputValue(dateString?: string): string {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   if (isNaN(date.getTime())) return "";
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// }

const userSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  email: z.string().email().optional(),
  healthGoal: z.string().min(1, "Health goal is required"),
  bio: z.string().min(1, "Bio is required"),
  gender: z.enum(["male", "female", "other", ""], {
    required_error: "Gender is required"
  }),
  age: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, 
    z.number().int().min(1, "Age is required and must be at least 1").max(120, "Age must be less than 120")
  ),
});

type UserFormData = z.infer<typeof userSchema>;

export const useUserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [premiumInfo, setPremiumInfo] = useState<{
    premiumNo?: number;
    premiumOption?: any;
    validTill?: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { loadProfile } = useUserAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      fullName: "",
      contactNo: "",
      email: "",
      healthGoal: "",
      bio: "",
  gender: '',
      age: undefined,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const user = await getUserProfile();
        if (user?.profile) {
          const profile = user.profile;
          reset({
            fullName: profile.fullName || "",
            contactNo: profile.contactNo || "",
            email: user.email || "",
            healthGoal: profile.healthGoal || "",
            bio: profile.bio || "",
            gender: profile.gender || '',
            age: typeof profile.age === "number" && !isNaN(profile.age) ? profile.age : undefined,
          });
          setAvatar(profile.profileImage || null);
          
          // Set premium information
          if (user.premiumFeature) {
            setPremiumInfo({
              premiumNo: user.premiumFeature.premiumNo,
              premiumOption: user.premiumFeature.premiumOption,
              validTill: user.premiumFeature.validTill,
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = async () => {
    setIsEditing(false);
    const user = await loadProfile();
    if (user?.profile) {
      reset({
        fullName: user.profile.fullName || "",
        contactNo: user.profile.contactNo || "",
        email: user.email || "",
        healthGoal: user.profile.healthGoal || "",
        bio: user.profile.bio || "",
  gender: user.profile.gender || '',
        age: typeof user.profile.age === "number" && !isNaN(user.profile.age) ? user.profile.age : undefined,
      });
      setAvatar(user.profile.profileImage || null);
    }
  };

  const handleSave = async (data: UserFormData) => {
    try {
      setIsSaving(true);
      // Prepare request body as per backend requirements - all fields are required
      const reqBody = {
        newfullName: data.fullName,
        newphoneNumber: data.contactNo,
        newhealthGoal: data.healthGoal,
        newGender: data.gender,
        newAge: data.age,
        newBio: data.bio,
      };
      
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users/update-profile`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          // Add auth token if available
          ...(localStorage.getItem('authToken') && {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          })
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(reqBody),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || "Failed to update profile");
      }
      
      // Successfully updated - refresh the profile data
      await loadProfile();
      setIsEditing(false);
      setShowSuccess(true); // Show success popup
      
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Show error message (you can add a toast notification here)
      alert(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return {
    control,
    handleSubmit,
    errors,
    isEditing,
    isLoading,
    isSaving,
    avatar,
    premiumInfo,
    showSuccess,
    setShowSuccess,
    handleEdit,
    handleCancel,
    handleSave,
    handleAvatarChange,
  };
};
