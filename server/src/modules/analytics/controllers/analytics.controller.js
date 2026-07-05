import analyticsService from "../services/analytics.service.js";
import responseBuilder from "../../../core/response/responseBuilder.js";

class AnalyticsController {
  async system(req, res, next) {
    try {
      const stats = await analyticsService.systemStats();

      return responseBuilder.success(res, stats, "System analytics retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async applications(req, res, next) {
    try {
      const data = await analyticsService.monthlyApplications();

      return responseBuilder.success(res, data, "Application analytics retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async attachments(req, res, next) {
    try {
      const data = await analyticsService.monthlyAttachments();

      return responseBuilder.success(res, data, "Attachment analytics retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async evaluations(req, res, next) {
    try {
      const data = await analyticsService.evaluationAnalytics();

      return responseBuilder.success(res, data, "Evaluation analytics retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async companies(req, res, next) {
    try {
      const data = await analyticsService.companyAnalytics();

      return responseBuilder.success(res, data, "Company analytics retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }

  async students(req, res, next) {
    try {
      const data = await analyticsService.studentAnalytics();

      return responseBuilder.success(res, data, "Student analytics retrieved successfully.");
    } catch (error) {
      next(error);
    }
  }
}

export default new AnalyticsController();
