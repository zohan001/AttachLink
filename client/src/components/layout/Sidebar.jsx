import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
  FileText,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  Bell,
  School,
  UserCheck,
} from "lucide-react";
import { setSidebarOpen } from "../../store/uiSlice";

const roleLinks = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/students", label: "Students", icon: GraduationCap },
    { to: "/companies", label: "Companies", icon: Building2 },
    { to: "/schools", label: "Schools", icon: School },
    { to: "/supervisors", label: "Supervisors", icon: UserCheck },
    { to: "/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/applications", label: "Applications", icon: FileText },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ],
  student: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/applications", label: "Applications", icon: FileText },
    { to: "/attachments", label: "Attachments", icon: Briefcase },
    { to: "/logbooks", label: "Logbooks", icon: BookOpen },
    { to: "/evaluations", label: "Evaluations", icon: ClipboardCheck },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
  company: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/applications", label: "Applications", icon: FileText },
    { to: "/attachments", label: "Attachments", icon: Users },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
  school: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/students", label: "Students", icon: GraduationCap },
    { to: "/supervisors", label: "Supervisors", icon: UserCheck },
    { to: "/attachments", label: "Attachments", icon: Briefcase },
    { to: "/evaluations", label: "Evaluations", icon: ClipboardCheck },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
  supervisor: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/attachments", label: "Attachments", icon: Users },
    { to: "/logbooks", label: "Logbooks", icon: BookOpen },
    { to: "/evaluations", label: "Evaluations", icon: ClipboardCheck },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ],
};

export default function Sidebar() {
  const { user } = useSelector((s) => s.auth);
  const { sidebarOpen } = useSelector((s) => s.ui);
  const dispatch = useDispatch();

  const links = roleLinks[user?.role] || [];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      <aside
        className={`fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-200 w-64
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <nav className="p-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/dashboard"}
              onClick={() => dispatch(setSidebarOpen(false))}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
