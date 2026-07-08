import Company from "../models/company.model.js";

class CompanyRepository {
  async create(data) {
    return await Company.create(data);
  }

  async findAll() {
    return await Company.find().populate("userId", "firstName lastName email avatar");
  }

  async findById(id) {
    return await Company.findById(id).populate("userId", "firstName lastName email avatar");
  }

  async findByUserId(userId) {
    return await Company.findOne({ userId }).populate("userId", "firstName lastName email avatar");
  }

  async findByCompanyName(companyName) {
    return await Company.findOne({ companyName });
  }

  async update(id, data) {
    return await Company.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    }).populate("userId", "firstName lastName email avatar");
  }

  async delete(id) {
    return await Company.findByIdAndDelete(id);
  }
}

export default new CompanyRepository();
