import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Container,
  Paper,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ProfileHeader } from "@/components/ProfileElements/ProfileHeader";
import { ProfileEditButton } from "@/components/ProfileElements/ProfileEditButton";
import { ExpertProfilePersonalInfo } from "@/components/ProfileElements/ExpertProfilePersonalInfo";
import { ExpertProfileProfessionalInfo } from "@/components/ProfileElements/ExpertProfileProfessionalInfo";
import { ExpertProfileQualifications } from "@/components/ProfileElements/ExpertProfileQualifications";
import { ExpertProfileDocuments } from "@/components/ProfileElements/ExpertProfileDocuments";
import { getExpertProfile } from "@/utils/fetchProfiles";
import {toast} from "react-toastify";

// function toDateInputValue(dateString?: string): string {
//   if (!dateString) return "";
//   const date = new Date(dateString);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`;
// }


const expertProfileSchema = z.object({
  profile: z.object({
    fullName: z.string().optional(),
    contactNo: z.string().optional(),
    email: z.string().email().optional(),
    expertType: z.enum(["ayurvedic", "naturopathy"]).optional(),
    profileImage: z.string().optional(),
    experience: z.number().optional(),
    qualifications: z.array(
      z.object({
        degree: z.string(),
        college: z.string(),
        year: z.string(),
      })
    ).optional(),
    address: z.object({
      country: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
      clinicAddress: z.string().optional(),
    }).optional(),
    specialization: z.array(z.string()).optional(),
    bio: z.string().optional(),
    languagesSpoken: z.array(z.string()).optional(),
  }),
  verificationDetails: z.object({
    gender: z.enum(["male", "female", "other", ""]).optional(),
    registrationDetails: z.object({
      registrationNumber: z.string().optional(),
      registrationCouncil: z.string().optional(),
      yearOfRegistration: z.number().optional(),
    }).optional(),
    documents: z.object({
      identityProof: z.string().optional(),
      degreeCertificate: z.string().optional(),
      registrationProof: z.string().optional(),
      practiceProof: z.string().optional(),
    }).optional(),
  }),
});


type ExpertFormData = z.infer<typeof expertProfileSchema>;

const defaultFormValues: ExpertFormData = {
  profile: {
    fullName: "",
    contactNo: "",
    email: "",
    expertType: undefined,
    profileImage: "",
    experience: undefined,
    qualifications: [{ degree: "", college: "", year: "" }],
    address: {
      country: "Bharat",
      city: "",
      state: "",
      pincode: "",
      clinicAddress: "",
    },
    specialization: [],
    bio: "",
    languagesSpoken: [],
  },
  verificationDetails: {
    gender: "",
    registrationDetails: {
      registrationNumber: "",
      registrationCouncil: "",
      yearOfRegistration: undefined,
    },
    documents: {
      identityProof: "",
      degreeCertificate: "",
      registrationProof: "",
      practiceProof: "",
    },
  },
};


const ExpertProfilePage = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExpertFormData>({
    resolver: zodResolver(expertProfileSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const expert = await getExpertProfile();
        if (expert.profile?.profileImage) {
          setAvatar(expert.profile.profileImage);
        }

        reset({
          profile: {
            fullName: expert.profile?.fullName ?? "",
            contactNo: expert.profile?.contactNo ?? "",
            email: expert.email ?? "",
            expertType: expert.profile?.expertType ?? undefined,
            profileImage: expert.profile?.profileImage ?? "",
            experience: expert.profile?.experience ?? undefined,
            qualifications:
              expert.profile?.qualifications?.length > 0
                ? expert.profile.qualifications
                : [{ degree: "", college: "", year: "" }],
            address: {
              country: expert.profile?.address?.country ?? "Bharat",
              city: expert.profile?.address?.city ?? "",
              state: expert.profile?.address?.state ?? "",
              pincode: expert.profile?.address?.pincode ?? "",
              clinicAddress: expert.profile?.address?.clinicAddress ?? "",
            },
            specialization: expert.profile?.specialization ?? [],
            bio: expert.profile?.bio ?? "",
            languagesSpoken: expert.profile?.languagesSpoken ?? [],
          },
          verificationDetails: {
            gender: expert.verificationDetails?.gender || "",
            registrationDetails: {
              registrationNumber:
                expert.verificationDetails?.registrationDetails?.registrationNumber ??
                "",
              registrationCouncil:
                expert.verificationDetails?.registrationDetails?.registrationCouncil ??
                "",
              yearOfRegistration:
                expert.verificationDetails?.registrationDetails?.yearOfRegistration ??
                undefined,
            },
            documents: {
              identityProof:
                expert.verificationDetails?.documents?.identityProof ?? "",
              degreeCertificate:
                expert.verificationDetails?.documents?.degreeCertificate ?? "",
              registrationProof:
                expert.verificationDetails?.documents?.registrationProof ?? "",
              practiceProof:
                expert.verificationDetails?.documents?.practiceProof ?? "",
            },
          },
        });

        setFetchError(null);
      } catch (error) {
        console.error("Failed to fetch Expert Profile", error);
        setFetchError("Failed to load expert profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset(); 
    setIsEditing(false);
  };

const handleSave = async (data: ExpertFormData) => {
  try {
    // Only send required fields for expert update
    const reqBody = {
      newfullName: data.profile.fullName,
      newphoneNumber: data.profile.contactNo,
      newGender: data.verificationDetails.gender,
      newBio: data.profile.bio,
    };

    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/experts/update-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(reqBody),
    });

    let result = {};
    try {
      result = await response.json();
    } catch (jsonError) {
      // If response is not JSON, fallback to generic message
      result = { message: "Profile updated successfully" };
    }

    const msg = (result as { message?: string }).message;
    if (!response.ok) {
      throw new Error(msg || "Failed to update profile");
    }

    toast.success(msg || "Profile updated successfully");
    setIsEditing(false);
  } catch (error: any) {
    console.error("Update failed:", error);
    toast.error(error.message || "Failed to update profile");
  }
};


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (fetchError) return <div>{fetchError}</div>;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container
        maxWidth={false}
        disableGutters
        sx={{ py: 0, px: 0, width: "100vw", minWidth: 0 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 1, sm: 2, md: 4, lg: 6 },
            borderRadius: 0,
            background: theme.palette.background.paper,
            boxShadow: theme.shadows[3],
            width: "100vw",
            maxWidth: "100vw",
            minHeight: "100vh",
            mx: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 4,
            }}
          >
            <ProfileEditButton
              isEditing={isEditing}
              onEdit={handleEdit}
              onSave={handleSubmit(handleSave)}
              onCancel={handleCancel}
            />
          </Box>

          <ProfileHeader
            title="Expert Profile"
            subtitle="Manage your professional information and personal details"
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 6,
              position: "relative",
            }}
          >
          {/* Simple Avatar */}
          <Box sx={{ position: 'relative', mb: 3 }}>
            <Avatar
              src={avatar || "/default-avatar.jpg"}
              sx={{
                width: 140,
                height: 140,
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: `0 4px 20px ${theme.palette.primary.main}30`,
              }}
            />
          </Box>            {isEditing && (
              <Box
                component="label"
                htmlFor="expert-avatar-upload"
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  cursor: "pointer",
                  fontWeight: 500,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Change Photo
                <input 
                  id="expert-avatar-upload"
                  type="file" 
                  hidden 
                  accept="image/*"
                  onChange={handleAvatarChange} 
                />
              </Box>
            )}
          </Box>

          {/* Personal Information Component */}
          <ExpertProfilePersonalInfo
            control={control}
            errors={errors}
            isEditing={isEditing}
          />

          <Divider
            sx={{
              my: 6,
              borderColor: theme.palette.divider,
              borderWidth: 1,
            }}
          />

          <ExpertProfileProfessionalInfo
            control={control}
            errors={errors}
            isEditing={false}
          />

          <Divider
            sx={{
              my: 6,
              borderColor: theme.palette.divider,
              borderWidth: 1,
            }}
          />

          <ExpertProfileQualifications
            control={control}
            errors={errors}
            isEditing={false}
          />

          <Divider
            sx={{
              my: 6,
              borderColor: theme.palette.divider,
              borderWidth: 1,
            }}
          />

          <ExpertProfileDocuments
            control={control}
            errors={errors}
            isEditing={false}
          />
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default ExpertProfilePage;
