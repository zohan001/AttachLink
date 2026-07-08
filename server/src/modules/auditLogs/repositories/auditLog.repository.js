import AuditLog from "../models/auditLog.model.js";

class AuditLogRepository {
  async create(data) {
    return await AuditLog.create(data);
  }

  async findAll(filters = {}, page = 1, limit = 50) {
    const query = AuditLog.find(filters)
      .populate("performedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const items = await query;
    const total = await AuditLog.countDocuments(filters);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }
}

export default new AuditLogRepository();
