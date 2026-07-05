function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    const sanitizedKey = key.replace(/^\$/, "").replace(/\./g, "");
    if (sanitizedKey !== key) {
      obj[sanitizedKey] = obj[key];
      delete obj[key];
    }
    if (typeof obj[sanitizedKey] === "object") {
      sanitizeObject(obj[sanitizedKey]);
    }
  }
}

export default function mongoSanitize(req, res, next) {
  if (req.body) sanitizeObject(req.body);
  if (req.params) sanitizeObject(req.params);
  if (req.query) {
    const keys = Object.keys(req.query);
    for (const key of keys) {
      const sanitizedKey = key.replace(/^\$/, "").replace(/\./g, "");
      if (sanitizedKey !== key) {
        req.query[sanitizedKey] = req.query[key];
        delete req.query[key];
      }
      if (typeof req.query[sanitizedKey] === "object") {
        sanitizeObject(req.query[sanitizedKey]);
      }
    }
  }
  next();
}
