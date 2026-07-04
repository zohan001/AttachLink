import mongoose from "mongoose";

const supervisorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      unique: true,
    },

    supervisorType: {
      type: String,
      required: [true, "Supervisor type is required"],
      enum: ["academic", "industrial"],
    },

    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    department: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    position: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

supervisorSchema.index({ schoolId: 1 });
supervisorSchema.index({ companyId: 1 });

const Supervisor = mongoose.model("Supervisor", supervisorSchema);

export default Supervisor;
