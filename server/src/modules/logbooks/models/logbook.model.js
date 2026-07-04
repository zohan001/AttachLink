import mongoose from "mongoose";

const logbookSchema = new mongoose.Schema(
  {
    attachmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
      required: [true, "Attachment ID is required"],
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
    },

    date: {
      type: Date,
      required: [true, "Date is required"],
    },

    activities: {
      type: String,
      required: [true, "Activities are required"],
      trim: true,
    },

    hoursWorked: {
      type: Number,
      required: [true, "Hours worked is required"],
      min: [0.5, "Minimum 0.5 hours"],
      max: [24, "Maximum 24 hours"],
    },

    skillsLearned: {
      type: String,
      trim: true,
    },

    challenges: {
      type: String,
      trim: true,
    },

    solutions: {
      type: String,
      trim: true,
    },

    supervisorComment: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Submitted", "Approved", "Rejected"],
      default: "Draft",
    },

    submittedAt: {
      type: Date,
    },

    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

logbookSchema.index({ attachmentId: 1, date: -1 });
logbookSchema.index({ studentId: 1, status: 1 });

const Logbook = mongoose.model("Logbook", logbookSchema);

export default Logbook;
