import reportService from "../services/report.service.js";
import responseBuilder from "../../../core/response/responseBuilder.js";

class ReportController {
  async studentReport(req, res, next) {
    try {
      const report = await reportService.studentReport(req.params.id, req.user);

      return responseBuilder.success(res, report, "Student report generated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async attachmentReport(req, res, next) {
    try {
      const report = await reportService.attachmentReport(req.params.id, req.user);

      return responseBuilder.success(res, report, "Attachment report generated successfully.");
    } catch (error) {
      next(error);
    }
  }

  async companyReport(req, res, next) {
    try {
      const report = await reportService.companyReport(req.params.id);

      return responseBuilder.success(res, report, "Company report generated successfully.");
    } catch (error) {
      next(error);
    }
  }
}

export default new ReportController();
