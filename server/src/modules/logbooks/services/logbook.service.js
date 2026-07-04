import logbookRepository from "../repositories/logbook.repository.js";
import attachmentRepository from "../../attachments/repositories/attachment.repository.js";
import studentRepository from "../../students/repositories/student.repository.js";
import supervisorRepository from "../../supervisors/repositories/supervisor.repository.js";
import BaseService from "../../../core/services/BaseService.js";
import {
  AppError,
  ForbiddenError,
  NotFoundError,
} from "../../../core/errors/index.js";
import EventBus from "../../../core/events/EventBus.js";

class LogbookService extends BaseService {
  constructor() {
    super(logbookRepository, "Logbook");
  }

  async createDraft(studentUserId, data) {
    const student = await studentRepository.findByUserId(studentUserId);
    if (!student) {
      throw new NotFoundError("Student profile not found");
    }

    const attachment = await attachmentRepository.findById(data.attachmentId);
    if (!attachment) {
      throw new NotFoundError("Attachment not found");
    }

    if (attachment.studentId._id.toString() !== student._id.toString()) {
      throw new ForbiddenError("This attachment does not belong to you");
    }

    if (attachment.status !== "Active") {
      throw new AppError("Cannot log hours for a non-active attachment", 400);
    }

    return await this.repository.create({
      attachmentId: data.attachmentId,
      studentId: student._id,
      date: data.date,
      activities: data.activities,
      hoursWorked: data.hoursWorked,
      skillsLearned: data.skillsLearned || "",
      challenges: data.challenges || "",
      solutions: data.solutions || "",
    });
  }

  async getMy(studentUserId) {
    const student = await studentRepository.findByUserId(studentUserId);
    if (!student) {
      throw new NotFoundError("Student profile not found");
    }

    return await this.repository.findAllBy("studentId", student._id);
  }

  async getByAttachment(attachmentId) {
    return await this.repository.findAllBy("attachmentId", attachmentId);
  }

  async updateDraft(id, studentUserId, data) {
    const logbook = await this.getById(id);
    const student = await studentRepository.findByUserId(studentUserId);

    if (!student) {
      throw new NotFoundError("Student profile not found");
    }

    if (logbook.studentId._id.toString() !== student._id.toString()) {
      throw new ForbiddenError("You can only update your own logbook entry");
    }

    if (logbook.status !== "Draft") {
      throw new AppError("Cannot edit a submitted logbook entry", 400);
    }

    return await this.repository.update(id, data);
  }

  async submit(id, studentUserId) {
    const logbook = await this.getById(id);
    const student = await studentRepository.findByUserId(studentUserId);

    if (!student) {
      throw new NotFoundError("Student profile not found");
    }

    if (logbook.studentId._id.toString() !== student._id.toString()) {
      throw new ForbiddenError("You can only submit your own logbook entry");
    }

    if (logbook.status !== "Draft") {
      throw new AppError("Only draft entries can be submitted", 400);
    }

    const updated = await this.repository.update(id, {
      status: "Submitted",
      submittedAt: new Date(),
    });

    EventBus.emit("logbook.submitted", {
      logbookId: updated._id,
      studentId: student._id,
      attachmentId: logbook.attachmentId._id || logbook.attachmentId,
      date: logbook.date,
    });

    return updated;
  }

  async approve(id, supervisorUserId) {
    const logbook = await this.getById(id);

    const supervisor = await supervisorRepository.findByUserId(supervisorUserId);
    if (!supervisor) {
      throw new ForbiddenError("Supervisor profile not found");
    }

    if (logbook.status !== "Submitted") {
      throw new AppError("Only submitted entries can be approved", 400);
    }

    const updated = await this.repository.update(id, {
      status: "Approved",
      approvedAt: new Date(),
    });

    EventBus.emit("logbook.approved", {
      logbookId: updated._id,
      studentId: logbook.studentId._id || logbook.studentId,
      attachmentId: logbook.attachmentId._id || logbook.attachmentId,
      supervisorId: supervisor._id,
    });

    return updated;
  }

  async reject(id, supervisorUserId, comment = "") {
    const logbook = await this.getById(id);
    const supervisor = await supervisorRepository.findByUserId(supervisorUserId);

    if (!supervisor) {
      throw new ForbiddenError("Supervisor profile not found");
    }

    if (logbook.status !== "Submitted") {
      throw new AppError("Only submitted entries can be rejected", 400);
    }

    return await this.repository.update(id, {
      status: "Rejected",
      supervisorComment: comment,
    });
  }

  async addComment(id, supervisorUserId, comment) {
    const logbook = await this.getById(id);
    const supervisor = await supervisorRepository.findByUserId(supervisorUserId);

    if (!supervisor) {
      throw new ForbiddenError("Supervisor profile not found");
    }

    return await this.repository.update(id, {
      supervisorComment: comment,
    });
  }
}

export default new LogbookService();
