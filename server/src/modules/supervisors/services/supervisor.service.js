import supervisorRepository from "../repositories/supervisor.repository.js";
import schoolRepository from "../../schools/repositories/school.repository.js";
import companyRepository from "../../companies/repositories/company.repository.js";
import { NotFoundError, ForbiddenError, ConflictError, AppError } from "../../../core/errors/index.js";

class SupervisorService {
  async createProfile(userId, data) {
    const existing = await supervisorRepository.findByUserId(userId);

    if (existing) {
      throw new ConflictError("Supervisor profile already exists");
    }

    if (data.supervisorType === "academic") {
      if (!data.schoolId) {
        throw new AppError("Academic supervisors must have a school ID", 400);
      }

      const school = await schoolRepository.findById(data.schoolId);

      if (!school) {
        throw new NotFoundError("School not found");
      }
    }

    if (data.supervisorType === "industrial") {
      if (!data.companyId) {
        throw new AppError("Industrial supervisors must have a company ID", 400);
      }

      const company = await companyRepository.findById(data.companyId);

      if (!company) {
        throw new NotFoundError("Company not found");
      }
    }

    return await supervisorRepository.create({ userId, ...data });
  }

  async getAll(query = {}, requestingUser) {
    if (requestingUser?.role === "school") {
      const school = await schoolRepository.findByUserId(requestingUser.id);
      if (school) query.schoolId = school._id;
    }
    return await supervisorRepository.findAll(query);
  }

  async getById(id) {
    const supervisor = await supervisorRepository.findById(id);

    if (!supervisor) {
      throw new NotFoundError("Supervisor profile not found");
    }

    return supervisor;
  }

  async getByUserId(userId) {
    const supervisor = await supervisorRepository.findByUserId(userId);

    if (!supervisor) {
      throw new NotFoundError("Supervisor profile not found");
    }

    return supervisor;
  }

  async updateProfile(id, data, requestingUserId, requestingUserRole) {
    const supervisor = await supervisorRepository.findById(id);

    if (!supervisor) {
      throw new NotFoundError("Supervisor profile not found");
    }

    if (
      requestingUserRole !== "admin" &&
      supervisor.userId._id.toString() !== requestingUserId.toString()
    ) {
      throw new ForbiddenError("You can only update your own supervisor profile");
    }

    if (data.supervisorType === "academic" && data.schoolId) {
      const school = await schoolRepository.findById(data.schoolId);

      if (!school) {
        throw new NotFoundError("School not found");
      }
    }

    if (data.supervisorType === "industrial" && data.companyId) {
      const company = await companyRepository.findById(data.companyId);

      if (!company) {
        throw new NotFoundError("Company not found");
      }
    }

    return await supervisorRepository.update(id, data);
  }

  async deleteProfile(id) {
    const supervisor = await supervisorRepository.findById(id);

    if (!supervisor) {
      throw new NotFoundError("Supervisor profile not found");
    }

    await supervisorRepository.delete(id);

    return { id };
  }
}

export default new SupervisorService();
