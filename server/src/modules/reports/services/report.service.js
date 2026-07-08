import studentRepository from "../../students/repositories/student.repository.js";
import attachmentRepository from "../../attachments/repositories/attachment.repository.js";
import logbookRepository from "../../logbooks/repositories/logbook.repository.js";
import evaluationRepository from "../../evaluations/repositories/evaluation.repository.js";
import companyRepository from "../../companies/repositories/company.repository.js";
import opportunityRepository from "../../opportunities/repositories/opportunity.repository.js";
import schoolRepository from "../../schools/repositories/school.repository.js";
import supervisorRepository from "../../supervisors/repositories/supervisor.repository.js";
import { NotFoundError, ForbiddenError } from "../../../core/errors/index.js";

class ReportService {
  async studentReport(studentId, requestingUser) {
    const student = await studentRepository.findById(studentId);
    if (!student) throw new NotFoundError("Student not found");

    if (requestingUser?.role === "school") {
      const school = await schoolRepository.findByUserId(requestingUser.id);
      if (!school) throw new NotFoundError("School profile not found");
      if (student.schoolId?._id?.toString() !== school._id.toString() && student.schoolId?.toString() !== school._id.toString()) {
        throw new ForbiddenError("You can only view reports for students from your school");
      }
    }

    if (requestingUser?.role === "company") {
      const company = await companyRepository.findByUserId(requestingUser.id);
      if (!company) throw new NotFoundError("Company profile not found");
      const attachments = await attachmentRepository.findAllBy("studentId", studentId);
      const belongsToCompany = attachments.some(
        (a) => a.companyId?._id?.toString() === company._id.toString() || a.companyId?.toString() === company._id.toString()
      );
      if (!belongsToCompany) throw new ForbiddenError("You can only view reports for students who applied to your company");
    }

    if (requestingUser?.role === "supervisor") {
      const supervisor = await supervisorRepository.findByUserId(requestingUser.id);
      if (!supervisor) throw new NotFoundError("Supervisor profile not found");

      const supervisorAttachments = await attachmentRepository.findAllBy(
        supervisor.supervisorType === "academic" ? "academicSupervisorId" : "industrialSupervisorId",
        supervisor._id
      );
      const hasAccess = supervisorAttachments.some((a) =>
        a.studentId?._id?.toString() === studentId || a.studentId?.toString() === studentId
      );
      if (!hasAccess) throw new ForbiddenError("You can only view reports for students you supervise");
    }

    const attachments = await attachmentRepository.findAllBy("studentId", studentId);
    const attachmentIds = attachments.map((a) => a._id);

    const logbooks = await logbookRepository.findAllBy(
      "studentId",
      student._id
    );

    const evaluations = await evaluationRepository.findAllBy(
      "studentId",
      student._id
    );

    const totalHours = logbooks.reduce((sum, lb) => sum + (lb.hoursWorked || 0), 0);
    const approvedEntries = logbooks.filter((lb) => lb.status === "Approved").length;
    const submittedEntries = logbooks.filter((lb) => lb.status === "Submitted").length;
    const rejectedEntries = logbooks.filter((lb) => lb.status === "Rejected").length;

    const criteriaFields = [
      "punctuality", "technicalSkills", "communication", "teamwork",
      "problemSolving", "initiative", "qualityOfWork", "attendance",
    ];

    const avgScores = {};
    criteriaFields.forEach((field) => {
      const scores = evaluations
        .filter((e) => e.criteria && e.criteria[field])
        .map((e) => e.criteria[field]);
      avgScores[field] = scores.length
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : null;
    });

    const overallAvg = evaluations.length
      ? Math.round(
          (evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) /
            evaluations.length) *
            10
        ) / 10
      : null;

    return {
      student: {
        _id: student._id,
        admissionNumber: student.admissionNumber,
        course: student.course,
        department: student.department,
        yearOfStudy: student.yearOfStudy,
        user: student.userId,
      },
      attachments: attachments.map((a) => ({
        _id: a._id,
        company: a.companyId,
        opportunity: a.opportunityId,
        status: a.status,
        startDate: a.startDate,
        endDate: a.endDate,
      })),
      logbookSummary: {
        total: logbooks.length,
        approved: approvedEntries,
        submitted: submittedEntries,
        rejected: rejectedEntries,
        draft: logbooks.length - approvedEntries - submittedEntries - rejectedEntries,
        totalHoursWorked: totalHours,
      },
      evaluationSummary: {
        total: evaluations.length,
        averageOverallScore: overallAvg,
        averageCriteriaScores: avgScores,
      },
    };
  }

  async attachmentReport(attachmentId, requestingUser) {
    const attachment = await attachmentRepository.findById(attachmentId);
    if (!attachment) throw new NotFoundError("Attachment not found");

    if (requestingUser?.role === "school") {
      const school = await schoolRepository.findByUserId(requestingUser.id);
      if (!school) throw new NotFoundError("School profile not found");
      const student = await studentRepository.findById(
        attachment.studentId?._id || attachment.studentId
      );
      if (!student) throw new NotFoundError("Student not found");
      if (student.schoolId?._id?.toString() !== school._id.toString() && student.schoolId?.toString() !== school._id.toString()) {
        throw new ForbiddenError("You can only view reports for attachments from students in your school");
      }
    }

    if (requestingUser?.role === "company") {
      const company = await companyRepository.findByUserId(requestingUser.id);
      if (!company) throw new NotFoundError("Company profile not found");
      const attachmentCompanyId = attachment.companyId?._id?.toString() || attachment.companyId?.toString();
      if (attachmentCompanyId !== company._id.toString()) {
        throw new ForbiddenError("You can only view reports for your company's attachments");
      }
    }

    if (requestingUser?.role === "supervisor") {
      const supervisor = await supervisorRepository.findByUserId(requestingUser.id);
      if (!supervisor) throw new NotFoundError("Supervisor profile not found");
      const isAssigned =
        attachment.academicSupervisorId?._id?.toString() === supervisor._id.toString() ||
        attachment.academicSupervisorId?.toString() === supervisor._id.toString() ||
        attachment.industrialSupervisorId?._id?.toString() === supervisor._id.toString() ||
        attachment.industrialSupervisorId?.toString() === supervisor._id.toString();
      if (!isAssigned) throw new ForbiddenError("You can only view reports for attachments you supervise");
    }

    const logbooks = await logbookRepository.findAllBy("attachmentId", attachmentId);
    const evaluations = await evaluationRepository.findAllBy("attachmentId", attachmentId);

    const totalHours = logbooks.reduce((sum, lb) => sum + (lb.hoursWorked || 0), 0);
    const logbookDays = [...new Set(logbooks.map((lb) => lb.date?.toISOString().split("T")[0]))];

    return {
      attachment: {
        _id: attachment._id,
        student: attachment.studentId,
        company: attachment.companyId,
        opportunity: attachment.opportunityId,
        status: attachment.status,
        startDate: attachment.startDate,
        endDate: attachment.endDate,
      },
      logbooks: {
        total: logbooks.length,
        totalHours,
        uniqueDays: logbookDays.length,
        entries: logbooks,
      },
      evaluations: {
        total: evaluations.length,
        entries: evaluations,
      },
    };
  }

  async companyReport(companyId) {
    const company = await companyRepository.findById(companyId);
    if (!company) throw new NotFoundError("Company not found");

    const opportunities = await opportunityRepository.findByCompany(companyId);
    const opportunityIds = opportunities.map((o) => o._id);

    const attachments = await attachmentRepository.findAllBy("companyId", companyId);

    const activeAttachments = attachments.filter((a) => a.status === "Active");
    const completedAttachments = attachments.filter((a) => a.status === "Completed");

    const allStudentIds = [...new Set(attachments.map((a) => a.studentId?._id?.toString() || a.studentId?.toString()))];

    return {
      company: {
        _id: company._id,
        companyName: company.companyName,
        industry: company.industry,
        city: company.city,
        verified: company.verified,
      },
      opportunities: {
        total: opportunities.length,
        active: opportunities.filter((o) => o.status === "Open").length,
        closed: opportunities.filter((o) => o.status === "Closed").length,
        draft: opportunities.filter((o) => o.status === "Draft").length,
      },
      attachments: {
        total: attachments.length,
        active: activeAttachments.length,
        completed: completedAttachments.length,
        uniqueStudents: allStudentIds.length,
      },
    };
  }
}

export default new ReportService();
