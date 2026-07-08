import applicationRepository from "../repositories/application.repository.js";
import studentRepository from "../../students/repositories/student.repository.js";
import companyRepository from "../../companies/repositories/company.repository.js";
import opportunityRepository from "../../opportunities/repositories/opportunity.repository.js";
import notificationService from "../../notifications/services/notification.service.js";
import attachmentRepository from "../../attachments/repositories/attachment.repository.js";
import {
  NotFoundError,
  ForbiddenError,
  ConflictError,
  AppError,
} from "../../../core/errors/index.js";

const VALID_TRANSITIONS = {
  "Pending": ["Under Review", "Withdrawn"],
  "Under Review": ["Shortlisted", "Rejected", "Withdrawn"],
  "Shortlisted": ["Interview Scheduled", "Rejected", "Withdrawn"],
  "Interview Scheduled": ["Accepted", "Rejected", "Withdrawn"],
  "Accepted": [],
  "Rejected": [],
  "Withdrawn": [],
};

class ApplicationService {
  async apply(studentUserId, data) {
    const student = await studentRepository.findByUserId(studentUserId);

    if (!student) {
      throw new NotFoundError("Student profile not found. Create a student profile first.");
    }

    const opportunity = await opportunityRepository.findById(data.opportunityId);

    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }

    if (opportunity.status !== "Open") {
      throw new AppError("This opportunity is not accepting applications", 400);
    }

    if (new Date(opportunity.applicationDeadline) < new Date()) {
      throw new AppError("Application deadline has passed", 400);
    }

    const existing = await applicationRepository.findExisting(
      student._id,
      data.opportunityId
    );

    if (existing && existing.status !== "Withdrawn") {
      throw new ConflictError("You have already applied for this opportunity");
    }

    const application = await applicationRepository.create({
      studentId: student._id,
      opportunityId: data.opportunityId,
      companyId: opportunity.companyId._id || opportunity.companyId,
      coverLetter: data.coverLetter,
      cvUrl: data.cvUrl || "",
    });

    const oppCompany = await companyRepository.findById(opportunity.companyId._id || opportunity.companyId);
    notificationService.notify(
      oppCompany.userId._id || oppCompany.userId,
      "New Application",
      `A student has applied for ${opportunity.title}`
    );

    return application;
  }

  async getMyApplications(studentUserId) {
    const student = await studentRepository.findByUserId(studentUserId);

    if (!student) {
      throw new NotFoundError("Student profile not found");
    }

    return await applicationRepository.findStudentApplications(student._id);
  }

  async withdraw(id, studentUserId) {
    const application = await applicationRepository.findById(id);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    const student = await studentRepository.findByUserId(studentUserId);

    if (!student || application.studentId._id.toString() !== student._id.toString()) {
      throw new ForbiddenError("You can only withdraw your own applications");
    }

    if (!VALID_TRANSITIONS[application.status].includes("Withdrawn")) {
      throw new AppError(`Cannot withdraw an application with status "${application.status}"`, 400);
    }

    const withdrawCompany = await companyRepository.findById(application.companyId._id || application.companyId);
    notificationService.notify(
      withdrawCompany.userId._id || withdrawCompany.userId,
      "Application Withdrawn",
      `A student has withdrawn their application`
    );

    return await applicationRepository.updateStatus(id, "Withdrawn");
  }

  async getCompanyApplications(companyUserId) {
    const company = await companyRepository.findByUserId(companyUserId);

    if (!company) {
      throw new NotFoundError("Company profile not found");
    }

    return await applicationRepository.findCompanyApplications(company._id);
  }

  async getCompanyApplicationsByOpportunity(companyUserId, opportunityId) {
    const company = await companyRepository.findByUserId(companyUserId);

    if (!company) {
      throw new NotFoundError("Company profile not found");
    }

    const opportunity = await opportunityRepository.findById(opportunityId);

    if (!opportunity) {
      throw new NotFoundError("Opportunity not found");
    }

    if (opportunity.companyId._id.toString() !== company._id.toString()) {
      throw new ForbiddenError("You can only view applications for your own opportunities");
    }

    return await applicationRepository.findByOpportunity(company._id, opportunityId);
  }

  async updateStatus(id, status, companyUserId, feedback = "") {
    const company = await companyRepository.findByUserId(companyUserId);

    if (!company) {
      throw new NotFoundError("Company profile not found");
    }

    const application = await applicationRepository.findById(id);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    const appCompanyId = application.companyId._id
      ? application.companyId._id.toString()
      : application.companyId.toString();

    if (appCompanyId !== company._id.toString()) {
      throw new ForbiddenError("You can only review applications for your own opportunities");
    }

    const allowedTransitions = VALID_TRANSITIONS[application.status];

    if (!allowedTransitions || !allowedTransitions.includes(status)) {
      throw new AppError(
        `Cannot transition from "${application.status}" to "${status}"`,
        400
      );
    }

    const updateData = { status };

    if (["Under Review", "Shortlisted", "Interview Scheduled", "Accepted", "Rejected"].includes(status)) {
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = companyUserId;
    }

    if (status === "Shortlisted") {
      updateData.shortlisted = true;
    }

    if (feedback) {
      updateData.feedback = feedback;
    }

    const updated = await applicationRepository.update(id, updateData);

    const studentUserId = application.studentId?.userId?._id
      || application.studentId?.userId
      || application.studentId._id
      || application.studentId;

    notificationService.notify(
      studentUserId,
      "Application Updated",
      `Your application status has been updated to "${status}"`
    );

    if (status === "Accepted") {
      const existing = await attachmentRepository.findBy("applicationId", id);
      if (!existing) {
        await attachmentRepository.create({
          applicationId: id,
          studentId: application.studentId._id || application.studentId,
          opportunityId: application.opportunityId._id || application.opportunityId,
          companyId: application.companyId._id || application.companyId,
        });
      }
    }

    return updated;
  }

  async getAll() {
    return await applicationRepository.findAll();
  }

  async delete(id) {
    const application = await applicationRepository.findById(id);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    await applicationRepository.delete(id);

    return { id };
  }
}

export default new ApplicationService();
