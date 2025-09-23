import { Box, Typography, Chip, Avatar } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import { SuccessStoryType } from "@/types/SuccessStory.types";

export const TaggedDoctors = ({ post }: { post: SuccessStoryType }) => {
  // const navigate = useNavigate();

  // Ensure post.verified and post.rejections are always arrays of objects with .expert
  const getTaggedDoctorStatus = (doctorId: string) => {
    if (post.verified.some((d: any) => d.expert && d.expert._id === doctorId))
      return "verified";
    if (
      post.rejections &&
      post.rejections.some((d: any) => d.expert && d.expert._id === doctorId)
    )
      return "invalid";
    return "unverified";
  };

  return post.tagged.length > 0 ? (
    <Box sx={{ px: 2, pt: 0, pb: 1 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mb: 1, display: "block" }}
      >
        Tagged Doctors:
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {post.tagged.map((doctor) => {
          const status = getTaggedDoctorStatus(doctor._id);
          return (
            <Chip
              key={doctor._id}
              avatar={<Avatar src={doctor.profile.profileImage} />}
              label={`Dr. ${doctor.profile.fullName}`}
              size="small"
              // onClick={() => navigate(`/doctors/profile/${doctor._id}`)}
              sx={{
                backgroundColor:
                  status === "verified"
                    ? "rgba(5, 150, 105, 0.1)"
                    : status === "invalid"
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(156, 163, 175, 0.1)",
                color:
                  status === "verified"
                    ? "rgb(5, 150, 105)"
                    : status === "invalid"
                    ? "rgb(239, 68, 68)"
                    : "rgb(156, 163, 175)",
                "&:hover": {
                  backgroundColor:
                    status === "verified"
                      ? "rgba(5, 150, 105, 0.2)"
                      : status === "invalid"
                      ? "rgba(239, 68, 68, 0.2)"
                      : "rgba(156, 163, 175, 0.2)",
                },
                fontSize: "0.7rem",
                height: "28px",
              }}
            />
          );
        })}
      </Box>
    </Box>
  ) : null;
};
