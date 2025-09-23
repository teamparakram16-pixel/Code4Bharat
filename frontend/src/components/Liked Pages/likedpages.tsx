import { Box, Typography } from "@mui/material";
import GeneralPostCard from "@/components/PostCards/GeneralPostCard/GeneralPostCard";
import { useEffect, useState } from "react";

type PostListProps = {
  posts: any[];
  title: string;
  currentUserId?: string;
};

export const PostList = ({ posts, title }: PostListProps) => {
  const [enrichedPosts, setEnrichedPosts] = useState(posts);

  // Update enrichedPosts when posts prop changes
  useEffect(() => {
    setEnrichedPosts(posts);
  }, [posts]);

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      // Replace with your actual API endpoint for user profile
      console.log("Fetching profile for userId:", userId);
      const res = await fetch(`/api/user/profile/${userId}`);
      if (!res.ok) {
        console.warn("Profile fetch failed for userId:", userId);
        return { fullName: "Unknown", profileImage: "" };
      }
      const data = await res.json();
      console.log("Fetched profile response:", data);
      // If the response is nested, extract the correct fields
      if (data.profile && (data.profile.fullName || data.profile.profileImage)) {
        return {
          fullName: data.profile.fullName ?? "Unknown",
          profileImage: data.profile.profileImage ?? ""
        };
      }
      return {
        fullName: data.fullName ?? "Unknown",
        profileImage: data.profileImage ?? ""
      };
    };

    const enrichPosts = async () => {
      const updated = await Promise.all(
        posts.map(async (post) => {
          // If owner and profile are already populated from backend, use them
          if (post.owner && post.owner.profile && post.owner.profile.fullName) {
            return post;
          }
          
          // If post.user exists and has profile info, use it as owner
          if (post.user && post.user.profile && post.user.profile.fullName) {
            return {
              ...post,
              owner: {
                ...(post.user ?? {}),
                profile: post.user.profile
              }
            };
          }
          
          // Try to extract userId from various possible fields
          const userId =
            post.owner?._id ||
            post.owner?.userId ||
            post.userId ||
            post.user?._id ||
            post.authorId ||
            post.createdBy ||
            post.profileId;
            
          let profile = { fullName: "Unknown", profileImage: "" };
          if (userId) {
            try {
              profile = await fetchProfile(userId);
            } catch (error) {
              console.warn("Failed to fetch profile for userId:", userId, error);
            }
          } else {
            console.warn("No userId found for post:", post);
          }
          
          return {
            ...post,
            owner: {
              ...(post.owner ?? {}),
              profile,
            },
          };
        })
      );
      setEnrichedPosts(updated);
    };
    enrichPosts();
  }, [posts]);

  if (enrichedPosts.length === 0) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h6">No {title.toLowerCase()} yet.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", width: "100%" }}>
      <Typography variant="h5" mb={2}>
        {title}
      </Typography>
      {enrichedPosts.map((post) => (
        <Box key={post._id} mb={3}>
          <GeneralPostCard
            post={post}
            isLiked={false} // GeneralPostCard will determine this internally using useLikes hook
            isSaved={post.isSaved ?? false}
            currentUserId={typeof post.currentUserId === "string" && post.currentUserId ? post.currentUserId : (typeof post.owner?._id === "string" ? post.owner._id : "")}
            onMediaClick={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </Box>
      ))}
    </Box>
  );
};
