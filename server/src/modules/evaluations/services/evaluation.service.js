import evaluationRepository from "../repositories/evaluation.repository.js";
import attachmentRepository from "../../attachments/repositories/attachment.repository.js";
import supervisorRepository from "../../supervisors/repositories/supervisor.repository.js";
import studentRepository from "../../students/repositories/student.repository.js";
import schoolRepository from "../../schools/repositories/school.repository.js";
import notificationService from "../../notifications/services/notification.service.js";
import BaseService from "../../../core/services/BaseService.js";
import {
  AppError,
  ForbiddenError,
  NotFoundError,
} from "../../../core/errors/index.js";
import EventBus from "../../../core/events/EventBus.js";

function calculateOverallScore(criteria) {
  const values = Object.values(criteria).filter((v) => typeof v === "number");
  if (values.length === 0) return 3;
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

class EvaluationService extends BaseService {
  constructor() {
    super(evaluationRepository, "Evaluation");
  }

  async create(supervisorUserId, data) {
    const supervisor = await supervisorRepository.findByUserId(supervisorUserId);
    if (!supervisor) {
      throw new NotFoundError("Supervisor profile not found");
    }

    const attachment = await attachmentRepository.findById(data.attachmentId);
    if (!attachment) {
      throw new NotFoundError("Attachment not found");
    }

    if (attachment.status !== "Active" && attachment.status !== "Completed") {
      throw new AppError("Can only evaluate active or completed attachments", 400);
    }

    const criteria = data.criteria || {};
    const overallScore = calculateOverallScore(criteria);

    const evaluation = await this.repository.create({
      attachmentId: data.attachmentId,
      studentId: attachment.studentId._id || attachment.studentId,
      evaluatorId: supervisor._id,
      evaluatorType: supervisor.supervisorType,
      criteria,
      overallScore,
      strengths: data.strengths || "",
      weaknesses: data.weaknesses || "",
      generalComments: data.generalComments || "",
      recommendation: data.recommendation || null,
    });

    const studentUserId = attachment.studentId?.userId?._id
      || attachment.studentId?.userId
      || attachment.studentId._id
      || attachment.studentId;
    notificationService.notify(
      studentUserId,
      "New Evaluation",
      `You have received a new evaluation from your ${supervisor.supervisorType} supervisor`
    );

    return evaluation;
  }

  async getMy(userId, role) {
    const supervisor = await supervisorRepository.findByUserId(userId);
    if (supervisor) {
      return await this.repository.findAllBy("evaluatorId", supervisor._id);
    }

    const student = await studentRepository.findByUserId(userId);
    if (student) {
      return await this.repository.findAllBy("studentId", student._id);
    }

    if (role === "school") {
      return await this.repository.findAll({});
    }

    return [];
  }

  async getByAttachment(attachmentId) {
    return await this.repository.findAllBy("attachmentId", attachmentId);
  }

  async updateDraft(id, supervisorUserId, data) {
    const evaluation = await this.getById(id);
    const supervisor = await supervisorRepository.findByUserId(supervisorUserId);

    if (!supervisor) {
      throw new NotFoundError("Supervisor profile not found");
    }

    if (evaluation.evaluatorId._id.toString() !== supervisor._id.toString()) {
      throw new ForbiddenError("You can only update your own evaluations");
    }

    if (evaluation.status !== "Draft") {
      throw new AppError("Cannot update a submitted evaluation", 400);
    }

    if (data.criteria) {
      data.overallScore = calculateOverallScore(data.criteria);
    }

    return await this.repository.update(id, data);
  }

  async submit(id, supervisorUserId) {
    const evaluation = await this.getById(id);
    const supervisor = await supervisorRepository.findByUserId(supervisorUserId);

    if (!supervisor) {
      throw new NotFoundError("Supervisor profile not found");
    }

    if (evaluation.evaluatorId._id.toString() !== supervisor._id.toString()) {
      throw new ForbiddenError("You can only submit your own evaluations");
    }

    if (evaluation.status !== "Draft") {
      throw new AppError("Evaluation has already been submitted", 400);
    }

    const updated = await this.repository.update(id, {
      status: "Submitted",
      submittedAt: new Date(),
    });

    EventBus.emit("evaluation.submitted", {
      evaluationId: updated._id,
      studentId: evaluation.studentId._id || evaluation.studentId,
      attachmentId: evaluation.attachmentId._id || evaluation.attachmentId,
      evaluatorId: supervisor._id,
      evaluatorType: supervisor.supervisorType,
      overallScore: updated.overallScore,
    });

    return updated;
  }
}

export default new EvaluationService();
