import applicationService from "../services/application.service.js";

class ApplicationController {
  async apply(req, res, next) {
    try {
      const application = await applicationService.apply(
        req.user.id,
        req.body
      );

      return res.status(201).json({
        success: true,
        message: "Application submitted successfully.",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMy(req, res, next) {
    try {
      const applications = await applicationService.getMyApplications(
        req.user.id
      );

      return res.status(200).json({
        success: true,
        message: "Your applications retrieved successfully.",
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  async withdraw(req, res, next) {
    try {
      const application = await applicationService.withdraw(
        req.params.id,
        req.user.id
      );

      return res.status(200).json({
        success: true,
        message: "Application withdrawn successfully.",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyApplications(req, res, next) {
    try {
      const applications =
        await applicationService.getCompanyApplications(req.user.id);

      return res.status(200).json({
        success: true,
        message: "Applications retrieved successfully.",
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyApplicationsByOpportunity(req, res, next) {
    try {
      const applications =
        await applicationService.getCompanyApplicationsByOpportunity(
          req.user.id,
          req.params.opportunityId
        );

      return res.status(200).json({
        success: true,
        message: "Applications retrieved successfully.",
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const application = await applicationService.updateStatus(
        req.params.id,
        req.body.status,
        req.user.id,
        req.body.feedback
      );

      return res.status(200).json({
        success: true,
        message: `Application status updated to "${req.body.status}".`,
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const applications = await applicationService.getAll();

      return res.status(200).json({
        success: true,
        message: "All applications retrieved successfully.",
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await applicationService.delete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Application deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ApplicationController();
