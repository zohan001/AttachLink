import supervisorService from "../services/supervisor.service.js";

class SupervisorController {
  async create(req, res, next) {
    try {
      const supervisor = await supervisorService.createProfile(
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Supervisor profile created successfully.",
        data: supervisor,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const supervisors = await supervisorService.getAll();

      return res.status(200).json({
        success: true,
        message: "Supervisors retrieved successfully.",
        data: supervisors,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const supervisor = await supervisorService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Supervisor retrieved successfully.",
        data: supervisor,
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const supervisor = await supervisorService.getByUserId(req.user.id);

      return res.status(200).json({
        success: true,
        message: "Supervisor profile retrieved successfully.",
        data: supervisor,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const supervisor = await supervisorService.updateProfile(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );

      return res.status(200).json({
        success: true,
        message: "Supervisor profile updated successfully.",
        data: supervisor,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await supervisorService.deleteProfile(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Supervisor profile deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SupervisorController();
