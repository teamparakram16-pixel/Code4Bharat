import { useState } from "react";
import { PostList } from "@/components/Liked Pages/likedpages";
import { Box, Tabs, Tab } from "@mui/material";
import { useBookmarks } from "@/hooks/useBookmarks/useBookmarks";
import { useLikes } from "@/hooks/useLikes/useLikes";
import { PostCardSkeleton } from "@/components/PostCards/PostCardSkeleton";

type TabType = "liked" | "bookmarked";

export const UserPostsPage = () => {
  const [tab, setTab] = useState<TabType>("liked");
  const { likedPosts, isLoading: likesLoading } = useLikes();
  const { bookmarks, isLoading: bookmarksLoading } = useBookmarks();

  const posts = tab === "liked" ? likedPosts : bookmarks ?? [];

  if ((tab === "liked" && likesLoading) || (tab === "bookmarked" && bookmarksLoading)) {
    return (
      <>
        {[...Array(10)].map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </>
    );
  }

  return (
    <Box width="100%" p={10} maxWidth="100vw" minWidth="100vw" mx="auto">
      <Tabs
        value={tab}
        onChange={(_, value) => setTab(value)}
        aria-label="liked or bookmarked posts"
        centered
      >
        <Tab label="Liked Posts" value="liked" />
        <Tab label="Bookmarked Posts" value="bookmarked" />
      </Tabs>

      <PostList
        posts={posts}
        title={tab === "liked" ? "Liked Posts" : "Bookmarked Posts"}
      />
    </Box>
  );
};
