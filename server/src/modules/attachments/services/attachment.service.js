import BaseService from "../../../core/services/BaseService.js";
import attachmentRepository from "../repositories/attachment.repository.js";
import applicationRepository from "../../applications/repositories/application.repository.js";
import studentRepository from "../../students/repositories/student.repository.js";
import schoolRepository from "../../schools/repositories/school.repository.js";
import companyRepository from "../../companies/repositories/company.repository.js";
import supervisorRepository from "../../supervisors/repositories/supervisor.repository.js";
import { AppError, ForbiddenError, ConflictError, NotFoundError } from "../../../core/errors/index.js";
import EventBus from "../../../core/events/EventBus.js";

class AttachmentService extends BaseService {
  constructor() {
    super(attachmentRepository, "Attachment");
  }

  async getAll(filters = {}, requestingUser) {
    if (requestingUser?.role === "school") {
      const school = await schoolRepository.findByUserId(requestingUser.id);
      if (school) {
        const students = await studentRepository.findAll({ schoolId: school._id });
        const studentIds = students.map((s) => s._id);
        filters.studentId = { $in: studentIds };
      }
    }
    if (requestingUser?.role === "company") {
      const company = await companyRepository.findByUserId(requestingUser.id);
      if (company) filters.companyId = company._id;
    }
    if (requestingUser?.role === "supervisor") {
      const supervisor = await supervisorRepository.findByUserId(requestingUser.id);
      if (supervisor) {
        filters.$or = [
          { academicSupervisorId: supervisor._id },
          { industrialSupervisorId: supervisor._id },
        ];
      }
    }
    return await this.repository.findAll(filters);
  }

  async createFromAcceptedApplication(userId, data) {
    const application = await applicationRepository.findById(data.applicationId);

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    if (application.status !== "Accepted") {
      throw new AppError(
        "Attachment can only be created from an accepted application",
        400
      );
    }

    const existing = await attachmentRepository.findBy("applicationId", data.applicationId);
    if (existing) {
      throw new ConflictError("Attachment already exists for this application");
    }

    const attachment = await this.repository.create({
      applicationId: data.applicationId,
      studentId: application.studentId._id,
      opportunityId: application.opportunityId._id,
      companyId: application.companyId._id,
      academicSupervisorId: data.academicSupervisorId || null,
      industrialSupervisorId: data.industrialSupervisorId || null,
      startDate: data.startDate,
      endDate: data.endDate,
      terms: data.terms || "",
      notes: data.notes || "",
    });

    EventBus.emit("attachment.created", {
      attachmentId: attachment._id,
      studentId: application.studentId._id,
      companyId: application.companyId._id,
    });

    return attachment;
  }

  async getByStudent(studentUserId) {
    const student = await studentRepository.findByUserId(studentUserId);
    if (!student) {
      throw new AppError("Student profile not found", 404);
    }
    return await this.repository.findAllBy("studentId", student._id);
  }

  async assignSupervisor(id, supervisorField, supervisorId, requestingUserRole) {
    if (requestingUserRole !== "admin") {
      throw new ForbiddenError("Only admins can assign supervisors");
    }

    const attachment = await this.getById(id);

    const updateData = {};
    updateData[supervisorField] = supervisorId;

    return await this.repository.update(id, updateData);
  }

  async complete(id) {
    const attachment = await this.getById(id);
    if (attachment.status === "Terminated") {
      throw new AppError("Cannot complete a terminated attachment", 400);
    }
    return await this.repository.update(id, { status: "Completed" });
  }

  async terminate(id, reason) {
    const attachment = await this.getById(id);
    if (attachment.status === "Completed") {
      throw new AppError("Cannot terminate a completed attachment", 400);
    }
    return await this.repository.update(id, {
      status: "Terminated",
      notes: reason || attachment.notes,
    });
  }
}

export default new AttachmentService();
