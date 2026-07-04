import studentRepository from "../repositories/student.repository.js";

class StudentService {
  async createProfile(userId, profileData) {
    const existingProfile = await studentRepository.findByUserId(userId);

    if (existingProfile) {
      throw new Error("Student profile already exists");
    }

    const existingAdmission = await studentRepository.findByAdmissionNumber(
      profileData.admissionNumber
    );

    if (existingAdmission) {
      throw new Error("Admission number already exists");
    }

    const student = await studentRepository.create({
      userId,
      ...profileData,
    });

    return student;
  }

  async getAll(query = {}) {
    return await studentRepository.findAll(query);
  }

  async getById(id) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student profile not found");
    }

    return student;
  }

  async getByUserId(userId) {
    const student = await studentRepository.findByUserId(userId);

    if (!student) {
      throw new Error("Student profile not found");
    }

    return student;
  }

  async updateProfile(id, data, requestingUserId, requestingUserRole) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student profile not found");
    }

    if (
      requestingUserRole !== "admin" &&
      student.userId._id.toString() !== requestingUserId.toString()
    ) {
      throw new Error("You can only update your own profile");
    }

    const updated = await studentRepository.update(id, data);

    return updated;
  }

  async deleteProfile(id) {
    const student = await studentRepository.findById(id);

    if (!student) {
      throw new Error("Student profile not found");
    }

    await studentRepository.delete(id);

    return { id };
  }
}

export default new StudentService();
