import School from "../models/school.model.js";

class SchoolRepository {
  async create(data) {
    return await School.create(data);
  }

  async findAll() {
    return await School.find().populate("userId", "firstName lastName email avatar");
  }

  async findById(id) {
    return await School.findById(id).populate("userId", "firstName lastName email avatar");
  }

  async findByUserId(userId) {
    return await School.findOne({ userId }).populate("userId", "firstName lastName email avatar");
  }

  async findBySchoolName(schoolName) {
    return await School.findOne({ schoolName });
  }

  async update(id, data) {
    return await School.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    }).populate("userId", "firstName lastName email avatar");
  }

  async delete(id) {
    return await School.findByIdAndDelete(id);
  }
}

export default new SchoolRepository();
