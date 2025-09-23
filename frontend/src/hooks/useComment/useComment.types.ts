export type PostType = "Post" | "SuccessStory" | "Routine";

export interface CommentPayload {
  content: string;
  repliedTo?: string | null;
}

export interface FetchCommentsOptions {
  postType: PostType;
  postId: string;
  parentCommentId?: string;
}

export interface CreateCommentOptions {
  postType: PostType;
  postId: string;
  payload: CommentPayload;
}

export interface EditCommentOptions {
  postType: PostType;
  commentId: string;
  content: string;
}

export interface DeleteCommentOptions {
  postType: PostType;
  commentId: string;
}
