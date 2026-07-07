import api from "./client";

export const getMyApplications = () => api.get("/applications/my").then((r) => r.data.data);
export const getCompanyApplications = (oppId) =>
  api.get(oppId ? `/applications/company/${oppId}` : "/applications/company").then((r) => r.data.data);
export const getApplications = (params) => api.get("/applications", { params }).then((r) => r.data);
export const createApplication = (data) => api.post("/applications", data).then((r) => r.data.data);
export const updateApplicationStatus = (id, status) =>
  api.patch(`/applications/${id}/status`, { status }).then((r) => r.data.data);
export const withdrawApplication = (id) => api.patch(`/applications/${id}/withdraw`).then((r) => r.data.data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
