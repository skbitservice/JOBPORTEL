import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    filename: String,
    path: String,
    mimeType: String,
    size: Number
  },
  { _id: false }
);

const applicantSchema = new mongoose.Schema(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },
    fullAddress: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    },
    currentLocation: {
      label: String,
      lat: Number,
      lng: Number
    },
    skills: {
      type: [String],
      default: [],
      index: true
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
      max: 60,
      index: true
    },
    otpVerified: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["New", "Reviewed", "Shortlisted", "Rejected"],
      default: "New",
      index: true
    },
    files: {
      resume: fileSchema,
      photo: fileSchema
    }
  },
  { timestamps: true }
);

applicantSchema.index({
  fullName: "text",
  email: "text",
  mobile: "text",
  city: "text",
  state: "text",
  skills: "text"
});

export default mongoose.model("Applicant", applicantSchema);
