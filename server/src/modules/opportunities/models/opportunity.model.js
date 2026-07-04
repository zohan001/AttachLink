import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    internshipType: {
      type: String,
      required: [true, "Internship type is required"],
      enum: [
        "Industrial Attachment",
        "Internship",
        "Graduate Trainee",
        "Apprenticeship",
      ],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    workMode: {
      type: String,
      required: [true, "Work mode is required"],
      enum: ["On-site", "Hybrid", "Remote"],
    },

    vacancies: {
      type: Number,
      required: [true, "Number of vacancies is required"],
      min: [1, "Vacancies must be at least 1"],
    },

    applicationDeadline: {
      type: Date,
      required: [true, "Application deadline is required"],
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },

    requirements: {
      type: [String],
      required: [true, "At least one requirement is required"],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one requirement is required",
      },
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    salary: {
      type: Number,
    },

    currency: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Draft", "Open", "Closed", "Expired"],
      default: "Draft",
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

opportunitySchema.index({ companyId: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ workMode: 1 });
opportunitySchema.index({ location: 1 });

const Opportunity = mongoose.model("Opportunity", opportunitySchema);

export default Opportunity;
