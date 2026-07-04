import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: [true, "Application ID is required"],
      unique: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
    },

    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: [true, "Opportunity ID is required"],
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required"],
    },

    academicSupervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
    },

    industrialSupervisorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Terminated"],
      default: "Active",
    },

    terms: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

attachmentSchema.index({ studentId: 1 });
attachmentSchema.index({ companyId: 1 });
attachmentSchema.index({ academicSupervisorId: 1 });
attachmentSchema.index({ industrialSupervisorId: 1 });

const Attachment = mongoose.model("Attachment", attachmentSchema);

export default Attachment;
