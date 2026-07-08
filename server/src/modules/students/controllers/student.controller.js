import studentService from "../services/student.service.js";

class StudentController {
  async create(req, res, next) {
    try {
      const student = await studentService.createProfile(
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Student profile created successfully.",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const students = await studentService.getAll(req.query, req.user);

      return res.status(200).json({
        success: true,
        message: "Students retrieved successfully.",
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const student = await studentService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Student retrieved successfully.",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const student = await studentService.getByUserId(req.user.id);

      return res.status(200).json({
        success: true,
        message: "Profile retrieved successfully.",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const student = await studentService.updateProfile(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: "Student profile updated successfully.",
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await studentService.deleteProfile(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Student profile deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new StudentController();
