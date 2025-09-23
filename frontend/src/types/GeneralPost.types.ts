import { MediaUploadsType, UserOrExpertDetailsType } from ".";

export interface GeneralPostType {
  _id: string;
  title: string;
  description: string;
  media: MediaUploadsType;
  filters: string[];
  readTime: string;
  likesCount: number;
  commentsCount: number;
  owner: UserOrExpertDetailsType; // populated expert with profile
  createdAt: string;
}
