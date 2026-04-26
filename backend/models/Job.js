import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    authoriserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    authoriserName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    eventType: {
      type: String,
      enum: ["wedding", "reception", "party", "temple_function", "corporate", "other"],
      required: true
    },
    workType: {
      type: String,
      enum: ["serving", "cleaning", "table_setup", "water_service", "cooking_assist", "other"],
      required: true
    },
    workersRequired: { type: Number, required: true, min: 1 },
    paymentPerDay: { type: Number, required: true, min: 1 },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
