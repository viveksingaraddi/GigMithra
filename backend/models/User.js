import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  userType: { type: String, enum: ["worker", "authoriser"], required: true },
  companyName: { type: String, trim: true, default: null }
}, { timestamps: true });

userSchema.index({ phone: 1, userType: 1 }, { unique: true });

export default mongoose.model("User", userSchema);