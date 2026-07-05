import { Router } from "express";

import authRoutes from "../modules/auth/routes/auth.routes.js";
import studentRoutes from "../modules/students/routes/student.routes.js";
import companyRoutes from "../modules/companies/routes/company.routes.js";
import opportunityRoutes from "../modules/opportunities/routes/opportunity.routes.js";
import applicationRoutes from "../modules/applications/routes/application.routes.js";
import schoolRoutes from "../modules/schools/routes/school.routes.js";
import supervisorRoutes from "../modules/supervisors/routes/supervisor.routes.js";
import attachmentRoutes from "../modules/attachments/routes/attachment.routes.js";
import logbookRoutes from "../modules/logbooks/routes/logbook.routes.js";
import evaluationRoutes from "../modules/evaluations/routes/evaluation.routes.js";
import reportRoutes from "../modules/reports/routes/report.routes.js";
import notificationRoutes from "../modules/notifications/routes/notification.routes.js";

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

/*
|--------------------------------------------------------------------------
| Applications
|--------------------------------------------------------------------------
*/

router.use("/applications", applicationRoutes);

/*
|--------------------------------------------------------------------------
| Schools
|--------------------------------------------------------------------------
*/

router.use("/schools", schoolRoutes);

/*
|--------------------------------------------------------------------------
| Supervisors
|--------------------------------------------------------------------------
*/

router.use("/supervisors", supervisorRoutes);

/*
|--------------------------------------------------------------------------
| Attachments
|--------------------------------------------------------------------------
*/

router.use("/attachments", attachmentRoutes);

/*
|--------------------------------------------------------------------------
| Logbooks
|--------------------------------------------------------------------------
*/

router.use("/logbooks", logbookRoutes);

/*
|--------------------------------------------------------------------------
| Evaluations
|--------------------------------------------------------------------------
*/

router.use("/evaluations", evaluationRoutes);

/*
|--------------------------------------------------------------------------
| Reports
|--------------------------------------------------------------------------
*/

router.use("/reports", reportRoutes);

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

router.use("/notifications", notificationRoutes);

export default router;