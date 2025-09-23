import { z } from "zod";

// Define the form schema with zod
const formSchema = z
  .object({
    title: z
      .string()
      .min(3, { message: "Title must be at least 3 characters" })
      .max(100),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters" }),
    media: z
      .object({
        images: z
          .array(z.instanceof(File))
          .max(3, "You can only upload up to 3 images"),
        video: z.instanceof(File).nullable(),
        document: z.instanceof(File).nullable(),
      })
      .default({ images: [], video: null, document: null }),
    hasRoutines: z.boolean().default(false),
    routines: z
      .array(
        z.object({
          time: z.string().min(1, { message: "Time is required" }),
          content: z.string().min(1, { message: "Content is required" }),
        })
      )
      .optional(),
    tagged: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          avatar: z.string(),
        })
      )
      .max(5, { message: "You can select up to 5 doctors" }),
  })
  .refine(
    (data) => {
      if (data.hasRoutines) {
        return Array.isArray(data.routines) && data.routines.length > 0;
      }
      return true;
    },
    {
      message:
        "At least one routine is required when 'Has Routines' is enabled.",
      path: ["routines"],
    }
  );

export default formSchema;
