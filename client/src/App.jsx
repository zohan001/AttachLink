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
          <Route path="/profile/student" element={<Lazy><StudentProfile /></Lazy>} />
          <Route path="/profile/company" element={<Lazy><CompanyProfile /></Lazy>} />
          <Route path="/profile/school" element={<Lazy><SchoolProfile /></Lazy>} />
          <Route path="/profile/supervisor" element={<Lazy><SupervisorProfile /></Lazy>} />
          <Route path="/opportunities" element={<Lazy><OpportunityList /></Lazy>} />
          <Route path="/opportunities/new" element={<Lazy><OpportunityForm /></Lazy>} />
          <Route path="/opportunities/:id" element={<Lazy><OpportunityDetail /></Lazy>} />
          <Route path="/opportunities/:id/edit" element={<Lazy><OpportunityForm /></Lazy>} />
          <Route path="/applications" element={<Lazy><ApplicationList /></Lazy>} />
          <Route path="/attachments" element={<Lazy><AttachmentList /></Lazy>} />
          <Route path="/attachments/:id" element={<Lazy><AttachmentDetail /></Lazy>} />
          <Route path="/attachments/:id/logbooks" element={<Lazy><LogbookList /></Lazy>} />
          <Route path="/attachments/:id/evaluations" element={<Lazy><EvaluationList /></Lazy>} />
          <Route path="/logbooks" element={<Lazy><LogbookList /></Lazy>} />
          <Route path="/evaluations" element={<Lazy><EvaluationList /></Lazy>} />
          <Route path="/notifications" element={<Lazy><NotificationList /></Lazy>} />
          <Route path="/reports" element={<Lazy><ReportList /></Lazy>} />
          <Route path="/settings" element={<Lazy><Settings /></Lazy>} />

          <Route path="/admin/students" element={<Lazy><AdminStudents /></Lazy>} />
          <Route path="/admin/companies" element={<Lazy><AdminCompanies /></Lazy>} />
          <Route path="/admin/schools" element={<Lazy><AdminSchools /></Lazy>} />
          <Route path="/admin/supervisors" element={<Lazy><AdminSupervisors /></Lazy>} />
          <Route path="/admin/applications" element={<Lazy><AdminApplications /></Lazy>} />
          <Route path="/admin/opportunities" element={<Lazy><AdminOpportunities /></Lazy>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
