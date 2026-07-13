import User from "../../auth/models/user.model.js";
import Student from "../../students/models/student.model.js";
import Company from "../../companies/models/company.model.js";
import School from "../../schools/models/school.model.js";
import Supervisor from "../../supervisors/models/supervisor.model.js";
import Opportunity from "../../opportunities/models/opportunity.model.js";
import Application from "../../applications/models/application.model.js";
import Attachment from "../../attachments/models/attachment.model.js";
import Logbook from "../../logbooks/models/logbook.model.js";
import Evaluation from "../../evaluations/models/evaluation.model.js";
import Notification from "../../notifications/models/notification.model.js";

import studentRepository from "../../students/repositories/student.repository.js";
import companyRepository from "../../companies/repositories/company.repository.js";
import schoolRepository from "../../schools/repositories/school.repository.js";
import supervisorRepository from "../../supervisors/repositories/supervisor.repository.js";
import attachmentRepository from "../../attachments/repositories/attachment.repository.js";
import opportunityRepository from "../../opportunities/repositories/opportunity.repository.js";

import { NotFoundError } from "../../../core/errors/index.js";

class DashboardService {
  async admin(userId) {
    const counts = await Promise.all([
      User.countDocuments(),
      Student.countDocuments(),
      Company.countDocuments(),
      School.countDocuments(),
      Supervisor.countDocuments(),
      Opportunity.countDocuments({ published: true, status: "Open" }),
      Opportunity.countDocuments({ status: "Closed" }),
      Application.countDocuments(),
      Attachment.countDocuments({ status: "Active" }),
      Attachment.countDocuments({ status: "Completed" }),
      Logbook.countDocuments({ status: "Submitted" }),
      Evaluation.countDocuments({ status: "Submitted" }),
      Notification.countDocuments({ recipientId: userId, read: false }),
    ]);

    return {
      users: counts[0],
      students: counts[1],
      companies: counts[2],
      schools: counts[3],
      supervisors: counts[4],
      openOpportunities: counts[5],
      closedOpportunities: counts[6],
      applications: counts[7],
      activeAttachments: counts[8],
      completedAttachments: counts[9],
      pendingLogbooks: counts[10],
      submittedEvaluations: counts[11],
      unreadNotifications: counts[12],
    };
  }

  async company(userId) {
    const company = await companyRepository.findByUserId(userId);
    if (!company) throw new NotFoundError("Company profile not found");

    const opportunities = await opportunityRepository.findByCompany(company._id);
    const opportunityIds = opportunities.map((o) => o._id);

    const [applications, acceptedStudents, active, completed, notifications] =
      await Promise.all([
        Application.countDocuments({
          companyId: company._id,
          status: { $ne: "Withdrawn" },
        }),
        Application.countDocuments({
          companyId: company._id,
          status: "Accepted",
        }),
        Attachment.countDocuments({ companyId: company._id, status: "Active" }),
        Attachment.countDocuments({
          companyId: company._id,
          status: "Completed",
        }),
        Notification.find({ recipientId: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    return {
      company: {
        _id: company._id,
        companyName: company.companyName,
        industry: company.industry,
        logo: company.logo,
        verified: company.verified,
      },
      opportunities: opportunities.map((o) => ({
        _id: o._id,
        title: o.title,
        status: o.status,
        vacancies: o.vacancies,
        applicationDeadline: o.applicationDeadline,
      })),
      applications,
      acceptedStudents,
      activeAttachments: active,
      completedAttachments: completed,
      recentNotifications: notifications,
    };
  }

  async student(userId) {
    const student = await studentRepository.findByUserId(userId);
    if (!student) throw new NotFoundError("Student profile not found");

    const [attachments, myApplications, logbooks, evaluations, notifications] =
      await Promise.all([
        attachmentRepository.findAllBy("studentId", student._id),
        Application.find({ studentId: student._id })
          .populate("opportunityId", "title companyId status")
          .populate("companyId", "companyName logo")
          .sort({ createdAt: -1 })
          .lean(),
        Logbook.find({ studentId: student._id })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
        Evaluation.find({ studentId: student._id })
          .populate("evaluatorId", "evaluatorType")
          .lean(),
        Notification.find({ recipientId: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    const currentAttachment = attachments.find((a) => a.status === "Active");

    return {
      student: {
        _id: student._id,
        admissionNumber: student.admissionNumber,
        course: student.course,
        department: student.department,
        yearOfStudy: student.yearOfStudy,
      },
      currentAttachment: currentAttachment || null,
      allAttachments: attachments,
      applications: myApplications,
      logbooks: {
        total: logbooks.length,
        recent: logbooks,
      },
      evaluations,
      recentNotifications: notifications,
    };
  }

  async school(userId) {
    const school = await schoolRepository.findByUserId(userId);
    if (!school) throw new NotFoundError("School profile not found");

    const [students, supervisors, active, evaluations, notifications] =
      await Promise.all([
        Student.countDocuments({ schoolId: school._id }),
        Supervisor.countDocuments({ schoolId: school._id }),
        Attachment.countDocuments({ status: "Active" }),
        Evaluation.countDocuments({ status: "Submitted" }),
        Notification.find({ recipientId: userId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    const schoolStudentIds = (
      await Student.find({ schoolId: school._id }).select("_id").lean()
    ).map((s) => s._id);

    const schoolEvaluations = await Evaluation.countDocuments({
      status: "Submitted",
      studentId: { $in: schoolStudentIds },
    });

    return {
      school: {
        _id: school._id,
        schoolName: school.schoolName,
        institutionType: school.institutionType,
        verified: school.verified,
      },
      registeredStudents: students,
      supervisors,
      activeAttachments: active,
      pendingEvaluations: schoolEvaluations,
      recentNotifications: notifications,
    };
  }

  async supervisor(userId) {
    const supervisor = await supervisorRepository.findByUserId(userId);
    if (!supervisor) throw new NotFoundError("Supervisor profile not found");

    const supervisorField =
      supervisor.supervisorType === "academic"
        ? "academicSupervisorId"
        : "industrialSupervisorId";

    const attachments = await Attachment.find({
      [supervisorField]: supervisor._id,
    })
      .populate({
        path: "studentId",
        populate: { path: "userId", select: "firstName lastName email" },
      })
      .populate("opportunityId", "title")
      .populate("companyId", "companyName")
      .lean();

    const assignedStudentIds = [
      ...new Set(attachments.map((a) => a.studentId?._id?.toString())),
    ];

    const [pendingLogbooks, evaluations, notifications] = await Promise.all([
      Logbook.countDocuments({
        status: "Submitted",
        studentId: { $in: assignedStudentIds },
      }),
      Evaluation.find({ evaluatorId: supervisor._id }).lean(),
      Notification.find({ recipientId: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    const assignedStudents = attachments.map((a) => a.studentId);

    return {
      supervisor: {
        _id: supervisor._id,
        supervisorType: supervisor.supervisorType,
        department: supervisor.department,
        position: supervisor.position,
      },
      assignedStudents,
      assignedAttachments: attachments,
      pendingLogbooks,
      evaluations: {
        total: evaluations.length,
        submitted: evaluations.filter((e) => e.status === "Submitted").length,
        draft: evaluations.filter((e) => e.status === "Draft").length,
      },
      recentNotifications: notifications,
    };
  }
}

export default new DashboardService();
