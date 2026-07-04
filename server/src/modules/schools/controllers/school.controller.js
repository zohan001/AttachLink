import schoolService from "../services/school.service.js";

class SchoolController {
  async create(req, res, next) {
    try {
      const school = await schoolService.createProfile(req.user.id, req.body);

      return res.status(201).json({
        success: true,
        message: "School profile created successfully.",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const schools = await schoolService.getAll();

      return res.status(200).json({
        success: true,
        message: "Schools retrieved successfully.",
        data: schools,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const school = await schoolService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        message: "School retrieved successfully.",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const school = await schoolService.getByUserId(req.user.id);

      return res.status(200).json({
        success: true,
        message: "School profile retrieved successfully.",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const school = await schoolService.updateProfile(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: "School profile updated successfully.",
        data: school,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await schoolService.deleteProfile(req.params.id);

      return res.status(200).json({
        success: true,
        message: "School profile deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SchoolController();
