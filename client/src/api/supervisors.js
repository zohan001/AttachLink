import api from "./client";

export const getMySupervisorProfile = () => api.get("/supervisors/me").then((r) => r.data.data);
export const getSupervisorProfile = (id) => api.get(`/supervisors/${id}`).then((r) => r.data.data);
export const createSupervisorProfile = (data) => api.post("/supervisors", data).then((r) => r.data.data);
export const updateSupervisorProfile = (id, data) => api.put(`/supervisors/${id}`, data).then((r) => r.data.data);
export const getSupervisors = (params) => api.get("/supervisors", { params }).then((r) => r.data);
export const deleteSupervisor = (id) => api.delete(`/supervisors/${id}`);
