import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "../api/client";
import StatsCard from "../components/common/StatsCard";
import Loading from "../components/common/Loading";
import {
  Users,
  Building2,
  School,
  UserCheck,
  Briefcase,
  FileText,
  BookOpen,
  ClipboardCheck,
  Bell,
  TrendingUp,
} from "lucide-react";

const roleEndpoints = {
  admin: "/dashboard/admin",
  company: "/dashboard/company",
  student: "/dashboard/student",
  school: "/dashboard/school",
  supervisor: "/dashboard/supervisor",
};

const adminStats = [
  { key: "users", icon: Users, color: "#6366f1", label: "Total Users" },
  { key: "students", icon: Users, color: "#06b6d4", label: "Students" },
  { key: "companies", icon: Building2, color: "#f59e0b", label: "Companies" },
  { key: "schools", icon: School, color: "#10b981", label: "Schools" },
  { key: "supervisors", icon: UserCheck, color: "#8b5cf6", label: "Supervisors" },
  { key: "openOpportunities", icon: Briefcase, color: "#3b82f6", label: "Open Opportunities" },
  { key: "applications", icon: FileText, color: "#ec4899", label: "Applications" },
  { key: "activeAttachments", icon: TrendingUp, color: "#14b8a6", label: "Active Attachments" },
  { key: "pendingLogbooks", icon: BookOpen, color: "#f97316", label: "Pending Logbooks" },
  { key: "submittedEvaluations", icon: ClipboardCheck, color: "#22c55e", label: "Evaluations" },
  { key: "unreadNotifications", icon: Bell, color: "#ef4444", label: "Unread Notifications" },
];

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const endpoint = roleEndpoints[user?.role];

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", user?.role],
    queryFn: () => api.get(endpoint).then((r) => r.data.data),
    enabled: !!endpoint,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 capitalize">{user?.role} Dashboard</h2>
        <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}</p>
      </div>

      {user?.role === "admin" && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {adminStats.map((stat) => (
            <StatsCard key={stat.key} title={stat.label} value={data[stat.key]} icon={stat.icon} color={stat.color} />
          ))}
        </div>
      )}

      {user?.role === "company" && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Applications" value={data.applications} icon={FileText} color="#6366f1" />
          <StatsCard title="Accepted Students" value={data.acceptedStudents} icon={Users} color="#06b6d4" />
          <StatsCard title="Active Attachments" value={data.activeAttachments} icon={Briefcase} color="#10b981" />
          <StatsCard title="Completed" value={data.completedAttachments} icon={ClipboardCheck} color="#f59e0b" />
        </div>
      )}

      {user?.role === "student" && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Applications" value={data.applications?.length} icon={FileText} color="#6366f1" />
          <StatsCard title="Logbook Entries" value={data.logbooks?.total} icon={BookOpen} color="#06b6d4" />
          <StatsCard title="Evaluations" value={data.evaluations?.length} icon={ClipboardCheck} color="#10b981" />
          <StatsCard title="Notifications" value={data.recentNotifications?.length} icon={Bell} color="#f59e0b" />
        </div>
      )}

      {user?.role === "school" && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Registered Students" value={data.registeredStudents} icon={Users} color="#6366f1" />
          <StatsCard title="Supervisors" value={data.supervisors} icon={UserCheck} color="#06b6d4" />
          <StatsCard title="Active Attachments" value={data.activeAttachments} icon={Briefcase} color="#10b981" />
          <StatsCard title="Pending Evaluations" value={data.pendingEvaluations} icon={ClipboardCheck} color="#f59e0b" />
        </div>
      )}

      {user?.role === "supervisor" && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Assigned Students" value={data.assignedStudents?.length} icon={Users} color="#6366f1" />
          <StatsCard title="Pending Logbooks" value={data.pendingLogbooks} icon={BookOpen} color="#06b6d4" />
          <StatsCard title="Total Evaluations" value={data.evaluations?.total} icon={ClipboardCheck} color="#10b981" />
          <StatsCard title="Draft Evaluations" value={data.evaluations?.draft} icon={FileText} color="#f59e0b" />
        </div>
      )}

      {!data && !isLoading && (
        <p className="text-gray-500 text-center py-12">No dashboard data available. Complete your profile setup.</p>
      )}
    </div>
  );
}
