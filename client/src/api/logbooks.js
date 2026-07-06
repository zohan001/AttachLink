import api from "./client";

export const getMyLogbooks = () => api.get("/logbooks/my").then((r) => r.data.data);
export const getAttachmentLogbooks = (id) => api.get(`/logbooks/attachment/${id}`).then((r) => r.data.data);
export const getLogbook = (id) => api.get(`/logbooks/${id}`).then((r) => r.data.data);
export const createLogbook = (data) => api.post("/logbooks", data).then((r) => r.data.data);
export const updateLogbook = (id, data) => api.put(`/logbooks/${id}`, data).then((r) => r.data.data);
export const submitLogbook = (id) => api.patch(`/logbooks/${id}/submit`).then((r) => r.data.data);
export const approveLogbook = (id) => api.patch(`/logbooks/${id}/approve`).then((r) => r.data.data);
export const rejectLogbook = (id, comment) =>
  api.patch(`/logbooks/${id}/reject`, { comment }).then((r) => r.data.data);
export const commentLogbook = (id, comment) =>
  api.patch(`/logbooks/${id}/comment`, { comment }).then((r) => r.data.data);
export const deleteLogbook = (id) => api.delete(`/logbooks/${id}`);
