import api from "./client";

export const getMySchoolProfile = () => api.get("/schools/me").then((r) => r.data.data);
export const getSchoolProfile = (id) => api.get(`/schools/${id}`).then((r) => r.data.data);
export const createSchoolProfile = (data) => api.post("/schools", data).then((r) => r.data.data);
export const updateSchoolProfile = (id, data) => api.put(`/schools/${id}`, data).then((r) => r.data.data);
export const getSchools = (params) => api.get("/schools", { params }).then((r) => r.data);
export const deleteSchool = (id) => api.delete(`/schools/${id}`);
