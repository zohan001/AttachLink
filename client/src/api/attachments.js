import api from "./client";

export const getMyAttachments = () => api.get("/attachments/my").then((r) => r.data.data);
export const getAttachments = (params) => api.get("/attachments", { params }).then((r) => r.data.data);
export const getAttachment = (id) => api.get(`/attachments/${id}`).then((r) => r.data.data);
export const createAttachment = (data) => api.post("/attachments", data).then((r) => r.data.data);
export const completeAttachment = (id) => api.patch(`/attachments/${id}/complete`).then((r) => r.data.data);
export const terminateAttachment = (id) => api.patch(`/attachments/${id}/terminate`).then((r) => r.data.data);
export const assignSupervisor = (id, field, supervisorId) =>
  api.patch(`/attachments/${id}/assign-supervisor/${field}`, { supervisorId }).then((r) => r.data.data);
export const updateAttachment = (id, data) => api.put(`/attachments/${id}`, data).then((r) => r.data.data);
