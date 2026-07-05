import api from "./client";

export const getMyNotifications = () => api.get("/notifications/my").then((r) => r.data.data);
export const getUnreadCount = () => api.get("/notifications/unread-count").then((r) => r.data.data);
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data.data);
export const markAllAsRead = () => api.patch("/notifications/read-all").then((r) => r.data.data);
