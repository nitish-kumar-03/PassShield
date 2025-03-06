import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true, // Ensuring name is required
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email should be unique for users
      lowercase: true, // Store email in lowercase for consistency
      trim: true, // Removes spaces before and after
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
