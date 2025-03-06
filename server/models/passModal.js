import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Ensuring reference matches the correct model name
      required: true, // Making sure an author is always associated
    },
    title: {
      type: String,
      required: true,
      trim: true, // Removes unnecessary spaces
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Password", passwordSchema);
