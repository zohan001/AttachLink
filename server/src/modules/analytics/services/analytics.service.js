import User from "../../auth/models/user.model.js";
import Opportunity from "../../opportunities/models/opportunity.model.js";
import Application from "../../applications/models/application.model.js";
import Attachment from "../../attachments/models/attachment.model.js";
import Logbook from "../../logbooks/models/logbook.model.js";
import Evaluation from "../../evaluations/models/evaluation.model.js";
import Company from "../../companies/models/company.model.js";
import School from "../../schools/models/school.model.js";
import Supervisor from "../../supervisors/models/supervisor.model.js";
import Student from "../../students/models/student.model.js";
import Notification from "../../notifications/models/notification.model.js";

class AnalyticsService {
  async systemStats() {
    const [
      totalUsers,
      students,
      companies,
      schools,
      supervisors,
      totalOpportunities,
      openOpportunities,
      closedOpportunities,
      totalApplications,
      acceptedApplications,
      totalAttachments,
      activeAttachments,
      completedAttachments,
      totalLogbooks,
      submittedLogbooks,
      approvedLogbooks,
      totalEvaluations,
      unreadNotifications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "company" }),
      User.countDocuments({ role: "school" }),
      User.countDocuments({ role: "supervisor" }),
      Opportunity.countDocuments(),
      Opportunity.countDocuments({ published: true, status: "Open" }),
      Opportunity.countDocuments({ status: "Closed" }),
      Application.countDocuments(),
      Application.countDocuments({ status: "Accepted" }),
      Attachment.countDocuments(),
      Attachment.countDocuments({ status: "Active" }),
      Attachment.countDocuments({ status: "Completed" }),
      Logbook.countDocuments(),
      Logbook.countDocuments({ status: "Submitted" }),
      Logbook.countDocuments({ status: "Approved" }),
      Evaluation.countDocuments(),
      Notification.countDocuments({ read: false }),
    ]);

    const acceptanceRate = totalApplications > 0
      ? Math.round((acceptedApplications / totalApplications) * 100)
      : 0;

    const completionRate = totalAttachments > 0
      ? Math.round((completedAttachments / totalAttachments) * 100)
      : 0;

    const evaluationAvg = await Evaluation.aggregate([
      { $group: { _id: null, avg: { $avg: "$overallScore" } } },
    ]);

    const hoursAgg = await Logbook.aggregate([
      { $group: { _id: null, total: { $sum: "$hoursWorked" }, avg: { $avg: "$hoursWorked" } } },
    ]);

    return {
      users: {
        total: totalUsers,
        students,
        companies,
        schools,
        supervisors,
      },
      opportunities: {
        total: totalOpportunities,
        open: openOpportunities,
        closed: closedOpportunities,
      },
      applications: {
        total: totalApplications,
        accepted: acceptedApplications,
        acceptanceRate: `${acceptanceRate}%`,
      },
      attachments: {
        total: totalAttachments,
        active: activeAttachments,
        completed: completedAttachments,
        completionRate: `${completionRate}%`,
      },
      logbooks: {
        total: totalLogbooks,
        submitted: submittedLogbooks,
        approved: approvedLogbooks,
        totalHours: hoursAgg[0]?.total || 0,
        averageHoursPerEntry: Math.round((hoursAgg[0]?.avg || 0) * 10) / 10,
      },
      evaluations: {
        total: totalEvaluations,
        averageScore: evaluationAvg[0]
          ? Math.round(evaluationAvg[0].avg * 10) / 10
          : null,
      },
      notifications: {
        unread: unreadNotifications,
      },
    };
  }

  async monthlyApplications() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const data = await Application.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ["$status", "Accepted"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return data.map((d) => ({
      month: `${d._id.year}-${String(d._id.month).padStart(2, "0")}`,
      total: d.total,
      accepted: d.accepted,
      rejected: d.rejected,
    }));
  }

  async monthlyAttachments() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const data = await Attachment.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
          terminated: {
            $sum: { $cond: [{ $eq: ["$status", "Terminated"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return data.map((d) => ({
      month: `${d._id.year}-${String(d._id.month).padStart(2, "0")}`,
      total: d.total,
      active: d.active,
      completed: d.completed,
      terminated: d.terminated,
    }));
  }

  async evaluationAnalytics() {
    const [avgResult, scores, recommendationDist] = await Promise.all([
      Evaluation.aggregate([
        {
          $group: {
            _id: null,
            avg: { $avg: "$overallScore" },
            max: { $max: "$overallScore" },
            min: { $min: "$overallScore" },
          },
        },
      ]),
      Evaluation.aggregate([
        {
          $group: {
            _id: null,
            punctuality: { $avg: "$criteria.punctuality" },
            technicalSkills: { $avg: "$criteria.technicalSkills" },
            communication: { $avg: "$criteria.communication" },
            teamwork: { $avg: "$criteria.teamwork" },
            problemSolving: { $avg: "$criteria.problemSolving" },
            initiative: { $avg: "$criteria.initiative" },
            qualityOfWork: { $avg: "$criteria.qualityOfWork" },
            attendance: { $avg: "$criteria.attendance" },
          },
        },
      ]),
      Evaluation.aggregate([
        { $match: { recommendation: { $ne: null } } },
        { $group: { _id: "$recommendation", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    const avg = avgResult[0] || {};
    const criteria = scores[0] || {};

    const round = (v) => (v ? Math.round(v * 10) / 10 : null);

    return {
      averageScore: round(avg.avg),
      highestScore: round(avg.max),
      lowestScore: round(avg.min),
      criteriaAverages: {
        punctuality: round(criteria.punctuality),
        technicalSkills: round(criteria.technicalSkills),
        communication: round(criteria.communication),
        teamwork: round(criteria.teamwork),
        problemSolving: round(criteria.problemSolving),
        initiative: round(criteria.initiative),
        qualityOfWork: round(criteria.qualityOfWork),
        attendance: round(criteria.attendance),
      },
      recommendationDistribution: recommendationDist.map((r) => ({
        recommendation: r._id,
        count: r.count,
      })),
    };
  }

  async companyAnalytics() {
    const companies = await Company.find()
      .populate("userId", "firstName lastName email")
      .lean();

    const companyStats = await Promise.all(
      companies.map(async (c) => {
        const [opportunities, activeAttachments, completedAttachments] =
          await Promise.all([
            Opportunity.countDocuments({ companyId: c._id }),
            Attachment.countDocuments({
              companyId: c._id,
              status: "Active",
            }),
            Attachment.countDocuments({
              companyId: c._id,
              status: "Completed",
            }),
          ]);

        return {
          _id: c._id,
          companyName: c.companyName,
          industry: c.industry,
          verified: c.verified,
          opportunities,
          activeAttachments,
          completedAttachments,
        };
      })
    );

    companyStats.sort((a, b) => b.activeAttachments - a.activeAttachments);

    return {
      total: companies.length,
      topByAttachments: companyStats.slice(0, 10),
    };
  }

  async studentAnalytics() {
    const students = await Student.find().populate("userId", "firstName lastName email").lean();

    const studentStats = await Promise.all(
      students.map(async (s) => {
        const [totalHours, totalLogbooks, approvedLogbooks, evaluations] =
          await Promise.all([
            Logbook.aggregate([
              { $match: { studentId: s._id } },
              { $group: { _id: null, total: { $sum: "$hoursWorked" } } },
            ]),
            Logbook.countDocuments({ studentId: s._id }),
            Logbook.countDocuments({ studentId: s._id, status: "Approved" }),
            Evaluation.find({ studentId: s._id }).select("overallScore").lean(),
          ]);

        const avgScore =
          evaluations.length > 0
            ? Math.round(
                (evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0) /
                  evaluations.length) *
                  10
              ) / 10
            : null;

        return {
          _id: s._id,
          user: s.userId,
          admissionNumber: s.admissionNumber,
          course: s.course,
          totalHours: totalHours[0]?.total || 0,
          totalLogbooks,
          approvedLogbooks,
          evaluationCount: evaluations.length,
          averageScore: avgScore,
        };
      })
    );

    const byHours = [...studentStats].sort((a, b) => b.totalHours - a.totalHours);
    const byScore = [...studentStats].sort(
      (a, b) => (b.averageScore || 0) - (a.averageScore || 0)
    );
    const byLogbooks = [...studentStats].sort(
      (a, b) => b.totalLogbooks - a.totalLogbooks
    );

    return {
      total: students.length,
      topByHours: byHours.slice(0, 10),
      topByScore: byScore.slice(0, 10),
      topByLogbooks: byLogbooks.slice(0, 10),
    };
  }
}

export default new AnalyticsService();
