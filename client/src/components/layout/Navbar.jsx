import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Menu, Bell, User } from "lucide-react";
import { logout } from "../../store/authSlice";
import { toggleSidebar } from "../../store/uiSlice";
import { getUnreadCount } from "../../api/notifications";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: unreadData } = useQuery({
    queryKey: ["unread-count"],
    queryFn: getUnreadCount,
    refetchInterval: 30000,
  });
  const unread = unreadData?.unread || 0;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => dispatch(toggleSidebar())}
          >
            <Menu size={20} />
          </button>
          <h1 className="text-xl font-bold text-indigo-600">AttachLink</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            className="relative p-2 rounded-lg hover:bg-gray-100"
            onClick={() => navigate("/notifications")}
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <User size={18} />
            <span className="hidden sm:inline capitalize">{user?.role}</span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
