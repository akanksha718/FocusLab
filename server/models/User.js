import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: String,
    photo: String,
    provider: String,
    emailVerified: Boolean,
    role: { type: String, default: "user" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
