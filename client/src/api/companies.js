import api from "./client";

export const getMyCompanyProfile = () => api.get("/companies/me").then((r) => r.data.data);
export const getCompanyProfile = (id) => api.get(`/companies/${id}`).then((r) => r.data.data);
export const createCompanyProfile = (data) => api.post("/companies", data).then((r) => r.data.data);
export const updateCompanyProfile = (id, data) => api.put(`/companies/${id}`, data).then((r) => r.data.data);
export const getCompanies = (params) => api.get("/companies", { params }).then((r) => r.data);
export const deleteCompany = (id) => api.delete(`/companies/${id}`);
