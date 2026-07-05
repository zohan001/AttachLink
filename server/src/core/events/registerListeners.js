import EventBus from "./EventBus.js";
import notificationService from "../../modules/notifications/services/notification.service.js";
import attachmentRepository from "../../modules/attachments/repositories/attachment.repository.js";
import supervisorRepository from "../../modules/supervisors/repositories/supervisor.repository.js";

export function registerEventListeners() {
  EventBus.on("attachment.created", async (data) => {
    try {
      const studentId = data.studentId;
      const student = await import("../../modules/students/repositories/student.repository.js").then(
        (m) => m.default.findById(studentId)
      );
      if (student && student.userId) {
        await notificationService.notify(
          student.userId._id || student.userId,
          "Attachment Created",
          "Your attachment has been created. Start logging your hours!",
          "attachment.created",
          { attachmentId: data.attachmentId }
        );
      }
    } catch (error) {
      console.error("[EventBus] Error handling attachment.created:", error.message);
    }
  });

  EventBus.on("logbook.submitted", async (data) => {
    try {
      const attachment = await attachmentRepository.findById(data.attachmentId);

      if (!attachment) return;

      const supervisorIds = [];

      if (attachment.academicSupervisorId) {
        const academicId =
          attachment.academicSupervisorId._id || attachment.academicSupervisorId;
        const academic = await supervisorRepository.findById(academicId);
        if (academic && academic.userId) {
          supervisorIds.push(academic.userId._id || academic.userId);
        }
      }

      if (attachment.industrialSupervisorId) {
        const industrialId =
          attachment.industrialSupervisorId._id || attachment.industrialSupervisorId;
        const industrial = await supervisorRepository.findById(industrialId);
        if (industrial && industrial.userId) {
          supervisorIds.push(industrial.userId._id || industrial.userId);
        }
      }

      for (const userId of supervisorIds) {
        await notificationService.notify(
          userId,
          "Logbook Submitted",
          "A student has submitted a logbook entry for your review.",
          "logbook.submitted",
          {
            logbookId: data.logbookId,
            studentId: data.studentId,
            attachmentId: data.attachmentId,
          }
        );
      }
    } catch (error) {
      console.error("[EventBus] Error handling logbook.submitted:", error.message);
    }
  });

  EventBus.on("logbook.approved", async (data) => {
    try {
      const student = await import("../../modules/students/repositories/student.repository.js").then(
        (m) => m.default.findById(data.studentId)
      );
      if (student && student.userId) {
        await notificationService.notify(
          student.userId._id || student.userId,
          "Logbook Approved",
          "Your logbook entry has been approved by your supervisor.",
          "logbook.approved",
          {
            logbookId: data.logbookId,
            attachmentId: data.attachmentId,
          }
        );
      }
    } catch (error) {
      console.error("[EventBus] Error handling logbook.approved:", error.message);
    }
  });

  EventBus.on("evaluation.submitted", async (data) => {
    try {
      const student = await import("../../modules/students/repositories/student.repository.js").then(
        (m) => m.default.findById(data.studentId)
      );
      if (student && student.userId) {
        await notificationService.notify(
          student.userId._id || student.userId,
          "Evaluation Submitted",
          `Your ${data.evaluatorType} supervisor has submitted an evaluation (Score: ${data.overallScore}/5).`,
          "evaluation.submitted",
          {
            evaluationId: data.evaluationId,
            attachmentId: data.attachmentId,
          }
        );
      }
    } catch (error) {
      console.error("[EventBus] Error handling evaluation.submitted:", error.message);
    }
  });

  console.log("[EventBus] Event listeners registered.");
}
