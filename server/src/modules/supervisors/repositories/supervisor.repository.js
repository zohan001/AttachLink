import Supervisor from "../models/supervisor.model.js";

class SupervisorRepository {
  async create(data) {
    return await Supervisor.create(data);
  }

  async findAll() {
    return await Supervisor.find()
      .populate("userId", "firstName lastName email avatar")
      .populate("schoolId", "schoolName abbreviation")
      .populate("companyId", "companyName logo");
  }

  async findById(id) {
    return await Supervisor.findById(id)
      .populate("userId", "firstName lastName email avatar")
      .populate("schoolId", "schoolName abbreviation")
      .populate("companyId", "companyName logo");
  }

  async findByUserId(userId) {
    return await Supervisor.findOne({ userId })
      .populate("userId", "firstName lastName email avatar")
      .populate("schoolId", "schoolName abbreviation")
      .populate("companyId", "companyName logo");
  }

  async findBySchool(schoolId) {
    return await Supervisor.find({ schoolId, supervisorType: "academic" })
      .populate("userId", "firstName lastName email avatar");
  }

  async findByCompany(companyId) {
    return await Supervisor.find({ companyId, supervisorType: "industrial" })
      .populate("userId", "firstName lastName email avatar");
  }

  async update(id, data) {
    return await Supervisor.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    })
      .populate("userId", "firstName lastName email avatar")
      .populate("schoolId", "schoolName abbreviation")
      .populate("companyId", "companyName logo");
  }

  async delete(id) {
    return await Supervisor.findByIdAndDelete(id);
  }
}

export default new SupervisorRepository();
