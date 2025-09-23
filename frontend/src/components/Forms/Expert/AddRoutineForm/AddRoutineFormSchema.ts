import { z } from "zod";

const addRoutineFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.instanceof(File).nullable(),
  routines: z
    .array(
      z.object({
        time: z.string().min(1, "Time is required"),
        content: z.string().min(1, "Content is required"),
      })
    )
    .min(1, "At least one routine is required"),
});

export default addRoutineFormSchema;