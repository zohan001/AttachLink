import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "CREATE", "UPDATE", "DELETE",
        "LOGIN", "LOGOUT",
        "ASSIGN_SUPERVISOR", "COMPLETE_ATTACHMENT", "TERMINATE_ATTACHMENT",
        "PUBLISH_OPPORTUNITY", "CLOSE_OPPORTUNITY",
        "APPROVE_LOGBOOK", "REJECT_LOGBOOK",
        "SUBMIT_EVALUATION",
        "PASSWORD_RESET", "EMAIL_VERIFY",
      ],
    },
    entityType: {
      type: String,
      required: true,
      enum: ["User", "Student", "Company", "School", "Supervisor", "Opportunity", "Application", "Attachment", "Logbook", "Evaluation"],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performedByRole: {
      type: String,
      enum: ["student", "company", "school", "supervisor", "admin"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
