import { MediaUploadsType } from "@/types";

export interface PostFormSchema {
  title: string;
  description: string;
  media: MediaUploadsType;
}
