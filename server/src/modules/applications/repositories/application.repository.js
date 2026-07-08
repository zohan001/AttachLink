import Application from "../models/application.model.js";

const populateFields = [
  { path: "studentId", populate: { path: "userId", select: "firstName lastName email" } },
  { path: "opportunityId", select: "title location applicationDeadline status" },
  { path: "companyId", select: "companyName logo" },
];

class ApplicationRepository {
  async create(data) {
    return await Application.create(data);
  }

  async findById(id) {
    return await Application.findById(id).populate(populateFields);
  }

  async findStudentApplications(studentId) {
    return await Application.find({ studentId })
      .populate(populateFields)
      .sort({ appliedAt: -1 });
  }

  async findCompanyApplications(companyId) {
    return await Application.find({ companyId })
      .populate(populateFields)
      .sort({ appliedAt: -1 });
  }

  async findByOpportunity(companyId, opportunityId) {
    return await Application.find({ companyId, opportunityId })
      .populate(populateFields)
      .sort({ appliedAt: -1 });
  }

  async findExisting(studentId, opportunityId) {
    return await Application.findOne({ studentId, opportunityId });
  }

  async findAll() {
    return await Application.find()
      .populate(populateFields)
      .sort({ appliedAt: -1 });
  }

  async updateStatus(id, status, reviewedBy) {
    const update = { status };

    if (["Under Review", "Shortlisted", "Interview Scheduled", "Accepted", "Rejected"].includes(status)) {
      update.reviewedAt = new Date();
    }

    if (reviewedBy) {
      update.reviewedBy = reviewedBy;
    }

    if (status === "Shortlisted") {
      update.shortlisted = true;
    }

    return await Application.findByIdAndUpdate(id, update, { returnDocument: "after" }).populate(populateFields);
  }

  async update(id, data) {
    return await Application.findByIdAndUpdate(id, data, { returnDocument: "after" }).populate(populateFields);
  }

  async delete(id) {
    return await Application.findByIdAndDelete(id);
  }
}

export default new ApplicationRepository();
