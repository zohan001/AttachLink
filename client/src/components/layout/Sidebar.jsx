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
  Settings,
  Megaphone,
} from "lucide-react";
import { setSidebarOpen } from "../../store/uiSlice";

const roleLinks = {
  admin: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/students", label: "Students", icon: GraduationCap },
    { to: "/admin/companies", label: "Companies", icon: Building2 },
    { to: "/admin/schools", label: "Schools", icon: School },
    { to: "/admin/supervisors", label: "Supervisors", icon: UserCheck },
    { to: "/admin/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/admin/applications", label: "Applications", icon: FileText },
    { to: "/attachments", label: "Attachments", icon: Briefcase },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  student: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile/student", label: "My Profile", icon: Users },
    { to: "/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/applications", label: "Applications", icon: FileText },
    { to: "/attachments", label: "Attachments", icon: Megaphone },
    { to: "/logbooks", label: "Logbooks", icon: BookOpen },
    { to: "/evaluations", label: "Evaluations", icon: ClipboardCheck },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  company: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile/company", label: "My Profile", icon: Building2 },
    { to: "/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/applications", label: "Applications", icon: FileText },
    { to: "/attachments", label: "Attachments", icon: Users },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  school: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile/school", label: "My Profile", icon: School },
    { to: "/admin/students", label: "Students", icon: GraduationCap },
    { to: "/admin/supervisors", label: "Supervisors", icon: UserCheck },
    { to: "/attachments", label: "Attachments", icon: Briefcase },
    { to: "/evaluations", label: "Evaluations", icon: ClipboardCheck },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
  ],
  supervisor: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/profile/supervisor", label: "My Profile", icon: UserCheck },
    { to: "/attachments", label: "Attachments", icon: Users },
    { to: "/logbooks", label: "Logbooks", icon: BookOpen },
    { to: "/evaluations", label: "Evaluations", icon: ClipboardCheck },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: Settings },
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
        <div className="px-4 py-3 border-b border-gray-100 mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
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
