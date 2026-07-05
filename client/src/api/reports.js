import api from "./client";

export const getStudentReport = (id) => api.get(`/reports/students/${id}`).then((r) => r.data.data);
export const getAttachmentReport = (id) => api.get(`/reports/attachments/${id}`).then((r) => r.data.data);
export const getCompanyReport = (id) => api.get(`/reports/companies/${id}`).then((r) => r.data.data);
