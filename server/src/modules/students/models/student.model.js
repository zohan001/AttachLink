import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },

    admissionNumber: {
      type: String,
      required: [true, "Admission number is required"],
      unique: true,
      trim: true,
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },

    course: {
      type: String,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
    },

    yearOfStudy: {
      type: Number,
      min: 1,
      max: 6,
    },

    phone: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dateOfBirth: {
      type: Date,
    },

    nationalId: {
      type: String,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    cvUrl: {
      type: String,
      default: "",
    },

    portfolioUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive", "graduated", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

studentSchema.index({ schoolId: 1 });

const Student = mongoose.model("Student", studentSchema);

export default Student;
