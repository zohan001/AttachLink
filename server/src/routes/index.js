import { Router } from "express";

import authRoutes from "../modules/auth/routes/auth.routes.js";
import studentRoutes from "../modules/students/routes/student.routes.js";
import companyRoutes from "../modules/companies/routes/company.routes.js";
import opportunityRoutes from "../modules/opportunities/routes/opportunity.routes.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "AttachLink API is running successfully.",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use("/auth", authRoutes);

/*
|--------------------------------------------------------------------------
| Students
|--------------------------------------------------------------------------
*/

router.use("/students", studentRoutes);

/*
|--------------------------------------------------------------------------
| Companies
|--------------------------------------------------------------------------
*/

router.use("/companies", companyRoutes);

/*
|--------------------------------------------------------------------------
| Opportunities
|--------------------------------------------------------------------------
*/

router.use("/opportunities", opportunityRoutes);

export default router;