import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    registrationNumber: {
      type: String,
      trim: true,
    },

    industry: {
      type: String,
      required: [true, "Industry is required"],
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

    website: {
      type: String,
      trim: true,
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

const Company = mongoose.model("Company", companySchema);

export default Company;
