import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recipient ID is required"],
    },

    type: {
      type: String,
      required: [true, "Notification type is required"],
      enum: [
        "application.submitted",
        "application.status_changed",
        "logbook.submitted",
        "logbook.approved",
        "logbook.rejected",
        "evaluation.submitted",
        "attachment.created",
        "info",
      ],
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },

    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    read: {
      type: Boolean,
      default: false,
    },

    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, read: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
