import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getExpertProfile } from "@/utils/fetchProfiles";

const expertProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  contactNo: z.string().min(10, "Contact number must be at least 10 digits"),
  gender: z.enum(["male", "female", "other", ""], {
    required_error: "Gender is required"
  }),
  bio: z.string().optional(),
});

export type ExpertProfileFormData = z.infer<typeof expertProfileSchema>;

export const useExpertProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpertProfileFormData>({
    resolver: zodResolver(expertProfileSchema),
    defaultValues: {
      fullName: "",
      contactNo: "",
      gender: "",
      bio: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const expert = await getExpertProfile();
        reset({
          fullName: expert.profile?.fullName || "",
          contactNo: expert.profile?.contactNo || "",
          gender: expert.verificationDetails?.gender || "",
          bio: expert.profile?.bio || "",
        });
        setAvatar(expert.profile?.profileImage || null);
        setFetchError(null);
      } catch (error) {
        setFetchError("Failed to load expert profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = async () => {
    setIsEditing(false);
    const expert = await getExpertProfile();
    reset({
      fullName: expert.profile?.fullName || "",
      contactNo: expert.profile?.contactNo || "",
      gender: expert.verificationDetails?.gender || "",
      bio: expert.profile?.bio || "",
    });
    setAvatar(expert.profile?.profileImage || null);
  };

  const handleSave = async (data: ExpertProfileFormData) => {
    try {
      setIsSaving(true);
      const reqBody = {
        newfullName: data.fullName,
        newphoneNumber: data.contactNo,
        newGender: data.gender,
        newBio: data.bio,
      };
  const res = await fetch("/api/expert/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reqBody),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to update profile");
      setIsEditing(false);
      setShowSuccess(true);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Failed to update profile");
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
    showSuccess,
    setShowSuccess,
    fetchError,
    handleEdit,
    handleCancel,
    handleSave,
    handleAvatarChange,
  };
};
