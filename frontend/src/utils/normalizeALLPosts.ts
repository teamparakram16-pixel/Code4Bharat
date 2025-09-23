type UnifiedPost = {
  postId: string;
  title: string;
  description: string;
  routines: { time: string; content: string }[];
  filters: string[];
  type: "posts" | "routines" | "successstories";
};

export function normalizeAllPosts({
  gposts = [],
  routines = [],
  successStories = [],
}: {
  gposts?: any[];
  routines?: any[];
  successStories?: any[];
}): UnifiedPost[] {
  const generalPosts = gposts.map((post) => ({
    postId: post.id.toString(),
    title: post.title,
    description: post.content,
    routines: [], // general posts don't have routines
    filters: post.tags || [],
    type: "posts" as const,
  }));

  const routinePosts = routines.map((routine) => ({
    postId: routine.id.toString(),
    title: routine.title,
    description: routine.content,
    routines: routine.activities || [],
    filters: routine.tags || [],
    type: "routines" as const,
  }));

  const successPosts = successStories.map((story) => ({
    postId: story.id.toString(),
    title: story.title,
    description: story.content,
    routines: story.activities  || [],
    filters: story.tags || [],
    type: "successstories" as const,
  }));

  return [...generalPosts, ...routinePosts, ...successPosts];
}
