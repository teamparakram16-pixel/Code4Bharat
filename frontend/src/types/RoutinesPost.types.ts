import { RoutineType, UserOrExpertDetailsType } from ".";

export interface RoutinePostType {
  _id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  filters: string[];
  routines: RoutineType[];
  readTime: string;
  likesCount: number;
  commentsCount: number;
  owner: UserOrExpertDetailsType; // populated owner data
  createdAt: string;
}
