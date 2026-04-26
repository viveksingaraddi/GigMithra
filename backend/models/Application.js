import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    workerName: { type: String, required: true, trim: true },
    workerPhone: { type: String, required: true, trim: true },
    workerLocation: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

applicationSchema.index({ jobId: 1, workerId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
