import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RoutineSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      default: null,
    },

    filters: {
      type: [String],
      required: true,
    },
    routines: {
      type: [
        {
          time: {
            type: String,
            required: true,
            minlength: 2, // Ensure string length > 1
          },
          content: {
            type: String,
            required: true,
            minlength: 2,
          },
        },
      ],
      validate: {
        validator: function (val) {
          return val.length > 0; // Ensure at least one routine exists
        },
        message: "At least one routine is required.",
      },
    },
    readTime: {
      type: String,
      required: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Expert",
    },
    // routines: {
    //   type: [
    //     {
    //       time: {
    //         type: String,
    //         required: [true, "Time is required"],
    //         minlength: [1, "Time must be at least 2 characters"],
    //       },
    //       content: {
    //         type: String,
    //         required: [true, "Content is required"],
    //         minlength: [1, "Content must be at least 2 characters"],
    //       },
    //     },
    //   ],
    //   validate: {
    //     validator: function (value) {
    //       return Array.isArray(value) && value.length > 0;
    //     },
    //     message: "At least one routine is required.",
    //   },
    //   required: true,
    // },
  },
  { timestamps: true }
);

const Routine = model("Routines", RoutineSchema);
export default Routine;
