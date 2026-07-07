import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { lazy, Suspense } from "react";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Loading from "./components/common/Loading";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

const StudentProfile = lazy(() => import("./pages/student/Profile"));
const CompanyProfile = lazy(() => import("./pages/company/Profile"));
const SchoolProfile = lazy(() => import("./pages/school/Profile"));
const SupervisorProfile = lazy(() => import("./pages/supervisor/Profile"));
const OpportunityList = lazy(() => import("./pages/opportunities/List"));
const OpportunityDetail = lazy(() => import("./pages/opportunities/Detail"));
const OpportunityForm = lazy(() => import("./pages/opportunities/Form"));
const ApplicationList = lazy(() => import("./pages/applications/List"));
const AttachmentList = lazy(() => import("./pages/attachments/List"));
const AttachmentDetail = lazy(() => import("./pages/attachments/Detail"));
const LogbookList = lazy(() => import("./pages/logbooks/List"));
const EvaluationList = lazy(() => import("./pages/evaluations/List"));
const NotificationList = lazy(() => import("./pages/notifications/List"));
const ReportList = lazy(() => import("./pages/reports/List"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const AdminStudents = lazy(() => import("./pages/admin/Students"));
const AdminCompanies = lazy(() => import("./pages/admin/Companies"));
const AdminSchools = lazy(() => import("./pages/admin/Schools"));
const AdminSupervisors = lazy(() => import("./pages/admin/Supervisors"));
const AdminApplications = lazy(() => import("./pages/admin/Applications"));
const AdminOpportunities = lazy(() => import("./pages/admin/Opportunities"));

function Lazy({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/notifications" element={<Lazy><NotificationList /></Lazy>} />
          <Route path="/settings" element={<Lazy><Settings /></Lazy>} />
          <Route path="/opportunities" element={<Lazy><OpportunityList /></Lazy>} />
          <Route path="/opportunities/:id" element={<Lazy><OpportunityDetail /></Lazy>} />
          <Route path="/attachments" element={<Lazy><AttachmentList /></Lazy>} />
          <Route path="/attachments/:id" element={<Lazy><AttachmentDetail /></Lazy>} />

          {/* Student-only */}
          <Route path="/profile/student" element={<ProtectedRoute roles={["student"]}><StudentProfile /></ProtectedRoute>} />
          <Route path="/logbooks" element={<ProtectedRoute roles={["student", "supervisor"]}><LogbookList /></ProtectedRoute>} />
          <Route path="/attachments/:id/logbooks" element={<ProtectedRoute roles={["student", "supervisor"]}><LogbookList /></ProtectedRoute>} />
          <Route path="/evaluations" element={<ProtectedRoute roles={["student", "school", "supervisor"]}><EvaluationList /></ProtectedRoute>} />
          <Route path="/attachments/:id/evaluations" element={<ProtectedRoute roles={["student", "school", "supervisor"]}><EvaluationList /></ProtectedRoute>} />

          {/* Company-only */}
          <Route path="/profile/company" element={<ProtectedRoute roles={["company"]}><CompanyProfile /></ProtectedRoute>} />
          <Route path="/opportunities/new" element={<ProtectedRoute roles={["company"]}><OpportunityForm /></ProtectedRoute>} />
          <Route path="/opportunities/:id/edit" element={<ProtectedRoute roles={["company", "admin"]}><OpportunityForm /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute roles={["student", "company"]}><ApplicationList /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute roles={["admin", "company", "school"]}><ReportList /></ProtectedRoute>} />

          {/* School-only */}
          <Route path="/profile/school" element={<ProtectedRoute roles={["school"]}><SchoolProfile /></ProtectedRoute>} />

          {/* Supervisor-only */}
          <Route path="/profile/supervisor" element={<ProtectedRoute roles={["supervisor"]}><SupervisorProfile /></ProtectedRoute>} />

          {/* Admin-only */}
          <Route path="/admin/students" element={<ProtectedRoute roles={["admin", "school"]}><AdminStudents /></ProtectedRoute>} />
          <Route path="/admin/companies" element={<ProtectedRoute roles={["admin"]}><AdminCompanies /></ProtectedRoute>} />
          <Route path="/admin/schools" element={<ProtectedRoute roles={["admin"]}><AdminSchools /></ProtectedRoute>} />
          <Route path="/admin/supervisors" element={<ProtectedRoute roles={["admin", "school"]}><AdminSupervisors /></ProtectedRoute>} />
          <Route path="/admin/applications" element={<ProtectedRoute roles={["admin"]}><AdminApplications /></ProtectedRoute>} />
          <Route path="/admin/opportunities" element={<ProtectedRoute roles={["admin"]}><AdminOpportunities /></ProtectedRoute>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
