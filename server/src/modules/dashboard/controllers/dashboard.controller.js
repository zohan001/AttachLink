import dashboardService from "../services/dashboard.service.js";
import responseBuilder from "../../../core/response/responseBuilder.js";

class DashboardController {
  async admin(req, res, next) {
    try {
      const data = await dashboardService.admin();

      return responseBuilder.success(res, data, "Admin dashboard data retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async company(req, res, next) {
    try {
      const data = await dashboardService.company(req.user.id);

      return responseBuilder.success(res, data, "Company dashboard data retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async student(req, res, next) {
    try {
      const data = await dashboardService.student(req.user.id);

      return responseBuilder.success(res, data, "Student dashboard data retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async school(req, res, next) {
    try {
      const data = await dashboardService.school(req.user.id);

      return responseBuilder.success(res, data, "School dashboard data retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async supervisor(req, res, next) {
    try {
      const data = await dashboardService.supervisor(req.user.id);

      return responseBuilder.success(res, data, "Supervisor dashboard data retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
