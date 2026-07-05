import api from "./client";

export const getOpportunities = (params) => api.get("/opportunities", { params }).then((r) => r.data);
export const getMyOpportunities = () => api.get("/opportunities/my").then((r) => r.data.data);
export const getOpportunity = (id) => api.get(`/opportunities/${id}`).then((r) => r.data.data);
export const createOpportunity = (data) => api.post("/opportunities", data).then((r) => r.data.data);
export const updateOpportunity = (id, data) => api.put(`/opportunities/${id}`, data).then((r) => r.data.data);
export const publishOpportunity = (id) => api.patch(`/opportunities/${id}/publish`).then((r) => r.data.data);
export const closeOpportunity = (id) => api.patch(`/opportunities/${id}/close`).then((r) => r.data.data);
export const deleteOpportunity = (id) => api.delete(`/opportunities/${id}`);
