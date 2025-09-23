import { MediaUploadsType, RoutineType } from "@/types";

export interface SuccessStorySchema {
  title: string;
  description: string;
  media: MediaUploadsType;
  routines: RoutineType[];
  tagged: string[];
}
