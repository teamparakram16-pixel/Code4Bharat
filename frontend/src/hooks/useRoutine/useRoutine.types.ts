import { RoutineType } from "@/types";


export interface RoutineSchema {
  title: string;
  description: string;
  thumbnail: File | null;
  routines: RoutineType[];
}
