import Student from "../models/student.model.js";

class StudentRepository {
  async create(data) {
    return await Student.create(data);
  }

  async findAll(query = {}) {
    return await Student.find(query).populate("userId", "firstName lastName email avatar");
  }

  async findById(id) {
    return await Student.findById(id).populate("userId", "firstName lastName email avatar");
  }

  async findByUserId(userId) {
    return await Student.findOne({ userId }).populate("userId", "firstName lastName email avatar");
  }

  async findByAdmissionNumber(admissionNumber) {
    return await Student.findOne({ admissionNumber });
  }

  async update(id, data) {
    return await Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("userId", "firstName lastName email avatar");
  }

  async delete(id) {
    return await Student.findByIdAndDelete(id);
  }
}

export default new StudentRepository();
