import auditLogRepository from "../repositories/auditLog.repository.js";

class AuditLogController {
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 50, entityType, action } = req.query;
      const filters = {};
      if (entityType) filters.entityType = entityType;
      if (action) filters.action = action;

      const result = await auditLogRepository.findAll(filters, Number(page), Number(limit));

      return res.status(200).json({
        success: true,
        message: "Audit logs retrieved successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuditLogController();
