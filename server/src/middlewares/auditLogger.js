import AuditLog from "../modules/auditLogs/models/auditLog.model.js";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const ACTION_MAP = {
  POST: "CREATE",
  PUT: "UPDATE",
  PATCH: "UPDATE",
  DELETE: "DELETE",
};

function inferEntityType(path) {
  const segments = path.replace(/^\/api\/v1\//, "").split("/");
  const raw = segments[0];
  const singular = raw.endsWith("ies") ? raw.slice(0, -3) + "y" : raw.endsWith("s") ? raw.slice(0, -1) : raw;
  const map = {
    student: "Student",
    supervisor: "Supervisor",
    company: "Company",
    school: "School",
    opportunity: "Opportunity",
    application: "Application",
    attachment: "Attachment",
    logbook: "Logbook",
    evaluation: "Evaluation",
    "audit-log": "AuditLog",
    notification: "Notification",
  };
  return map[singular] || singular.charAt(0).toUpperCase() + singular.slice(1);
}

export default function auditLogger(req, res, next) {
  if (!WRITE_METHODS.has(req.method) || !req.user) {
    return next();
  }

  const action = ACTION_MAP[req.method];
  const entityType = inferEntityType(req.path);
  const entityId = req.params.id || req.body?._id || null;

  if (!entityId && action !== "CREATE") {
    return next();
  }

  const originalEnd = res.end.bind(res);

  res.end = function (...args) {
    if (res.statusCode < 400) {
      const description = `${action} ${entityType}${entityId ? ` (${entityId})` : ""} by ${req.user.role} ${req.user.id}`;
      AuditLog.create({
        action,
        entityType,
        entityId: entityId || "000000000000000000000000",
        performedBy: req.user.id,
        performedByRole: req.user.role,
        description,
        metadata: {
          method: req.method,
          path: req.path,
          params: req.params,
          body: sanitizeBody(req.body),
        },
        ip: req.ip || req.headers["x-forwarded-for"] || "",
      }).catch((err) => console.error("Audit log failed:", err.message));
    }
    return originalEnd(...args);
  };

  next();
}

function sanitizeBody(body) {
  if (!body) return {};
  const sanitized = { ...body };
  ["password", "currentPassword", "newPassword", "confirmPassword", "confirmNewPassword"].forEach(
    (k) => delete sanitized[k]
  );
  return sanitized;
}
