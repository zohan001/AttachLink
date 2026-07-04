import mongoose from "mongoose";

const criteriaSchema = new mongoose.Schema(
  {
    punctuality: { type: Number, min: 1, max: 5, default: 3 },
    technicalSkills: { type: Number, min: 1, max: 5, default: 3 },
    communication: { type: Number, min: 1, max: 5, default: 3 },
    teamwork: { type: Number, min: 1, max: 5, default: 3 },
    problemSolving: { type: Number, min: 1, max: 5, default: 3 },
    initiative: { type: Number, min: 1, max: 5, default: 3 },
    qualityOfWork: { type: Number, min: 1, max: 5, default: 3 },
    attendance: { type: Number, min: 1, max: 5, default: 3 },
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
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

    evaluatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supervisor",
      required: [true, "Evaluator ID is required"],
    },

    evaluatorType: {
      type: String,
      enum: ["academic", "industrial"],
      required: [true, "Evaluator type is required"],
    },

    criteria: {
      type: criteriaSchema,
      default: () => ({}),
    },

    overallScore: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },

    strengths: {
      type: String,
      trim: true,
    },

    weaknesses: {
      type: String,
      trim: true,
    },

    generalComments: {
      type: String,
      trim: true,
    },

    recommendation: {
      type: String,
      enum: ["Excellent", "Good", "Satisfactory", "Needs Improvement", "Poor"],
    },

    status: {
      type: String,
      enum: ["Draft", "Submitted"],
      default: "Draft",
    },

    submittedAt: Date,
  },
  {
    timestamps: true,
  }
);

evaluationSchema.index({ attachmentId: 1 });
evaluationSchema.index({ evaluatorId: 1 });
evaluationSchema.index({ studentId: 1 });

const Evaluation = mongoose.model("Evaluation", evaluationSchema);

export default Evaluation;
