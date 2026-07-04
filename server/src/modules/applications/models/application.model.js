import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student is required"],
    },

    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: [true, "Opportunity is required"],
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },

    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      trim: true,
    },

    cvUrl: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Accepted",
        "Rejected",
        "Withdrawn",
      ],
      default: "Pending",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },

    reviewedAt: {
      type: Date,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    feedback: {
      type: String,
      trim: true,
    },

    shortlisted: {
      type: Boolean,
      default: false,
    },

    interviewDate: {
      type: Date,
    },

    interviewLocation: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ studentId: 1 });
applicationSchema.index({ opportunityId: 1 });
applicationSchema.index({ companyId: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
