import companyRepository from "../repositories/company.repository.js";

class CompanyService {
  async createProfile(userId, profileData) {
    const existingProfile = await companyRepository.findByUserId(userId);

    if (existingProfile) {
      throw new Error("Company profile already exists");
    }

    const existingName = await companyRepository.findByCompanyName(
      profileData.companyName
    );

    if (existingName) {
      throw new Error("Company name already exists");
    }

    const company = await companyRepository.create({
      userId,
      ...profileData,
    });

    return company;
  }

  async getAll() {
    return await companyRepository.findAll();
  }

  async getById(id) {
    const company = await companyRepository.findById(id);

    if (!company) {
      throw new Error("Company profile not found");
    }

    return company;
  }

  async getByUserId(userId) {
    const company = await companyRepository.findByUserId(userId);

    if (!company) {
      throw new Error("Company profile not found");
    }

    return company;
  }

  async updateProfile(id, data, requestingUserId, requestingUserRole) {
    const company = await companyRepository.findById(id);

    if (!company) {
      throw new Error("Company profile not found");
    }

    if (
      requestingUserRole !== "admin" &&
      company.userId._id.toString() !== requestingUserId.toString()
    ) {
      throw new Error("You can only update your own company profile");
    }

    if (data.companyName && data.companyName !== company.companyName) {
      const existingName = await companyRepository.findByCompanyName(
        data.companyName
      );

      if (existingName) {
        throw new Error("Company name already exists");
      }
    }

    const updated = await companyRepository.update(id, data);

    return updated;
  }

  async deleteProfile(id) {
    const company = await companyRepository.findById(id);

    if (!company) {
      throw new Error("Company profile not found");
    }

    await companyRepository.delete(id);

    return { id };
  }
}

export default new CompanyService();
