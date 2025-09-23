import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";

import ProfileHeader from "@/components/DoctorProfile/ProfileHeader/ProfileHeader";
import AboutSection from "@/components/DoctorProfile/AboutSection/AboutSection";
import ContentTabs from "@/components/DoctorProfile/ContentTabs/ContentTabs";
import { useDoctor } from "@/hooks/useDoctor/useDoctor";
import usePost from "@/hooks/usePost/usePost";
import { toast } from "react-toastify";


interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

const DoctorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { doctor, loading, error } = useDoctor(id);
  const { getPostById } = usePost();

  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState("");

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (doctor?.posts?.length) {
      const fetchPosts = async () => {
        setPostsLoading(true);
        setPostsError("");
        try {
          const data = await getPostById(doctor.posts as any);
          if (data && data.posts) {
            setPosts(data.posts);
          } else {
            setPostsError("Failed to fetch posts");
          }
        } catch (error: any) {
          setPostsError(error.message || "Unexpected error");
        } finally {
          setPostsLoading(false);
        }
      };
      fetchPosts();
    } else {
      setPosts([]);
    }
  }, [doctor]);


  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };


  if (loading) {
    return (
      <Box mt={10} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={10} textAlign="center">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
        <Button href="/search/doctor" variant="contained" sx={{ mt: 2 }}>
          Back to Search
        </Button>
      </Box>
    );
  }

  if (!doctor) {
    return (
      <Box mt={10} textAlign="center">
        <Typography variant="h6">Doctor not found.</Typography>
        <Button href="/search-doctor" variant="contained" sx={{ mt: 2 }}>
          Back to Search
        </Button>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" mt={10} mb={6} px={2}>
      <ProfileHeader
        doctor={{
          id: doctor._id,
          name: doctor.profile?.fullName || doctor.username,
          avatar: doctor.profile?.profileImage || "",
          specialty: doctor.profile?.expertType || "N/A",
          hospital: doctor.profile?.address?.clinicAddress || "N/A",
          location: `${doctor.profile?.address?.city || ""}, ${doctor.profile?.address?.state || ""
            }`,
          posts: doctor.posts?.length || 0,
          followers: doctor.followers || 0,
          following: doctor.following || 0,
          verified: doctor.verifications?.isDoctor || false,
          about: doctor.profile?.bio || "",
        }}
        isFollowing={false}
        onFollow={() => toast.success("Follow clicked")}
        onMessage={() => toast.success("Message clicked")}
        onBookAppointment={() => toast.success("Book Appointment clicked")}
      />

      <ContentTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        postsCount={doctor.posts?.length || 0}
        routinesCount={doctor.routinePosts?.length || 0}
        savedCount={doctor.savedPosts?.length || 0}
        aboutVisible={true}
      />

      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Posts ({doctor.posts?.length || 0})
          </Typography>

          {postsLoading ? (
            <CircularProgress />
          ) : postsError ? (
            <Typography color="error">{postsError}</Typography>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                    {post.content || "No content available."}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No posts available.</Typography>
          )}
        </Box>
      )}


      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Routines ({doctor.routinePosts?.length || 0})
          </Typography>
          {/* Similarly fetch and show routines if needed */}
          {doctor.routinePosts?.length === 0 && (
            <Typography>No routines available.</Typography>
          )}
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Saved ({doctor.savedPosts?.length || 0})
          </Typography>
          {(!doctor.savedPosts || doctor.savedPosts.length === 0) && (
            <Typography>No saved items.</Typography>
          )}
        </Box>
      )}

      {activeTab === 3 && (
        <AboutSection
          doctor={{
            about: doctor.profile?.bio || "No bio available",
            specializations: doctor.profile?.specialization || [],
            languages: doctor.profile?.languagesSpoken || [],
            education: (doctor.profile?.qualifications || []).map((q: any) => ({
              degree: q.degree,
              university: q.college,
              year: q.year,
            })),
            experienceList: [
              {
                position: doctor.profile?.expertType || "",
                hospital: doctor.profile?.address?.clinicAddress || "",
                period: `${doctor.profile?.experience || 0} years experience`,
              },
            ],
            email: doctor.email,
            phone: doctor.profile?.contactNo?.toString() || "" ,
            hospital: doctor.profile?.address?.clinicAddress || "",
            location: `${doctor.profile?.address?.city || ""}, ${doctor.profile?.address?.state || ""}`,

            university: doctor.profile?.qualifications?.[0]?.college || "Unknown University",
            experience: doctor.profile?.experience || 0,
            rating: 0,
            reviews: 0,
          }}
        />

      )}
    </Box>
  );
};

export default DoctorProfile;
