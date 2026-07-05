import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getMyNotifications, markAsRead, markAllAsRead } from "../../api/notifications";
import PageHeader from "../../components/common/PageHeader";
import Loading from "../../components/common/Loading";
import { Mail, MailOpen, CheckCheck } from "lucide-react";

export default function NotificationList() {
  const qc = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
  });

  const list = Array.isArray(items) ? items : [];

  const readMut = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const readAllMut = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifications"] }); toast.success("All marked as read"); },
  });

  return (
    <div>
      <PageHeader
        title="Notifications"
        action={
          list.some((n) => !n.read) && (
            <button onClick={() => readAllMut.mutate()} className="btn-secondary inline-flex items-center gap-2 text-sm">
              <CheckCheck size={16} /> Mark All Read
            </button>
          )
        }
      />

      {isLoading ? <Loading /> : (
        <div className="space-y-2">
          {list.length === 0 && <p className="text-center py-12 text-gray-400">No notifications</p>}
          {list.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.read && readMut.mutate(n._id)}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors
                ${n.read ? "bg-white border-gray-200" : "bg-indigo-50 border-indigo-200"}`}
            >
              {n.read ? <MailOpen size={20} className="text-gray-400 mt-0.5" /> : <Mail size={20} className="text-indigo-600 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>{n.title}</p>
                {n.message && <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>}
                <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
