import schoolRepository from "../repositories/school.repository.js";
import { NotFoundError, ForbiddenError, ConflictError } from "../../../core/errors/index.js";

class SchoolService {
  async createProfile(userId, profileData) {
    const existing = await schoolRepository.findByUserId(userId);

    if (existing) {
      throw new ConflictError("School profile already exists");
    }

    const nameExists = await schoolRepository.findBySchoolName(profileData.schoolName);

    if (nameExists) {
      throw new ConflictError("School name already exists");
    }

    return await schoolRepository.create({ userId, ...profileData });
  }

  async getAll() {
    return await schoolRepository.findAll();
  }

  async getById(id) {
    const school = await schoolRepository.findById(id);

    if (!school) {
      throw new NotFoundError("School profile not found");
    }

    return school;
  }

  async getByUserId(userId) {
    const school = await schoolRepository.findByUserId(userId);

    if (!school) {
      throw new NotFoundError("School profile not found");
    }

    return school;
  }

  async updateProfile(id, data, requestingUserId, requestingUserRole) {
    const school = await schoolRepository.findById(id);

    if (!school) {
      throw new NotFoundError("School profile not found");
    }

    if (
      requestingUserRole !== "admin" &&
      school.userId._id.toString() !== requestingUserId.toString()
    ) {
      throw new ForbiddenError("You can only update your own school profile");
    }

    if (data.schoolName && data.schoolName !== school.schoolName) {
      const nameExists = await schoolRepository.findBySchoolName(data.schoolName);

      if (nameExists) {
        throw new ConflictError("School name already exists");
      }
    }

    return await schoolRepository.update(id, data);
  }

  async deleteProfile(id) {
    const school = await schoolRepository.findById(id);

    if (!school) {
      throw new NotFoundError("School profile not found");
    }

    await schoolRepository.delete(id);

    return { id };
  }
}

export default new SchoolService();
