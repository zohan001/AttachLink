import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },

    schoolName: {
      type: String,
      required: [true, "School name is required"],
      unique: true,
      trim: true,
    },

    abbreviation: {
      type: String,
      trim: true,
    },

    institutionType: {
      type: String,
      required: [true, "Institution type is required"],
      enum: ["University", "TVET", "College", "High School", "Training Institute"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    county: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const School = mongoose.model("School", schoolSchema);

export default School;
